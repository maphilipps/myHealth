---
title: 'Analytics: Recovery Recommendations'
status: todo
type: feature
priority: high
tags:
    - ai
    - analytics
    - recovery
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-san0
---

# Recovery Recommendations

## Beschreibung
AI analysiert Recovery-Daten und gibt Empfehlungen für optimale Erholung und Training-Timing.

## Datenquellen

### HealthKit Integration
- Schlafqualität und -dauer
- HRV (Heart Rate Variability)
- Resting Heart Rate
- Aktivitätslevel (Schritte)

### Training Data
- Muskelgruppen-Belastung
- Volumen pro Muskel
- Zeit seit letztem Training
- Intensität (RPE)

### User Input
- Subjektives Wohlbefinden
- Muskelkater-Level
- Stress-Level

## Recovery Status

### Muskel-Recovery
```
┌─────────────────────────────────────┐
│  Recovery Status                     │
├─────────────────────────────────────┤
│  Brust      [████████░░] 80%        │
│  Rücken     [██████████] 100%       │
│  Schultern  [███████░░░] 70%        │
│  Beine      [██████░░░░] 60%        │
│  Arme       [█████████░] 90%        │
└─────────────────────────────────────┘

AI: "Beine brauchen noch ~24h.
     Heute wäre ein guter Tag für Oberkörper."
```

### Systemische Recovery
```
AI: "Basierend auf deinem HRV (niedriger als Baseline)
     und nur 6h Schlaf gestern empfehle ich:

     Option A: Leichteres Workout heute
     Option B: Active Recovery (Mobility, Walk)
     Option C: Ruhetag

     Was passt dir am besten?"
```

## Proactive Suggestions

### Workout-Tag
```
AI: "Guten Morgen! Deine Recovery sieht gut aus:
     - 7.5h Schlaf ✓
     - HRV über Baseline ✓
     - Oberkörper erholt ✓

     Perfekt für dein geplantes Push-Workout!"
```

### Warnung
```
AI: "Heads up: Dein HRV ist heute 15% unter normal.
     Das kann bedeuten dass du nicht optimal erholt bist.

     Ich würde empfehlen:
     - Kürzeres Workout (30 statt 60 min)
     - Leichtere Gewichte (-10%)
     - Oder: Heute Pause, morgen voll durchstarten"
```

## Implementation
- HealthKit Framework
- Custom Recovery Algorithm
- Supabase für Historical Data
- Morning Check-in (optional)

## Definition of Done
- [ ] HealthKit Integration funktioniert
- [ ] Muskel-Recovery wird berechnet
- [ ] HRV-basierte Empfehlungen
- [ ] Proactive Morning Notifications
