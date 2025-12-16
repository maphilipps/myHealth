# Plan: Supabase Migration

## Übersicht

**Alte Architektur (verworfen):**
```
YAML Files → Custom MCP Server → Agent SDK → iOS App
     ↓
  Git Repo
```

**Neue Architektur:**
```
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
├──────────────┬──────────────┬─────────────┬─────────────────┤
│  PostgreSQL  │    Auth      │   Storage   │  Edge Functions │
│  (RLS)       │  (Apple,     │  (Progress  │  (Agent SDK,    │
│              │   Google)    │   Photos)   │   Webhooks)     │
└──────┬───────┴──────┬───────┴─────────────┴─────────────────┘
       │              │
       ▼              ▼
┌──────────────┐ ┌──────────────┐
│ Supabase MCP │ │ iOS App      │
│ (Claude Code)│ │ (Swift SDK)  │
└──────────────┘ └──────────────┘
       │              │
       └──────┬───────┘
              ▼
┌─────────────────────────────────────────────────────────────┐
│         Agent SDK Backend (Edge Functions)                   │
│         FitnessCoach, PlanCreator, HealthReporter           │
└─────────────────────────────────────────────────────────────┘
```

## Vorteile der neuen Architektur

| Aspekt | Alt (YAML + Custom MCP) | Neu (Supabase) |
|--------|------------------------|----------------|
| Auth | Selbst bauen | Fertig (Apple, Google, Email) |
| MCP Server | Selbst bauen | Fertig (Supabase MCP) |
| Multi-User | Komplex | Eingebaut (RLS) |
| iOS SDK | Selbst bauen | Fertig (supabase-swift) |
| Realtime | N/A | Eingebaut |
| Offline | N/A | Mit Local-first Pattern |
| Kosten | $0 + Hosting | $0 (Free Tier) |

---

## Neue Epic-Struktur

### Epic 1: Supabase Setup & Schema (NEU)
**Priorität: KRITISCH - Muss zuerst**

Tasks:
1. Supabase Projekt erstellen (Free Tier)
2. Database Schema anlegen
3. Row-Level Security Policies
4. Auth Provider konfigurieren (Email, Apple, Google)
5. Supabase MCP in Claude Code einrichten
6. Bestehende YAML-Daten migrieren

### Epic 2: iOS App - SwiftUI Native (ANGEPASST)
**Nutzt jetzt Supabase statt CloudKit**

Tasks:
1. Xcode Projekt Setup
2. Supabase Swift SDK Integration
3. Auth Flow (Sign in with Apple via Supabase)
4. Workout Session View
5. Progress Charts
6. HealthKit Import → Supabase

### Epic 3: Agent SDK - Fitness Coach (ANGEPASST)
**Nutzt Supabase MCP + Edge Functions**

Tasks:
1. Agent SDK Projekt Setup
2. Supabase MCP Integration konfigurieren
3. FitnessCoachAgent implementieren
4. PlanCreatorAgent implementieren
5. Deploy als Edge Functions

---

## Database Schema

### Übersicht Tabellen

| Bereich | Tabellen |
|---------|----------|
| **Core** | `exercises`, `user_profiles` |
| **Training** | `training_plans`, `plan_days`, `plan_exercises` |
| **Workouts** | `workout_sessions`, `workout_sets`, `workout_cardio` |
| **Nutrition** | `nutrition_logs`, `meals`, `meal_items`, `supplements` |
| **Vitals** | `vitals`, `body_measurements` |
| **Media** | `progress_photos` |

---

