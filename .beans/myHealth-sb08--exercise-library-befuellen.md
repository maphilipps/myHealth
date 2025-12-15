---
title: Exercise Library befüllen
status: done
type: task
priority: medium
tags:
    - supabase
    - data
created_at: 2025-12-15T22:00:00Z
updated_at: 2025-12-15T22:00:00Z
links:
    - parent: myHealth-sb01
    - blocked_by: myHealth-sb03
---

# Exercise Library befüllen

## Basis-Übungen (Must-Have)

### Chest
- Bench Press (Barbell, Dumbbell)
- Incline Bench Press
- Cable Fly
- Push-Up

### Back
- Deadlift
- Barbell Row
- Pull-Up / Lat Pulldown
- Cable Row

### Shoulders
- Overhead Press
- Lateral Raise
- Face Pull
- Rear Delt Fly

### Legs
- Squat (Back, Front)
- Leg Press
- Romanian Deadlift
- Leg Curl / Extension
- Calf Raise

### Arms
- Barbell Curl
- Tricep Pushdown
- Hammer Curl
- Skull Crusher

### Core
- Plank
- Cable Crunch
- Hanging Leg Raise

## Datenstruktur
```sql
INSERT INTO exercises (name, name_de, muscle_group, equipment, form_cues)
VALUES
  ('Bench Press', 'Bankdrücken', 'chest', 'barbell',
   ARRAY['Schulterblätter zusammen', 'Füße fest am Boden', 'Kontrolliert absenken']),
  ...
```

## Schritte
- [x] 38 Basis-Übungen definiert
- [x] Deutsche Namen hinzugefügt
- [x] Form Cues für jede Übung
- [x] Seed-SQL erstellt: `supabase/seed/002_exercises.sql`
- [x] In Supabase importiert via `supabase db push`
