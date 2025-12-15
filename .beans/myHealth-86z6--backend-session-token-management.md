---
title: 'Backend: Session & Token Management'
status: todo
type: feature
priority: high
tags:
    - auth
    - security
created_at: 2025-12-15T20:51:26Z
updated_at: 2025-12-15T20:51:26Z
links:
    - parent: myHealth-p6wt
---

## Beschreibung
Sichere Session-Verwaltung mit JWT/Refresh Tokens.

## Architektur
- Access Token: Short-lived (15min)
- Refresh Token: Long-lived (7 Tage)
- Secure Cookie Storage
- Token Rotation

## Endpoints
```
POST /auth/refresh
POST /auth/revoke
GET  /auth/sessions (alle aktiven Sessions)
DELETE /auth/sessions/:id
```

## Sicherheit
- [ ] HTTPS Only
- [ ] HttpOnly Cookies
- [ ] CSRF Protection
- [ ] Token Blacklisting

## Definition of Done
- [ ] JWT Implementation
- [ ] Refresh Token Rotation
- [ ] Session Management UI
- [ ] `/code-review:code-review` ausführen