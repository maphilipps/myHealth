---
title: MCP Server - Fitness Data Layer
status: todo
type: epic
priority: high
tags:
    - backend
    - mcp
created_at: 2025-12-15T20:41:48Z
updated_at: 2025-12-15T20:41:48Z
links:
    - parent: myHealth-a122
---

# MCP Server - Fitness Data Layer

## Beschreibung
TypeScript-basierter MCP Server der strukturierten Zugriff auf Fitness-Daten bietet. Ermöglicht Claude.ai, Claude Code und der iOS App den Zugriff auf Workout-Historie, Progressive Overload Berechnungen und Trainingsplan-Management.

## Repository
`myhealth-mcp` - Separates npm Package

## Technologie-Stack
- TypeScript
- `@modelcontextprotocol/sdk`
- `js-yaml` für YAML Parsing
- Node.js 20+

## Exposed Tools
| Tool | Input | Output |
|------|-------|--------|
| `log_workout` | exercise, weight, reps, rpe | confirmation |
| `get_progression` | exercise_name | recommended weight/reps |
| `create_plan` | goal, days, equipment | YAML plan |
| `analyze_progress` | period, metrics | trends |
| `sync_healthkit` | - | imported count |

## Exposed Resources
- `fitness://exercises` - Übungsbibliothek
- `fitness://plans/{id}` - Trainingspläne
- `fitness://workouts/{date}` - Workout-Logs
- `fitness://daily/{date}` - Tägliche Metriken
- `fitness://progress/{exercise}` - Fortschritt pro Übung

## Akzeptanzkriterien
- [ ] MCP Server startet fehlerfrei
- [ ] Alle 5 Tools implementiert und getestet
- [ ] Alle Resources abrufbar
- [ ] npm publish vorbereitet
- [ ] Claude Code Integration funktioniert
