---
title: 'Agent: ReporterAgent'
status: done
type: feature
priority: medium
tags:
    - agent
    - reporting
    - summaries
created_at: 2025-12-17T11:00:00Z
updated_at: 2025-12-17T11:00:00Z
links:
    - parent: myHealth-agt0
---

# ReporterAgent

## Beschreibung
Erstellt verständliche Zusammenfassungen und Reports. Transformiert Daten in narratives Feedback.

## Rolle
Der ReporterAgent ist der "Kommunikator" - er macht komplexe Daten verständlich und motivierend.

## Tools

### Read Tools
```typescript
get_period_summary(start_date, end_date)
// Returns: aggregated stats for period

get_stored_insights(period)
// Returns: insights from AnalystAgent

get_prs(period)
// Returns: PRs achieved in period

get_goals_progress()
// Returns: progress towards user goals

get_streak_info()
// Returns: workout consistency data
```

### Write Tools
```typescript
create_report(report: {
  type: 'weekly' | 'monthly' | 'custom',
  content: string,
  highlights: string[],
  concerns: string[],
  next_focus: string
})
// Stores report
```

## Report-Typen

### Wöchentlicher Report
```
Agent (gathers):
1. get_period_summary(last 7 days)
2. get_stored_insights('week')
3. get_prs('week')

Agent (composes):

"📊 Deine Woche (9.-15. Dez)

HIGHLIGHTS
• 4/4 geplante Workouts ✓
• PR bei Kreuzheben: 125kg × 6
• Gesamtvolumen: 52.000 kg (+8%)

BEOBACHTUNGEN
• Schlaf war diese Woche top (7.5h avg)
• Deine Leg Days waren stärker als sonst
• Oberkörper-Volumen etwas niedriger als geplant

INSIGHTS
⚠️ Push-Pull Imbalance erkannt
   → Mehr Rudern nächste Woche

🔄 Bankdrücken: Fast am 85kg Meilenstein
   → Nächste Woche versuchen!

NÄCHSTE WOCHE
Deload-Woche startet. Fokus auf:
• 50% Volumen
• Perfekte Form
• Active Recovery

Du bist auf einem guten Weg! 💪"
```

### Monatlicher Report
```
Agent (gathers):
1. get_period_summary(last 30 days)
2. get_stored_insights('month')
3. get_prs('month')
4. get_goals_progress()

Agent (composes):

"📅 Dein November

ZUSAMMENFASSUNG
Sessions: 17 (Ziel: 16) ✓
Gesamtvolumen: 215.000 kg
Durchschnittliche Session: 58 min

STRENGTH PROGRESS
• Bankdrücken: 80kg → 85kg (+6.25%)
• Kniebeugen: 105kg → 115kg (+9.5%)
• Kreuzheben: 120kg → 125kg (+4.2%)

KÖRPER
• Gewicht: 82kg → 82.5kg (+0.6%)
• Bei steigender Kraft = Recomposition!

TOP MOMENTS
🏆 Squat PR: 115kg × 8
🏆 Deadlift PR: 125kg × 6
🔥 4-Wochen Streak!

CHALLENGES
• Woche 2 war schwächer (Erkältung)
• Schulter-Discomfort am 15.11
  → Seitdem besser durch weniger OHP

DEZEMBER OUTLOOK
Du bist in Phase 2 des Programms.
Fokus auf Intensität statt Volumen.
Ziel: 90kg Bankdrücken bis Weihnachten? 🎄"
```

### On-Demand Summary
```
User: "Wie war mein Training diese Woche?"

Agent (quick summary):

"Diese Woche war solid!

• 3 von 4 Sessions (eine gestern noch offen)
• Push Day war besonders stark
• Beine etwas kürzer als geplant

Highlight: 85kg Bankdrücken für 6 Reps!
Das ist nahe an deinem PR.

Soll ich mehr Details zu einer bestimmten
Session oder Übung?"
```

## Narrative Style

### Principles
- **Verständlich**: Keine Fachbegriffe ohne Erklärung
- **Motivierend**: Erfolge hervorheben
- **Ehrlich**: Probleme ansprechen, aber konstruktiv
- **Actionable**: Was kann der User tun?

### Tone Adaptation
```
// Gute Woche
"Starke Woche! Du hast alles durchgezogen..."

// Schwache Woche
"Diese Woche war ruhiger - und das ist okay.
 Recovery ist Teil des Prozesses..."

// PR Week
"BOOM! Was für eine Woche!
 Du hast gleich 2 PRs geknackt..."
```

## Scheduled Reports
- **Sonntag Abend**: Weekly Summary
- **1. des Monats**: Monthly Summary
- **Nach jedem Workout**: Quick Session Recap

## Definition of Done
- [ ] Weekly Reports werden generiert
- [ ] Monthly Reports werden generiert
- [ ] On-demand Summaries funktionieren
- [ ] Reports sind motivierend und verständlich
- [ ] Insights vom AnalystAgent werden eingebunden
