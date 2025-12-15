---
title: MCP Server - Fitness Data Layer
status: superseded
type: epic
priority: low
tags:
    - backend
    - mcp
    - archived
created_at: 2025-12-15T20:41:48Z
updated_at: 2025-12-15T22:00:00Z
superseded_by: myHealth-sb01
links:
    - parent: myHealth-a122
---

# MCP Server - Fitness Data Layer

> **⚠️ SUPERSEDED**: Dieses Epic wurde durch [Supabase Setup](myHealth-sb01--supabase-setup-schema.md) ersetzt.
> Wir nutzen den **offiziellen Supabase MCP Server** statt eines eigenen.

## Ursprüngliche Beschreibung
TypeScript-basierter MCP Server der strukturierten Zugriff auf Fitness-Daten bietet.

## Grund für Ablösung
- Supabase bietet fertigen MCP Server
- Kein eigenes npm Package nötig
- Weniger Wartungsaufwand
- Bessere Integration mit Supabase Auth & RLS
