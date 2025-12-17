# Workout UX Improvements Plan

## Analyse: Aktuelle Top-Apps

| App | Stärken | Input-Methode |
|-----|---------|---------------|
| **Strong** | Minimale Taps, legendäre Einfachheit | Manuell, optimiert für Geschwindigkeit |
| **Hevy** | Moderne UI, Social Features | Manuell mit Quick-Fill |
| **Fitbod** | AI-generierte Workouts, Pre-filled Stats | AI + manuelle Anpassung |
| **Lolo** | Natural Language: "type or speak as if chatting" | NLP-basiert |

**Unser Vorteil:** Claude Agent SDK für echtes Natural Language Understanding!

---

## Phase 1: Quick Wins (Sofort umsetzbar)

### 1.1 Progressive Overload Hint
**Problem:** User weiß nicht, welches Gewicht er nehmen soll.
**Lösung:** Vor dem Input die `get_next_weight()` Empfehlung anzeigen.

```swift
// Vor dem Set-Input
VStack {
    if let recommendation = progressionHint {
        HStack {
            Image(systemName: "arrow.up.circle.fill")
                .foregroundStyle(.green)
            Text("Empfohlen: \(recommendation.weight)kg")
                .fontWeight(.medium)
            Text("(\(recommendation.reasoning))")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(.green.opacity(0.1))
        .clipShape(Capsule())
    }
}
```

### 1.2 Tap-to-Fill Previous Set
**Problem:** Manuelles Eintippen ist langsam.
**Lösung:** Tap auf vorherigen Satz → auto-fill.

```swift
// In previousSetsCard
ForEach(sets) { set in
    Button {
        weight = "\(set.weight)"
        reps = "\(set.reps)"
        // Haptic Feedback
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    } label: {
        HStack {
            Text("Set \(set.setNumber)")
            Spacer()
            Text("\(set.weight)kg × \(set.reps)")
            Image(systemName: "arrow.right.circle")
                .foregroundStyle(.blue)
        }
    }
}
```

### 1.3 Haptic Feedback
**Problem:** Kein taktiles Feedback bei Aktionen.
**Lösung:** UIImpactFeedbackGenerator bei wichtigen Aktionen.

```swift
// Bei Set-Completion
UINotificationFeedbackGenerator().notificationOccurred(.success)

// Bei Navigation
UIImpactFeedbackGenerator(style: .light).impactOccurred()

// Bei Timer-Ende
UINotificationFeedbackGenerator().notificationOccurred(.warning)
```

---

## Phase 2: Natural Language Input (Killer Feature)

### 2.1 Text-to-Workout Parser
**Problem:** Workout-Erstellung ist umständlich.
**Lösung:** Freitext → strukturiertes Workout via Claude.

**Input-Beispiele:**
```
"3x8 Bankdrücken mit 80kg, RPE 8"
"Heute Brust: Bench 4x8, Incline 3x10, Flyes 3x12"
"Wie letzte Woche aber 2.5kg mehr"
```

**Implementation:**

```swift
struct QuickLogView: View {
    @State private var inputText = ""
    @State private var parsedSets: [ParsedSet] = []

    var body: some View {
        VStack {
            // Natural Language Input
            TextField("z.B. '3x8 Bench 80kg' oder 'wie letztes Mal'", text: $inputText)
                .textFieldStyle(.roundedBorder)

            // Voice Input Button
            Button {
                startVoiceRecognition()
            } label: {
                Image(systemName: "mic.circle.fill")
                    .font(.title)
            }

            // Parse Button
            Button("Parsen") {
                Task {
                    parsedSets = await parseWithAgent(inputText)
                }
            }

            // Preview parsed sets
            ForEach(parsedSets) { set in
                ParsedSetPreview(set: set)
            }

            // Confirm & Log
            Button("Alle Sätze loggen") {
                logAllSets(parsedSets)
            }
        }
    }
}
```

### 2.2 Agent-basiertes Parsing
**Nutzt unseren FitnessCoachAgent:**

```typescript
// In Agent SDK
const parseWorkoutText = async (text: string, context: WorkoutContext) => {
  const response = await agent.chat({
    messages: [{
      role: 'user',
      content: `Parse diesen Workout-Text und gib strukturierte Daten zurück:
        Text: "${text}"
        Kontext: Letzte Session war ${context.lastSession.type},
        letzte Gewichte: ${JSON.stringify(context.recentWeights)}

        Antworte NUR mit JSON im Format:
        {
          "sets": [
            {"exercise": "Bench Press", "weight": 80, "reps": 8, "rpe": 8},
            ...
          ]
        }`
    }]
  });

  return JSON.parse(response.content);
};
```

### 2.3 Voice Input
**Problem:** Typing während des Trainings ist unpraktisch.
**Lösung:** Speech-to-Text + NLP Parsing.

```swift
import Speech

class VoiceInputManager: ObservableObject {
    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "de-DE"))

    func startListening() {
        // ... Speech recognition setup
        // Result → parseWithAgent()
    }
}
```

---

## Phase 3: Smart Workout Creation

### 3.1 Text-to-Plan
**Problem:** Plan-Erstellung im UI ist kompliziert.
**Lösung:** Natürliche Beschreibung → vollständiger Plan.

**Input:**
```
"Erstelle einen 4-Tage Upper/Lower Split für Hypertrophie.
Fokus auf Brust und Rücken. Equipment: Langhantel, Kurzhanteln, Kabelzug."
```

**Output:** Vollständiger TrainingPlan mit allen Exercises, Sets, Reps.

