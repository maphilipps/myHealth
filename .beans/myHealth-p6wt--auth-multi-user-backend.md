---
title: Auth & Multi-User Backend
status: todo
type: epic
priority: high
tags:
    - auth
    - backend
created_at: 2025-12-15T20:50:56Z
updated_at: 2025-12-15T20:50:56Z
links:
    - parent: myHealth-a122
---

# Auth & Multi-User Backend

## Beschreibung
Komplettes Authentication-System für Multi-User Support. Ermöglicht Skalierung von Single-User zu SaaS-Modell.

## Komponenten

### Backend (Node.js/TypeScript)
- User Registration & Login
- OAuth (Apple, Google)
- JWT Session Management
- RBAC (Role-Based Access Control)

### Datenbank
- PostgreSQL mit Row-Level Security
- User-Daten-Isolation
- Migration von YAML zu DB

### iOS Integration
- Native Auth Screens
- Sign in with Apple
- Biometric Login
- Secure Token Storage

## Technologie-Stack
- **Auth**: Passport.js oder Auth.js
- **JWT**: jose Library
- **DB**: PostgreSQL + Prisma
- **Password**: Argon2
