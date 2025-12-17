---
title: 'AI: Conversational Workout-Modifikation'
status: done
type: feature
priority: critical
tags:
    - ai
    - core
    - nlp
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T14:30:00Z
links:
    - parent: myHealth-aig0
---

# Conversational Workout-Modifikation

## Beschreibung
Während des Workouts oder davor kann der User Änderungen durch natürliche Sprache vornehmen. Keine Menüs, kein Suchen.

## Use Cases

### Übung ersetzen
```
User: "Ersetze Bankdrücken durch Schrägbank"
AI: "Okay, ich ersetze Flachbank durch Schrägbank.
     Dein letztes Schrägbank war 70kg x 10.
     Ich empfehle 72.5kg heute."
```

### Übung hinzufügen
```
User: "Füg noch Bizeps dazu"
AI: "Ich füge 3 Sätze Bizeps Curls am Ende hinzu.
     Letztes Mal: 15kg x 12. Heute: 15kg x 12-14."
```

### Übung entfernen
```
User: "Skip Kreuzheben, mein Rücken zwickt"
AI: "Verstanden, Kreuzheben übersprungen.
     Soll ich eine Alternative wie Hip Thrust einbauen?"
```

### Reihenfolge ändern
```
User: "Ich will mit Schultern anfangen"
AI: "Okay, ich schiebe Schulterdrücken nach vorne.
     Bedenke: Dein Bankdrücken könnte etwas leiden."
```

### Gewicht/Reps anpassen
```
User: "Mach Kniebeugen leichter heute"
AI: "Ich reduziere von 100kg auf 90kg.
     Soll ich dafür mehr Reps (12 statt 8) machen?"
```

## Context Awareness
Der AI Coach muss verstehen:
- Aktuelles Workout
- Position im Workout
- Bereits absolvierte Übungen
- Recovery Status der Muskeln

## Implementation
- Conversation State im Agent
- Tools: `modify_workout`, `swap_exercise`, `adjust_load`
- Confirmation vor destruktiven Änderungen
- Undo-Funktion

## Definition of Done
- [x] Alle Modifikations-Typen funktionieren ✅ (add, remove, swap, reorder, adjust)
- [x] Context wird korrekt verstanden ✅ (get_current_session tool)
- [x] Änderungen werden sofort reflektiert ✅ (modify_workout_exercises updates metadata)
- [x] AI erklärt Auswirkungen der Änderung ✅ (System prompt instructs this)

## Implementation Notes
- `modify_workout_exercises` tool supports all modification actions
- Tool registered with CoachAgent
- Context awareness via `get_current_session` and workout metadata
