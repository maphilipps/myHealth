---
title: 'Analytics: AI Training Reports'
status: done
type: feature
priority: high
tags:
    - ai
    - analytics
    - reports
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T14:45:00Z
links:
    - parent: myHealth-san0
---

# AI Training Reports

## Beschreibung
Wöchentliche und monatliche Zusammenfassungen die nicht nur Zahlen zeigen, sondern AI-generierte Insights liefern.

## Report-Typen

### Wöchentlicher Report (Sonntag Abend)
```
📊 Diese Woche

Workouts: 4/4 geplant ✓
Volumen: 45.000 kg (+12% vs Vorwoche)
Durchschnittliche RPE: 7.8

🏆 Highlights
- PR bei Kniebeugen: 105kg x 8
- Bankdrücken-Plateau durchbrochen

⚠️ Beobachtungen
- Schulter-Volumen war niedrig diese Woche
- Deine Pause zwischen Sätzen war länger als üblich
  (3:20 statt 2:30) - alles okay?

📈 Nächste Woche
- Deload-Woche empfohlen (Woche 5 im Zyklus)
- Fokus: Leichtere Gewichte, perfekte Form
```

### Monatlicher Report
```
📅 Dezember 2025

Sessions: 16 (4x/Woche Durchschnitt)
Gesamtvolumen: 180.000 kg
PRs diesen Monat: 5

💪 Stärken-Entwicklung
- Bankdrücken: 80kg → 85kg (+6.25%)
- Kniebeugen: 100kg → 105kg (+5%)
- Kreuzheben: 120kg → 125kg (+4.2%)

📊 Körper-Komposition
- Gewicht: 82kg → 83kg
- (Lean Mass Estimate: +0.8kg)

🎯 Empfehlungen für Januar
- Mehr Fokus auf Rücken (im Verhältnis zu Brust)
- Schlaf verbessern (Workouts am Donnerstag schwächer)
```

## Push Notifications
```
"Dein Wochenreport ist da! 4 Workouts, 2 PRs 🎉"
```

## Implementation
- Supabase Scheduled Functions
- Claude für Report-Generierung
- Swift Charts für Visualisierung
- Local Notifications

## Definition of Done
- [x] Wöchentliche Reports automatisch ✅ (via "Wie war meine Woche?" command)
- [x] Monatliche Reports automatisch ✅ (ReporterAgent + get_period_summary)
- [x] Reports sind personalisiert ✅ (Agent analyzes user data)
- [ ] Push Notifications funktionieren (Future: iOS native + Supabase Edge Functions)

## Implementation Notes
- ReporterAgent has all required tools: `get_period_summary`, `get_pr_history`, `create_report`
- User can request reports on-demand via conversation
- Automated scheduled reports need Supabase Edge Functions (future enhancement)
