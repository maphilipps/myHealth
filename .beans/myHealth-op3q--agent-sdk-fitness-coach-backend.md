---
title: Agent SDK - Fitness Coach Backend
status: todo
type: epic
priority: high
tags:
    - backend
    - agent-sdk
created_at: 2025-12-15T20:43:35Z
updated_at: 2025-12-15T20:43:35Z
links:
    - parent: myHealth-a122
---

# Agent SDK - Fitness Coach Backend

## Beschreibung
TypeScript-basierte Agent SDK Anwendung die als intelligenter Fitness-Coach fungiert. Nutzt MCP Server für Datenzugriff und Claude für intelligente Empfehlungen.

## Repository
`myhealth-agent` - Separates Repo

## Technologie-Stack
- TypeScript
- `@anthropic-ai/claude-agent-sdk`
- Node.js 20+
- Integration mit `@myhealth/mcp-server`

## Agents

### FitnessCoachAgent
Hauptagent für Workout-Empfehlungen und -Tracking.
- Progressive Overload Beratung
- Workout-Logging
- Formcheck-Hinweise

### PlanCreatorAgent
Erstellt und passt Trainingspläne an.
- Periodisierung
- Hybrid-Pläne (Kraft + Cardio)
- Deload-Planung

### HealthReporterAgent
Analysiert Gesundheitsdaten und erstellt Reports.
- Weekly/Monthly Summaries
- Trend-Erkennung
- Korrelations-Analyse

### NutritionAnalystAgent
Ernährungsberatung und -tracking.
- Makro-Berechnung
- Defizit/Überschuss-Management
- Mahlzeiten-Vorschläge

## Akzeptanzkriterien
- [ ] Alle 4 Agents implementiert
- [ ] MCP Server Integration funktioniert
- [ ] Conversation History wird gehalten
- [ ] Kann in Claude Code genutzt werden
- [ ] Kann standalone als CLI laufen
