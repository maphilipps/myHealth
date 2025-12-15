---
title: 'MCP Server: npm Package vorbereiten'
status: todo
type: task
priority: normal
tags:
    - backend
    - release
created_at: 2025-12-15T20:43:18Z
updated_at: 2025-12-15T20:43:18Z
links:
    - parent: myHealth-q36m
---

# MCP Server: npm Package vorbereiten

## Aufgaben
1. package.json für npm publish konfigurieren
2. README.md mit vollständiger Dokumentation
3. LICENSE (MIT)
4. CHANGELOG.md
5. .npmignore
6. TypeScript Declarations (.d.ts)
7. ESM + CJS Builds

## package.json
```json
{
  "name": "@myhealth/mcp-server",
  "version": "0.1.0",
  "description": "MCP Server for fitness data - Progressive Overload, Workout Tracking, HealthKit",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "myhealth-mcp": "./bin/cli.js"
  },
  "keywords": ["mcp", "fitness", "workout", "progressive-overload", "claude"],
  "files": ["dist", "bin", "README.md"]
}
```

## CLI Usage (nach Install)
```bash
npx @myhealth/mcp-server --data-dir ~/myHealth/data
```

## Definition of Done
- [ ] `npm pack` erzeugt sauberes Package
- [ ] README dokumentiert alle Tools und Resources
- [ ] CLI startet Server korrekt
- [ ] Bereit für `npm publish`
