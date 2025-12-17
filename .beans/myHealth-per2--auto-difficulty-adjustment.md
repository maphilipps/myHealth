---
title: 'Personalization: Auto-Difficulty Adjustment'
status: todo
type: feature
priority: high
tags:
    - ai
    - adaptive
    - personalization
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-per0
---

# Auto-Difficulty Adjustment

## Beschreibung
Das System passt die Schwierigkeit automatisch an das aktuelle Fitness-Level und die Tagesform an.

## Adjustment Faktoren

### Langfristig (Fitness Level)
```
Analyse der letzten 4 Wochen:
- Durchschnittliche Gewichtssteigerung
- RPE-Verteilung
- Completion Rate
- Recovery Speed

→ Baseline Difficulty Level
```

### Kurzfristig (Tagesform)
```
Heute:
- Schlafqualität (HealthKit)
- HRV vs Baseline
- Erste Sätze Performance
- User Feedback ("bin müde")

→ Daily Modifier
```

## Difficulty Presets

### Auto (Empfohlen)
```
AI passt automatisch an:
- Gute Tage: +5-10% Gewicht oder +2 Reps
- Normale Tage: Standard Progression
- Schlechte Tage: -10-15%, Volumen reduzieren
```

### Locked Progression
```
User will manuelle Kontrolle:
- AI schlägt vor, aber fragt immer
- Keine automatischen Anpassungen
```

### Challenge Mode
```
Für erfahrene Lifter:
- Aggressivere Progression
- RPE Ziel: 8-9
- Weniger Deload
```

## Real-time Adjustment

### Im Workout
```
Set 1: 100kg x 8 @ RPE 9
Set 2: 100kg x 6 @ RPE 10

AI: "Das war schwerer als erwartet.
     Für Set 3-4 empfehle ich 95kg
     um das Volumen zu halten."
```

### Zwischen Workouts
```
AI: "Basierend auf gestern:
     - 3 Übungen nicht geschafft
     - Durchschnitt RPE: 9.2

     Heute starten wir 10% leichter
     und schauen wie es läuft."
```

## Warm-up Based Calibration
```
AI: "Wie war das Aufwärmsatz?
     60kg x 5 für Bankdrücken"

User: "Leicht"

AI: "Perfekt, dann starten wir bei 85kg
     statt der geplanten 82.5kg"
```

## Implementation
- Multi-factor Difficulty Score
- Real-time Adjustment Algorithm
- User Override möglich
- Learning from Outcomes

## Definition of Done
- [ ] Long-term Difficulty Tracking
- [ ] Daily Modifier funktioniert
- [ ] Real-time Adjustments im Workout
- [ ] User kann Override/Lock nutzen
