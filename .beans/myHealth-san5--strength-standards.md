---
title: 'Analytics: Strength Standards Vergleich'
status: done
type: feature
priority: low
tags:
    - analytics
    - motivation
    - gamification
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-san0
---

# Strength Standards Vergleich

## Beschreibung
Zeigt wo der User im Vergleich zu populären Strength Standards steht. Motivierend und für Zielsetzung.

## Standards-Systeme

### Symmetric Strength
```
Kategorien: Untrained, Novice, Intermediate,
            Advanced, Elite, World Class

Berechnung: Gewicht × Reps → 1RM Estimate
Normalisierung: Körpergewicht-basiert
```

### Beispiel-Anzeige
```
┌─────────────────────────────────────────────┐
│  Deine Strength Standards                    │
│  (Körpergewicht: 80kg)                       │
├─────────────────────────────────────────────┤
│                                              │
│  Bankdrücken: 85kg × 8 (est. 1RM: 105kg)    │
│  [░░░░░░██████░░░░░░░░░░░░] Intermediate    │
│                                              │
│  Kniebeugen: 105kg × 8 (est. 1RM: 130kg)    │
│  [░░░░░░░░░░████████░░░░░░] Advanced        │
│                                              │
│  Kreuzheben: 130kg × 6 (est. 1RM: 150kg)    │
│  [░░░░░░░░░░░░████████░░░░] Advanced        │
│                                              │
│  Overhead Press: 55kg × 8 (est. 1RM: 68kg)  │
│  [░░░░████████░░░░░░░░░░░░] Intermediate    │
│                                              │
└─────────────────────────────────────────────┘
```

## AI Interpretation
```
AI: "Dein Gesamtprofil ist 'Intermediate'.

Stärken:
- Unterkörper ist überproportional stark
- Du bist auf dem Weg zu 'Advanced'

Schwachstellen:
- Overhead Press hinkt hinterher
- Mehr Schulter-Fokus würde helfen

Nächste Meilensteine:
- Bankdrücken: 10kg bis Advanced (115kg 1RM)
- OHP: 12kg bis Intermediate Ende (80kg 1RM)"
```

## Gamification
- Badges für Level-Ups
- Progress Tracking über Zeit
- Milestone Notifications

```
🎉 "Level Up! Kniebeugen jetzt auf ADVANCED Level!"
```

## Privacy Note
- Vergleich nur gegen Standards, nicht andere User
- Kein Ranking/Leaderboard
- Fokus auf persönlichen Fortschritt

## Implementation
- Strength Standards Datenbank
- 1RM Calculator (Epley, Brzycki)
- Progress Tracking View
- Achievement System

## Definition of Done
- [ ] Standards-Datenbank implementiert
- [ ] 1RM Berechnung korrekt
- [ ] Visuelle Darstellung
- [ ] AI gibt kontextuelle Tipps
