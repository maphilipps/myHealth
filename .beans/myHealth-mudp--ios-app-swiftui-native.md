---
title: iOS App - SwiftUI Native
status: in_progress
type: epic
priority: high
tags:
    - ios
    - swiftui
    - supabase
created_at: 2025-12-15T20:44:34Z
updated_at: 2025-12-15T23:55:00Z
links:
    - parent: myHealth-a122
    - blocked_by: myHealth-sb01
---

# iOS App - SwiftUI Native

## Beschreibung
Native iOS App mit SwiftUI für Workout-Tracking. Nutzt **Supabase** als Backend (statt CloudKit/iCloud).

## Repository
`myhealth-ios` - Separates Xcode Projekt auf GitHub: https://github.com/maphilipps/myhealth-ios

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
- [x] Workout Session Tracking mit RPE (ActiveWorkoutView)
- [x] Progressive Overload Anzeige (via Supabase Function)
- [x] Exercise Library (aus Supabase)
- [ ] Training Plans

### Auth
- [x] Email/Password Login (via Supabase)
- [ ] Sign in with Apple (vorbereitet, später aktivieren)
- [x] Session Persistence
- [x] Secure Token Storage (Keychain via Supabase SDK)

### HealthKit
- [x] Schritte importieren → vitals
- [x] Herzfrequenz importieren
- [x] Schlaf importieren
- [x] Gewicht sync (bidirektional)

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
