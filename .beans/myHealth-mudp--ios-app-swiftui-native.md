---
title: iOS App - SwiftUI Native
status: todo
type: epic
priority: high
tags:
    - ios
    - frontend
created_at: 2025-12-15T20:44:34Z
updated_at: 2025-12-15T20:44:34Z
links:
    - parent: myHealth-a122
---

# iOS App - SwiftUI Native

## Beschreibung
Native iOS App mit SwiftUI für Workout-Tracking, HealthKit-Integration und Agent-Kommunikation.

## Repository
`myhealth-ios` - Separates Xcode Projekt

## Technologie-Stack
- SwiftUI (iOS 17+)
- SwiftData für lokale Persistenz
- HealthKit für Apple Health Integration
- CloudKit/iCloud Drive für Sync
- Swift Charts für Visualisierung
- URLSession + async/await für API Calls

## Features

### Core
- Workout Session Tracking mit RPE
- Progressive Overload Anzeige
- Exercise Library
- Training Plans

### HealthKit
- Schritte importieren
- Herzfrequenz importieren
- Schlaf importieren
- Gewicht sync (bidirektional)

### Agent Integration
- Chat mit Fitness Coach
- Plan-Erstellung via Agent
- Analyse-Reports abrufen

### UI/UX
- Dark Mode
- Haptic Feedback
- Widget für Home Screen
- Apple Watch Complication (später)

## Akzeptanzkriterien
- [ ] Workout kann komplett getrackt werden
- [ ] HealthKit Daten werden importiert
- [ ] Agent-Chat funktioniert
- [ ] iCloud Sync funktioniert
- [ ] App läuft flüssig (60fps)
