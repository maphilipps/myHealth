---
title: 'Backend: User Profile & Settings'
status: todo
type: feature
priority: normal
tags:
    - auth
    - user
created_at: 2025-12-15T20:51:28Z
updated_at: 2025-12-15T20:51:28Z
links:
    - parent: myHealth-p6wt
---

## Beschreibung
User-Profil mit persönlichen Einstellungen.

## Profil-Felder
- Name
- Email
- Avatar
- Timezone
- Units (kg/lbs, km/miles)
- Training Preferences

## Fitness-Profil
- Geburtsdatum
- Geschlecht
- Größe
- Aktivitätslevel
- Trainingsziel

## API Endpoints
```
GET    /users/me
PATCH  /users/me
DELETE /users/me (Account löschen)
POST   /users/me/avatar
```

## Definition of Done
- [ ] Profil CRUD funktioniert
- [ ] Avatar Upload
- [ ] Account Deletion mit Daten-Export
- [ ] `/code-review:code-review` ausführen