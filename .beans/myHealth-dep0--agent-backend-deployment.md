---
title: 'Epic: Agent Backend Deployment'
status: todo
type: epic
priority: high
tags:
    - deployment
    - infrastructure
    - devops
created_at: 2025-12-19T11:00:00Z
updated_at: 2025-12-19T11:00:00Z
links:
    - parent: myHealth-af01
---

# Epic: Agent Backend Deployment

## Entscheidung

| Aspekt | Entscheidung |
|--------|--------------|
| **Hosting Provider** | **Fly.io** (offiziell von Anthropic empfohlen) |
| **Region** | Frankfurt (fra) - DSGVO-freundlich |
| **Pattern** | Hybrid Sessions (Auto-Sleep + Auto-Wake) |
| **Auth (Dev)** | Claude Code Subscription (lokal) |
| **Auth (Prod)** | Anthropic API Key (in Fly Secrets) |

## Beschreibung
Das Agent Backend (`agent-backend/`) wird zu **Fly.io** deployed, damit die native iOS App darauf zugreifen kann.

> **Note:** Dieses Projekt ist **iOS-only**. Es gibt keine Web-App.

## Anforderungen

| Anforderung | Grund |
|-------------|-------|
| **Long Request Timeout** | Claude API Calls können 10-60s dauern |
| **Persistent Process** | Kein Cold Start bei jedem Request |
| **HTTPS** | iOS App Security (ATS) |
| **Environment Variables** | API Keys sicher speichern |
| **Auto-Deploy** | GitHub Integration für CI/CD |
| **WebSocket Support** | Für Streaming Responses |
| **Skalierbar** | Später mehr User |
| **Günstig** | Personal Project Budget |

## Offizielle Anthropic Empfehlungen

