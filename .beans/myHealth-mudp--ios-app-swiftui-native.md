---
title: iOS App - SwiftUI Native
status: todo
type: epic
priority: high
tags:
    - ios
    - swiftui
    - supabase
created_at: 2025-12-15T20:44:34Z
updated_at: 2025-12-15T22:00:00Z
links:
    - parent: myHealth-a122
    - blocked_by: myHealth-sb01
---

# iOS App - SwiftUI Native

## Beschreibung
Native iOS App mit SwiftUI für Workout-Tracking. Nutzt **Supabase** als Backend (statt CloudKit/iCloud).

## Repository
`myhealth-ios` - Separates Xcode Projekt

## Technologie-Stack
- SwiftUI (iOS 17+)
- **Supabase Swift SDK** (`supabase-swift`) ← NEU
- HealthKit für Apple Health Integration
- Swift Charts für Visualisierung
- Async/Await für Networking

## Änderungen vs. ursprünglicher Plan
| Ursprünglich | Jetzt |
|--------------|-------|
| SwiftData + CloudKit | Supabase PostgreSQL |
| iCloud Sync | Supabase Realtime (optional) |
| Custom Auth | Supabase Auth (Apple Sign-In) |

## Features

### Core
- [ ] Workout Session Tracking mit RPE
- [ ] Progressive Overload Anzeige (via Supabase Function)
- [ ] Exercise Library (aus Supabase)
- [ ] Training Plans

### Auth
- [ ] Sign in with Apple (via Supabase)
- [ ] Session Persistence
- [ ] Secure Token Storage (Keychain)

### HealthKit
- [ ] Schritte importieren → daily_logs
- [ ] Herzfrequenz importieren
- [ ] Schlaf importieren
- [ ] Gewicht sync (bidirektional)

### Agent Integration
- [ ] Chat mit Fitness Coach (API Call zu Agent SDK)
- [ ] Plan-Erstellung via Agent
- [ ] Analyse-Reports abrufen

### UI/UX
- [ ] Dark Mode
- [ ] Haptic Feedback
- [ ] Widget für Home Screen

## Supabase Integration
```swift
import Supabase

let supabase = SupabaseClient(
  supabaseURL: URL(string: "https://xxx.supabase.co")!,
  supabaseKey: "your-anon-key"
)

// Auth
let session = try await supabase.auth.signInWithApple(
  idToken: appleIdToken,
  nonce: nonce
)

// Query mit RLS (automatisch user-gefiltert)
let sessions: [WorkoutSession] = try await supabase
  .from("workout_sessions")
  .select()
  .order("date", ascending: false)
  .execute()
  .value
```

## Akzeptanzkriterien
- [ ] App startet und zeigt Login
- [ ] Sign in with Apple funktioniert
- [ ] Workout kann komplett getrackt werden
- [ ] Daten werden in Supabase gespeichert
- [ ] HealthKit Daten werden importiert
- [ ] Progress Charts zeigen echte Daten
- [ ] App läuft flüssig (60fps)

## Nach Abschluss
- [ ] `/code-review:code-review` ausführen
