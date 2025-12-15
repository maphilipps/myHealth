---
title: 'iOS: Xcode Projekt Setup'
status: done
type: task
priority: high
tags:
    - ios
    - setup
created_at: 2025-12-15T20:45:06Z
updated_at: 2025-12-15T20:45:06Z
links:
    - parent: myHealth-mudp
---

# iOS: Xcode Projekt Setup

## Aufgaben
1. Xcode Projekt erstellen
   - File → New → Project → iOS → App
   - Product Name: myHealth
   - Interface: SwiftUI
   - Storage: SwiftData
   - Include Tests: Yes

2. Capabilities hinzufügen
   - HealthKit
   - iCloud (CloudKit)
   - Background Modes (Background fetch)

3. Projekt-Struktur
```
myHealth/
├── myHealthApp.swift
├── ContentView.swift
├── Models/
│   ├── Workout.swift
│   ├── Exercise.swift
│   ├── DailyLog.swift
│   └── TrainingPlan.swift
├── Views/
│   ├── Dashboard/
│   ├── Workout/
│   ├── Progress/
│   ├── Chat/
│   └── Settings/
├── Services/
│   ├── HealthKitService.swift
│   ├── CloudSyncService.swift
│   ├── AgentAPIService.swift
│   └── ProgressionEngine.swift
├── Utils/
│   └── Extensions/
└── Resources/
    └── Assets.xcassets
```

4. SwiftData Models definieren
5. Basic Navigation einrichten
6. GitHub Repo erstellen und pushen

## Definition of Done
- [x] Projekt kompiliert
- [x] Basic Navigation funktioniert
- [x] HealthKit Capability aktiviert
- [x] Repo auf GitHub: https://github.com/maphilipps/myhealth-ios
- [ ] `/code-review:code-review` ausführen
