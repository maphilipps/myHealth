---
title: 'AI: Voice-to-Log'
status: todo
type: feature
priority: high
tags:
    - ai
    - voice
    - ios
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T14:35:00Z
links:
    - parent: myHealth-aig0
notes: |
  Requires iOS native work (AVSpeechRecognizer).
  Backend API is ready - iOS app needs speech-to-text integration.
---

# Voice-to-Log (Spracheingabe)

## Beschreibung
Sets per Sprache loggen - keine Hände am Handy nötig während des Trainings.

## Warum ist das wichtig?
- Hände sind oft verschwitzt/mit Gewichten beschäftigt
- Schneller als Tippen
- Natürlicher Workflow
- Apple Watch Integration

## Voice Commands

### Set loggen
```
"80 Kilo, 10 Wiederholungen"
"Hundert Kilo, acht Reps, war schwer"
"Gleiches Gewicht, 12 Reps"
"Bodyweight, 15"
```

### RPE hinzufügen
```
"Das war leicht" → RPE 6
"War okay" → RPE 7
"Schwer" → RPE 8
"Sehr schwer" → RPE 9
"Maximal" → RPE 10
```

### Quick Commands
```
"Nächste Übung"
"Pause fertig"
"Übung überspringen"
"Workout beenden"
```

### Modifikationen
```
"Füg noch einen Satz hinzu"
"Mach das Gewicht leichter"
"Ich brauch 3 Minuten Pause"
```

## Speech Recognition
- iOS Speech Framework
- Offline-Fähig für Core Commands
- Claude für komplexe Interpretation
- Noise Cancellation für Gym

## UI Flow
```
┌─────────────────────────────────────┐
│  🎤 Listening...                    │
│                                     │
│  "80 Kilo, zehn Reps"              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ ✓ 80 kg × 10 reps            │  │
│  │   RPE: 7 (auto-detected)      │  │
│  │                               │  │
│  │  [Bestätigen]  [Korrigieren]  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Apple Watch Integration
- Watch als primärer Voice Input
- Haptic Confirmation
- Minimal UI auf Watch
- Sync mit iPhone

## Implementation
- `AVSpeechRecognizer` für iOS
- Custom Vocabulary für Fitness-Begriffe
- Streaming zu Claude für Interpretation
- Fallback auf manuelle Eingabe

## Definition of Done
- [ ] Basic Voice Commands funktionieren
- [ ] Gewicht/Reps werden korrekt erkannt
- [ ] RPE aus Kontext interpretiert
- [ ] Apple Watch Support
- [ ] Offline Core Commands
