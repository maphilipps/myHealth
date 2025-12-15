---
title: YAML-Daten nach Supabase migrieren
status: todo
type: task
priority: medium
tags:
    - supabase
    - migration
created_at: 2025-12-15T22:00:00Z
updated_at: 2025-12-15T22:00:00Z
links:
    - parent: myHealth-sb01
    - blocked_by: myHealth-sb03
---

# YAML-Daten nach Supabase migrieren

## Vorhandene Daten
```
data/
├── daily/          # → daily_logs
├── workouts/       # → workout_sessions + workout_sets
├── nutrition/      # → daily_logs (Makros)
├── vitals/         # → daily_logs
├── plans/          # → training_plans
└── exercises/      # → exercises
```

## Migrations-Script
```bash
# 1. YAML zu JSON konvertieren
node scripts/yaml-to-json.js

# 2. SQL Seed-File generieren
node scripts/generate-seed.js

# 3. In Supabase importieren
supabase db seed --file data/seed.sql
```

## Schritte
- [ ] Migrations-Script schreiben
- [ ] Test-Migration in Dev
- [ ] Daten validieren
- [ ] `data/` Ordner archivieren

## Nach Migration
- `data/` Ordner löschen oder nach `data-archive/` verschieben
- CLAUDE.md aktualisieren (keine YAML-Referenzen mehr)

## Nach Abschluss
- [ ] `/code-review:code-review` ausführen
