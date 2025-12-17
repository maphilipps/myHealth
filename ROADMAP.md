# Roadmap

## Milestone: MVP Launch - Fitbod Replacement ([myHealth-a122](.beans/myHealth-a122--mvp-launch-fitbod-replacement.md))

### Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
├──────────────┬──────────────┬─────────────┬─────────────────┤
│  PostgreSQL  │    Auth      │   Storage   │  Edge Functions │
│  (RLS)       │  (Apple,     │  (optional) │  (Webhooks)     │
│              │   Google)    │             │                 │
└──────┬───────┴──────┬───────┴─────────────┴─────────────────┘
       │              │
       ▼              ▼
┌──────────────┐ ┌──────────────┐
│ Supabase MCP │ │ iOS App      │
│ (Claude Code)│ │ (Swift SDK)  │
└──────────────┘ └──────────────┘
       │              │
       └──────┬───────┘
              ▼
┌─────────────────────────────────────────────────────────────┐
│              Agent SDK Backend (optional)                    │
│         FitnessCoach, PlanCreator, HealthReporter           │
└─────────────────────────────────────────────────────────────┘
```

---

### Epic: Supabase Setup & Schema ([myHealth-sb01](.beans/myHealth-sb01--supabase-setup-schema.md)) ✅

**Status:** Done | **Priorität:** KRITISCH

Backend-as-a-Service Setup mit PostgreSQL, Auth und MCP Integration.

- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Supabase Projekt erstellen ([myHealth-sb02](.beans/myHealth-sb02--supabase-projekt-erstellen.md))
- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Database Schema anlegen ([myHealth-sb03](.beans/myHealth-sb03--database-schema-anlegen.md))
- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Row-Level Security einrichten ([myHealth-sb04](.beans/myHealth-sb04--rls-policies-einrichten.md))
- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Auth Provider konfigurieren ([myHealth-sb05](.beans/myHealth-sb05--auth-provider-konfigurieren.md))
- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Supabase MCP in Claude Code einrichten ([myHealth-sb06](.beans/myHealth-sb06--supabase-mcp-einrichten.md))
- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) YAML-Daten migrieren ([myHealth-sb07](.beans/myHealth-sb07--yaml-daten-migrieren.md))
- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Exercise Library befüllen ([myHealth-sb08](.beans/myHealth-sb08--exercise-library-befuellen.md))

---

### Epic: iOS App - SwiftUI Native ([myHealth-mudp](.beans/myHealth-mudp--ios-app-swiftui-native.md))

**Status:** Todo | **Blocked by:** Supabase Setup

Native iOS App mit Supabase Swift SDK.

- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Xcode Projekt Setup ([myHealth-ryao](.beans/myHealth-ryao--ios-xcode-projekt-setup.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) iOS: Authentication Flow ([myHealth-y3l3](.beans/myHealth-y3l3--ios-authentication-flow.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) iOS: Workout Session View ([myHealth-bamz](.beans/myHealth-bamz--ios-workout-session-view.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) iOS: Progress Charts ([myHealth-vqh9](.beans/myHealth-vqh9--ios-progress-charts.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) iOS: HealthKit Integration ([myHealth-scew](.beans/myHealth-scew--ios-healthkit-integration.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) iOS: Agent Chat Integration ([myHealth-dnyi](.beans/myHealth-dnyi--ios-agent-chat-integration.md))

---

### Epic: Agent SDK - Fitness Coach Backend ([myHealth-op3q](.beans/myHealth-op3q--agent-sdk-fitness-coach-backend.md)) ✅

**Status:** Done | **Blocked by:** Supabase Setup (resolved)

Intelligenter Fitness-Coach mit Claude Agent SDK und Supabase MCP.

- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Agent SDK: Projekt Setup ([myHealth-9du8](.beans/myHealth-9du8--agent-sdk-projekt-setup-mit-new-sdk-app.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Agent SDK: FitnessCoachAgent implementieren ([myHealth-br9q](.beans/myHealth-br9q--agent-sdk-fitnesscoachagent-implementieren.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Agent SDK: PlanCreatorAgent implementieren ([myHealth-ta88](.beans/myHealth-ta88--agent-sdk-plancreatoragent-implementieren.md))
- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Agent SDK: Claude Code Integration ([myHealth-igry](.beans/myHealth-igry--agent-sdk-claude-code-integration.md))

---

## Milestone: AI-Fitness Product Launch ([myHealth-af01](.beans/myHealth-af01--ai-fitness-product-launch.md)) 🚀

> **Vision:** 100% Agent-basiertes Fitness-Training. **Keine Algorithmen** - Agents SIND die Business Logic.

### Kern-Prinzip: Agent-First

```
┌────────────────────────────────────────────────────────────┐
│  ❌ NICHT: Code mit Algorithmen                            │
│     if rpe > 8.5: weight -= 5%                             │
│                                                             │
│  ✅ STATTDESSEN: Agents entscheiden situativ               │
│     Agent analysiert Kontext, Historie, User-Feedback      │
│     und trifft intelligente Entscheidungen                 │
└────────────────────────────────────────────────────────────┘
```

---

### Epic: Agent Architecture ([myHealth-agt0](.beans/myHealth-agt0--agent-architecture.md)) 🧠 ✅

**Status:** Done | **Priorität:** KRITISCH (Implemented in agent-backend)

Die Multi-Agent Architektur auf der alles basiert.

- ![feature](https://img.shields.io/badge/agent-8B5CF6?style=flat-square) PlannerAgent ([myHealth-agt1](.beans/myHealth-agt1--planner-agent.md)) - Langfristige Planung
- ![feature](https://img.shields.io/badge/agent-8B5CF6?style=flat-square) CoachAgent ([myHealth-agt2](.beans/myHealth-agt2--coach-agent.md)) - Echtzeit-Coaching
- ![feature](https://img.shields.io/badge/agent-8B5CF6?style=flat-square) AnalystAgent ([myHealth-agt3](.beans/myHealth-agt3--analyst-agent.md)) - Muster & Insights
- ![feature](https://img.shields.io/badge/agent-8B5CF6?style=flat-square) ReporterAgent ([myHealth-agt4](.beans/myHealth-agt4--reporter-agent.md)) - Summaries & Reports

---

### Epic: AI Workout Generation ([myHealth-aig0](.beans/myHealth-aig0--ai-workout-generation.md)) ⭐ KERN-FEATURE

**Status:** Todo | **Priorität:** KRITISCH

DAS Differenzierungsmerkmal - Workouts per natürlicher Sprache erstellen und anpassen.

- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Prompt-basierte Workout-Erstellung ([myHealth-aig1](.beans/myHealth-aig1--prompt-workout-creation.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Conversational Workout-Modifikation ([myHealth-aig2](.beans/myHealth-aig2--conversational-workout-modification.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Real-time AI Coaching ([myHealth-aig3](.beans/myHealth-aig3--realtime-ai-coaching.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Voice-to-Log ([myHealth-aig4](.beans/myHealth-aig4--voice-to-log.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Natural Language Exercise Search ([myHealth-aig5](.beans/myHealth-aig5--natural-language-exercise-search.md))

---

### Epic: Smart Analytics ([myHealth-san0](.beans/myHealth-san0--smart-analytics.md))

**Status:** Todo | **Priorität:** HOCH

AI-powered Insights die über simple Statistiken hinausgehen.

- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) AI Training Reports ([myHealth-san1](.beans/myHealth-san1--ai-training-reports.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Plateau Detection ([myHealth-san2](.beans/myHealth-san2--plateau-detection.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Recovery Recommendations ([myHealth-san3](.beans/myHealth-san3--recovery-recommendations.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Injury Prevention Alerts ([myHealth-san4](.beans/myHealth-san4--injury-prevention-alerts.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Strength Standards Vergleich ([myHealth-san5](.beans/myHealth-san5--strength-standards.md))

---

### Epic: Personalization Engine ([myHealth-per0](.beans/myHealth-per0--personalization-engine.md))

**Status:** Todo | **Priorität:** HOCH

Der AI Coach lernt kontinuierlich und passt sich an.

- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Preference Learning ([myHealth-per1](.beans/myHealth-per1--preference-learning.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Auto-Difficulty Adjustment ([myHealth-per2](.beans/myHealth-per2--auto-difficulty-adjustment.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Equipment Detection ([myHealth-per3](.beans/myHealth-per3--equipment-detection.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Time-based Optimization ([myHealth-per4](.beans/myHealth-per4--time-optimization.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Goal-based Program Adaptation ([myHealth-per5](.beans/myHealth-per5--goal-based-adaptation.md))

---

### Epic: Enhanced UX Features ([myHealth-eux0](.beans/myHealth-eux0--enhanced-ux-features.md))

**Status:** Todo | **Priorität:** MITTEL

Fitbod-Parität und darüber hinaus.

- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Muscle Recovery Map ([myHealth-eux1](.beans/myHealth-eux1--muscle-recovery-map.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Personal Records Dashboard ([myHealth-eux2](.beans/myHealth-eux2--personal-records-dashboard.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Workout Calendar ([myHealth-eux3](.beans/myHealth-eux3--workout-calendar.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Apple Watch App ([myHealth-eux4](.beans/myHealth-eux4--apple-watch-app.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Exercise Demos ([myHealth-eux5](.beans/myHealth-eux5--exercise-demos.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Workout Sharing/Export ([myHealth-eux6](.beans/myHealth-eux6--workout-sharing.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Body Measurements ([myHealth-eux7](.beans/myHealth-eux7--body-measurements.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Supersets & Circuits ([myHealth-eux8](.beans/myHealth-eux8--supersets-circuits.md))

---

## Archivierte Epics

### ~~MCP Server - Fitness Data Layer~~ ([myHealth-q36m](.beans/myHealth-q36m--mcp-server-fitness-data-layer.md))

> ⚠️ **SUPERSEDED** by Supabase Setup - Wir nutzen den offiziellen Supabase MCP Server.

### ~~Auth & Multi-User Backend~~ ([myHealth-p6wt](.beans/myHealth-p6wt--auth-multi-user-backend.md))

> ⚠️ **SUPERSEDED** by Supabase Setup - Supabase bringt Auth out-of-the-box.

---

## Feature-Übersicht (AI-Fitness)

| Epic | Features | Priorität |
|------|----------|-----------|
| **Agent Architecture** | 4 Agents | KRITISCH |
| **AI Workout Generation** | 5 Features | KRITISCH |
| **Smart Analytics** | 5 Features | HOCH |
| **Personalization Engine** | 5 Features | HOCH |
| **Enhanced UX** | 8 Features | MITTEL |
| **Gesamt** | **27 Beans** | |

## Das Agent-Team

| Agent | Rolle | Verantwortung |
|-------|-------|---------------|
| 🧠 **PlannerAgent** | Strategist | Trainingspläne, Periodisierung, Programme |
| 🏋️ **CoachAgent** | Personal Trainer | Live-Coaching, Gewichte, Motivation |
| 📊 **AnalystAgent** | Data Scientist | Muster, Plateaus, Insights |
| 📝 **ReporterAgent** | Kommunikator | Summaries, Reports, Feedback |

## Differenzierung vs Fitbod

| Aspekt | Fitbod | myHealth AI |
|--------|--------|-------------|
| **Architektur** | Algorithmen im Code | **Agents = Logic** |
| Workout-Erstellung | Feste Regeln | **Agent entscheidet** |
| Progressive Overload | Formula-based | **Kontextbasiert** |
| Recovery | Statische Berechnung | **Agent interpretiert** |
| Input | UI-Klicks | **Natural Language** |
| Insights | Charts | **Agent erklärt warum** |

---

## Technischer Plan

Detaillierter Plan: [`docs/PLAN-supabase-migration.md`](docs/PLAN-supabase-migration.md)
