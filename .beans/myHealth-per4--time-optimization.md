---
title: 'Personalization: Time-based Optimization'
status: done
type: feature
priority: medium
tags:
    - personalization
    - scheduling
    - optimization
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-per0
---

# Time-based Optimization

## Beschreibung
Workouts werden an das verfügbare Zeitfenster angepasst - von 20 Minuten bis 90 Minuten.

## Zeit-Awareness

### Vorher festlegen
```
User: "Ich hab heute nur 30 Minuten"

AI: "30-Minuten Power-Workout!

     Fokus auf Compound-Übungen:
     1. Kniebeugen 3x8
     2. Bankdrücken 3x8
     3. Rudern 3x10

     Kurze Pausen (90 Sek), kein Aufwärmen
     am Kabel nötig. Effizient!"
```

### Während dem Workout
```
[Timer: 45 min]
[Verbleibende Übungen: 3]

AI: "Du bist bei 45 Minuten.
     Für die letzten 3 Übungen:

     Option A: Supersets (15 Min extra)
     Option B: Skip Isolation, nur Biceps Curls (10 Min)
     Option C: Finish tomorrow (Notizen werden gespeichert)"
```

## Workout-Scaling

### Zeit-Presets
```
20 min: "Quick Hit"
- 2-3 Compound Übungen
- 2 Sätze pro Übung
- Superset wo möglich
- Kein Isolationsarbeit

45 min: "Standard"
- 4-5 Übungen
- 3 Sätze pro Übung
- 1-2 Isolation am Ende

60 min: "Full Session"
- 5-6 Übungen
- 3-4 Sätze
- Aufwärmsätze inkludiert
- Vollständige Isolation

90 min: "Extended"
- Alle geplanten Übungen
- Extra Volumen
- Mobility am Ende
```

### Prioritization
```
Bei Zeitknappheit priorisieren:
1. Compound Übungen (Kniebeugen, Kreuzheben, Presses)
2. Schwache Muskelgruppen
3. Übungen mit höchstem ROI
4. Isolation nur wenn Zeit
```

## Smart Scheduling

### Kalender-Integration
```
AI: "Ich sehe du hast Mittwoch nur 1h Mittagspause.
     Soll ich das Mittwoch-Workout auf 45min kürzen?

     Donnerstag hast du abends mehr Zeit,
     da könnte ich das Extra-Volumen einbauen."
```

### Flexible Wochenplanung
```yaml
week_plan:
  total_volume_target: 20_sets_chest

  if_4_days: [5, 5, 5, 5]  # Gleichmäßig
  if_3_days: [7, 7, 6]      # Etwas mehr pro Session
  if_2_days: [10, 10]       # High-Volume Sessions
```

## Implementation
- Time-aware Workout Generator
- Dynamic Exercise Prioritization
- Calendar Integration (optional)
- Mid-workout Adjustment

## Definition of Done
- [x] Zeit kann vor Workout gewählt werden ✅ (CoachAgent asks during workout creation)
- [x] Workout passt sich an Zeit an ✅ (set_workout_exercises creates appropriate workout)
- [x] Mid-workout Adjustments möglich ✅ (modify_workout_exercises tool)
- [ ] Kalender-Integration (optional, future: iOS EventKit)

## Implementation Notes
- CoachAgent conversational workflow handles time constraints naturally
- User can specify "nur 30 Minuten" and agent adapts workout
- modify_workout_exercises allows mid-workout changes (add, remove, swap)
- Calendar integration would need iOS EventKit + edge functions
