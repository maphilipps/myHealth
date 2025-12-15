---
title: 'Backend: API Authentication Middleware'
status: todo
type: task
priority: critical
tags:
    - auth
    - backend
created_at: 2025-12-15T20:51:29Z
updated_at: 2025-12-15T20:51:29Z
links:
    - parent: myHealth-p6wt
---

## Beschreibung
Middleware für sichere API-Authentifizierung.

## Features
- JWT Validation
- Role-Based Access Control (RBAC)
- API Key Support (für MCP Server)
- Request Signing (optional)

## Rollen
- `user`: Standard User
- `premium`: Premium Features
- `admin`: Admin Access

## Implementation
```typescript
// Middleware
export const authMiddleware = async (req, res, next) => {
  const token = extractToken(req);
  const user = await validateToken(token);
  req.user = user;
  next();
};

// Route Protection
router.get('/workouts', authMiddleware, requireRole('user'), ...);
```

## Definition of Done
- [ ] JWT Middleware implementiert
- [ ] RBAC funktioniert
- [ ] API Key für Services
- [ ] Unit Tests
- [ ] `/code-review:code-review` ausführen