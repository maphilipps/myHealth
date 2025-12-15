---
name: Health Schema
description: This skill should be used when the user asks to "add health data", "create a daily log", "log a workout", "track nutrition", "record vitals", "understand the data format", or needs to know how myHealth YAML files are structured. Provides schema definitions, validation rules, and data format guidance for all health tracking data.
version: 0.1.0
---

# Health Schema Knowledge

## Purpose

Provide comprehensive understanding of myHealth's YAML-based data structures for consistent, valid health data tracking. All data is Git-versionable and human-readable.

## Data Directory Structure

```
data/
├── daily/          # Daily summary logs (one per day)
├── workouts/       # Individual workout sessions
├── nutrition/      # Meal and nutrition logs
├── vitals/         # Vital sign measurements
├── plans/          # Training plans and programs
└── exercises/      # Exercise library definitions
```

## Core Schemas

### Daily Log (`data/daily/YYYY-MM-DD.yaml`)

Track daily summary metrics:

```yaml
date: 2024-01-15
weight_kg: 82.5
body_fat_percent: 18.5  # optional
water_ml: 2500
sleep:
  hours: 7.5
  quality: 4  # 1-5 scale
  deep_hours: 2.1  # optional, from Apple Health
  rem_hours: 1.8   # optional
steps: 8432  # from Apple Health
active_calories: 450  # from Apple Health
mood: 4  # 1-5 scale
energy: 3  # 1-5 scale
stress: 2  # 1-5 scale, lower is better
notes: "Free text notes for the day"
```

### Workout Session (`data/workouts/YYYY-MM-DD-{type}.yaml`)

Track individual training sessions:

```yaml
date: 2024-01-15
type: torso  # torso, limbs, push, pull, legs, full, cardio
start_time: "18:30"
end_time: "19:45"
duration_min: 75
location: "Gym Name"  # optional

exercises:
  - name: Bench Press
    equipment: barbell
    sets:
      - weight_kg: 80
        reps: 8
        rpe: 8  # Rate of Perceived Exertion 1-10
        rest_sec: 120
      - weight_kg: 80
        reps: 7
        rpe: 9
      - weight_kg: 75
        reps: 8
        rpe: 8
    notes: "Felt strong today"  # optional

  - name: Cable Fly
    equipment: cable
    sets:
      - weight_kg: 15  # per side
        reps: 12
        rpe: 7

warmup:  # optional
  - name: Treadmill
    duration_min: 5
    intensity: light

cardio:  # optional
  - name: Rowing
    duration_min: 10
    distance_m: 2000
    heart_rate_avg: 145

notes: "Great session, progressive overload on bench"
fatigue_level: 3  # 1-5, post-workout
```

### Nutrition Log (`data/nutrition/YYYY-MM-DD.yaml`)

Track daily nutrition:

```yaml
date: 2024-01-15
meals:
  - time: "07:30"
    type: breakfast
    items:
      - name: Oatmeal with berries
        calories: 350
        protein_g: 12
        carbs_g: 55
        fat_g: 8
        fiber_g: 6
      - name: Protein shake
        calories: 150
        protein_g: 30
        carbs_g: 5
        fat_g: 2

  - time: "12:30"
    type: lunch
    items:
      - name: Chicken breast
        amount: "200g"
        calories: 330
        protein_g: 62
        carbs_g: 0
        fat_g: 7

  - time: "19:00"
    type: dinner
    restaurant: "Restaurant Name"  # optional
    items:
      - name: Salmon with vegetables
        calories: 500
        protein_g: 45
        carbs_g: 20
        fat_g: 28

snacks:
  - time: "15:00"
    name: Apple
    calories: 95
    carbs_g: 25

supplements:
  - name: Creatine
    amount: "5g"
  - name: Vitamin D
    amount: "2000 IU"

totals:  # auto-calculated or from Yazio
  calories: 1425
  protein_g: 149
  carbs_g: 105
  fat_g: 45
  fiber_g: 18

water_ml: 2500  # can also be in daily log
notes: "Ate clean today"
```

### Vitals (`data/vitals/YYYY-MM-DD.yaml`)

Track vital measurements:

```yaml
date: 2024-01-15
measurements:
  - time: "07:00"
    type: morning
    weight_kg: 82.5
    body_fat_percent: 18.5
    blood_pressure:
      systolic: 120
      diastolic: 80
    resting_heart_rate: 58

  - time: "20:00"
    type: evening
    blood_pressure:
      systolic: 118
      diastolic: 78

hrv:  # Heart Rate Variability from Apple Health
  morning: 45

body_measurements:  # weekly/monthly
  chest_cm: 105
  waist_cm: 84
  hips_cm: 98
  bicep_left_cm: 36
  bicep_right_cm: 36.5
  thigh_left_cm: 58
  thigh_right_cm: 58
```

