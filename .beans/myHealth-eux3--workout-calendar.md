---
title: 'UX: Workout Calendar View'
status: todo
type: feature
priority: medium
tags:
    - ios
    - ui
    - planning
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-eux0
---

# Workout Calendar View

## Beschreibung
Kalender-Ansicht für Trainingsplanung und History.

## Views

### Monatsansicht
```
┌─────────────────────────────────────────────┐
│        ◀  Dezember 2025  ▶                  │
├─────────────────────────────────────────────┤
│  Mo   Di   Mi   Do   Fr   Sa   So          │
├─────────────────────────────────────────────┤
│   1    2    3    4    5    6    7          │
│  💪        💪        💪   🏃              │
├─────────────────────────────────────────────┤
│   8    9   10   11   12   13   14          │
│  💪        💪        💪        🏃          │
├─────────────────────────────────────────────┤
│  15   16   17   18   19   20   21          │
│  💪        💪        ▣    ▣    ▣    ▣     │
│                      ← Deload Week          │
└─────────────────────────────────────────────┘

Legende:
💪 = Kraft-Workout (grün = done, grau = geplant)
🏃 = Cardio/Laufen
▣ = Deload
⬜ = Ruhetag
```

### Wochenansicht
```
┌─────────────────────────────────────────────┐
│  Diese Woche                    [+ Planen]  │
├─────────────────────────────────────────────┤
│  Mo 16   Push (Brust, Schultern, Trizeps)  │
│          ✓ Completed - 55min, 12k kg Vol   │
├─────────────────────────────────────────────┤
│  Di 17   Rest Day                           │
│          🧘 Active Recovery empfohlen       │
├─────────────────────────────────────────────┤
│  Mi 18   Pull (Rücken, Bizeps)              │
│          ⏱ Geplant für 18:00               │
├─────────────────────────────────────────────┤
│  Do 19   Legs                               │
│          📋 Geplant                         │
├─────────────────────────────────────────────┤
│  Fr 20   Push                               │
│          📋 Geplant                         │
├─────────────────────────────────────────────┤
│  Sa 21   🏃 Easy Run (5km)                  │
│          📋 Geplant                         │
├─────────────────────────────────────────────┤
│  So 22   Rest                               │
└─────────────────────────────────────────────┘
```

## AI Scheduling

### Automatische Planung
```
AI: "Ich habe deinen Wochenplan erstellt:

     Mo: Push - Brust erholt
     Mi: Pull - 48h nach Push
     Fr: Legs - 72h seit letztem Leg Day
     Sa: Optional Easy Run

     Passt das so?"
```

### Smart Rescheduling
```
User: "Ich kann Mittwoch nicht"

AI: "Kein Problem! Alternativen:

     A) Di statt Mi (Pull → Push tauschen für bessere Recovery)
     B) Do statt Mi (dann Fr = Legs statt Push)
     C) Diese Woche nur 3x, nächste Woche aufholen

     Was passt besser?"
```

## Calendar Sync

### Apple Calendar Integration
```
- Workouts als Kalender-Events
- Reminder 1h vorher
- Automatische Updates bei Änderungen
```

## Implementation
- FSCalendar oder Custom SwiftUI
- EventKit für Calendar Sync
- Supabase für Workout History
- AI für Scheduling Suggestions

## Definition of Done
- [ ] Monatsansicht funktioniert
- [ ] Wochenansicht funktioniert
- [ ] Tap auf Tag zeigt Details
- [ ] AI Scheduling Suggestions
- [ ] Apple Calendar Sync (optional)
