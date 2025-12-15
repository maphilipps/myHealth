---
title: Database Schema anlegen
status: done
type: task
priority: critical
tags:
    - supabase
    - database
created_at: 2025-12-15T22:00:00Z
updated_at: 2025-12-15T22:00:00Z
links:
    - parent: myHealth-sb01
    - blocked_by: myHealth-sb02
---

# Database Schema anlegen

## Tabellen

### Core Tables
- [x] `exercises` - Übungsbibliothek
- [x] `user_profiles` - User-Erweiterung
- [x] `training_plans` - Trainingspläne (+ plan_days, plan_exercises)
- [x] `workout_sessions` - Sessions
- [x] `workout_sets` - Sets mit RPE
- [x] `vitals` - Tägliche Metriken (inkl. Gewicht, Schlaf, etc.)
- [x] `nutrition_logs` - Ernährung (+ meals, meal_items, supplements)
- [x] `body_measurements` - Körpermaße
- [x] `progress_photos` - Fortschrittsfotos
- [x] `workout_cardio` - Cardio-Tracking

### Functions (SECURITY DEFINER)
- [x] `get_exercise_history()` - Übungshistorie
- [x] `get_personal_records()` - PRs mit 1RM
- [x] `get_next_weight()` - Progressive Overload
- [x] `get_daily_summary()` - Tages-Zusammenfassung

## Schema-Datei
`docs/PLAN-supabase-migration.md` enthält vollständiges SQL.

## Ausführung
```bash
# Via Supabase Dashboard SQL Editor
# oder
supabase db push
```