### Exercise Library (`data/exercises/{exercise-name}.yaml`)

Define exercises for the library:

```yaml
name: Bench Press
category: chest
muscle_groups:
  primary: [chest, triceps]
  secondary: [front_delts]
equipment: barbell
type: compound

progression:
  method: double_progression
  rep_range: [6, 10]
  weight_increment_kg: 2.5

form_cues:
  - "Retract shoulder blades"
  - "Feet flat on floor"
  - "Bar path slightly diagonal"
  - "Full ROM to chest"

variations:
  - Incline Bench Press
  - Decline Bench Press
  - Close Grip Bench Press
  - Dumbbell Bench Press
```

### Training Plan (`data/plans/{plan-name}.yaml`)

Define training programs:

```yaml
name: Torso-Limbs Split
description: 4-day upper/lower split for hypertrophy
start_date: 2024-01-01
duration_weeks: 12

schedule:
  - day: monday
    type: torso
  - day: tuesday
    type: limbs
  - day: wednesday
    type: rest
  - day: thursday
    type: torso
  - day: friday
    type: limbs
  - day: saturday
    type: rest
  - day: sunday
    type: rest

workouts:
  torso:
    exercises:
      - name: Bench Press
        sets: 3
        rep_range: [6, 10]
        rest_sec: 120
      - name: Bent Over Row
        sets: 3
        rep_range: [8, 12]
        rest_sec: 90
      - name: Overhead Press
        sets: 3
        rep_range: [8, 12]
        rest_sec: 90
      - name: Cable Fly
        sets: 3
        rep_range: [10, 15]
        rest_sec: 60
      - name: Face Pull
        sets: 3
        rep_range: [12, 15]
        rest_sec: 60

  limbs:
    exercises:
      - name: Squat
        sets: 3
        rep_range: [6, 10]
        rest_sec: 180
      - name: Romanian Deadlift
        sets: 3
        rep_range: [8, 12]
        rest_sec: 120
      - name: Leg Press
        sets: 3
        rep_range: [10, 15]
        rest_sec: 90
      - name: Barbell Curl
        sets: 3
        rep_range: [8, 12]
        rest_sec: 60
      - name: Tricep Pushdown
        sets: 3
        rep_range: [10, 15]
        rest_sec: 60

progression:
  type: intelligent  # intelligent, linear, double_progression
  deload_frequency_weeks: 4
```

## File Naming Conventions

| Data Type | Pattern | Example |
|-----------|---------|---------|
| Daily | `YYYY-MM-DD.yaml` | `2024-01-15.yaml` |
| Workout | `YYYY-MM-DD-{type}.yaml` | `2024-01-15-torso.yaml` |
| Nutrition | `YYYY-MM-DD.yaml` | `2024-01-15.yaml` |
| Vitals | `YYYY-MM-DD.yaml` | `2024-01-15.yaml` |
| Exercise | `{exercise-name}.yaml` | `bench-press.yaml` |
| Plan | `{plan-name}.yaml` | `torso-limbs-split.yaml` |

## Validation Rules

### Required Fields

- **Daily**: `date`
- **Workout**: `date`, `type`, `exercises` (with at least one)
- **Nutrition**: `date`, `meals` or `totals`
- **Vitals**: `date`, at least one measurement
- **Exercise**: `name`, `category`, `equipment`
- **Plan**: `name`, `schedule`, `workouts`

### Value Ranges

| Field | Valid Range | Notes |
|-------|-------------|-------|
| `weight_kg` | 30-300 | Body weight |
| `reps` | 1-100 | Per set |
| `rpe` | 1-10 | Rate of Perceived Exertion |
| `rest_sec` | 0-600 | Rest between sets |
| `mood/energy` | 1-5 | Subjective scales |
| `sleep.hours` | 0-24 | |
| `calories` | 0-10000 | Per day |

## Creating New Entries

### Quick Daily Log

```yaml
# data/daily/2024-01-15.yaml
date: 2024-01-15
weight_kg: 82.5
water_ml: 2500
sleep:
  hours: 7.5
  quality: 4
mood: 4
```

### Quick Workout

```yaml
# data/workouts/2024-01-15-torso.yaml
date: 2024-01-15
type: torso
exercises:
  - name: Bench Press
    sets:
      - weight_kg: 80
        reps: 8
        rpe: 8
```

## Additional Resources

### Reference Files

For detailed information:
- **`references/apple-health-mapping.md`** - Apple Health export field mapping
- **`references/yazio-mapping.md`** - Yazio export field mapping

### Example Files

Working examples in `examples/`:
- **`daily-complete.yaml`** - Full daily log example
- **`workout-torso.yaml`** - Complete torso workout
- **`nutrition-day.yaml`** - Full day nutrition
