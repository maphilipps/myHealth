---
title: 'Agent SDK: Claude Code Integration'
status: todo
type: task
priority: high
tags:
    - backend
    - integration
created_at: 2025-12-15T20:44:31Z
updated_at: 2025-12-15T20:44:31Z
links:
    - parent: myHealth-op3q
---

# Agent SDK: Claude Code Integration

## Beschreibung
Integration des Agent SDK in Claude Code für nahtlose Nutzung.

## .mcp.json Konfiguration
```json
{
  "mcpServers": {
    "myhealth": {
      "command": "npx",
      "args": ["@myhealth/mcp-server", "--data-dir", "~/Documents/myHealth/data"],
      "env": {}
    }
  }
}
```

## hooks.json für Session Start
```json
{
  "hooks": [
    {
      "event": "SessionStart",
      "type": "prompt",
      "prompt": "myHealth fitness data is available. Use mcp__myhealth__* tools for workout tracking and progression."
    }
  ]
}
```

## Skills Integration
Erstelle Skills in `~/.claude/skills/`:
- `myhealth-workout/SKILL.md`
- `myhealth-nutrition/SKILL.md`
- `myhealth-analysis/SKILL.md`

## Definition of Done
- [ ] MCP Server startet automatisch
- [ ] Claude Code erkennt myHealth Tools
- [ ] Skills funktionieren korrekt
- [ ] Dokumentation vollständig
- [ ] `/code-review:code-review` ausführen
