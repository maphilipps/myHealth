---
title: Row-Level Security einrichten
status: done
type: task
priority: high
tags:
    - supabase
    - security
created_at: 2025-12-15T22:00:00Z
updated_at: 2025-12-15T22:00:00Z
links:
    - parent: myHealth-sb01
    - blocked_by: myHealth-sb03
---

# Row-Level Security einrichten

## Policies

### user_profiles
```sql
CREATE POLICY "Users manage own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);
```

### training_plans
```sql
CREATE POLICY "Users manage own plans" ON training_plans
  FOR ALL USING (auth.uid() = user_id);
```

### workout_sessions
```sql
CREATE POLICY "Users manage own sessions" ON workout_sessions
  FOR ALL USING (auth.uid() = user_id);
```

### workout_sets
```sql
CREATE POLICY "Users manage own sets" ON workout_sets
  FOR ALL USING (
    session_id IN (SELECT id FROM workout_sessions WHERE user_id = auth.uid())
  );
```

### daily_logs
```sql
CREATE POLICY "Users manage own logs" ON daily_logs
  FOR ALL USING (auth.uid() = user_id);
```

### exercises (global, read-only)
```sql
CREATE POLICY "Anyone can read exercises" ON exercises
  FOR SELECT USING (true);
```

## Status
RLS Policies wurden zusammen mit dem Schema in `001_initial_schema.sql` deployed.

Alle Tabellen haben `ENABLE ROW LEVEL SECURITY` und passende Policies:
- User-owned tables: `auth.uid() = user_id`
- Exercises: Global lesbar, nur eigene Custom-Exercises bearbeitbar
- Denormalized user_id auf workout_sets/workout_cardio für Performance

## Testen
- [ ] Als User A einloggen → nur eigene Daten sichtbar
- [ ] Als User B einloggen → keine Daten von User A
- [x] Exercises für alle lesbar (globale + eigene Custom)
