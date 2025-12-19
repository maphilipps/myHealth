# myHealth - Personal Health Tracking System

Ein umfassendes Gesundheits-Tracking-System mit nativer iOS App und Claude Agent SDK Backend für intelligente Analyse und Workout-Coaching.

## Features

- **iOS Native App** (SwiftUI + Supabase)
- **Workout Tracking** mit Progressive Overload
- **Ernährungs-Tracking** mit Makro-Analyse
- **Vitaldaten-Monitoring** (Gewicht, Schlaf, Herzfrequenz)
- **Apple Health Integration** (Auto-Sync)
- **AI Agents** (FitnessCoach, PlanCreator, Analyst, Reporter, Nutrition)
- **Supabase Backend** (PostgreSQL + Auth + RLS)

## Architektur

```
myHealth/
├── myhealth-ios/        # Native iOS App (SwiftUI)
├── agent-backend/       # Claude Agent SDK Backend
│   ├── src/agents/     # AI Agents
│   ├── src/tools/      # Supabase Tools
│   ├── Dockerfile      # Fly.io Deployment
│   └── fly.toml        # Fly.io Config
├── supabase/           # Database Migrations
├── .beans/             # Project Planning
└── data-archive/       # Historische YAML-Daten
```

## Quick Start

### 1. Supabase Backend

Die Datenbank läuft auf Supabase (PostgreSQL mit RLS):

```bash
# Migrations anwenden
cd supabase
supabase db push
```

### 2. Agent Backend (Entwicklung)

```bash
cd agent-backend
npm install
npm run dev:server
# → http://localhost:3001
```

### 3. iOS App (Xcode)

```bash
open myhealth-ios/myHealth.xcodeproj
# Cmd+R zum Starten im Simulator
```

## AI Agents

| Agent | Aufgabe |
|-------|---------|
| **PlannerAgent** | Trainingsplan-Erstellung |
| **CoachAgent** | Echtzeit-Coaching im Workout |
| **AnalystAgent** | Trend-Analyse & Insights |
| **ReporterAgent** | Wöchentliche Reports |
| **NutritionAgent** | Ernährungs-Tracking & Muster |

## Deployment

| Komponente | Plattform | URL |
|------------|-----------|-----|
| **iOS App** | App Store | TestFlight / Production |
| **Agent Backend** | Fly.io | `https://myhealth-agents.fly.dev` |
| **Database** | Supabase | `https://xxx.supabase.co` |

### Agent Backend deployen

```bash
cd agent-backend
fly auth login
fly deploy
```

Siehe `.beans/myHealth-dep0--agent-backend-deployment.md` für Details.

## Lizenz

Private Nutzung
