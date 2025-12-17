---
title: 'UX: Apple Watch Companion App'
status: todo
type: feature
priority: high
tags:
    - ios
    - watchos
    - wearable
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-eux0
---

# Apple Watch Companion App

## Beschreibung
Standalone Watch App für Workout-Tracking ohne iPhone in der Hand.

## Core Features

### Workout View
```
┌─────────────────────────┐
│     Bankdrücken         │
│                         │
│   Set 2 of 4           │
│                         │
│   ┌─────────────────┐   │
│   │     80 kg       │   │
│   │    × 10 reps    │   │
│   └─────────────────┘   │
│                         │
│   Last: 77.5kg × 10     │
│                         │
│  [✓ Done]  [Skip →]    │
└─────────────────────────┘
```

### Quick Input
```
Digital Crown:
- Drehen = Gewicht anpassen (±2.5kg)
- Click = Bestätigen

Tap:
- Auf Reps = Reps ändern
- Auf Done = Set loggen

Force Touch:
- RPE eingeben
- Übung skippen
- Pause verlängern
```

### Rest Timer
```
┌─────────────────────────┐
│                         │
│         REST            │
│                         │
│   ╭──────────────────╮  │
│   │                  │  │
│   │      1:47        │  │
│   │                  │  │
│   ╰──────────────────╯  │
│                         │
│   [Tap to Skip]         │
│                         │
└─────────────────────────┘
```

### Voice Commands
```
"Hey Siri, log set"
→ Watch hört zu
→ "80 Kilo, 10 Reps"
→ Bestätigung mit Haptic
```

## Complications

### Circular Complication
```
  ╭───────╮
  │ 💪 3  │  ← 3 Übungen übrig
  │ sets  │
  ╰───────╯
```

### Large Complication
```
┌───────────────────────┐
│ 💪 Push Day           │
│ Next: Bankdrücken     │
│ 80kg recommended      │
└───────────────────────┘
```

## Standalone Features
- Workout startet ohne iPhone
- Lokale Übungs-Cache
- Sync wenn wieder verbunden
- HealthKit direktes Schreiben

## Haptic Feedback
| Event | Haptic |
|-------|--------|
| Set Complete | Success |
| PR! | Celebration |
| Rest Over | Notification |
| Workout Done | Victory |

## Implementation
- WatchOS App Target
- WatchConnectivity für Sync
- SwiftData für Local Cache
- HealthKit Workout Sessions

## Definition of Done
- [ ] Workout trackbar auf Watch
- [ ] Digital Crown Input funktioniert
- [ ] Voice Commands funktionieren
- [ ] Complications verfügbar
- [ ] Offline-fähig mit Sync
