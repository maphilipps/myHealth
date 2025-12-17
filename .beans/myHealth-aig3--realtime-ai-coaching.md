---
title: 'AI: Real-time Coaching während Workout'
status: todo
type: feature
priority: high
tags:
    - ai
    - coaching
    - realtime
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-aig0
---

# Real-time AI Coaching während Workout

## Beschreibung
Der AI Coach gibt proaktiv Tipps, Motivation und Anpassungen während des Workouts - wie ein echter Personal Trainer.

## Coaching-Momente

### Nach jedem Satz
```
User loggt: 80kg x 8 @ RPE 9

AI: "Starker Satz! RPE 9 ist am oberen Ende.
     Für den nächsten Satz: Bleib bei 80kg,
     Fokus auf saubere Form. 6-8 Reps reichen."
```

### Bei Plateau-Erkennung
```
AI: "Ich sehe du bist wieder bei 80kg.
     Das ist der dritte Versuch.
     Lass uns Drop-Sets probieren:
     80kg x 6, dann sofort 60kg x 10."
```

### Bei ungewöhnlicher Performance
```
AI: "Normalerweise schaffst du 10 Reps bei dem Gewicht.
     Heute nur 6 - alles okay?
     Soll ich das Gewicht für die restlichen Sätze reduzieren?"
```

### Zwischen Übungen
```
AI: "Bankdrücken erledigt!
     Nächste: Schrägbank Kurzhanteln.
     Letzte Woche: 32.5kg x 10.
     Heute probieren wir 35kg."
```

### Motivational Moments
```
AI: "Das war ein PR bei Kniebeugen!
     105kg x 8 - 2.5kg mehr als letztes Mal.
     Die Arbeit zahlt sich aus!"
```

## Coaching Personality
- Supportiv aber nicht übertrieben
- Fakten-basiert
- Anpassbar (mehr/weniger Feedback)
- Lernt Präferenzen

## Settings
```yaml
coaching_level:
  - minimal    # Nur bei PRs und Problemen
  - moderate   # Nach jedem Satz kurzes Feedback
  - detailed   # Volle Personal Trainer Experience
```

## Implementation
- Post-Set Analysis im Agent
- Pattern Recognition für Anomalien
- Streaming Response für schnelles Feedback
- Haptic Feedback bei wichtigen Moments

## Definition of Done
- [ ] Feedback nach jedem Satz
- [ ] PRs werden erkannt und gefeiert
- [ ] Anomalien werden angesprochen
- [ ] Coaching-Level einstellbar
