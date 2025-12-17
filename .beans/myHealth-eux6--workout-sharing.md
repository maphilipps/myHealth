---
title: 'UX: Workout Sharing/Export'
status: todo
type: feature
priority: low
tags:
    - ios
    - social
    - export
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-eux0
---

# Workout Sharing/Export

## Beschreibung
Workouts teilen und Daten exportieren.

## Share Features

### Workout Summary Card
```
┌─────────────────────────────────────────────┐
│  🏋️ Push Day                                │
│  myHealth                                   │
├─────────────────────────────────────────────┤
│                                              │
│  Duration: 58 min                           │
│  Volume: 14,250 kg                          │
│  Exercises: 6                               │
│                                              │
│  💪 Highlights:                             │
│  • Bankdrücken: 85kg × 8 (PR!)             │
│  • Schulterdrücken: 55kg × 10              │
│                                              │
│  AI Coach says:                             │
│  "Starke Session! Brust-Volumen            │
│   war 20% höher als Durchschnitt."         │
│                                              │
└─────────────────────────────────────────────┘
```

### Share Options
- Instagram Stories (optimiertes Format)
- WhatsApp/iMessage
- Save to Photos
- Copy as Text

## Export Features

### Data Export
```yaml
formats:
  - CSV (für Excel/Sheets)
  - JSON (für Entwickler)
  - PDF (für Trainer/Arzt)

export_options:
  - Alle Daten
  - Zeitraum wählen
  - Nur bestimmte Übungen
  - Anonymisiert
```

### Export Contents
```
workout_export.csv:
date, exercise, weight, reps, rpe, notes
2025-12-15, Bench Press, 80, 10, 8,
2025-12-15, Bench Press, 82.5, 8, 8.5,
...
```

### PDF Report
```
┌─────────────────────────────────────────────┐
│  TRAINING REPORT                            │
│  Marc Philipps                              │
│  Dezember 2025                              │
├─────────────────────────────────────────────┤
│                                              │
│  [Charts und Statistiken]                   │
│                                              │
│  [PR Entwicklung]                           │
│                                              │
│  [AI Analyse & Empfehlungen]                │
│                                              │
│  myHealth App - Powered by AI               │
└─────────────────────────────────────────────┘
```

## Privacy Controls
```yaml
sharing_settings:
  include_weight: false  # Körpergewicht
  include_photos: false
  include_ai_insights: true
  watermark: true
```

## Implementation
- UIActivityViewController für Share
- CSV/JSON Generation
- PDFKit für Reports
- CloudKit für Sharing Links

## Definition of Done
- [ ] Share Card Generation
- [ ] Social Media Optimiert
- [ ] CSV Export funktioniert
- [ ] PDF Report Generation
- [ ] Privacy Controls
