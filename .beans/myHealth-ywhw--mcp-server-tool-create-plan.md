---
title: 'MCP Server: Tool - create_plan'
status: superseded
type: feature
priority: high
tags:
    - backend
    - tools
created_at: 2025-12-15T20:42:44Z
updated_at: 2025-12-15T20:42:44Z
links:
    - parent: myHealth-q36m
---

# MCP Server: Tool - create_plan

## Beschreibung
Erstellt einen personalisierten Trainingsplan basierend auf Zielen, verfügbarer Zeit und Equipment.

## Input Schema
```typescript
{
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'hybrid',
  days_per_week: number,        // 2-6
  equipment: 'full_gym' | 'home_basic' | 'home_advanced' | 'bodyweight',
  include_cardio?: boolean,     // Für Hybrid-Pläne
  cardio_type?: 'running' | 'cycling' | 'swimming',
  experience_level?: 'beginner' | 'intermediate' | 'advanced',
  time_per_session?: number     // Minuten
}
```

## Output
```typescript
{
  plan_id: string,
  plan_name: string,
  yaml_content: string,         // Vollständiger YAML Plan
  summary: string,
  weekly_structure: [{
    day: string,
    type: 'strength' | 'cardio' | 'rest',
    workout_name: string,
    exercises: string[]
  }]
}
```

## Plan-Templates
- **Torso/Limbs Split** (4 Tage)
- **Push/Pull/Legs** (3-6 Tage)
- **Upper/Lower** (4 Tage)
- **Full Body** (3 Tage)
- **Hybrid Strength + Running** (4-5 Tage)

## Hybrid-Plan Logik
```
- Lauf-Sessions NICHT vor Bein-Training
- Easy Runs an Regenerationstagen
- Quality Sessions (Intervalle) mit 48h Abstand zu hartem Krafttraining
- Long Runs am Wochenende
```

## Beispiel: Hybrid 4 Tage
```yaml
name: Hybrid Strength + Running
goal: hybrid
days_per_week: 4
weekly_structure:
  monday:
    type: strength
    workout: upper_body
  tuesday:
    type: cardio
    workout: easy_run
    duration_min: 40
  thursday:
    type: strength
    workout: lower_body
  saturday:
    type: cardio
    workout: long_run
    duration_min: 60
```

## Definition of Done
- [ ] Alle Plan-Templates implementiert
- [ ] Hybrid-Logik korrekt
- [ ] YAML-Output validiert
- [ ] Plan wird in data/plans/ gespeichert
- [ ] `/code-review:code-review` ausführen
