---
title: 'UX: Muscle Recovery Map'
status: todo
type: feature
priority: high
tags:
    - ios
    - ui
    - recovery
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-eux0
---

# Muscle Recovery Map (Heatmap)

## Beschreibung
Visuelle Darstellung welche Muskeln bereit für Training sind und welche noch Recovery brauchen.

## Design

### Körper-Ansicht
```
       ┌───────────┐
       │    ◯      │  ← Kopf
       ├───────────┤
     ┌─┤  Schulter ├─┐
     │ │  ███████  │ │  ← Rot = noch erholen
     │ ├───────────┤ │
   ──┤ │   Brust   │ ├──
     │ │  ░░░░░░░  │ │  ← Grün = bereit
     │ ├───────────┤ │
     │ │   Core    │ │
     │ │  ▓▓▓▓▓▓▓  │ │  ← Gelb = fast bereit
     │ └───────────┘ │
     │       │       │
     │    ┌──┴──┐    │
     │    │Beine│    │
     │    │█████│    │  ← Rot
     │    └─────┘    │
```

### Farbskala
| Farbe | Status | Bedeutung |
|-------|--------|-----------|
| 🟢 Grün | 80-100% | Vollständig erholt |
| 🟡 Gelb | 50-80% | Fast bereit |
| 🟠 Orange | 25-50% | Braucht mehr Zeit |
| 🔴 Rot | 0-25% | Nicht trainieren |

## Recovery-Berechnung

### Faktoren
```swift
recoveryScore = baseRecovery
              - volumeImpact
              - intensityImpact
              + timeSinceWorkout
              + sleepBonus
              + hrvBonus
```

### Muskelgruppen-Mapping
```yaml
muscle_groups:
  chest:
    exercises: [bench_press, incline_press, flies, pushups]
    recovery_time_hours: 48-72

  back:
    exercises: [rows, pullups, lat_pulldown, deadlifts]
    recovery_time_hours: 48-72

  legs:
    exercises: [squats, leg_press, lunges, rdl]
    recovery_time_hours: 72-96

  shoulders:
    exercises: [ohp, lateral_raises, face_pulls]
    recovery_time_hours: 48

  arms:
    exercises: [curls, tricep_extensions]
    recovery_time_hours: 24-48
```

## AI Integration
```
User tippt auf rote Brust:

AI: "Deine Brust ist noch bei 30% Recovery.

     Letzte Session: Gestern
     - 16 Sätze Brust
     - Hohe Intensität (Avg RPE 8.5)

     Empfehlung: Noch 24h warten
     oder leichtes Pump-Workout heute."
```

## UI Interactions
- Tap auf Muskelgruppe → Detail-Info
- Long Press → Letzte Workouts für Muskel
- Swipe zwischen Vorder-/Rückansicht
- Animation für Recovery-Fortschritt

## Implementation
- 3D Körper-Modell (SceneKit oder 2D Asset)
- Recovery Algorithm in Swift
- Supabase für Workout History
- HealthKit für Sleep/HRV Bonus

## Definition of Done
- [ ] Körper-Visualisierung implementiert
- [ ] Recovery wird korrekt berechnet
- [ ] Tap für Details funktioniert
- [ ] AI erklärt Recovery Status
