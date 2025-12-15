---
title: 'Backend: User Registration & Login'
status: todo
type: feature
priority: high
tags:
    - auth
created_at: 2025-12-15T20:51:23Z
updated_at: 2025-12-15T20:51:23Z
links:
    - parent: myHealth-p6wt
---

## Beschreibung
User können sich registrieren und einloggen.

## Anforderungen
- Email + Password Registration
- Email Verification
- Password Reset Flow
- Secure Password Hashing (bcrypt/argon2)
- Rate Limiting

## API Endpoints
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
```

## Definition of Done
- [ ] Registration funktioniert
- [ ] Login/Logout funktioniert
- [ ] Email Verification implementiert
- [ ] Password Reset funktioniert
- [ ] Tests vorhanden
- [ ] `/code-review:code-review` ausführen