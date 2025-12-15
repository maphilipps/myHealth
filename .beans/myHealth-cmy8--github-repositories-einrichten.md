---
title: GitHub Repositories einrichten
status: completed
type: task
priority: high
tags:
    - infra
    - setup
created_at: 2025-12-15T20:45:53Z
updated_at: 2025-12-15T20:46:40Z
links:
    - parent: myHealth-a122
---

# GitHub Repositories einrichten

## Repositories

### 1. myhealth-mcp
MCP Server für Fitness-Daten
- TypeScript
- npm Package
- MIT License

### 2. myhealth-agent
Agent SDK Anwendung
- TypeScript
- CLI Tool
- MIT License

### 3. myhealth-ios
SwiftUI iOS App
- Swift
- Xcode Projekt
- Proprietary (vorerst)

### 4. myHealth (bestehendes Repo)
- Daten (data/)
- Dokumentation
- Skills
- Koordination

## Struktur
```
github.com/[username]/
├── myhealth-mcp/       # npm: @myhealth/mcp-server
├── myhealth-agent/     # npm: @myhealth/agent
├── myhealth-ios/       # App Store
└── myHealth/           # Mono-Repo für Daten & Docs
```

## Definition of Done
- [x] Alle Repos erstellt
- [x] README.md in jedem Repo
- [x] .gitignore konfiguriert
- [x] License Files

## Ergebnis

| Repo | URL | Status |
|------|-----|--------|
| myhealth-mcp | https://github.com/maphilipps/myhealth-mcp | ✅ |
| myhealth-agent | https://github.com/maphilipps/myhealth-agent | ✅ |
| myhealth-ios | https://github.com/maphilipps/myhealth-ios | ✅ |
