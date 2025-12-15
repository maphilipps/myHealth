# myHealth Infrastruktur & Architektur

## Übersicht

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER TOUCHPOINTS                                  │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│   iOS App       │   Claude.ai     │   Claude Code   │   Apple Watch         │
│   (SwiftUI)     │   (Chat)        │   (Terminal)    │   (Complication)      │
└────────┬────────┴────────┬────────┴────────┬────────┴───────────┬───────────┘
         │                 │                 │                     │
         │                 │                 │                     │
         ▼                 ▼                 ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AGENT LAYER                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    Claude Agent SDK                                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │   Fitness   │  │  Nutrition  │  │   Health    │  │    Plan     │   │  │
│  │  │   Coach     │  │   Analyst   │  │   Reporter  │  │   Creator   │   │  │
│  │  │   Agent     │  │   Agent     │  │   Agent     │  │   Agent     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MCP SERVER LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                     myHealth MCP Server                                  ││
│  │  ┌───────────────────────────────────────────────────────────────────┐  ││
│  │  │ TOOLS                                                              │  ││
│  │  │ • log_workout(exercise, weight, reps, rpe)                        │  ││
│  │  │ • get_progression(exercise) → weight_recommendation               │  ││
│  │  │ • create_plan(goal, days_per_week, equipment)                     │  ││
│  │  │ • analyze_period(start, end, metrics)                             │  ││
│  │  │ • sync_healthkit() → steps, hr, sleep, weight                     │  ││
│  │  │ • log_nutrition(meal, foods[]) → macros                           │  ││
│  │  └───────────────────────────────────────────────────────────────────┘  ││
│  │  ┌───────────────────────────────────────────────────────────────────┐  ││
│  │  │ RESOURCES                                                          │  ││
│  │  │ • fitness://exercises         → Exercise Library                  │  ││
│  │  │ • fitness://plans/{id}        → Training Plans                    │  ││
│  │  │ • fitness://workouts/{date}   → Workout History                   │  ││
│  │  │ • fitness://daily/{date}      → Daily Metrics                     │  ││
│  │  │ • fitness://nutrition/{date}  → Nutrition Log                     │  ││
│  │  │ • fitness://progress/{ex}     → Exercise Progress                 │  ││
│  │  └───────────────────────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                          │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│   iCloud Drive  │   HealthKit     │   SwiftData     │   Git Backup          │
│   (YAML Files)  │   (Apple)       │   (iOS Cache)   │   (Versioning)        │
│                 │                 │                 │                       │
│   data/         │   • Steps       │   • Session     │   • History           │
│   ├── daily/    │   • Heart Rate  │   • Offline     │   • Diffs             │
│   ├── workouts/ │   • Sleep       │   • Sync Queue  │   • Branches          │
│   ├── nutrition/│   • Weight      │                 │                       │
│   └── plans/    │   • HRV         │                 │                       │
└─────────────────┴─────────────────┴─────────────────┴───────────────────────┘
```

---

## Komponenten Detail

### 1. iOS App (SwiftUI)

**Hauptaufgabe:** Native UI für Workout-Tracking, HealthKit-Zugriff

```
┌─────────────────────────────────────────┐
│              iOS App                     │
├─────────────────────────────────────────┤
│  Views                                   │
│  ├── WorkoutSessionView                 │
│  ├── ExerciseDetailView                 │
│  ├── ProgressChartView                  │
│  ├── NutritionLogView                   │
│  └── SettingsView                       │
├─────────────────────────────────────────┤
│  Services                                │
│  ├── HealthKitService                   │
│  ├── CloudKitSyncService                │
│  ├── AgentAPIService                    │
│  └── ProgressionEngine                  │
├─────────────────────────────────────────┤
│  Data                                    │
│  ├── SwiftData Models                   │
│  ├── iCloud Container                   │
│  └── Local Cache                        │
└─────────────────────────────────────────┘
```

**Technologie-Stack:**

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| UI Framework | SwiftUI | Native Performance, iOS 17+ |
| Data Layer | SwiftData | Apple's modern persistence |
| Health Data | HealthKit | Native Apple Health Access |
| Cloud Sync | CloudKit / iCloud Drive | Seamless Apple Ecosystem |
| Charts | Swift Charts | Native, performant |
| Networking | URLSession + async/await | Modern Swift concurrency |

---

### 2. Claude Agent SDK (Backend Logic)

**Hauptaufgabe:** Intelligente Fitness-Coaching Logik

```
┌─────────────────────────────────────────┐
│         Claude Agent SDK App            │
├─────────────────────────────────────────┤
│  Agents                                  │
│  ├── FitnessCoachAgent                  │
│  │   └── Progressive Overload Logic     │
│  ├── NutritionAnalystAgent              │
│  │   └── Macro Calculation              │
│  ├── PlanCreatorAgent                   │
│  │   └── Periodization Logic            │
│  └── HealthReporterAgent                │
│      └── Trend Analysis                 │
├─────────────────────────────────────────┤
│  MCP Integration                         │
│  ├── Custom Tools (@tool decorator)     │
│  ├── Resource Handlers                  │
│  └── Prompt Templates                   │
├─────────────────────────────────────────┤
│  Session Management                      │
│  ├── Context Retention                  │
│  ├── User Preferences                   │
│  └── Conversation History               │
└─────────────────────────────────────────┘
```

**Technologie-Stack:**

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| SDK | `@anthropic-ai/claude-agent-sdk` | Official Anthropic SDK |
| Language | TypeScript | Better tooling, types |
| Runtime | Node.js 20+ / Bun | Fast, modern JS runtime |
| MCP Server | `@modelcontextprotocol/sdk` | Standard protocol |

---

### 3. MCP Server (Data Access Layer)

**Hauptaufgabe:** Strukturierter Zugriff auf Fitness-Daten

```
┌─────────────────────────────────────────┐
│           MCP Server                     │
├─────────────────────────────────────────┤
│  Tools (Actions)                         │
│  ├── log_workout                        │
│  │   Input: exercise, weight, reps, rpe │
│  │   Output: confirmation, streak       │
│  ├── get_progression                    │
│  │   Input: exercise_name               │
│  │   Output: recommended weight/reps    │
│  ├── create_training_plan               │
│  │   Input: goal, frequency, equipment  │
│  │   Output: full YAML plan             │
│  ├── analyze_progress                   │
│  │   Input: period, metrics             │
│  │   Output: trends, insights           │
│  └── sync_healthkit                     │
│      Input: date_range                  │
│      Output: imported records count     │
├─────────────────────────────────────────┤
│  Resources (Data)                        │
│  ├── fitness://exercises                │
│  ├── fitness://plans/*                  │
│  ├── fitness://workouts/*               │
│  ├── fitness://daily/*                  │
│  └── fitness://progress/*               │
├─────────────────────────────────────────┤
│  Prompts (Templates)                     │
│  ├── workout_recommendation             │
│  ├── weekly_summary                     │
│  └── plan_adjustment                    │
└─────────────────────────────────────────┘
```

---

### 4. Data Layer

**YAML-basierte Speicherung (Git-versioniert)**

```
data/
├── exercises/                 # Exercise Library
│   ├── bench-press.yaml
│   ├── squat.yaml
│   └── ...
├── plans/                     # Training Plans
│   ├── torso-limbs-default.yaml
│   ├── push-pull-legs.yaml
│   └── hybrid-running.yaml    # NEU: Hybrid mit Laufen
├── workouts/                  # Workout Logs
│   ├── 2024-12-15-torso.yaml
│   └── ...
├── daily/                     # Daily Metrics
│   ├── 2024-12-15.yaml
│   └── ...
├── nutrition/                 # Nutrition Logs
│   └── 2024-12-15.yaml
└── vitals/                    # Health Data
    └── 2024-12-15.yaml
