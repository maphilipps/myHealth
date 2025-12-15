---
title: 'Backend: Data Isolation & Multi-Tenancy'
status: todo
type: task
priority: high
tags:
    - auth
    - database
created_at: 2025-12-15T20:51:31Z
updated_at: 2025-12-15T20:51:31Z
links:
    - parent: myHealth-p6wt
---

## Beschreibung
Sicherstellen, dass User nur ihre eigenen Daten sehen.

## Strategie
- Row-Level Security (RLS)
- User ID in allen Tabellen
- Automatische Filterung

## Implementation
```sql
-- PostgreSQL RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_isolation ON workouts
  USING (user_id = current_user_id());
```

## Daten-Migration
- Bestehende YAML-Daten zu User migrieren
- Import-Funktion für existierende Daten

## Definition of Done
- [ ] RLS für alle Tabellen
- [ ] Daten-Migration Script
- [ ] Security Audit bestanden
- [ ] `/code-review:code-review` ausführen