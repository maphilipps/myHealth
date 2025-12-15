---
title: Supabase MCP in Claude Code einrichten
status: done
type: task
priority: high
tags:
    - supabase
    - mcp
    - claude-code
created_at: 2025-12-15T22:00:00Z
updated_at: 2025-12-15T22:00:00Z
links:
    - parent: myHealth-sb01
    - blocked_by: myHealth-sb02
---

# Supabase MCP in Claude Code einrichten

## Option 1: Remote MCP (empfohlen)
Im Supabase Dashboard unter Project Settings → AI aktivieren.

## Option 2: Local MCP

### Installation
```bash
npm install -g @supabase/mcp-server
```

### Konfiguration
In `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_URL": "https://xxx.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJ..."
      }
    }
  }
}
```

## Sicherheit
- [x] Access Token für MCP konfiguriert
- [ ] Read-only Mode für Production (später)

## Konfiguration
MCP wurde in `~/.claude/settings.local.json` konfiguriert:
```json
"supabase": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server", "--access-token", "..."]
}
```

## Testen
- [ ] Claude Code neu starten um MCP zu aktivieren
- [ ] `@supabase` Tool verfügbar
- [ ] Query: "Zeige alle Exercises"
