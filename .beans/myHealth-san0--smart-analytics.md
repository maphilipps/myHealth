---
title: 'Epic: Smart Analytics'
status: done
type: epic
priority: high
tags:
    - ai
    - analytics
    - insights
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-af01
---

# Epic: Smart Analytics

## Beschreibung
AI-powered Insights die über simple Statistiken hinausgehen. Der Coach analysiert Muster, erkennt Probleme und gibt proaktiv Empfehlungen.

## Warum ist das wichtig?
Rohe Zahlen (Volumen, PRs) sind nicht actionable. AI kann:
- Plateaus erkennen bevor sie frustrieren
- Overtraining-Risiken identifizieren
- Schwachstellen im Training aufzeigen
- Erfolge feiern und motivieren

## Features
- AI Training Reports (Wochen/Monats-Zusammenfassungen)
- Plateau Detection & Durchbruchstipps
- Recovery Recommendations
- Injury Prevention Alerts
- Strength Standards Vergleich

## Beispiel-Insights
```
"Dein Bankdrücken stagniert seit 3 Wochen bei 85kg.
Ich sehe dass du immer am Montag trainierst nach dem Wochenende.

Vorschlag: Lass uns die Reps erhöhen (10-12 statt 8)
für 2 Wochen, dann zurück zu 8 Reps mit mehr Gewicht.

Außerdem: Dein Trizeps ist relativ schwach -
mehr Isolation könnte helfen."
```

## Tech Stack
- Supabase Views für Aggregationen
- Claude für natürlichsprachige Insights
- Charts mit Swift Charts
- Push Notifications für Alerts

## Definition of Done
- [ ] Wöchentliche Reports automatisch
- [ ] Plateau Detection funktioniert
- [ ] Mindestens 5 verschiedene Insight-Typen
- [ ] Reports sind personalisiert und actionable
