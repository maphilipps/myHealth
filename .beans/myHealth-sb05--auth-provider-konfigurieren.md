---
title: Auth Provider konfigurieren
status: done
type: task
priority: high
tags:
    - supabase
    - auth
created_at: 2025-12-15T22:00:00Z
updated_at: 2025-12-15T22:00:00Z
links:
    - parent: myHealth-sb01
    - blocked_by: myHealth-sb02
---

# Auth Provider konfigurieren

## Provider

### 1. Email/Password (Development)
- [ ] In Supabase Dashboard aktivieren
- [ ] Email Templates anpassen (optional)
- [ ] Confirm Email deaktivieren für Dev

### 2. Sign in with Apple (Production)
- [ ] Apple Developer: Service ID erstellen
- [ ] Apple Developer: Sign in with Apple aktivieren
- [ ] Supabase: Apple Provider konfigurieren
- [ ] Redirect URLs eintragen

### 3. Google Sign-In (optional)
- [ ] Google Cloud Console: OAuth Client erstellen
- [ ] Supabase: Google Provider konfigurieren

## iOS Deep Links
```
myhealth://auth/callback
```

## Testen
- [ ] Email Login funktioniert
- [ ] Apple Sign-In funktioniert (Simulator/Device)

## Nach Abschluss
- [ ] `/code-review:code-review` ausführen
