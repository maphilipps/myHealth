---
title: Agent SDK - Fitness Coach Backend
status: todo
type: epic
priority: high
tags:
    - backend
    - agent-sdk
    - supabase
created_at: 2025-12-15T20:43:35Z
updated_at: 2025-12-15T22:00:00Z
links:
    - parent: myHealth-a122
    - blocked_by: myHealth-sb01
---

# Agent SDK - Fitness Coach Backend

## Beschreibung
TypeScript-basierte Agent SDK Anwendung die als intelligenter Fitness-Coach fungiert.
Nutzt **Supabase MCP** für Datenzugriff (kein eigener MCP Server mehr).

## Technologie-Stack
- TypeScript
- `@anthropic-ai/claude-agent-sdk`
- Node.js 20+
- **Supabase MCP** für Datenzugriff

## Agents

### FitnessCoachAgent
Hauptagent für Workout-Empfehlungen und -Tracking.
- Progressive Overload Beratung (via `get_next_weight()` Function)
- Workout-Logging
- Formcheck-Hinweise
- RPE-basierte Empfehlungen

### PlanCreatorAgent
Erstellt und passt Trainingspläne an.
- Periodisierung
- Hybrid-Pläne (Kraft + Cardio)
- Deload-Planung
- Anpassung an Equipment

### HealthReporterAgent
Analysiert Gesundheitsdaten und erstellt Reports.
- Weekly/Monthly Summaries
- Trend-Erkennung (Gewicht, Kraft)
- PR-Tracking

## MCP Integration
Statt eigenem MCP Server nutzen wir den **Supabase MCP**:
```typescript
// Agent hat Zugriff auf Supabase via MCP
const coach = new FitnessCoachAgent({
  mcpServers: ['supabase'],
  systemPrompt: `Du bist ein Fitness-Coach...`
});
```

## Deployment-Optionen
1. **Supabase Edge Functions** - Serverless, nah an den Daten
2. **Vercel/Railway** - Einfaches Node.js Deployment
3. **Claude Code Plugin** - Lokale Nutzung

## Akzeptanzkriterien
- [ ] FitnessCoachAgent implementiert
- [ ] PlanCreatorAgent implementiert
- [ ] Supabase MCP Integration funktioniert
- [ ] Kann in Claude Code genutzt werden
- [ ] API Endpoint für iOS App (optional)

## Nach Abschluss
- [ ] `/code-review:code-review` ausführen
