---
title: 'Backend: OAuth & Social Login'
status: todo
type: feature
priority: normal
tags:
    - auth
created_at: 2025-12-15T20:51:24Z
updated_at: 2025-12-15T20:51:24Z
links:
    - parent: myHealth-p6wt
---

## Beschreibung
Login über Social Provider für einfacheren Zugang.

## Provider (Priorität)
1. Apple Sign In (iOS Pflicht)
2. Google OAuth
3. Optional: GitHub

## Implementation
- OAuth 2.0 / OpenID Connect
- Account Linking (Social → Email)
- Token Refresh

## Definition of Done
- [ ] Apple Sign In funktioniert
- [ ] Google OAuth funktioniert
- [ ] Account Linking möglich