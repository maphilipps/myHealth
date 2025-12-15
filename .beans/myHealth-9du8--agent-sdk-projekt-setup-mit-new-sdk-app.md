---
title: 'Agent SDK: Projekt Setup mit /new-sdk-app'
status: todo
type: task
priority: high
tags:
    - backend
    - setup
created_at: 2025-12-15T20:44:08Z
updated_at: 2025-12-15T20:44:08Z
links:
    - parent: myHealth-op3q
---

# Agent SDK: Projekt Setup

## Aufgaben
Nutze das `/new-sdk-app` Plugin um das Projekt zu initialisieren.

## Schritte
```bash
/new-sdk-app myhealth-agent

# Auswahl:
# Language: TypeScript
# Agent type: Custom (Fitness Coach)
# Starting point: Basic agent with common features
```

## Nach Setup
1. GitHub Repo erstellen und pushen
2. MCP Server als Dependency hinzufügen
3. System Prompt konfigurieren
4. Environment Variables setzen

## System Prompt (Initial)
```
You are myHealth, a personalized fitness coaching agent.

Your responsibilities:
1. Track workout progress with RPE-based progressive overload
2. Create and adjust training plans
3. Analyze trends and provide actionable insights
4. Support hybrid training (strength + cardio)

Always be data-driven, encouraging, and concise.
```

## Definition of Done
- [ ] Projekt kompiliert fehlerfrei
- [ ] `npm start` startet Agent
- [ ] MCP Server angebunden
- [ ] Repo auf GitHub
