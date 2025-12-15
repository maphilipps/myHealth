---
title: 'iOS: Workout Session View'
status: todo
type: feature
priority: critical
tags:
    - ios
    - ui
    - core
created_at: 2025-12-15T20:45:10Z
updated_at: 2025-12-15T20:45:10Z
links:
    - parent: myHealth-mudp
---

# iOS: Workout Session View

## Beschreibung
**KERN-FEATURE** - Hauptbildschirm für aktives Workout-Tracking.

## UI Komponenten

### Pre-Workout Screen
- Heutiger Plan anzeigen
- Übungsliste mit empfohlenen Gewichten
- 'Start Workout' Button

### Active Workout Screen
- Timer (Gesamtdauer)
- Aktuelle Übung prominent
- Set-Tracking:
  - Gewicht Input (NumPad optimiert)
  - Reps Input
  - RPE Slider (1-10)
  - 'Complete Set' Button
- Rest Timer (automatisch nach Set)
- Previous Session anzeigen
- Progression-Empfehlung

### Set Card Design
```
┌─────────────────────────────────┐
│ Set 1                    ✓ Done │
├─────────────────────────────────┤
│  [80] kg  ×  [10] reps          │
│                                 │
│  RPE: ○○○○○○○●○○  (8)          │
│                                 │
│  Last: 77.5kg × 10 @ RPE 8      │
│  Recommended: 80kg × 8-10       │
└─────────────────────────────────┘
```

### Exercise Navigation
- Swipe zwischen Übungen
- Exercise List Sidebar
- Quick Jump

### Rest Timer
- Countdown mit Vibration
- Skip Button
- Automatischer Start nach Set Complete

## Interactions
- Haptic Feedback bei Set Complete
- Long Press für Set löschen
- Double Tap für RPE +1
- Shake für Undo

## Definition of Done
- [ ] Komplettes Workout trackbar
- [ ] RPE Eingabe funktioniert
- [ ] Rest Timer funktioniert
- [ ] Previous Session wird angezeigt
- [ ] Progression-Empfehlung sichtbar
- [ ] Smooth 60fps Animations
