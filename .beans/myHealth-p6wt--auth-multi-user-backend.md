---
title: Auth & Multi-User Backend
status: superseded
type: epic
priority: low
tags:
    - auth
    - backend
    - archived
created_at: 2025-12-15T20:50:56Z
updated_at: 2025-12-15T22:00:00Z
superseded_by: myHealth-sb01
links:
    - parent: myHealth-a122
---

# Auth & Multi-User Backend

> **⚠️ SUPERSEDED**: Dieses Epic wurde durch [Supabase Setup](myHealth-sb01--supabase-setup-schema.md) ersetzt.
> Supabase bringt Auth, RLS und Multi-Tenancy out-of-the-box.

## Ursprüngliche Beschreibung
Komplettes Authentication-System für Multi-User Support mit Passport.js, JWT, Prisma.

## Grund für Ablösung
- Supabase Auth ist fertig (Email, Apple, Google, Magic Links)
- Row-Level Security ersetzt manuelle Data Isolation
- Kein eigenes Session Management nötig
- Supabase Swift SDK für iOS Auth
