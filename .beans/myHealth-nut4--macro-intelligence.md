---
title: Macro Intelligence
status: todo
type: task
priority: high
tags:
    - nutrition
    - macros
    - training-sync
created_at: 2025-12-19T10:00:00Z
updated_at: 2025-12-19T10:00:00Z
links:
    - parent: myHealth-nut0
---

# Macro Intelligence

## Beschreibung
Intelligente Makro-Berechnung und -Tracking mit dynamischer Anpassung basierend auf Zielen, Training und Fortschritt.

## Features

### 1. Goal-based Macro Calculation
```
User: "Ich will abnehmen, aber Muskeln halten"

Agent: "Für einen 'Clean Cut' empfehle ich:

        📊 Deine Werte (basierend auf 82kg, aktiv):
        • Kalorien: 2.200 kcal/Tag (-300 Defizit)
        • Protein: 180g (2.2g/kg - hoch für Muskelerhalt)
        • Carbs: 180g (Energie fürs Training)
        • Fett: 75g (Hormone, Sättigung)

        An Trainingstagen +200 kcal mehr Carbs.

        Klingt das machbar?"
```

### 2. Training-Day Sync
```yaml
# Automatische Anpassung

rest_day:
  calories: 2200
  protein: 180g
  carbs: 150g
  fat: 80g

training_day_light: # Cardio, Mobility
  calories: 2350
  protein: 180g
  carbs: 180g (+30g)
  fat: 80g

training_day_heavy: # Kraft, Beine
  calories: 2500
  protein: 180g
  carbs: 220g (+70g)
  fat: 80g
```

### 3. Real-time Progress Tracking
```
┌─────────────────────────────────────────┐
│         Heute (Trainingstag)             │
├─────────────────────────────────────────┤
│                                          │
│  Kalorien  ████████░░░░░░░  1680/2500   │
│  Protein   █████████████░░  156/180g    │
│  Carbs     ██████░░░░░░░░░  120/220g    │
│  Fett      ████████████░░░  65/80g      │
│                                          │
│  💡 "Noch 100g Carbs - perfekt für      │
│      Pre-Workout Snack!"                 │
│                                          │
└─────────────────────────────────────────┘
```

### 4. Flexible Dieting (IIFYM)
```
User: "Kann ich Pizza heute Abend essen?"

Agent: "Lass uns rechnen! 🍕

        Du hast noch übrig:
        • 600 kcal
        • 40g Protein
        • 80g Carbs
        • 20g Fett

        Eine Pizza Margherita (300g) hat ca:
        • 750 kcal, 30g Protein, 90g Carbs, 25g Fett

        Geht fast auf! Wenn du:
        • Heute Abend nur die Pizza isst (keine Beilage)
        • Oder 2/3 isst und Rest für morgen

        Dann passt's in deine Makros.
        Dein Protein-Ziel ist auch fast erreicht -
        vielleicht noch einen Shake vorher?"
```

### 5. Weekly Macro Review
```
Agent (Sonntag Abend):

"📊 Deine Woche in Makros:

 Tag    Kcal   Protein  Carbs  Fett
 ─────────────────────────────────
 Mo     2480   185g ✓   210g   78g   (Training)
 Di     2150   172g     165g   72g
 Mi     2320   190g ✓   195g   75g   (Training)
 Do     2100   168g     150g   80g
 Fr     2650   140g ❌  220g   95g   (Pizza 🍕)
 Sa     2050   175g     160g   68g
 So     2200   180g ✓   170g   75g   (Training)
 ─────────────────────────────────
 Ø      2279   173g     181g   78g
 Ziel   2300   180g     180g   75g

 ✅ Kalorien: Perfekt im Schnitt!
 ⚠️ Protein: Freitag war niedrig
 💡 Tipp: Freitags früher Protein tanken"
```

## Macro Calculation Logic

### Grundumsatz (BMR)
```python
def calculate_bmr(weight_kg, height_cm, age, sex):
    """Mifflin-St Jeor Formel"""
    if sex == 'male':
        return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:
        return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
```

