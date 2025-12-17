---
title: 'UX: Personal Records Dashboard'
status: todo
type: feature
priority: high
tags:
    - ios
    - ui
    - motivation
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-eux0
---

# Personal Records Dashboard

## Beschreibung
Übersicht aller PRs mit History, Predictions und Celebration.

## PR-Tracking

### PR Typen
```yaml
pr_types:
  1rm:           # Geschätzt aus Sets
    name: "1 Rep Max"
    calculation: "Epley Formula"

  volume_pr:      # Meiste kg in einer Session
    name: "Volume PR"
    calculation: "Sum(weight × reps)"

  rep_pr:         # Meiste Reps bei Gewicht X
    name: "Rep PR"
    per_weight: true

  e1rm_pr:        # Estimated 1RM Verbesserung
    name: "Strength PR"
    calculation: "Best e1RM ever"
```

## Dashboard Design

### Main View
```
┌─────────────────────────────────────────────┐
│  🏆 Personal Records                         │
├─────────────────────────────────────────────┤
│                                              │
│  RECENT PRs                                  │
│  ┌─────────────────────────────────────────┐ │
│  │ 🎉 Kniebeugen     105kg × 8   NEW!      │ │
│  │    Vor 2 Tagen    e1RM: 131kg           │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  TOP LIFTS                                   │
│  ┌──────────────────┬──────────────────────┐ │
│  │ Bankdrücken      │ Kreuzheben           │ │
│  │ 85kg × 8         │ 130kg × 6            │ │
│  │ e1RM: 106kg      │ e1RM: 150kg          │ │
│  │ ↑ 5kg seit Start │ ↑ 20kg seit Start    │ │
│  └──────────────────┴──────────────────────┘ │
│                                              │
│  ALL TIME STATS                              │
│  Total PRs: 47  │  This Month: 3            │
│                                              │
└─────────────────────────────────────────────┘
```

### Exercise Detail
```
┌─────────────────────────────────────────────┐
│  ◀ Bankdrücken PR History                    │
├─────────────────────────────────────────────┤
│                                              │
│  Current Best: 85kg × 8 (e1RM: 106kg)       │
│                                              │
│  [Chart: e1RM über Zeit]                     │
│  📈 ────────────────────────────╱───         │
│     Jan  Feb  Mar  Apr  Mai  Jun             │
│                                              │
│  PR Timeline:                                │
│  • Jun 15: 85kg × 8 🏆 Current               │
│  • Mai 28: 82.5kg × 9                        │
│  • Mai 12: 80kg × 10                         │
│  • Apr 20: 80kg × 8                          │
│  ...                                         │
│                                              │
│  AI Prediction:                              │
│  "Bei aktuellem Tempo erreichst du          │
│   90kg × 8 in ~6 Wochen"                    │
│                                              │
└─────────────────────────────────────────────┘
```

## PR Celebration

### Im Workout
```
🎉 NEUER PR!

Bankdrücken
85kg × 8

+2.5kg mehr als dein bisheriger Rekord!

[Teilen]  [Weiter]
```

### Haptics & Sound
- Strong Haptic Feedback
- Optional: Celebration Sound
- Confetti Animation

## AI PR Predictions
```
AI: "Basierend auf deinem Fortschritt:

     Bankdrücken 90kg:  ~6 Wochen
     100kg Kniebeuge:   ~3 Wochen (fast da!)
     150kg Kreuzheben:  Erreicht! 🎉"
```

## Implementation
- PR Detection nach jedem Set
- e1RM Calculation (Epley, Brzycki)
- Swift Charts für History
- Share Sheet Integration

## Definition of Done
- [ ] PRs werden automatisch erkannt
- [ ] Dashboard zeigt alle PRs
- [ ] History View pro Übung
- [ ] Celebration Animation
- [ ] AI Predictions funktionieren