```sql
-- =====================================================
-- EXERCISES (Global + Custom)
-- =====================================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_de TEXT,
  muscle_group TEXT NOT NULL,
  secondary_muscles TEXT[],
  equipment TEXT,
  exercise_type TEXT CHECK (exercise_type IN ('compound', 'isolation', 'cardio')) DEFAULT 'isolation',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  form_cues TEXT[],
  -- Progressive Overload Settings
  progression_method TEXT DEFAULT 'double_progression',
  default_rep_range INT[] DEFAULT '{8, 12}',
  weight_increment_kg DECIMAL(3,2) DEFAULT 2.5,
  -- Custom Exercise Support
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Unique constraint: global exercises by name, custom per user
  UNIQUE NULLS NOT DISTINCT (name, created_by)
);

CREATE INDEX idx_exercises_muscle ON exercises(muscle_group);
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercises_custom ON exercises(created_by) WHERE is_custom = true;

-- RLS für Exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Jeder kann globale Exercises lesen + eigene Custom
CREATE POLICY "Users see global and own exercises" ON exercises
  FOR SELECT USING (is_custom = false OR created_by = auth.uid());

-- Nur eigene Custom Exercises erstellen
CREATE POLICY "Users create own custom exercises" ON exercises
  FOR INSERT WITH CHECK (is_custom = true AND created_by = auth.uid());

-- Nur eigene Custom Exercises bearbeiten
CREATE POLICY "Users update own custom exercises" ON exercises
  FOR UPDATE USING (is_custom = true AND created_by = auth.uid());

-- Nur eigene Custom Exercises löschen
CREATE POLICY "Users delete own custom exercises" ON exercises
  FOR DELETE USING (is_custom = true AND created_by = auth.uid());

-- =====================================================
-- USER PROFILES (Erweitert auth.users)
-- =====================================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  weight_kg DECIMAL(4,1),
  height_cm INT,
  birth_date DATE,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[],
  preferred_units TEXT CHECK (preferred_units IN ('metric', 'imperial')) DEFAULT 'metric',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can create own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- TRAINING PLANS (Normalisiert)
-- =====================================================
CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('strength', 'hypertrophy', 'hybrid', 'cutting', 'maintenance')),
  days_per_week INT CHECK (days_per_week BETWEEN 1 AND 7),
  deload_frequency_weeks INT DEFAULT 4,
  current_week INT DEFAULT 1,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own plans" ON training_plans
  FOR ALL USING (auth.uid() = user_id);

-- Plan Days (welcher Wochentag = welcher Workout-Typ)
CREATE TABLE plan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES training_plans ON DELETE CASCADE NOT NULL,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Montag
  workout_type TEXT NOT NULL, -- 'torso', 'limbs', 'push', 'pull', 'rest'
  UNIQUE(plan_id, day_of_week)
);

ALTER TABLE plan_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own plan days" ON plan_days
  FOR ALL USING (
    plan_id IN (SELECT id FROM training_plans WHERE user_id = auth.uid())
  );

-- Plan Exercises (welche Übungen pro Workout-Typ)
CREATE TABLE plan_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES training_plans ON DELETE CASCADE NOT NULL,
  workout_type TEXT NOT NULL,
  exercise_id UUID REFERENCES exercises NOT NULL,
  exercise_order INT NOT NULL,
  sets INT DEFAULT 3,
  rep_range_min INT DEFAULT 8,
  rep_range_max INT DEFAULT 12,
  rest_sec INT DEFAULT 90,
  notes TEXT
);

ALTER TABLE plan_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own plan exercises" ON plan_exercises
  FOR ALL USING (
    plan_id IN (SELECT id FROM training_plans WHERE user_id = auth.uid())
  );

CREATE INDEX idx_plan_exercises_plan ON plan_exercises(plan_id, workout_type);

-- =====================================================
-- WORKOUT SESSIONS
-- =====================================================
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_id UUID REFERENCES training_plans,
  date DATE NOT NULL,
  type TEXT, -- 'torso', 'legs', 'push', 'pull', 'full_body', 'cardio'
  duration_min INT,
  notes TEXT,
  mood INT CHECK (mood BETWEEN 1 AND 5),
  energy INT CHECK (energy BETWEEN 1 AND 5),
  is_deload BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sessions" ON workout_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_sessions_user_date ON workout_sessions(user_id, date DESC);

-- =====================================================
-- WORKOUT SETS (mit denormalisierter user_id für Performance)
-- =====================================================
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL, -- Denormalisiert für RLS Performance
  exercise_id UUID REFERENCES exercises NOT NULL,
  set_order INT NOT NULL,
  target_reps INT,
  target_weight_kg DECIMAL(5,2),
  actual_reps INT,
  actual_weight_kg DECIMAL(5,2),
  rpe DECIMAL(2,1) CHECK (rpe BETWEEN 1 AND 10),
  rest_sec INT,
  is_warmup BOOLEAN DEFAULT false,
  is_pr BOOLEAN DEFAULT false, -- Expliziter PR-Marker
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger für automatische user_id
CREATE OR REPLACE FUNCTION set_workout_set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  SELECT user_id INTO NEW.user_id
  FROM workout_sessions WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workout_sets_set_user_id
  BEFORE INSERT ON workout_sets
  FOR EACH ROW EXECUTE FUNCTION set_workout_set_user_id();

ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sets" ON workout_sets
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_sets_session ON workout_sets(session_id);
CREATE INDEX idx_sets_user_exercise ON workout_sets(user_id, exercise_id);

-- =====================================================
-- WORKOUT CARDIO (Warmup + Cardio)
-- =====================================================
CREATE TABLE workout_cardio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL, -- 'Treadmill', 'Rowing', 'Cycling'
  duration_min INT,
  distance_m INT,
  calories INT,
  heart_rate_avg INT,
  heart_rate_max INT,
  is_warmup BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger für automatische user_id
CREATE TRIGGER workout_cardio_set_user_id
  BEFORE INSERT ON workout_cardio
  FOR EACH ROW EXECUTE FUNCTION set_workout_set_user_id();

ALTER TABLE workout_cardio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cardio" ON workout_cardio
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- NUTRITION LOGS
-- =====================================================
CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  target_calories INT,
  target_protein_g INT,
  target_carbs_g INT,
  target_fat_g INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own nutrition logs" ON nutrition_logs
  FOR ALL USING (auth.uid() = user_id);

-- Meals (Frühstück, Mittagessen, etc.)
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID REFERENCES nutrition_logs ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout')),
  time TIME,
  restaurant TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own meals" ON meals
  FOR ALL USING (auth.uid() = user_id);

-- Meal Items (einzelne Lebensmittel)
CREATE TABLE meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES meals ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  amount TEXT, -- '100g', '1 Stück', '200ml'
  calories INT,
  protein_g DECIMAL(5,1),
  carbs_g DECIMAL(5,1),
  fat_g DECIMAL(5,1),
  fiber_g DECIMAL(5,1),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own meal items" ON meal_items
  FOR ALL USING (
    meal_id IN (SELECT id FROM meals WHERE user_id = auth.uid())
  );

-- Supplements
CREATE TABLE supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL, -- 'Creatine', 'Vitamin D', 'Omega-3'
  amount TEXT, -- '5g', '1000 IU', '2 Kapseln'
  time TIME,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own supplements" ON supplements
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_supplements_user_date ON supplements(user_id, date);

-- =====================================================
-- VITALS
-- =====================================================
CREATE TABLE vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  measured_at TIME,
  -- Weight & Composition
  weight_kg DECIMAL(4,1),
  body_fat_percent DECIMAL(3,1),
  muscle_mass_kg DECIMAL(4,1),
  -- Heart
  resting_heart_rate INT,
  hrv_average INT,
  hrv_rmssd INT,
  -- Blood Pressure
  bp_systolic INT,
  bp_diastolic INT,
  -- Sleep (from Apple Health)
  sleep_hours DECIMAL(3,1),
  sleep_deep_hours DECIMAL(3,1),
  sleep_rem_hours DECIMAL(3,1),
  sleep_quality INT CHECK (sleep_quality BETWEEN 1 AND 5),
  -- Activity
  steps INT,
  active_calories INT,
  -- Subjective
  mood INT CHECK (mood BETWEEN 1 AND 5),
  energy INT CHECK (energy BETWEEN 1 AND 5),
  stress INT CHECK (stress BETWEEN 1 AND 5),
  soreness INT CHECK (soreness BETWEEN 1 AND 5),
  notes TEXT,
  source TEXT, -- 'manual', 'apple_health', 'garmin'
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own vitals" ON vitals
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_vitals_user_date ON vitals(user_id, date DESC);

-- Body Measurements (Umfänge)
CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  chest_cm DECIMAL(4,1),
  waist_cm DECIMAL(4,1),
  hips_cm DECIMAL(4,1),
  bicep_left_cm DECIMAL(4,1),
  bicep_right_cm DECIMAL(4,1),
  forearm_cm DECIMAL(4,1),
  thigh_left_cm DECIMAL(4,1),
  thigh_right_cm DECIMAL(4,1),
  calf_cm DECIMAL(4,1),
  neck_cm DECIMAL(4,1),
  shoulders_cm DECIMAL(4,1),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own measurements" ON body_measurements
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PROGRESS PHOTOS
-- =====================================================
CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  storage_path TEXT NOT NULL, -- Pfad in Supabase Storage
  category TEXT CHECK (category IN ('front', 'side', 'back', 'other')),
  weight_kg DECIMAL(4,1), -- Gewicht zum Zeitpunkt
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own photos" ON progress_photos
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- VIEWS (mit Security)
-- =====================================================

-- Exercise History (für Progressive Overload)
-- Als Function für RLS-Sicherheit
CREATE OR REPLACE FUNCTION get_exercise_history(
  p_exercise_id UUID DEFAULT NULL,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  exercise_id UUID,
  exercise_name TEXT,
  actual_weight_kg DECIMAL,
  actual_reps INT,
  rpe DECIMAL,
  date DATE,
  session_id UUID
)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id AS exercise_id,
    e.name AS exercise_name,
    wset.actual_weight_kg,
    wset.actual_reps,
    wset.rpe,
    ws.date,
    ws.id AS session_id
  FROM workout_sets wset
  JOIN workout_sessions ws ON wset.session_id = ws.id
  JOIN exercises e ON wset.exercise_id = e.id
  WHERE ws.user_id = auth.uid()
    AND wset.is_warmup = false
    AND wset.actual_reps IS NOT NULL
    AND (p_exercise_id IS NULL OR e.id = p_exercise_id)
  ORDER BY ws.date DESC, wset.set_order
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Personal Records
CREATE OR REPLACE FUNCTION get_personal_records(
  p_exercise_id UUID DEFAULT NULL
)
RETURNS TABLE (
  exercise_id UUID,
  exercise_name TEXT,
  weight_kg DECIMAL,
  reps INT,
  estimated_1rm DECIMAL,
  achieved_on DATE
)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (e.id)
    e.id AS exercise_id,
    e.name AS exercise_name,
    wset.actual_weight_kg AS weight_kg,
    wset.actual_reps AS reps,
    ROUND(wset.actual_weight_kg * (1 + wset.actual_reps::DECIMAL / 30.0), 1) AS estimated_1rm,
    ws.date AS achieved_on
  FROM workout_sets wset
  JOIN workout_sessions ws ON wset.session_id = ws.id
  JOIN exercises e ON wset.exercise_id = e.id
  WHERE ws.user_id = auth.uid()
    AND wset.is_warmup = false
    AND wset.actual_weight_kg IS NOT NULL
    AND (p_exercise_id IS NULL OR e.id = p_exercise_id)
  ORDER BY e.id, (wset.actual_weight_kg * (1 + wset.actual_reps::DECIMAL / 30.0)) DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTIONS für Progressive Overload (verbessert)
-- =====================================================
CREATE OR REPLACE FUNCTION get_next_weight(
  p_exercise_id UUID,
  p_target_reps INT DEFAULT 8
)
RETURNS TABLE (
  recommended_weight DECIMAL,
  last_weight DECIMAL,
  last_reps INT,
  last_rpe DECIMAL,
  trend TEXT,
  reasoning TEXT
)
SECURITY DEFINER
AS $$
DECLARE
  v_exercise_type TEXT;
  v_increment DECIMAL;
  v_last_weight DECIMAL;
  v_last_reps INT;
  v_last_rpe DECIMAL;
  v_avg_rpe DECIMAL;
  v_sessions_count INT;
  v_recommended DECIMAL;
  v_trend TEXT;
  v_reasoning TEXT;
BEGIN
  -- Exercise-Typ für Increment holen
  SELECT exercise_type, weight_increment_kg
  INTO v_exercise_type, v_increment
  FROM exercises WHERE id = p_exercise_id;

  -- Fallback Increment basierend auf Typ
  IF v_increment IS NULL THEN
    v_increment := CASE WHEN v_exercise_type = 'compound' THEN 2.5 ELSE 1.25 END;
  END IF;

  -- Letzte 3 Sessions analysieren
  WITH recent_sets AS (
    SELECT
      wset.actual_weight_kg,
      wset.actual_reps,
      wset.rpe,
      ws.date,
      ROW_NUMBER() OVER (PARTITION BY ws.id ORDER BY wset.set_order) as set_num,
      DENSE_RANK() OVER (ORDER BY ws.date DESC) as session_rank
    FROM workout_sets wset
    JOIN workout_sessions ws ON wset.session_id = ws.id
    WHERE ws.user_id = auth.uid()
      AND wset.exercise_id = p_exercise_id
      AND wset.is_warmup = false
      AND wset.actual_weight_kg IS NOT NULL
    ORDER BY ws.date DESC
  )
  SELECT
    (SELECT actual_weight_kg FROM recent_sets WHERE session_rank = 1 AND set_num = 1),
    (SELECT actual_reps FROM recent_sets WHERE session_rank = 1 AND set_num = 1),
    (SELECT rpe FROM recent_sets WHERE session_rank = 1 AND set_num = 1),
    AVG(rpe),
    COUNT(DISTINCT session_rank)
  INTO v_last_weight, v_last_reps, v_last_rpe, v_avg_rpe, v_sessions_count
  FROM recent_sets
  WHERE session_rank <= 3;

  -- Keine Daten?
  IF v_last_weight IS NULL THEN
    RETURN QUERY SELECT
      NULL::DECIMAL, NULL::DECIMAL, NULL::INT, NULL::DECIMAL,
      'new'::TEXT, 'Keine vorherigen Daten - starte mit leichtem Gewicht'::TEXT;
    RETURN;
  END IF;

  -- Trend bestimmen
  IF v_sessions_count < 2 THEN
    v_trend := 'insufficient_data';
  ELSIF v_avg_rpe < 7.5 THEN
    v_trend := 'progressing';
  ELSIF v_avg_rpe > 9 THEN
    v_trend := 'plateau';
  ELSE
    v_trend := 'stable';
  END IF;

  -- Progressive Overload Logik
  IF v_last_rpe < 7 THEN
    v_recommended := v_last_weight + v_increment;
    v_reasoning := 'RPE war niedrig (' || v_last_rpe || ') - Gewicht um ' || v_increment || 'kg erhöhen';
  ELSIF v_last_rpe <= 8.5 AND v_last_reps >= p_target_reps THEN
    v_recommended := v_last_weight + v_increment;
    v_reasoning := 'Ziel-Reps (' || p_target_reps || ') erreicht bei gutem RPE - Gewicht erhöhen';
  ELSIF v_last_rpe > 9.5 THEN
    -- Möglicher Deload nötig
    v_recommended := v_last_weight * 0.9;
    v_reasoning := 'RPE sehr hoch (' || v_last_rpe || ') - evtl. Deload auf ' || ROUND(v_last_weight * 0.9, 1) || 'kg';
  ELSIF v_last_rpe > 9 THEN
    v_recommended := v_last_weight;
    v_reasoning := 'RPE war hoch (' || v_last_rpe || ') - Gewicht halten, an Form arbeiten';
  ELSE
    v_recommended := v_last_weight;
    v_reasoning := 'Weiter an Reps arbeiten (' || v_last_reps || '→' || p_target_reps || ') bei gleichem Gewicht';
  END IF;

  RETURN QUERY SELECT v_recommended, v_last_weight, v_last_reps, v_last_rpe, v_trend, v_reasoning;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Tägliche Zusammenfassung
CREATE OR REPLACE FUNCTION get_daily_summary(p_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  date DATE,
  has_workout BOOLEAN,
  workout_type TEXT,
  total_sets INT,
  total_volume DECIMAL,
  calories_consumed INT,
  protein_consumed INT,
  weight_kg DECIMAL,
  sleep_hours DECIMAL,
  mood INT
)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p_date,
    EXISTS(SELECT 1 FROM workout_sessions ws WHERE ws.user_id = auth.uid() AND ws.date = p_date),
    (SELECT ws.type FROM workout_sessions ws WHERE ws.user_id = auth.uid() AND ws.date = p_date LIMIT 1),
    (SELECT COUNT(*)::INT FROM workout_sets wset
     JOIN workout_sessions ws ON wset.session_id = ws.id
     WHERE ws.user_id = auth.uid() AND ws.date = p_date AND NOT wset.is_warmup),
    (SELECT SUM(wset.actual_weight_kg * wset.actual_reps)
     FROM workout_sets wset
     JOIN workout_sessions ws ON wset.session_id = ws.id
     WHERE ws.user_id = auth.uid() AND ws.date = p_date AND NOT wset.is_warmup),
    (SELECT SUM(mi.calories)::INT FROM meal_items mi
     JOIN meals m ON mi.meal_id = m.id
     JOIN nutrition_logs nl ON m.log_id = nl.id
     WHERE nl.user_id = auth.uid() AND nl.date = p_date),
    (SELECT SUM(mi.protein_g)::INT FROM meal_items mi
     JOIN meals m ON mi.meal_id = m.id
     JOIN nutrition_logs nl ON m.log_id = nl.id
     WHERE nl.user_id = auth.uid() AND nl.date = p_date),
    (SELECT v.weight_kg FROM vitals v WHERE v.user_id = auth.uid() AND v.date = p_date ORDER BY measured_at DESC LIMIT 1),
    (SELECT v.sleep_hours FROM vitals v WHERE v.user_id = auth.uid() AND v.date = p_date LIMIT 1),
    (SELECT v.mood FROM vitals v WHERE v.user_id = auth.uid() AND v.date = p_date LIMIT 1);
END;
$$ LANGUAGE plpgsql;
```

