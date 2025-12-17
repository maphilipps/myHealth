---
title: 'UX: Supersets & Circuit Support'
status: todo
type: feature
priority: medium
tags:
    - ios
    - workout
    - advanced
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-eux0
---

# Supersets & Circuit Support

## Beschreibung
Erweiterte Workout-Strukturen für effizienteres Training.

## Workout Strukturen

### Superset (2 Übungen)
```
Bankdrücken ↔️ Rudern
─────────────────────────────────
Set 1: Bench 80kg×10 → Row 70kg×10
       [Rest 90s]
Set 2: Bench 80kg×9  → Row 70kg×10
       [Rest 90s]
Set 3: Bench 80kg×8  → Row 70kg×10
─────────────────────────────────
```

### Tri-Set (3 Übungen)
```
Schulter Circuit:
─────────────────────────────────
OHP → Lateral Raise → Face Pull
55kg×8 → 10kg×15 → 20kg×15
[Rest 2min]
Repeat 3x
─────────────────────────────────
```

### Giant Set (4+ Übungen)
```
Bein Burner:
─────────────────────────────────
Kniebeugen → Beinpresse → Lunges → Leg Curls
100kg×10 → 150kg×15 → BW×12 → 40kg×12
[Rest 3min]
Repeat 3x
─────────────────────────────────
```

### Circuit Training
```
Full Body Circuit (4 Runden):
─────────────────────────────────
45s Work / 15s Transition

1. Push-ups
2. Rows
3. Squats
4. Planks
5. Burpees

[3min Rest zwischen Runden]
─────────────────────────────────
```

## UI für Supersets

### Workout Builder
```
┌─────────────────────────────────────────────┐
│  Übungen                    [+ Superset]    │
├─────────────────────────────────────────────┤
│  1. Kniebeugen              [○ ○ ○ ○]       │
├─────────────────────────────────────────────┤
│  ┌─ Superset ─────────────────────────────┐ │
│  │ 2a. Bankdrücken          [○ ○ ○]       │ │
│  │ 2b. Rudern               [○ ○ ○]       │ │
│  └────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│  3. Schulterdrücken         [○ ○ ○]        │
└─────────────────────────────────────────────┘
```

### Active Workout
```
┌─────────────────────────────────────────────┐
│  🔄 SUPERSET - Round 2/3                    │
├─────────────────────────────────────────────┤
│                                              │
│  CURRENT: Bankdrücken                       │
│  80 kg × 10 reps                            │
│  [Log Set]                                  │
│                                              │
│  NEXT: Rudern (no rest)                     │
│  70 kg × 10 reps                            │
│                                              │
└─────────────────────────────────────────────┘
```

## AI Superset Suggestions
```
AI: "Für dein 45-Minuten Workout
     empfehle ich Supersets:

     1. Bench + Row (Push/Pull)
     2. OHP + Pulldowns (Push/Pull)
     3. Curls + Triceps (Antagonist)

     Das spart ~15 Minuten gegenüber
     normalem Training bei gleichem Volumen."
```

## Smart Pairing
```yaml
superset_rules:
  antagonist:  # Gegenspieler
    - [bench, row]
    - [biceps, triceps]
    - [quad, hamstring]

  pre_exhaust:  # Isolation vor Compound
    - [flies, bench]
    - [lateral_raise, ohp]

  post_exhaust:  # Compound dann Isolation
    - [bench, flies]
    - [squats, leg_extension]

  upper_lower:  # Kein Konflikt
    - [pullups, squats]
    - [ohp, lunges]
```

## Implementation
- Superset Data Model
- UI für Gruppierung
- Timer Anpassung (kein Rest zwischen)
- AI Pairing Suggestions

## Definition of Done
- [ ] Supersets erstellbar
- [ ] Tri-Sets/Giant Sets Support
- [ ] Circuit Mode
- [ ] AI Pairing Suggestions
- [ ] Timer passt sich an
