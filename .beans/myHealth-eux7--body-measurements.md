---
title: 'UX: Body Measurements Tracking'
status: todo
type: feature
priority: medium
tags:
    - ios
    - tracking
    - body
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-eux0
---

# Body Measurements Tracking

## Beschreibung
Körpermaße tracken für Fortschritts-Visualisierung.

## Measurements

### Core Measurements
```yaml
measurements:
  weight:
    unit: kg
    frequency: daily/weekly
    source: manual | healthkit | smart_scale

  body_fat:
    unit: percentage
    frequency: weekly
    source: manual | smart_scale | dexa

  circumferences:
    chest: cm
    waist: cm
    hips: cm
    biceps_left: cm
    biceps_right: cm
    thigh_left: cm
    thigh_right: cm
    calf: cm
    neck: cm
```

### Progress Photos
```
- Front/Side/Back Views
- Same lighting reminder
- Overlay comparison
- Privacy: Local only (optional Cloud)
```

## Input Flow

### Quick Weight Log
```
┌─────────────────────────────────────────────┐
│  Guten Morgen! 🌅                           │
│                                              │
│  Gewicht heute?                             │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │           82.3 kg                        │ │
│  │      [- 0.1]  ↕️  [+ 0.1]               │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  Gestern: 82.5 kg                           │
│  7-Tage Durchschnitt: 82.2 kg               │
│                                              │
│              [Speichern]                     │
└─────────────────────────────────────────────┘
```

### Full Measurement Session
```
AI: "Zeit für deine monatliche Messung!

     Brauchst du eine Erinnerung wie man misst?

     [ ] Brust
     [ ] Taille
     [ ] Hüfte
     [ ] Bizeps (L/R)
     [ ] Oberschenkel (L/R)

     [Anleitung anzeigen]  [Los geht's]"
```

## Trends & Analysis

### Weight Trend
```
┌─────────────────────────────────────────────┐
│  Gewicht: Letzte 90 Tage                    │
├─────────────────────────────────────────────┤
│  84 ─                                        │
│  83 ─  ╲                                     │
│  82 ─    ╲___________/‾‾‾‾╲___              │
│  81 ─                        ‾‾‾             │
│  80 ─                                        │
│      Sep    Okt    Nov    Dez               │
├─────────────────────────────────────────────┤
│  Trend: -2.1 kg in 90 Tagen                 │
│  Rate: ~0.5 kg/Monat (gesund!)              │
└─────────────────────────────────────────────┘
```

### AI Insights
```
AI: "Dein Gewicht ist stabil bei ~82kg.

     Beobachtung:
     - Kraft steigt (PRs)
     - Gewicht konstant
     → Wahrscheinlich Recomposition!

     Deine Umfänge zeigen:
     - Brust: +1.5cm seit Start
     - Taille: -2cm seit Start

     Das ist genau der Fortschritt den
     wir sehen wollen! 💪"
```

## HealthKit Sync
- Automatischer Weight Import
- Body Fat wenn verfügbar
- Export zu Health App

## Implementation
- Manual Input Forms
- HealthKit Integration
- Swift Charts für Trends
- Photo Storage (Local/CloudKit)

## Definition of Done
- [ ] Weight Tracking funktioniert
- [ ] Circumference Tracking
- [ ] Progress Photos (optional)
- [ ] HealthKit Sync
- [ ] AI Trend Analysis
