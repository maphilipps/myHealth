---
title: 'Analytics: Plateau Detection'
status: todo
type: feature
priority: high
tags:
    - ai
    - analytics
    - coaching
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-san0
---

# Plateau Detection & Durchbruchstipps

## Beschreibung
Der AI erkennt wenn Fortschritt stagniert und gibt konkrete, personalisierte Tipps zum Durchbrechen.

## Plateau-Erkennung

### Definition
```
Plateau = keine Steigerung bei Gewicht ODER Reps
         über 3+ Wochen bei gleicher Übung
         trotz konsistentem Training
```

### Faktoren für Analyse
- Gewichts-Verlauf
- Rep-Verlauf
- RPE-Verlauf (steigend bei gleichem Gewicht?)
- Volumen-Verlauf
- Trainings-Frequenz

## Durchbruch-Strategien

### Volumen-Anpassung
```
AI: "Dein Bankdrücken stagniert seit 3 Wochen.

Beobachtung: Dein Volumen war konstant bei 15 Sätzen/Woche.

Vorschlag: Lass uns für 2 Wochen auf 20 Sätze erhöhen,
dann zurück auf 15. Oft braucht der Körper einen neuen Reiz."
```

### Intensitäts-Variation
```
AI: "Du trainierst immer im 8-10 Rep Bereich.

Vorschlag: Diese Woche 3-5 Reps mit schwerem Gewicht,
nächste Woche zurück zu 8-10. Das aktiviert
andere Muskelfasern."
```

### Übungs-Variation
```
AI: "Flat Bench Plateau.

Vorschlag: 4 Wochen Pause von Flat Bench.
Stattdessen: Incline DB Press als Hauptübung.
Danach zurück - oft hilft der frische Blick."
```

### Recovery-Check
```
AI: "Plateau bei ALLEN Compound-Übungen gleichzeitig.

Das deutet auf Übertraining oder schlechte Recovery.
- Wie ist dein Schlaf?
- Stress-Level?
- Ernährung?

Empfehlung: 1 Woche Deload, dann neu starten."
```

## Proactive Alerts
```
Push: "⚠️ Bankdrücken: 3. Woche ohne Fortschritt.
       Tippe für Durchbruch-Tipps."
```

## Implementation
- Trend Analysis in Supabase Views
- Claude für Empfehlungen
- Notification System
- A/B Testing für Strategien

## Definition of Done
- [ ] Plateaus werden automatisch erkannt
- [ ] Mindestens 4 verschiedene Strategien
- [ ] Proactive Notifications
- [ ] Tipps sind personalisiert
