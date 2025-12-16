---
title: 'Agent SDK: FitnessCoachAgent implementieren'
status: done
type: feature
priority: critical
tags:
    - backend
    - agent
    - core
created_at: 2025-12-15T20:44:10Z
updated_at: 2025-12-15T20:44:10Z
links:
    - parent: myHealth-op3q
---

# Agent SDK: FitnessCoachAgent

## Beschreibung
Haupt-Agent für Workout-Coaching mit Progressive Overload.

## Capabilities
- Nutzt `get_progression` Tool um Gewichte zu empfehlen
- Nutzt `log_workout` Tool um Sets zu speichern
- Versteht RPE und passt Empfehlungen an
- Gibt Formcheck-Hinweise aus der Übungsbibliothek

## Conversation Flow

### Workout starten
```
User: 'Ich will heute Torso trainieren'
Agent: 
1. Lädt Torso-Plan aus Resources
2. Holt Progression für jede Übung
3. Zeigt Workout-Karte mit empfohlenen Gewichten
```

### Set loggen
```
User: 'Bankdrücken 80kg 10 Wiederholungen, fühlte sich gut an'
Agent:
1. Interpretiert 'gut' als ~RPE 7-8
2. Ruft log_workout auf
3. Bestätigt und gibt Empfehlung für nächsten Satz
```

### Anpassung
```
User: 'Das war zu schwer'
Agent:
1. Reduziert Gewicht um 5-10%
2. Erklärt warum (Recovery, Schlaf, etc.)
3. Passt zukünftige Empfehlungen an
```

## Implementation
```typescript
const fitnessCoach = server.registerTool(
  'workout_coach',
  {
    title: 'Fitness Coach',
    description: 'Interactive workout coaching with progressive overload',
    inputSchema: {
      action: z.enum(['start_workout', 'log_set', 'get_recommendation', 'finish_workout']),
      workout_type: z.string().optional(),
      exercise: z.string().optional(),
      weight: z.number().optional(),
      reps: z.number().optional(),
      perceived_effort: z.string().optional()
    }
  },
  async (input) => {
    // Agent logic here
  }
);
```

## Definition of Done
- [ ] Agent kann komplettes Workout durchführen
- [ ] Progression-Empfehlungen sind korrekt
- [ ] Natural Language Input wird verstanden
- [ ] Context zwischen Sätzen bleibt erhalten
- [ ] `/code-review:code-review` ausführen
