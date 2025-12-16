---
title: 'MCP Server: Resources implementieren'
status: superseded
type: task
priority: high
tags:
    - backend
    - resources
created_at: 2025-12-15T20:43:16Z
updated_at: 2025-12-15T20:43:16Z
links:
    - parent: myHealth-q36m
---

# MCP Server: Resources implementieren

## Beschreibung
MCP Resources für read-only Zugriff auf Fitness-Daten.

## Resources

### fitness://exercises
```json
{
  "exercises": [
    {
      "name": "Bench Press",
      "muscle_group": "chest",
      "equipment": "barbell",
      "default_sets": 4,
      "default_reps": "6-10",
      "form_cues": ["Schulterblätter zusammen", "Füße fest am Boden"]
    }
  ]
}
```

### fitness://plans/{id}
Liefert einen spezifischen Trainingsplan als JSON.

### fitness://workouts/{date}
```
fitness://workouts/2024-12-15
fitness://workouts/latest
fitness://workouts/week
```

### fitness://daily/{date}
Tägliche Metriken (Gewicht, Schlaf, Schritte, etc.)

### fitness://progress/{exercise}
Fortschritts-Historie für eine spezifische Übung.

## Implementation
```typescript
server.registerResource(
  'exercises',
  'fitness://exercises',
  { title: 'Exercise Library', mimeType: 'application/json' },
  async (uri) => {
    const exercises = await loadExercises();
    return { contents: [{ uri: uri.href, text: JSON.stringify(exercises) }] };
  }
);
```

## Definition of Done
- [ ] Alle 5 Resource-Typen implementiert
- [ ] Parameter-Parsing funktioniert (z.B. /workouts/2024-12-15)
- [ ] Error Handling für nicht gefundene Resources
- [ ] JSON Output ist korrekt formatiert
- [ ] `/code-review:code-review` ausführen