---

## Migration bestehender YAML-Daten

### Mapping YAML → SQL

| YAML Source | SQL Target | Transformation |
|-------------|------------|----------------|
| `data/exercises/*.yaml` | `exercises` | Direct + add exercise_type |
| `data/plans/*.yaml` | `training_plans` + `plan_days` + `plan_exercises` | Split & normalize |
| `data/workouts/*.yaml` | `workout_sessions` + `workout_sets` + `workout_cardio` | Split |
| `data/daily/*.yaml` | `vitals` | Map fields |
| `data/nutrition/*.yaml` | `nutrition_logs` + `meals` + `meal_items` + `supplements` | Split |

### Migrationsscripts

```
scripts/
├── migrate/
│   ├── 01-exercises.ts      # Exercise Library importieren
│   ├── 02-plans.ts          # Training Plans normalisieren
│   ├── 03-workouts.ts       # Workouts + Sets + Cardio
│   ├── 04-vitals.ts         # Daily logs → Vitals
│   ├── 05-nutrition.ts      # Nutrition → Meals + Items
│   └── run-all.ts           # Orchestrierung
└── seed/
    └── exercises.sql        # Initial Exercise Library
```

### Migration Steps

```bash
# 1. Supabase CLI installieren
npm install -g supabase

# 2. Projekt linken
supabase link --project-ref <your-project-ref>

# 3. Schema deployen
supabase db push

# 4. Exercise Library seeden
supabase db seed --file scripts/seed/exercises.sql

# 5. User anlegen (für Migration)
# → Via Supabase Dashboard oder Auth API

# 6. Daten migrieren
npx ts-node scripts/migrate/run-all.ts

# 7. Validieren
supabase db diff
```