```

---

## Deployment Optionen

### Option A: Personal Use (Lokal)

```
┌─────────────────────────────────────────────────────────────┐
│                     Dein Mac                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Claude Code │──│ MCP Server  │──│ data/ (YAML)        │  │
│  └─────────────┘  │ (localhost) │  │ iCloud Drive        │  │
│                   └─────────────┘  └─────────────────────┘  │
│                         │                    │               │
│                         │                    │               │
│                         │                    ▼               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    iPhone                            │    │
│  │  ┌─────────────┐  ┌─────────────┐                   │    │
│  │  │  iOS App    │──│ iCloud Sync │                   │    │
│  │  └─────────────┘  └─────────────┘                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

Kosten: €0
Setup: 1-2 Stunden
```

### Option B: Multi-User (Cloud)

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloud Infrastructure                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 API Gateway                          │    │
│  │                 (Cloudflare / Vercel)                │    │
│  └────────────────────────┬────────────────────────────┘    │
│                           │                                  │
│  ┌────────────────────────┼────────────────────────────┐    │
│  │                        ▼                             │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │ Agent SDK   │  │ MCP Server  │  │  Database   │  │    │
│  │  │ (Workers)   │──│ (Stateless) │──│ (Postgres)  │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  │                   Fly.io / Railway                   │    │
│  └──────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           │                                  │
│  ┌────────────────────────┼────────────────────────────┐    │
│  │                        ▼                             │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │   Auth      │  │   Storage   │  │   Cache     │  │    │
│  │  │  (Clerk)    │  │   (R2/S3)   │  │  (Redis)    │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  │                     Cloudflare                       │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

Kosten: ~€50-200/Monat
Setup: 1-2 Wochen
```

---

## Technologie-Vergleich

### iOS App

