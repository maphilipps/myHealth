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

### Epic: Supabase Setup & Schema ([myHealth-sb01](.beans/myHealth-sb01--supabase-setup-schema.md)) 🆕

**Status:** Todo | **Priorität:** KRITISCH

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

### Epic: Agent SDK - Fitness Coach Backend ([myHealth-op3q](.beans/myHealth-op3q--agent-sdk-fitness-coach-backend.md))

**Status:** Todo | **Blocked by:** Supabase Setup

Intelligenter Fitness-Coach mit Claude Agent SDK und Supabase MCP.

- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Agent SDK: Projekt Setup ([myHealth-9du8](.beans/myHealth-9du8--agent-sdk-projekt-setup-mit-new-sdk-app.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Agent SDK: FitnessCoachAgent implementieren ([myHealth-br9q](.beans/myHealth-br9q--agent-sdk-fitnesscoachagent-implementieren.md))
- ![feature](https://img.shields.io/badge/feature-0e8a16?style=flat-square) Agent SDK: PlanCreatorAgent implementieren ([myHealth-ta88](.beans/myHealth-ta88--agent-sdk-plancreatoragent-implementieren.md))
- ![task](https://img.shields.io/badge/task-1d76db?style=flat-square) Agent SDK: Claude Code Integration ([myHealth-igry](.beans/myHealth-igry--agent-sdk-claude-code-integration.md))

---

## Archivierte Epics

### ~~MCP Server - Fitness Data Layer~~ ([myHealth-q36m](.beans/myHealth-q36m--mcp-server-fitness-data-layer.md))

> ⚠️ **SUPERSEDED** by Supabase Setup - Wir nutzen den offiziellen Supabase MCP Server.

### ~~Auth & Multi-User Backend~~ ([myHealth-p6wt](.beans/myHealth-p6wt--auth-multi-user-backend.md))

> ⚠️ **SUPERSEDED** by Supabase Setup - Supabase bringt Auth out-of-the-box.

---

## Technischer Plan

Detaillierter Plan: [`docs/PLAN-supabase-migration.md`](docs/PLAN-supabase-migration.md)

## Geschätzter Aufwand

| Phase | Dauer | Inhalt |
|-------|-------|--------|
| 1. Supabase Setup | 1 Tag | Projekt, Schema, MCP |
| 2. Migration | 1 Tag | YAML → Supabase |
| 3. iOS Basics | 1 Woche | Auth, Workout Logging |
| 4. Agent SDK | 3-4 Tage | FitnessCoach, PlanCreator |
| 5. Polish | 1 Woche | HealthKit, Charts, UX |

**Gesamt: ~3 Wochen**
