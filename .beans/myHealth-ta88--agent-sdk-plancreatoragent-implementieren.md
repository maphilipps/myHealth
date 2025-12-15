---
title: 'Agent SDK: PlanCreatorAgent implementieren'
status: todo
type: feature
priority: high
tags:
    - backend
    - agent
created_at: 2025-12-15T20:44:12Z
updated_at: 2025-12-15T20:44:12Z
links:
    - parent: myHealth-op3q
---

# Agent SDK: PlanCreatorAgent

## Beschreibung
Agent für intelligente Trainingsplan-Erstellung und -Anpassung.

## Capabilities
- Erstellt personalisierte Trainingspläne
- Unterstützt Hybrid-Training (Kraft + Laufen)
- Plant Deload-Wochen automatisch
- Passt Pläne basierend auf Fortschritt an

## Conversation Examples

### Neuen Plan erstellen
```
User: 'Erstelle mir einen Plan für 4x pro Woche, Fokus Hypertrophie'
Agent:
1. Fragt nach Equipment, Zeitbudget
2. Generiert optimalen Split
3. Speichert als YAML
4. Erklärt die Struktur
```

### Hybrid-Plan
```
User: 'Ich will 3x Kraft und 2x Laufen machen'
Agent:
1. Strukturiert Woche so, dass Laufen nicht vor Bein-Training
2. Easy Runs an Regenerationstagen
3. Qualitäts-Sessions mit genug Abstand zu Kraft
```

### Plan anpassen
```
User: 'Ich hab keine Zeit mehr für 4x, nur noch 3x'
Agent:
1. Analysiert aktuellen Plan
2. Konsolidiert zu 3-Tage-Plan
3. Erhält wichtigste Übungen
4. Erklärt Trade-offs
```

## Periodisierung-Logik
- **Wochen 1-4**: Volume Phase (moderate Gewichte, höhere Reps)
- **Wochen 5-8**: Intensity Phase (höhere Gewichte, moderate Reps)
- **Woche 9**: Deload
- **Repeat**

## Definition of Done
- [ ] Alle Standard-Splits verfügbar
- [ ] Hybrid-Pläne funktionieren
- [ ] Periodisierung wird berücksichtigt
- [ ] Plan-Export als YAML
- [ ] `/code-review:code-review` ausführen