| Option | Pros | Cons | Empfehlung |
|--------|------|------|------------|
| **SwiftUI (nativ)** | Beste Performance, HealthKit nativ, Apple-Standard | Nur iOS | ⭐ Empfohlen |
| React Native | Cross-Platform | HealthKit-Bridge nötig, langsamer | Nicht empfohlen |
| Flutter | Cross-Platform, schnell | HealthKit-Bridge, kein Swift | Nicht empfohlen |
| Capacitor | Bestehendes React | Kein natives Feel | Fallback |

### Agent SDK

| Option | Pros | Cons | Empfehlung |
|--------|------|------|------------|
| **TypeScript SDK** | Beste Docs, npm ecosystem | - | ⭐ Empfohlen |
| Python SDK | Einfacher für ML | Weniger Tools | Alternative |

### MCP Server

| Option | Pros | Cons | Empfehlung |
|--------|------|------|------------|
| **TypeScript** | Gleiche Sprache wie Agent SDK | - | ⭐ Empfohlen |
| Swift | Native iOS Integration | Weniger MCP Docs | Später optional |
| Go | Schnell, single binary | Weniger flexible | Für Prod-Scale |

### Data Storage

| Option | Pros | Cons | Empfehlung |
|--------|------|------|------------|
| **YAML + iCloud** | Lesbar, Git-versioniert, Apple Sync | Nicht für Multi-User | ⭐ Personal Use |
| SQLite + CloudKit | Schneller, strukturiert | Weniger portabel | Alternative |
| Postgres + Supabase | Multi-User, skalierbar | Komplex | Für SaaS |

### Hosting (Multi-User)

| Option | Pros | Cons | Empfehlung |
|--------|------|------|------------|
| **Fly.io** | Günstig, einfach, Edge | - | ⭐ Empfohlen |
| Railway | Developer-friendly | Teurer | Alternative |
| Vercel | Serverless | Cold Starts | Für Frontend |
| AWS | Skalierbar | Komplex | Enterprise |

---

## Hybrid-Plan Feature (Laufen + Kraft)

Da du Hybrid-Training erwähnst, hier wie der Agent das handhabt:

```yaml
# data/plans/hybrid-strength-running.yaml
name: "Hybrid Strength + Running"
goal: "strength_and_endurance"
days_per_week: 5
weekly_structure:
  monday:
    type: strength
    workout: torso
    duration_min: 60
  tuesday:
    type: running
    workout: easy_run
    duration_min: 45
    target_hr_zone: 2
  wednesday:
    type: strength
    workout: limbs
    duration_min: 60
  thursday:
    type: running
    workout: intervals
    duration_min: 30
    intervals:
      - { pace: "5k_pace", duration: "400m", rest: "90s", reps: 6 }
  friday:
    type: strength
    workout: full_body_light
    duration_min: 45
  saturday:
    type: running
    workout: long_run
    duration_min: 60-90
    target_hr_zone: 2
  sunday:
    type: rest
    notes: "Active recovery, stretching"

progression_rules:
  strength:
    - "Follow RPE-based progressive overload"
    - "Reduce volume on days before long runs"
  running:
    - "Increase weekly mileage by max 10%"
    - "Easy runs truly easy (conversational pace)"
    - "One quality session per week (intervals OR tempo)"
```

**Agent-Interaktion:**

```
User: "Ich will Hybrid machen - 3x Kraft, 2x Laufen"

Agent: "Perfekt! Ich erstelle dir einen Hybrid-Plan.

Kurze Fragen:
1. Was ist dein Lauf-Ziel? (5K Zeit verbessern / Ausdauer aufbauen / Gewicht halten)
2. Aktuelles Lauf-Level? (Anfänger / Läuft regelmäßig / Erfahren)
3. Hast du eine Laufuhr mit HR-Tracking?

Basierend darauf optimiere ich die Verteilung, damit Kraft und Laufen
sich nicht gegenseitig behindern."
```

---

## Nächste Schritte

### Phase 1: Foundation (Diese Woche)

```
1. [ ] MCP Server in TypeScript aufsetzen
2. [ ] Agent SDK App mit /new-sdk-app erstellen
3. [ ] Basis-Tools implementieren (log_workout, get_progression)
4. [ ] Lokaler Test mit Claude Code
```

### Phase 2: iOS App (Nächste 2 Wochen)

```
1. [ ] Xcode Projekt mit SwiftUI
2. [ ] HealthKit Integration
3. [ ] iCloud Sync für YAML-Daten
4. [ ] Agent API Anbindung
```

### Phase 3: Polish (Woche 3-4)

```
1. [ ] Hybrid-Plan Feature
2. [ ] Charts & Visualisierung
3. [ ] TestFlight Beta
4. [ ] MCP Server als npm Package publishen
```

---

## Quick Start

```bash
# 1. Agent SDK App erstellen (nutzt das Plugin!)
/new-sdk-app myhealth-agent

# 2. Auswählen:
#    Language: TypeScript
#    Agent type: Custom (Fitness Coach)
#    Starting point: Basic agent

# 3. MCP Server hinzufügen
# (wird im nächsten Schritt gebaut)
```

Soll ich direkt loslegen?