### 3.2 Smart Suggestions
**Basierend auf:**
- Letzte Workouts (Frequenz, Volumen)
- Progression-Trends
- RPE-Historie
- Regenerationszeit

```swift
// Im Coach-Chat oder Dashboard
struct SmartSuggestionCard: View {
    let suggestion: WorkoutSuggestion

    var body: some View {
        VStack(alignment: .leading) {
            Text("Heute empfohlen")
                .font(.caption)
                .foregroundStyle(.secondary)

            Text(suggestion.workoutType.displayName)
                .font(.title2)
                .fontWeight(.bold)

            Text(suggestion.reasoning)
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Button("Workout starten") {
                // Start workout with pre-loaded suggestions
            }
        }
    }
}
```

---

## Phase 4: UX Polish

### 4.1 Swipe Gestures
```swift
// In Set-Liste
.swipeActions(edge: .trailing) {
    Button(role: .destructive) {
        deleteSet(set)
    } label: {
        Label("Löschen", systemImage: "trash")
    }
}
.swipeActions(edge: .leading) {
    Button {
        duplicateSet(set)
    } label: {
        Label("Kopieren", systemImage: "doc.on.doc")
    }
    .tint(.blue)
}
```

### 4.2 Quick-Add Shortcuts
```swift
// Horizontale Quick-Buttons
ScrollView(.horizontal) {
    HStack {
        QuickAddButton(text: "+2.5kg") {
            weight = "\(Double(weight)! + 2.5)"
        }
        QuickAddButton(text: "+1 Rep") {
            reps = "\(Int(reps)! + 1)"
        }
        QuickAddButton(text: "=Last") {
            loadLastSet()
        }
    }
}
```

### 4.3 Rest Timer Improvements
```swift
// Configurable rest times
enum RestPreset: Int, CaseIterable {
    case short = 60
    case medium = 90
    case long = 120
    case extraLong = 180

    var label: String {
        "\(rawValue)s"
    }
}

// Auto-start option
@AppStorage("autoStartRest") var autoStartRest = true

// Vibration at end
AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
```

---

## Prioritäten

| Feature | Impact | Aufwand | Priorität | Status |
|---------|--------|---------|-----------|--------|
| Progressive Overload Hint | Hoch | Niedrig | **P0** | ✅ Done |
| Tap-to-Fill | Hoch | Niedrig | **P0** | ✅ Done |
| Haptic Feedback | Mittel | Niedrig | **P0** | ✅ Done |
| Natural Language Input | Sehr Hoch | Mittel | **P1** | ✅ Done |
| Voice Input | Hoch | Mittel | **P1** | ✅ Done |
| Text-to-Plan | Sehr Hoch | Hoch | **P2** | ✅ Done |
| Swipe Gestures | Mittel | Niedrig | **P2** | ✅ Done |
| Smart Suggestions | Hoch | Hoch | **P2** | ✅ Done |
| Quick-Add Shortcuts | Hoch | Niedrig | **P2** | ✅ Done |

---

## Nächste Schritte

1. ~~**Phase 1 implementieren** (Quick Wins)~~ ✅ DONE (2025-12-16)
   - ✅ Progressive Overload Hint (mit Tap-to-Fill)
   - ✅ Tap-to-Fill für vorherige Sätze
   - ✅ Haptic Feedback (Set completion, Rest timer, Navigation)

2. ~~**Phase 2: Natural Language Input**~~ ✅ DONE (2025-12-16)
   - ✅ `parseWorkoutText()` in Web (claude-api.ts)
   - ✅ `parseWorkoutText()` in iOS (AgentService.swift)
   - ✅ QuickLogView mit Text + Voice Input
   - ✅ VoiceInputManager mit SFSpeechRecognizer (de-DE)
   - ✅ Xcode-Projekt aktualisiert

3. ~~**Phase 3: Text-to-Plan & Smart Suggestions**~~ ✅ DONE (2025-12-16)
   - ✅ `generatePlanFromText()` in AgentService.swift
   - ✅ `getSmartSuggestion()` in AgentService.swift
   - ✅ CreatePlanView mit AI-Mode (Template vs AI)
   - ✅ Natural Language Plan Generation
   - ✅ Plan Preview vor dem Speichern
   - ✅ SmartSuggestionCard in DashboardView
   - ✅ AI-Recommendation Section mit Confidence Indicator
   - ✅ createPlanFromAI() in TrainingPlanService.swift

4. ~~**Phase 4: UX Polish**~~ ✅ DONE (2025-12-16)
   - ✅ Swipe Gestures für Set Management (Delete/Duplicate)
   - ✅ Quick-Add Buttons (+2.5kg, -2.5kg, +1 Rep, -1 Rep, =Last)
   - ✅ deleteSet(), updateSet(), duplicateSet() in WorkoutService.swift
   - ✅ SetRowView mit SwipeActions
   - ✅ QuickAddButton Component

---

## Quellen

- [Best Weightlifting Apps Comparison](https://just12reps.com/best-weightlifting-apps-of-2025-compare-strong-fitbod-hevy-jefit-just12reps/)
- [Hevy Best Workout App](https://www.hevyapp.com/use-cases/best-workout-app/)
- [AI Fitness Workout Assistant NLP Research](https://www.ijsat.org/papers/2025/1/2874.pdf)
- [Lolo Fitness AI Log](https://apps.apple.com/in/app/fitness-workout-ai-log-lolo/id6670321531)
- [Everfit AI Workout Builder](https://help.everfit.io/en/articles/9373485-introducing-ai-workout-builder)
