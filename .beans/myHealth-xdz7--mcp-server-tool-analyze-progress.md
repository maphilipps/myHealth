---
title: 'MCP Server: Tool - analyze_progress'
status: todo
type: feature
priority: normal
tags:
    - backend
    - tools
created_at: 2025-12-15T20:43:14Z
updated_at: 2025-12-15T20:43:14Z
links:
    - parent: myHealth-q36m
---

# MCP Server: Tool - analyze_progress

## Beschreibung
Analysiert Fortschritt über einen Zeitraum und liefert Insights, Trends und Empfehlungen.

## Input Schema
```typescript
{
  period: 'week' | 'month' | 'quarter' | 'custom',
  start_date?: string,     // Für custom
  end_date?: string,       // Für custom
  metrics?: string[]       // z.B. ['volume', 'strength', 'weight']
}
```

## Output
```typescript
{
  period: { start: string, end: string },
  summary: {
    workouts_completed: number,
    total_volume_kg: number,
    prs_achieved: number,
    avg_rpe: number
  },
  trends: {
    weight: { direction: 'up' | 'down' | 'stable', change: number },
    strength: { direction: string, details: string },
    volume: { direction: string, change_percent: number }
  },
  prs: [{ exercise: string, weight: number, reps: number, date: string }],
  insights: string[],
  recommendations: string[]
}
```

## Insights Beispiele
- 'Dein Trainingsvolumen ist um 15% gestiegen - gute Progression\!'
- 'Schlaf unter 7h korreliert mit höherem RPE am Folgetag'
- 'Bench Press zeigt Plateau seit 3 Wochen - Variationsempfehlung'

## Definition of Done
- [ ] Alle Metriken berechnet
- [ ] Trend-Erkennung funktioniert
- [ ] Insights sind actionable
- [ ] Performance bei großen Datensätzen okay
