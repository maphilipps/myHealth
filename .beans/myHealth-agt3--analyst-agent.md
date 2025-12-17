---
title: 'Agent: AnalystAgent'
status: done
type: feature
priority: high
tags:
    - agent
    - analytics
    - insights
created_at: 2025-12-17T11:00:00Z
updated_at: 2025-12-17T11:00:00Z
links:
    - parent: myHealth-agt0
---

# AnalystAgent

## Beschreibung
Analysiert Trainings-Daten, erkennt Muster und generiert actionable Insights. Der "Data Scientist" im Agent-Team.

## Rolle
Der AnalystAgent schaut auf die großen Zusammenhänge - Trends über Wochen/Monate, Muster die dem User nicht auffallen.

## Tools

### Read Tools
```typescript
query_workouts(params: {
  start_date?: date,
  end_date?: date,
  exercise_id?: string,
  muscle_group?: string
})
// Returns: filtered workout data

get_exercise_trends(exercise_id, period_days)
// Returns: weight/reps/volume trends

get_volume_by_muscle(period_days)
// Returns: volume distribution per muscle group

get_vitals_correlation(metric, period_days)
// Returns: correlation between vitals and performance

get_pr_history(exercise_id?)
// Returns: PR progression over time
```

### Write Tools
```typescript
create_insight(insight: {
  type: string,
  title: string,
  content: string,
  severity: 'info' | 'warning' | 'success',
  actionable: boolean,
  action_suggestion?: string
})
// Stores an insight for later retrieval
```

## Analyse-Typen

### Plateau Detection
```
Agent (analyzes):
1. get_exercise_trends('bench_press', 28)
   → Week 1: 80kg avg
   → Week 2: 80kg avg
   → Week 3: 80kg avg
   → Week 4: 80kg avg

Agent (thinks):
- 4 Wochen keine Progression
- RPE war dabei 7-8 (nicht am Limit)
- Volume war konstant
- Aber Sleep war gut, Training konsistent
→ Das ist ein Plateau, nicht Overtraining

Agent creates insight:
{
  type: "plateau",
  title: "Bankdrücken stagniert",
  content: "Seit 4 Wochen keine Progression bei 80kg,
            trotz guter Recovery. Zeit für Variation.",
  severity: "warning",
  actionable: true,
  action_suggestion: "Versuche: Rep-Range ändern (5x5),
                      Variation (Incline), oder Deload"
}
```

### Imbalance Detection
```
Agent (analyzes):
1. get_volume_by_muscle(28)
   → Chest: 20 sets/week
   → Back: 12 sets/week
   → Shoulders: 15 sets/week
   → Legs: 8 sets/week

Agent (thinks):
- Push:Pull ratio 1.7:1 (sollte ~1:1 sein)
- Beine stark untertrainiert
- Könnte zu Schulter-Problemen führen

Agent creates insight:
{
  type: "imbalance",
  title: "Push-Pull Imbalance",
  content: "Dein Push-Volumen ist 70% höher als Pull.
            Das kann langfristig Schulter-Probleme verursachen.",
  severity: "warning",
  actionable: true,
  action_suggestion: "Füge 2-3 Ruder-Sätze pro Push-Session hinzu,
                      oder einen extra Back-Day"
}
```

### Recovery Pattern Analysis
```
Agent (analyzes):
1. get_vitals_correlation('sleep_hours', 28)
2. query_workouts({last: 28 days})

Agent (thinks):
- Tage mit <6h Schlaf: RPE +1.5 höher im Schnitt
- Tage nach schlechtem Schlaf: -10% Performance
- User bemerkt das wahrscheinlich nicht bewusst

Agent creates insight:
{
  type: "correlation",
  title: "Schlaf beeinflusst dein Training stark",
  content: "An Tagen nach <6h Schlaf ist deine Performance
            durchschnittlich 10% niedriger und RPE höher.",
  severity: "info",
  actionable: true,
  action_suggestion: "Versuch vor intensiven Sessions
                      auf 7+ Stunden Schlaf zu kommen"
}
```

### Progress Celebration
```
Agent (analyzes):
1. get_pr_history('squat')
2. Compare: 3 months ago vs now

Agent (thinks):
- Kniebeugen: 90kg → 115kg (+28%)
- Das ist exzellenter Fortschritt
- User braucht positive Bestätigung

Agent creates insight:
{
  type: "milestone",
  title: "Insane Squat Progress!",
  content: "Deine Kniebeugen sind in 3 Monaten
            von 90kg auf 115kg gestiegen - das sind 28%!",
  severity: "success",
  actionable: false
}
```

## On-Demand Analysis

### User fragt
```
User: "Warum stagniert mein Bankdrücken?"

Agent:
1. get_exercise_trends('bench_press', 42)
2. get_volume_by_muscle(42)
3. get_vitals_correlation('sleep', 42)

Agent: "Ich hab mir dein Bankdrücken angeschaut:

Beobachtungen:
• Gewicht konstant bei 82.5kg seit 5 Wochen
• Aber: Reps sind gestiegen (7→9)
• Dein Brust-Volumen ist relativ niedrig (12 sets/wk)
• Keine Korrelation mit Schlaf

Meine Einschätzung:
Du machst tatsächlich Fortschritt (Reps!), aber
das Gewicht bewegt sich nicht weil du noch nicht
bei 10+ Reps bist.

Vorschlag:
• Wenn du 10 Reps erreichst, geh auf 85kg
• ODER: Mehr Brust-Volumen (16-20 sets/week)

Was davon spricht dich mehr an?"
```

## Automatische Analyse
Der AnalystAgent läuft auch im Hintergrund (täglich/wöchentlich) und speichert Insights die dann der ReporterAgent verwendet.

## Definition of Done
- [ ] Plateau Detection funktioniert
- [ ] Imbalance Detection funktioniert
- [ ] Correlation Analysis funktioniert
- [ ] Insights werden gespeichert
- [ ] On-demand Analyse möglich
- [ ] KEINE hardcoded Thresholds
