---
title: 'MCP Server: Tool - get_progression'
status: todo
type: feature
priority: critical
tags:
    - backend
    - tools
    - core
created_at: 2025-12-15T20:42:42Z
updated_at: 2025-12-15T20:42:42Z
links:
    - parent: myHealth-q36m
---

# MCP Server: Tool - get_progression

## Beschreibung
**KERN-FEATURE** - Berechnet die empfohlene Gewichts-/Wiederholungsprogression basierend auf der Workout-Historie.

## Input Schema
```typescript
{
  exercise: string,      // z.B. 'Bench Press'
  sessions?: number      // Anzahl Sessions zu analysieren (default: 3)
}
```

## Output
```typescript
{
  exercise: string,
  recommended_weight: number,
  recommended_reps: string,     // z.B. '6-8'
  reasoning: string,            // Erklärung warum
  confidence: 'high' | 'medium' | 'low',
  last_sessions: [{
    date: string,
    sets: [{ weight: number, reps: number, rpe?: number }]
  }],
  trend: 'progressing' | 'plateau' | 'regressing' | 'deload_needed'
}
```

## Progressive Overload Algorithmus

```
1. Lade letzte 3-4 Sessions der Übung
2. Analysiere RPE-Trend:
   - RPE < 8 konstant → Gewicht erhöhen
   - RPE 8-9 konstant → Reps erhöhen
   - RPE > 9 für 2+ Wochen → Deload empfehlen
3. Prüfe Rep-Range Achievement:
   - Top of range erreicht + RPE okay → +2.5kg (Compound) / +1.25kg (Isolation)
   - Mid range → Reps erhöhen
   - Missed reps → Gewicht halten oder reduzieren
4. Berücksichtige Equipment-Typ für Increment
```

## Increment-Tabelle
| Equipment | Standard | Micro |
|-----------|----------|-------|
| Barbell | 2.5kg | 1.25kg |
| Dumbbell | 2kg | 1kg |
| Cable/Machine | 2.5-5kg | varies |

## Beispiel Output
```json
{
  "exercise": "Bench Press",
  "recommended_weight": 82.5,
  "recommended_reps": "6-8",
  "reasoning": "Letzte Session: 80kg × 10,9,8 @ RPE 8. Top of rep range erreicht bei moderatem RPE. Zeit für +2.5kg.",
  "confidence": "high",
  "trend": "progressing"
}
```

## Definition of Done
- [ ] Algorithmus implementiert wie beschrieben
- [ ] Alle Edge Cases behandelt (keine Historie, nur 1 Session, etc.)
- [ ] Unit Tests für Progression-Logik
- [ ] Reasoning ist hilfreich und verständlich
