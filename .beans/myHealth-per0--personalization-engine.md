---
title: 'Epic: Personalization Engine'
status: todo
type: epic
priority: high
tags:
    - ai
    - ml
    - personalization
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-af01
---

# Epic: Personalization Engine

## Beschreibung
Der AI Coach lernt kontinuierlich aus dem Nutzerverhalten und passt sich an. Je mehr man trainiert, desto besser werden die Empfehlungen.

## Warum ist das wichtig?
Jeder trainiert anders:
- Manche mögen hohe Reps, andere schwere Gewichte
- Equipment variiert (Home Gym vs Studio)
- Zeitbudget ändert sich
- Ziele entwickeln sich

## Features
- Preference Learning (lernt implizit aus Verhalten)
- Auto-adjusting Difficulty
- Equipment Detection & Adaptation
- Time-based Optimization
- Goal-based Program Adaptation

## Lern-Signale
```
Implizit:
- Welche Übungen werden übersprungen?
- Bei welchen Übungen sind RPE konsistent hoch/niedrig?
- Wie lange dauern Workouts tatsächlich?
- Welche Tageszeiten werden bevorzugt?

Explizit:
- "Ich mag keine Burpees"
- "Ich hab nur Kurzhanteln"
- "Mein Ziel ist Muskelaufbau"
```

## User Profile Evolution
```yaml
# Woche 1
preferences:
  learned: false

# Woche 8
preferences:
  favorite_exercises: [Bankdrücken, Klimmzüge, RDL]
  avoided_exercises: [Burpees, Box Jumps]
  typical_duration: 55min
  preferred_rep_range: 8-12
  equipment: [Langhantel, Kurzhanteln, Kabelzug]
  recovery_speed: average
  response_to_volume: high
```

## Tech Stack
- Supabase für Preference Storage
- Claude für Interpretation
- Simple ML für Pattern Recognition
- A/B Testing für Optimization

## Definition of Done
- [ ] System lernt aus 10+ Workouts
- [ ] Präferenzen werden gespeichert
- [ ] Empfehlungen verbessern sich messbar
- [ ] User können Präferenzen overriden
