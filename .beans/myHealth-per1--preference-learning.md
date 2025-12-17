---
title: 'Personalization: Preference Learning'
status: todo
type: feature
priority: high
tags:
    - ai
    - ml
    - personalization
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-per0
---

# Preference Learning

## Beschreibung
Das System lernt implizit aus dem Nutzerverhalten, welche Übungen, Trainingszeiten und Strukturen bevorzugt werden.

## Lern-Signale

### Implizites Feedback
| Signal | Interpretation |
|--------|----------------|
| Übung übersprungen | Mögliche Abneigung |
| Übung hinzugefügt | Möglicht bevorzugt |
| Konsistent hohe RPE | Zu schwierig für User |
| Konsistent niedrige RPE | User mag die Übung |
| Workout abgebrochen bei Übung X | Übung X problematisch |
| Extra Sätze bei Übung Y | Übung Y wird gemocht |

### Explizites Feedback
```
User: "Ich hasse Burpees"
→ Burpees permanent ausgeschlossen

User: "Mehr Übungen wie das"
→ Ähnliche Übungen höher priorisieren
```

## Preference Kategorien

### Übungs-Präferenzen
```yaml
exercises:
  favorites:
    - Bankdrücken
    - Klimmzüge
    - RDL
  avoided:
    - Burpees
    - Box Jumps
  neutral:
    - [alle anderen]
```

### Struktur-Präferenzen
```yaml
structure:
  preferred_rep_range: 8-12
  prefers_compound_first: true
  rest_time_preference: long  # short/medium/long
  superset_tolerance: low
  workout_duration_sweet_spot: 55min
```

### Zeitliche Präferenzen
```yaml
timing:
  preferred_days: [Mo, Mi, Fr, Sa]
  preferred_time: morning  # morning/afternoon/evening
  monday_muscle_groups: [chest, triceps]  # Gewohnheit
```

## Confidence Scoring
```
preference_confidence:
  "hates_burpees": 0.95  # Explizit gesagt
  "prefers_8-12_reps": 0.72  # Aus 20+ Workouts gelernt
  "morning_person": 0.60  # 15 Workouts, Tendenz erkennbar
```

## Implementation
- Event Tracking in Supabase
- Simple ML für Pattern Recognition
- Decay Factor (alte Signale weniger wichtig)
- Override durch explizites Feedback

## Definition of Done
- [ ] Implizite Signale werden erfasst
- [ ] Explizites Feedback wird verarbeitet
- [ ] Präferenzen beeinflussen Empfehlungen
- [ ] Confidence Scores funktionieren