Laut [platform.claude.com/docs/agent-sdk/hosting](https://platform.claude.com/docs/en/agent-sdk/hosting):

> "The Claude Agent SDK differs from traditional stateless LLM APIs in that it maintains conversational state and executes commands in a persistent environment."

### System Requirements (offiziell)
- **Runtime:** Node.js 18+ (TypeScript SDK)
- **RAM:** 1 GiB empfohlen
- **Disk:** 5 GiB empfohlen
- **CPU:** 1 CPU
- **Network:** Outbound HTTPS zu `api.anthropic.com`

### Offiziell empfohlene Sandbox Provider

| Provider | Beschreibung | Link |
|----------|--------------|------|
| **Fly Machines** ⭐ | Container auf Edge | [fly.io/docs/machines](https://fly.io/docs/machines/) |
| **Modal Sandboxes** | ML-fokussiert | [modal.com](https://modal.com/docs/guide/sandbox) |
| **E2B** | Code Execution | [e2b.dev](https://e2b.dev/) |
| **Cloudflare Sandboxes** | Edge Workers | [github.com/cloudflare/sandbox-sdk](https://github.com/cloudflare/sandbox-sdk) |
| **Daytona** | Dev Environments | [daytona.io](https://www.daytona.io/) |
| **Vercel Sandbox** | Serverless+ | [vercel.com](https://vercel.com/docs/functions/sandbox) |

### ❌ NICHT GEEIGNET

| Plattform | Problem |
|-----------|---------|
| **Netlify Functions** | Serverless, 10s/26s Timeout |
| **Vercel Functions** | Serverless, 10s/60s Timeout |
| **Supabase Edge** | Deno, kurze Timeouts |
| **AWS Lambda** | Serverless, Cold Starts |

## Deployment Patterns (offiziell)

### Pattern 1: Ephemeral Sessions
Container pro Task, danach zerstören.
→ Gut für: Bug fixes, Daten-Extraktion, einmalige Tasks

### Pattern 2: Long-Running Sessions ⭐ UNSER USE CASE
Persistente Container für dauerhaft laufende Agents.
→ Gut für: **Chat Bots, Fitness Coaches, Email Agents**

### Pattern 3: Hybrid Sessions
Ephemere Container die State aus DB laden.
→ Gut für: Intermittierende Nutzung, Session Resume

### Pattern 4: Single Container
Mehrere Agents in einem Container.
→ Gut für: Simulationen, Agent-zu-Agent Kommunikation

## Unsere Wahl: Fly Machines (Pattern 2/3 Hybrid)

### Warum Fly.io?
1. ✅ **Offiziell von Anthropic empfohlen**
2. ✅ Persistente Container (kein Cold Start)
3. ✅ Auto-Sleep wenn idle (Kosten sparen)
4. ✅ Auto-Wake bei Request (Pattern 3 Hybrid)
5. ✅ Frankfurt Region (DSGVO-freundlich)
6. ✅ Free Tier für Personal Use

### Kosten-Schätzung
```
Container: ~$0.05/Stunde = ~$36/Monat (always-on)
Mit Auto-Sleep: ~$5-10/Monat (typische Nutzung)
Free Tier: $0 (bis zu 3 shared VMs)

ABER: Token-Kosten dominieren!
Claude API: ~$3/Million Input, ~$15/Million Output
→ Container ist nicht der Kostentreiber
```

## Setup-Schritte

```bash
# 1. Fly CLI installieren
brew install flyctl

# 2. Login/Signup
fly auth login

# 3. In agent-backend Verzeichnis
cd agent-backend

# 4. App erstellen
fly launch
# → Node.js App detected
# → Wähle Region (fra = Frankfurt)
# → Wähle "No" für Postgres (nutzen Supabase)

# 5. Secrets setzen
fly secrets set ANTHROPIC_API_KEY=sk-ant-xxx
fly secrets set SUPABASE_URL=https://xxx.supabase.co
fly secrets set SUPABASE_SERVICE_KEY=xxx

# 6. Deploy
fly deploy

# 7. Logs checken
fly logs
```

### Dockerfile (auto-generiert oder manuell)

```dockerfile
# Dockerfile für agent-backend
FROM node:20-slim

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build
COPY . .
RUN npm run build

# Run
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/server.js"]
```

### fly.toml Konfiguration

```toml
# fly.toml
app = "myhealth-agents"
primary_region = "fra"  # Frankfurt

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3001"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

  [http_service.concurrency]
    type = "requests"
    hard_limit = 25
    soft_limit = 20

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

## CI/CD mit GitHub Actions

```yaml
# .github/workflows/deploy-agents.yml
name: Deploy Agent Backend

on:
  push:
    branches: [main]
    paths:
      - 'agent-backend/**'
      - '.github/workflows/deploy-agents.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Deploy to Fly.io
        run: flyctl deploy --remote-only
        working-directory: agent-backend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

## Environment Variables

| Variable | Beschreibung | Wo setzen |
|----------|--------------|-----------|
| `ANTHROPIC_API_KEY` | Claude API Key | `fly secrets set` |
| `SUPABASE_URL` | Supabase Project URL | `fly secrets set` |
| `SUPABASE_SERVICE_KEY` | Service Role Key | `fly secrets set` |
| `NODE_ENV` | production | fly.toml |
| `PORT` | 3001 | fly.toml |

## Kosten-Schätzung

### Fly.io Free Tier
- 3 shared-cpu-1x VMs
- 160GB outbound traffic
- Unlimited inbound

**Für Personal Use:** €0/Monat ✅

### Bei Skalierung
- Hobby: ~$5/Monat (dedicated CPU)
- Startup: ~$10-20/Monat (mehr RAM, always-on)

## Alternative: Supabase Edge Functions

Falls du alles in Supabase halten willst, könntest du die Agents als Edge Functions deployen. ABER:

**Probleme:**
1. Deno statt Node.js (Claude SDK muss kompatibel sein)
2. Kürzere Timeouts (max 150s, default 60s)
3. Weniger Flexibilität

**Für später interessant wenn:**
- Du keinen separaten Server willst
- Requests schnell genug sind
- Anthropic ein Deno SDK released

## iOS App Anpassungen

Nach Deployment muss die iOS App die neue URL nutzen:

```swift
// myhealth-ios/Shared/Services/AgentAPIService.swift

enum Environment {
    static let agentAPIBaseURL: URL = {
        #if DEBUG
        return URL(string: "http://localhost:3001")!
        #else
        return URL(string: "https://myhealth-agents.fly.dev")!
        #endif
    }()
}
```

## Authentication Strategie

### Lokal (Development)
```bash
# Claude Code Subscription wird automatisch genutzt
# wenn `claude` im Terminal authentifiziert ist
cd agent-backend
npm run dev:server

# → Nutzt deine Claude Max/Pro Subscription
# → Keine API-Kosten
# → Unlimited Testing
```

### Production (Fly.io)
```bash
# API Key in Fly Secrets
fly secrets set ANTHROPIC_API_KEY=sk-ant-api03-xxx

# → Pay-per-use
# → Pflicht laut Anthropic ToS für deployed Apps
# → ~$3-5/Monat bei typischer Nutzung
```

### Kosten-Vergleich

| Szenario | Auth | Kosten/Monat |
|----------|------|--------------|
| Lokal entwickeln | Subscription | $20 (Pro) / $100 (Max) |
| Production (100 Chats) | API Key | ~$3-5 |
| Production (500 Chats) | API Key | ~$15-25 |

**Empfehlung:** API Key für Production ist oft günstiger!

## iOS App Testing Workflow

### Phase 1: Lokal testen (Development)

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT SETUP                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Mac (localhost)                      iPhone (Simulator)   │
│   ┌─────────────────┐                  ┌─────────────────┐  │
│   │ agent-backend   │◄────────────────►│   iOS App       │  │
│   │ localhost:3001  │   HTTP           │   (Xcode)       │  │
│   └─────────────────┘                  └─────────────────┘  │
│                                                              │
│   Auth: Claude Code Subscription                             │
│   Kosten: $0 (in Subscription inkl.)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Steps:**
```bash
# 1. Backend lokal starten
cd agent-backend
npm run dev:server
# → http://localhost:3001

# 2. iOS App im Simulator
# → Nutzt automatisch localhost:3001 im DEBUG mode
open myhealth-ios/myHealth.xcodeproj
# Cmd+R zum Starten
```

### Phase 2: Physisches iPhone testen (Staging)

```
┌─────────────────────────────────────────────────────────────┐
│                    STAGING SETUP                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Fly.io (Staging)                     iPhone (TestFlight)  │
│   ┌─────────────────┐                  ┌─────────────────┐  │
│   │ agent-backend   │◄────────────────►│   iOS App       │  │
│   │ staging.fly.dev │   HTTPS          │   (TestFlight)  │  │
│   └─────────────────┘                  └─────────────────┘  │
│                                                              │
│   Auth: API Key (Staging)                                   │
│   Kosten: Pay-per-use (~$1-2 für Testing)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Steps:**
```bash
# 1. Staging Environment deployen
fly apps create myhealth-agents-staging
fly secrets set ANTHROPIC_API_KEY=sk-ant-xxx --app myhealth-agents-staging
fly deploy --app myhealth-agents-staging

# 2. iOS App Build für TestFlight
# → Scheme auf "Staging" setzen
# → Archive & Upload to App Store Connect
# → TestFlight Beta testen
```

### Phase 3: Production Release

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Fly.io (Production)                  iPhone (App Store)   │
│   ┌─────────────────┐                  ┌─────────────────┐  │
│   │ agent-backend   │◄────────────────►│   iOS App       │  │
│   │ myhealth.fly.dev│   HTTPS          │   (Released)    │  │
│   └─────────────────┘                  └─────────────────┘  │
│                                                              │
│   Auth: API Key (Production)                                │
│   Monitoring: Fly.io Metrics + Sentry                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## iOS App Environment Configuration

```swift
// myhealth-ios/Shared/Config/Environment.swift

enum Environment {
    case development
    case staging
    case production

    static var current: Environment {
        #if DEBUG
        return .development
        #elseif STAGING
        return .staging
        #else
        return .production
        #endif
    }

    var agentAPIBaseURL: URL {
        switch self {
        case .development:
            return URL(string: "http://localhost:3001")!
        case .staging:
            return URL(string: "https://myhealth-agents-staging.fly.dev")!
        case .production:
            return URL(string: "https://myhealth-agents.fly.dev")!
        }
    }

    var supabaseURL: URL {
        // Supabase bleibt gleich für alle Environments
        // (oder separates Staging-Projekt)
        return URL(string: "https://xxx.supabase.co")!
    }
}
```

## Xcode Schemes

| Scheme | Environment | Backend | Use Case |
|--------|-------------|---------|----------|
| `myHealth (Debug)` | development | localhost:3001 | Simulator Testing |
| `myHealth (Staging)` | staging | staging.fly.dev | TestFlight Beta |
| `myHealth (Release)` | production | myhealth.fly.dev | App Store |

## Testing Checklist

### Vor Staging Deploy
- [ ] Alle Unit Tests grün
- [ ] Lokales Testing mit Simulator funktioniert
- [ ] API Endpoints getestet (Postman/curl)
- [ ] Error Handling getestet

### Vor Production Deploy
- [ ] Staging Tests bestanden
- [ ] TestFlight Beta von min. 1 Person getestet
- [ ] Performance unter Last getestet
- [ ] Rollback-Plan dokumentiert
- [ ] Monitoring eingerichtet

## Environments & URLs

| Environment | Backend URL | Fly App Name |
|-------------|-------------|--------------|
| Development | `http://localhost:3001` | - |
| Staging | `https://myhealth-agents-staging.fly.dev` | `myhealth-agents-staging` |
| Production | `https://myhealth-agents.fly.dev` | `myhealth-agents` |

## Definition of Done
- [ ] Fly.io Account erstellt
- [ ] Staging Environment deployed
- [ ] Production Environment deployed
- [ ] API Keys in Fly Secrets
- [ ] HTTPS funktioniert
- [ ] iOS App Environment Config
- [ ] Xcode Schemes konfiguriert
- [ ] GitHub Actions für Auto-Deploy
- [ ] TestFlight Build funktioniert gegen Staging
- [ ] Monitoring/Logs eingerichtet

## Children
- dep1: Fly.io Initial Setup
- dep2: Staging Environment
- dep3: Production Environment
- dep4: iOS App Environment Config
- dep5: CI/CD Pipeline
