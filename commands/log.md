---
description: Quick-log health data (workout, meal, vitals, daily)
argument-hint: [type] [data...] - e.g., "workout bench 80kg 8,8,7" or "meal chicken 200g rice 150g"
allowed-tools: Read, Write, Edit, Glob
---

# Quick Health Data Logging

Parse user input and create/update the appropriate YAML file in `data/`.

## Input Parsing

The user provides: `$ARGUMENTS`

Determine the log type from context:
- **workout** / **training** / exercise names → Workout log
- **meal** / **lunch** / **dinner** / **breakfast** / food names → Nutrition log
- **weight** / **sleep** / **steps** / **mood** → Daily log
- **bp** / **heart rate** / **hrv** → Vitals log

## Log Type: Workout

If logging workout data:

1. Parse exercise, weight, and reps from input
2. Read current plan from `data/plans/` to get workout type (torso/limbs)
3. Create or update `data/workouts/YYYY-MM-DD-{type}.yaml`

Example input: `bench 82.5kg 8,7,7 rpe 8`
→ Add to today's workout file:
```yaml
exercises:
  - name: Bench Press
    sets:
      - weight_kg: 82.5
        reps: 8
        rpe: 8
      - weight_kg: 82.5
        reps: 7
      - weight_kg: 82.5
        reps: 7
```

## Log Type: Nutrition

If logging meal/food data:

1. Parse food items and quantities
2. Estimate macros from common foods (use nutrition-tracking skill knowledge)
3. Create or update `data/nutrition/YYYY-MM-DD.yaml`

Example input: `lunch chicken 200g rice 150g broccoli`
→ Add to today's nutrition file under meals

## Log Type: Daily

If logging daily metrics:

1. Parse metric type and value
2. Create or update `data/daily/YYYY-MM-DD.yaml`

Example inputs:
- `weight 82.5` → weight_kg: 82.5
- `sleep 7.5 quality 4` → sleep: { hours: 7.5, quality: 4 }
- `mood 4 energy 3` → mood: 4, energy: 3
- `water 2500` → water_ml: 2500

## Log Type: Vitals

If logging vital signs:

1. Parse vital type and value
2. Create or update `data/vitals/YYYY-MM-DD.yaml`

Example inputs:
- `bp 120/80` → blood_pressure: { systolic: 120, diastolic: 80 }
- `rhr 58` → resting_heart_rate: 58

## File Operations

1. Check if today's file exists for the log type
2. If exists: Read, parse YAML, merge new data, write back
3. If not exists: Create new file with proper structure

## Response

After logging, confirm what was recorded:
- Show the data that was logged
- Show any calculated values (estimated macros for food)
- Suggest next actions if relevant

Use the health-schema skill for proper YAML structure.
