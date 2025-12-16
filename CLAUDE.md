# myHealth - Claude Code Projekt-Instruktionen

## Projektübersicht

**myHealth** ist ein persönliches Gesundheits-Tracking-System mit:
- **Supabase Backend** (PostgreSQL + Auth + RLS)
- **iOS App** (SwiftUI + Supabase Swift SDK)
- **Agent SDK** (FitnessCoach, PlanCreator Agents)
- Progressive Overload Training-Algorithmen

## Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
├──────────────┬──────────────┬─────────────┬─────────────────┤
│  PostgreSQL  │    Auth      │   Storage   │  Edge Functions │
│  (RLS)       │  (Apple,     │  (optional) │  (Webhooks)     │
│              │   Email)     │             │                 │
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
│              Agent SDK Backend                               │
│         FitnessCoachAgent, PlanCreatorAgent                  │
└─────────────────────────────────────────────────────────────┘
```

## Datenbank-Schema

Alle Daten werden in Supabase PostgreSQL gespeichert:
- `exercises` - Übungs-Bibliothek (global + custom)
- `workout_sessions` - Training-Sessions
- `workout_sets` - Einzelne Sätze mit Gewicht/Reps/RPE
- `vitals` - Tägliche Vitaldaten (Gewicht, Schlaf, Schritte)
- `training_plans` - Trainingspläne
- `nutrition_logs` - Ernährungsdaten

## Verfügbare Agents

- **FitnessCoachAgent** - Workout-Empfehlungen und Progressive Overload
- **PlanCreatorAgent** - Trainingsplan-Erstellung und Anpassung
- **HealthReporterAgent** - Trend-Analyse und Reports

## Supabase MCP

Claude Code hat direkten Zugriff auf die Supabase-Datenbank via MCP:

```typescript
// Beispiel: Letzte Workouts abfragen
const { data } = await supabase
  .from('workout_sessions')
  .select('*, workout_sets(*)')
  .order('date', { ascending: false })
  .limit(5);
```

## Progressive Overload (via get_next_weight Function)

Die Datenbank enthält eine `get_next_weight(exercise_id, target_reps)` Function:
- Analysiert die letzten 3 Sessions
- Berechnet Gewichtsempfehlung basierend auf RPE
- Gibt Trend und Reasoning zurück

```sql
SELECT * FROM get_next_weight('exercise-uuid', 8);
-- Returns: recommended_weight, last_weight, last_reps, last_rpe, trend, reasoning
```

## iOS App

Repository: `myhealth-ios` (https://github.com/maphilipps/myhealth-ios)

Features:
- Sign in with Apple + Email/Password
- Workout Session Tracking
- HealthKit Integration
- Agent Chat (Coach Tab)
- Progress Charts

## Migration von YAML

Historische YAML-Daten befinden sich in `data-archive/`.
Migration-Script: `scripts/migrate-yaml-to-supabase.ts`

```bash
# Migration ausführen (benötigt SUPABASE_URL, SUPABASE_SERVICE_KEY, USER_ID)
npx ts-node scripts/migrate-yaml-to-supabase.ts
```

## Beispiel-Abfragen (via Supabase MCP)

- "Wie war mein Training diese Woche?" → Query workout_sessions + workout_sets
- "Was soll ich heute bei Bankdrücken machen?" → Call get_next_weight()
- "Zeig mir meinen Gewichtsverlauf" → Query vitals.weight_kg
- "Erstelle einen Weekly Report" → Aggregate workout_sessions, vitals
