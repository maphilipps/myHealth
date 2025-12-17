---
title: 'Personalization: Equipment Detection'
status: todo
type: feature
priority: medium
tags:
    - personalization
    - equipment
    - setup
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-per0
---

# Equipment Detection & Adaptation

## Beschreibung
Das System kennt das verfügbare Equipment und passt Workouts automatisch an.

## Equipment Profile

### Onboarding
```
AI: "Welches Equipment hast du zur Verfügung?

     [ ] Langhantel + Rack
     [ ] Kurzhanteln (bis __kg)
     [ ] Kabelzug
     [ ] Klimmzugstange
     [ ] Dip Station
     [ ] Bänke (Flach/Schräg)
     [ ] Maschinen
     [ ] Resistance Bands
     [ ] Kettlebells
     [ ] Nur Körpergewicht"
```

### Locations
```yaml
locations:
  home:
    name: "Zuhause"
    equipment:
      - kurzhanteln_bis_32kg
      - klimmzugstange
      - resistance_bands

  gym:
    name: "McFit"
    equipment:
      - full_gym

  travel:
    name: "Hotel"
    equipment:
      - bodyweight
      - resistance_bands
```

## Smart Adaptation

### Location-aware
```
AI: "Du bist nicht im Gym (GPS zeigt Zuhause).
     Soll ich das Workout für dein Home-Equipment anpassen?

     Original: Bankdrücken, Kabelrudern, Beinpresse
     Angepasst: KH Floor Press, KH Rows, Goblet Squats"
```

### Equipment Substitution
```
User: "Ich hab heute keine Langhantel"

AI: "Kein Problem! Hier die Alternativen:
     - Bankdrücken → Kurzhantel Bankdrücken
     - Kniebeugen → Goblet Squats oder Bulgarian Splits
     - Kreuzheben → RDL mit Kurzhanteln"
```

### Gewichts-Verfügbarkeit
```yaml
home_dumbbells:
  available_weights: [5, 7.5, 10, 12.5, 15, 17.5, 20, 25, 30, 32.5]

AI: "Für Schulterdrücken empfehle ich 20kg.
     Da du nur 17.5 oder 20 hast,
     machst du 17.5 x 12 statt 20 x 8."
```

## Travel Mode
```
AI: "Hotel-Workout aktiviert!

     30 Minuten Bodyweight Circuit:
     - Push-ups (3 Varianten)
     - Rows mit Handtuch an Tür
     - Pistol Squats Progressions
     - Planks

     Keine Ausrüstung nötig!"
```

## Implementation
- Equipment Profile in Supabase
- Location-based Suggestions (optional)
- Exercise-to-Equipment Mapping
- Smart Substitution Algorithm

## Definition of Done
- [ ] Equipment Profile Setup
- [ ] Multiple Locations Support
- [ ] Automatische Substitution funktioniert
- [ ] Travel/Minimal Mode verfügbar