### TDEE (Total Daily Energy Expenditure)
```python
activity_multipliers = {
    'sedentary': 1.2,      # Bürojob, kein Training
    'light': 1.375,        # 1-2x Training/Woche
    'moderate': 1.55,      # 3-4x Training/Woche
    'active': 1.725,       # 5-6x Training/Woche
    'very_active': 1.9     # Täglich intensiv
}

def calculate_tdee(bmr, activity_level):
    return bmr * activity_multipliers[activity_level]
```

### Goal-based Adjustment
```python
def adjust_for_goal(tdee, goal):
    adjustments = {
        'aggressive_cut': -500,
        'moderate_cut': -300,
        'maintain': 0,
        'lean_bulk': +200,
        'bulk': +400
    }
    return tdee + adjustments[goal]
```

### Macro Split
```python
def calculate_macros(calories, weight_kg, goal):
    if goal in ['cut', 'maintain']:
        protein_g = weight_kg * 2.2  # Hoch für Muskelerhalt
    else:
        protein_g = weight_kg * 1.8  # Bulk braucht weniger relativ

    fat_g = weight_kg * 0.9  # ~0.8-1g pro kg

    # Rest = Carbs
    protein_kcal = protein_g * 4
    fat_kcal = fat_g * 9
    carbs_kcal = calories - protein_kcal - fat_kcal
    carbs_g = carbs_kcal / 4

    return {
        'protein_g': round(protein_g),
        'carbs_g': round(carbs_g),
        'fat_g': round(fat_g)
    }
```

## Database Schema

```sql
CREATE TABLE nutrition_goals (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,

    -- Basis-Daten
    goal_type TEXT, -- 'cut', 'bulk', 'maintain'
    activity_level TEXT,

    -- Berechnete Ziele
    daily_calories INT,
    protein_g INT,
    carbs_g INT,
    fat_g INT,

    -- Training-Day Anpassungen
    training_day_adjustment JSONB,
    -- {
    --   "light": {"calories": +150, "carbs": +30},
    --   "heavy": {"calories": +300, "carbs": +70}
    -- }

    -- Meta
    created_at TIMESTAMPTZ DEFAULT now(),
    active BOOLEAN DEFAULT true
);

-- Täglicher Fortschritt (Aggregat)
CREATE TABLE daily_nutrition (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    date DATE,

    total_calories INT,
    total_protein_g DECIMAL,
    total_carbs_g DECIMAL,
    total_fat_g DECIMAL,

    goal_calories INT,
    goal_protein_g INT,
    goal_carbs_g INT,
    goal_fat_g INT,

    was_training_day BOOLEAN,
    training_type TEXT, -- 'heavy', 'light', null

    UNIQUE(user_id, date)
);
```

## Agent Integration

### Morning Setup
```
Agent (morgens, wenn Goals gesetzt):

"Guten Morgen!

📊 Deine Ziele heute (Trainingstag - Brust):
• Kalorien: 2.500
• Protein: 180g
• Carbs: 220g (extra für Training!)
• Fett: 80g

Pre-Workout Snack nicht vergessen! 💪"
```

### Real-time Coaching
```
User loggt Mittagessen (600 kcal, 45g P, 60g C, 20g F)

Agent: "✓ Geloggt!

Aktueller Stand:
• Kalorien: 1050/2500 (42%)
• Protein: 85/180g (47%) 👍
• Carbs: 100/220g (45%)

Protein läuft gut! Carbs könnten noch hoch -
perfect für Pre-Workout Snack gegen 16:00."
```

## Definition of Done
- [ ] Goal-Setup Wizard implementiert
- [ ] Automatische TDEE/Makro Berechnung
- [ ] Training-Day Sync funktioniert
- [ ] Real-time Progress Dashboard
- [ ] Weekly Review Report
- [ ] IIFYM Calculator für Food-Check
