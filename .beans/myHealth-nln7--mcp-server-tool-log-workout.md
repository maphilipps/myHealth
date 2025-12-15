---
title: 'MCP Server: Tool - log_workout'
status: todo
type: feature
priority: high
tags:
    - backend
    - tools
created_at: 2025-12-15T20:42:40Z
updated_at: 2025-12-15T20:42:40Z
links:
    - parent: myHealth-q36m
---

# MCP Server: Tool - log_workout

## Beschreibung
Tool zum Speichern eines abgeschlossenen Workout-Satzes in der YAML-Datei.

## Input Schema
```typescript
{
  exercise: string,      // z.B. 'Bench Press'
  weight: number,        // in kg
  reps: number,         // Wiederholungen
  rpe?: number,         // Rate of Perceived Exertion (1-10)
  notes?: string        // Optionale Notizen
}
```

## Output
```typescript
{
  success: boolean,
  workout_file: string,  // Pfad zur YAML-Datei
  set_number: number,    // Welcher Satz wurde geloggt
  message: string
}
```

## Logik
1. Prüfe ob heute schon ein Workout existiert
2. Wenn nicht, erstelle neue YAML-Datei
3. Füge Set zur entsprechenden Übung hinzu
4. Speichere mit Timestamp

## YAML Output Beispiel
```yaml
date: 2024-12-15
type: torso
exercises:
  - name: Bench Press
    sets:
      - weight: 80
        reps: 10
        rpe: 8
        timestamp: '2024-12-15T10:30:00'
```

## Definition of Done
- [ ] Tool registriert und aufrufbar
- [ ] YAML-Datei wird korrekt erstellt/erweitert
- [ ] Validation für Input
- [ ] Error Handling
- [ ] `/code-review:code-review` ausführen
