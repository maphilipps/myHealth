---
title: 'MCP Server: Projekt Setup'
status: superseded
type: task
priority: high
tags:
    - backend
    - setup
created_at: 2025-12-15T20:42:01Z
updated_at: 2025-12-15T20:42:01Z
links:
    - parent: myHealth-q36m
---

# MCP Server: Projekt Setup

## Aufgaben
1. GitHub Repo `myhealth-mcp` erstellen
2. TypeScript Projekt initialisieren
3. Dependencies installieren:
   - `@modelcontextprotocol/sdk`
   - `js-yaml`
   - `zod` für Schema Validation
4. tsconfig.json konfigurieren
5. package.json mit Scripts anlegen
6. .env.example erstellen
7. README.md mit Installationsanleitung

## Commands
```bash
mkdir myhealth-mcp && cd myhealth-mcp
npm init -y
npm install @modelcontextprotocol/sdk js-yaml zod
npm install -D typescript @types/node @types/js-yaml
npx tsc --init
```

## Definition of Done
- [ ] Repo auf GitHub
- [ ] `npm install` funktioniert
- [ ] `npm run build` kompiliert ohne Fehler
- [ ] Basic MCP Server startet
- [ ] `/code-review:code-review` ausführen
