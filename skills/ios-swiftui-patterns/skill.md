---
name: ios-swiftui-patterns
description: SwiftUI and iOS development patterns for the myHealth iOS app
---

# iOS SwiftUI Patterns for myHealth

Reference patterns for iOS development in the myHealth app.

## Project Structure

```
myhealth-ios/
├── myHealth/Sources/
│   ├── App/              # App entry, navigation
│   │   ├── myHealthApp.swift
│   │   └── ContentView.swift
│   ├── Models/           # Data models
│   │   ├── Workout.swift
│   │   ├── Exercise.swift
│   │   └── Vitals.swift
│   ├── Views/            # SwiftUI components
│   │   ├── Dashboard/
│   │   ├── PlanChat/     # Agent conversation UI
│   │   ├── Auth/
│   │   ├── Settings/
│   │   └── Workout/
│   ├── ViewModels/       # Business logic
│   │   ├── DashboardViewModel.swift
│   │   └── WorkoutViewModel.swift
│   └── Services/         # API, HealthKit, etc.
│       ├── SupabaseManager.swift
│       ├── AgentAPIService.swift
│       └── HealthKitManager.swift
└── project.yml           # XcodeGen config
```

## State Management Pattern

### ViewModel with @MainActor

```swift
import SwiftUI

@MainActor
class WorkoutViewModel: ObservableObject {
    @Published var workouts: [Workout] = []
    @Published var isLoading = false
    @Published var error: Error?

    private let supabase = SupabaseManager.shared

    func loadWorkouts() async {
        isLoading = true
        defer { isLoading = false }

        do {
            workouts = try await supabase.client
                .from("workout_sessions")
                .select()
                .order("date", ascending: false)
                .execute()
                .value
        } catch {
            self.error = error
        }
    }
}
```

### View with ViewModel

```swift
struct WorkoutListView: View {
    @StateObject private var viewModel = WorkoutViewModel()

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    ProgressView("Laden...")
                } else if let error = viewModel.error {
                    ErrorView(error: error, retry: {
                        Task { await viewModel.loadWorkouts() }
                    })
                } else {
                    workoutList
                }
            }
            .navigationTitle("Workouts")
            .task {
                await viewModel.loadWorkouts()
            }
        }
    }

    private var workoutList: some View {
        List(viewModel.workouts) { workout in
            WorkoutRow(workout: workout)
        }
    }
}
```

## Supabase Swift SDK Integration

### SupabaseManager Singleton

```swift
import Supabase

class SupabaseManager {
    static let shared = SupabaseManager()

    let client: SupabaseClient

    private init() {
        client = SupabaseClient(
            supabaseURL: URL(string: Config.supabaseURL)!,
            supabaseKey: Config.supabaseAnonKey
        )
    }

    // MARK: - Auth

    var currentUser: User? {
        client.auth.currentUser
    }

    func signInWithApple(idToken: String, nonce: String) async throws {
        try await client.auth.signInWithIdToken(
            credentials: .init(
                provider: .apple,
                idToken: idToken,
                nonce: nonce
            )
        )
    }

    func signOut() async throws {
        try await client.auth.signOut()
    }
}
```

### Database Operations

```swift
// Fetch with relationships
let workouts: [Workout] = try await supabase.client
    .from("workout_sessions")
    .select("*, workout_sets(*)")
    .eq("user_id", userId)
    .order("date", ascending: false)
    .limit(10)
    .execute()
    .value

// Insert
try await supabase.client
    .from("workout_sessions")
    .insert(newWorkout)
    .execute()

// Update
try await supabase.client
    .from("workout_sessions")
    .update(["status": "completed"])
    .eq("id", workoutId)
    .execute()

// Call RPC function
let result: ProgressionResult = try await supabase.client
    .rpc("get_next_weight", params: [
        "exercise_id": exerciseId,
        "target_reps": targetReps
    ])
    .execute()
    .value
```

## Agent API Integration

### AgentAPIService

```swift
class AgentAPIService {
    static let shared = AgentAPIService()

    private let baseURL = "https://myhealth-agents.fly.dev"

    func chat(message: String) async throws -> AsyncThrowingStream<ChatChunk, Error> {
        var request = URLRequest(url: URL(string: "\(baseURL)/api/chat")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(["message": message])

        let (bytes, response) = try await URLSession.shared.bytes(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.invalidResponse
        }

        return AsyncThrowingStream { continuation in
            Task {
                for try await line in bytes.lines {
                    if line.hasPrefix("data: ") {
                        let json = String(line.dropFirst(6))
                        if let data = json.data(using: .utf8),
                           let chunk = try? JSONDecoder().decode(ChatChunk.self, from: data) {
                            continuation.yield(chunk)
                        }
                    }
                }
                continuation.finish()
            }
        }
    }
}
```