### Beispiel Migration Script

```typescript
// scripts/migrate/03-workouts.ts
import { createClient } from '@supabase/supabase-js';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateWorkouts(userId: string) {
  const workoutsDir = path.join(__dirname, '../../data/workouts');
  const files = fs.readdirSync(workoutsDir).filter(f => f.endsWith('.yaml'));

  // Exercise name → ID mapping
  const { data: exercises } = await supabase
    .from('exercises')
    .select('id, name');
  const exerciseMap = new Map(exercises?.map(e => [e.name, e.id]));

  for (const file of files) {
    const content = yaml.load(fs.readFileSync(path.join(workoutsDir, file), 'utf8')) as any;

    // 1. Session erstellen
    const { data: session } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: userId,
        date: content.date,
        type: content.type,
        duration_min: content.duration_min,
        notes: content.notes,
        mood: content.mood,
        energy: content.energy,
        completed: true
      })
      .select()
      .single();

    // 2. Warmup als Cardio
    if (content.warmup) {
      for (const warmup of content.warmup) {
        await supabase.from('workout_cardio').insert({
          session_id: session!.id,
          user_id: userId,
          name: warmup.name,
          duration_min: warmup.duration_min,
          is_warmup: true
        });
      }
    }

    // 3. Sets migrieren
    for (const exercise of content.exercises || []) {
      const exerciseId = exerciseMap.get(exercise.name);
      if (!exerciseId) {
        console.warn(`Exercise not found: ${exercise.name}`);
        continue;
      }

      for (let i = 0; i < exercise.sets.length; i++) {
        const set = exercise.sets[i];
        await supabase.from('workout_sets').insert({
          session_id: session!.id,
          user_id: userId,
          exercise_id: exerciseId,
          set_order: i + 1,
          actual_weight_kg: set.weight,
          actual_reps: set.reps,
          rpe: set.rpe,
          is_warmup: set.warmup || false,
          is_pr: set.pr || false,
          notes: set.notes
        });
      }
    }

    // 4. Cardio
    if (content.cardio) {
      for (const cardio of content.cardio) {
        await supabase.from('workout_cardio').insert({
          session_id: session!.id,
          user_id: userId,
          name: cardio.name,
          duration_min: cardio.duration_min,
          distance_m: cardio.distance_m,
          heart_rate_avg: cardio.heart_rate?.average,
          is_warmup: false
        });
      }
    }

    console.log(`Migrated: ${file}`);
  }
}
```

