---
title: 'Personalization: Goal-based Program Adaptation'
status: todo
type: feature
priority: high
tags:
    - personalization
    - goals
    - programs
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-per0
---

# Goal-based Program Adaptation

## Beschreibung
Das Training wird automatisch an die Ziele des Users angepasst - Muskelaufbau, Kraft, Ausdauer, oder Kombination.

## Ziel-Typen

### Primäre Ziele
```yaml
goals:
  hypertrophy:        # Muskelaufbau
    rep_range: 8-12
    rest: 60-90s
    rpe_target: 7-8
    volume: high

  strength:           # Maximalkraft
    rep_range: 3-6
    rest: 3-5min
    rpe_target: 8-9
    volume: moderate

  endurance:          # Kraftausdauer
    rep_range: 15-20
    rest: 30-60s
    rpe_target: 6-7
    volume: very_high

  general_fitness:    # Allgemein fit
    rep_range: 8-15
    rest: 60-120s
    rpe_target: 7
    volume: moderate
```

### Sekundäre Ziele
```
User: "Hauptsächlich Muskelaufbau,
       aber ich will auch bei Kniebeugen stärker werden"

AI: Hypertrophie-Fokus mit Periodisierung,
    aber Kniebeugen im 5x5 Kraftbereich
```

## Goal-Setting Conversation

### Initial Setup
```
AI: "Was ist dein Hauptziel?

     🏋️ Muskelaufbau (Hypertrophie)
        Mehr Muskelmasse, ästhetischer Körper

     💪 Kraft
        Stärker werden, höhere Maximalgewichte

     🏃 Ausdauer/Conditioning
        Mehr Reps, kürzere Pausen, Cardio-Fit

     ⚡ Allgemeine Fitness
        Von allem etwas, gesund bleiben"
```

### Spezifische Ziele
```
AI: "Hast du konkrete Ziele?

     Beispiele:
     - '100kg Bankdrücken bis März'
     - '5kg abnehmen'
     - 'Klimmzüge von 5 auf 15 steigern'
     - 'Halbmarathon laufen können'"
```

## Program Adaptation

### Basierend auf Ziel: Hypertrophie
```
AI: "Dein Hypertrophie-Programm:

     - 4x pro Woche (PPL + Arms)
     - 10-20 Sätze pro Muskel/Woche
     - Rep-Range: 8-12 (manchmal 15-20)
     - Progressive Overload durch Reps dann Gewicht
     - Deload alle 4-6 Wochen"
```

### Basierend auf Ziel: Kraft
```
AI: "Dein Kraft-Programm:

     - 3-4x pro Woche (Full Body oder Upper/Lower)
     - Compound-Fokus
     - Rep-Range: 3-6 für Main Lifts
     - Längere Pausen (3-5 Min)
     - Periodisierung: Volume → Intensity → Peak"
```

## Goal Tracking

### Milestone Check-ins
```
AI: "Ziel-Update: 100kg Bankdrücken bis März

     Aktuell: 85kg (15kg to go)
     Wochen bis März: 12
     Benötigte Steigerung: ~1.25kg/Woche

     Du bist auf Kurs! 📈
     Letzte 4 Wochen: +5kg (1.25kg/Woche)"
```

### Goal Adjustment
```
AI: "Ich sehe dass du dein Laufziel selten verfolgst,
     aber regelmäßig extra Beinübungen machst.

     Soll ich dein Programm anpassen?
     - Weniger Laufen, mehr Bein-Hypertrophie?"
```

## Implementation
- Goal Profile in Supabase
- Program Templates pro Goal
- Progress Tracking gegen Ziele
- Dynamic Adjustment

## Definition of Done
- [ ] Goal-Setting Flow implementiert
- [ ] Programme passen sich an Ziele an
- [ ] Spezifische Ziele trackbar
- [ ] Regelmäßige Goal Check-ins