### Using in View

```swift
struct ChatView: View {
    @State private var messages: [Message] = []
    @State private var inputText = ""
    @State private var isStreaming = false

    var body: some View {
        VStack {
            ScrollView {
                ForEach(messages) { message in
                    MessageBubble(message: message)
                }
            }

            HStack {
                TextField("Nachricht...", text: $inputText)
                    .textFieldStyle(.roundedBorder)

                Button(action: sendMessage) {
                    Image(systemName: "arrow.up.circle.fill")
                }
                .disabled(inputText.isEmpty || isStreaming)
            }
            .padding()
        }
    }

    private func sendMessage() {
        let userMessage = Message(role: .user, content: inputText)
        messages.append(userMessage)
        inputText = ""

        Task {
            isStreaming = true
            defer { isStreaming = false }

            var assistantMessage = Message(role: .assistant, content: "")
            messages.append(assistantMessage)

            do {
                let stream = try await AgentAPIService.shared.chat(message: userMessage.content)
                for try await chunk in stream {
                    if let index = messages.lastIndex(where: { $0.role == .assistant }) {
                        messages[index].content += chunk.text
                    }
                }
            } catch {
                // Handle error
            }
        }
    }
}
```

## HealthKit Integration

### HealthKitManager

```swift
import HealthKit

class HealthKitManager: ObservableObject {
    let store = HKHealthStore()

    func requestAuthorization() async throws {
        let typesToRead: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
            HKObjectType.workoutType(),
        ]

        try await store.requestAuthorization(toShare: [], read: typesToRead)
    }

    func fetchSteps(for date: Date) async throws -> Int {
        let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount)!
        let predicate = HKQuery.predicateForSamples(
            withStart: Calendar.current.startOfDay(for: date),
            end: date,
            options: .strictStartDate
        )

        return try await withCheckedThrowingContinuation { continuation in
            let query = HKStatisticsQuery(
                quantityType: stepType,
                quantitySamplePredicate: predicate,
                options: .cumulativeSum
            ) { _, result, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }

                let steps = result?.sumQuantity()?.doubleValue(for: .count()) ?? 0
                continuation.resume(returning: Int(steps))
            }

            store.execute(query)
        }
    }
}
```

## Common UI Components

### Loading State View

```swift
struct LoadingView: View {
    let message: String

    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
            Text(message)
                .foregroundColor(.secondary)
        }
    }
}
```

### Error View with Retry

```swift
struct ErrorView: View {
    let error: Error
    let retry: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.largeTitle)
                .foregroundColor(.red)

            Text("Fehler aufgetreten")
                .font(.headline)

            Text(error.localizedDescription)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)

            Button("Erneut versuchen", action: retry)
                .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}
```

### Stat Card

```swift
struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                Text(title)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Text(value)
                .font(.title2)
                .fontWeight(.bold)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}
```

## Localization (German)

All user-facing strings should be in German:

```swift
// Use String Catalogs or Localizable.strings
Text("Training starten")
Text("Gewicht: \(weight, format: .number) kg")
Text("Wiederholungen")
Text("Fertig")
Text("Abbrechen")
```

## Testing Pattern

```swift
import XCTest
@testable import myHealth

@MainActor
final class WorkoutViewModelTests: XCTestCase {
    var sut: WorkoutViewModel!

    override func setUp() {
        super.setUp()
        sut = WorkoutViewModel()
    }

    func testLoadWorkouts_setsIsLoading() async {
        // Given initial state
        XCTAssertFalse(sut.isLoading)

        // When loading starts
        let task = Task {
            await sut.loadWorkouts()
        }

        // Then loading should be true during fetch
        // (test with mock service for reliable testing)
        await task.value
    }
}
```

## Build Commands

```bash
# Build
xcodebuild -project myHealth.xcodeproj \
  -scheme myHealth \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro' \
  build

# Test
xcodebuild test \
  -project myHealth.xcodeproj \
  -scheme myHealth \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro'

# Screenshot
xcrun simctl io booted screenshot screenshot.png
```
