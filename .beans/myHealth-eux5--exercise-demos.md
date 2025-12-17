---
title: 'UX: Exercise Demo Videos'
status: todo
type: feature
priority: low
tags:
    - ios
    - content
    - education
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-eux0
---

# Exercise Demo Videos/Animations

## Beschreibung
Visuelle Anleitungen für jede Übung mit AI-Formtipps.

## Content Types

### Video Demos
```
- Kurze Loops (5-10 Sek)
- Professionelle Qualität
- Verschiedene Winkel
- Slow-Motion für Details
```

### 3D Animations
```
- Muscle Highlighting
- Skeleton View
- Form Checkpoints
- Interactive Rotation
```

### AI Form Tips
```
Bei Bankdrücken:

AI: "Achte auf:
     1. Schulterblätter zusammen & runter
     2. Füße fest am Boden
     3. Leichte Brust-Wölbung
     4. Ellbogen 45° vom Körper
     5. Bar über Nippel-Linie"
```

## UI Integration

### Im Workout
```
[?] Info-Button bei jeder Übung

Tap → Overlay mit:
- Video/Animation
- AI Tips
- Common Mistakes
- Variationen
```

### Exercise Library
```
Jede Übung hat:
- Demo Video
- Primäre Muskeln (highlighted)
- Sekundäre Muskeln
- Equipment needed
- AI Coaching Cues
```

## AI Personalized Tips
```
Basierend auf User History:

AI: "Bei deinen letzten Kniebeugen
     war RPE immer hoch bei niedrigen Reps.

     Tipp: Versuche im Loch kurz zu pausieren
     bevor du hochdrückst. Das baut Kraft
     aus der schwächsten Position."
```

## Content Sourcing
- Eigene Produktion (langfristig)
- Lizenzierte Videos (kurzfristig)
- AI-generierte Animationen (experimentell)
- Community Submissions (mit Review)

## Implementation
- Video Hosting (CloudKit oder S3)
- Lazy Loading für Performance
- Offline Cache für Core Exercises
- SceneKit für 3D Animations

## Definition of Done
- [ ] Demo für Top 50 Übungen
- [ ] AI Tips pro Übung
- [ ] Info-Button im Workout
- [ ] Offline Cache funktioniert
