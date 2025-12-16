---
title: iOS App - SwiftUI Native
status: done
type: epic
priority: high
tags:
    - ios
    - swiftui
    - supabase
created_at: 2025-12-15T20:44:34Z
updated_at: 2025-12-16T09:45:00Z
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
- [x] Sign in with Apple ✓
- [x] Session Persistence
- [x] Secure Token Storage (Keychain via Supabase SDK)

### HealthKit
- [x] Schritte importieren → vitals
- [x] Herzfrequenz importieren
- [x] Schlaf importieren
- [x] Gewicht sync (bidirektional)

### Agent Integration
- [x] Chat mit Fitness Coach (ChatView mit AgentService) ✓
- [ ] Plan-Erstellung via Agent (future)
- [ ] Analyse-Reports abrufen (future)

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
- [x] App startet und zeigt Login ✓
- [x] Sign in with Apple funktioniert ✓
- [x] Workout kann komplett getrackt werden ✓
- [x] Daten werden in Supabase gespeichert ✓
- [x] HealthKit Daten werden importiert ✓
- [x] Progress Charts zeigen echte Daten ✓
- [x] App läuft flüssig (60fps) ✓

## Nach Abschluss
- [ ] `/code-review:code-review` ausführen