---

## Supabase Storage Setup

### Bucket: progress-photos

```sql
-- Via Supabase Dashboard oder API
-- Bucket erstellen: progress-photos
-- Public: false
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp
```

### Storage Policies

```sql
-- User kann nur in eigenen Ordner uploaden
CREATE POLICY "Users upload own photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'progress-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- User kann nur eigene Fotos lesen
CREATE POLICY "Users read own photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'progress-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- User kann eigene Fotos löschen
CREATE POLICY "Users delete own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'progress-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## Supabase MCP Konfiguration

In `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_URL": "https://xxx.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJ..."
      }
    }
  }
}
```

**Sicherheitshinweise:**
- Service Role Key nur für Development
- Für Production: Read-only Mode aktivieren
- Niemals echte User-Daten mit MCP explorieren

---

## Entscheidungen (getroffen)

| Frage | Entscheidung | Begründung |
|-------|--------------|------------|
| Offline-Support iOS | Local-first mit Sync | Gym hat oft schlechten Empfang |
| Agent SDK Hosting | Supabase Edge Functions | Kostenlos, nah an Daten |
| Exercise Library | Hybrid (Seed + Custom) | Basis-Übungen + User kann erweitern |

---

## Zeitplan

| Phase | Dauer | Inhalt |
|-------|-------|--------|
| 1. Setup | 1 Tag | Supabase Projekt, Schema, MCP |
| 2. Migration | 1 Tag | YAML → Supabase, Test Queries |
| 3. iOS Basics | 1 Woche | Auth, Workout Logging |
| 4. Agent SDK | 3-4 Tage | FitnessCoach, PlanCreator |
| 5. Polish | 1 Woche | HealthKit, Charts, UX |

**Gesamt: ~3 Wochen**
