---
title: 'Agent: PlannerAgent'
status: done
type: feature
priority: critical
tags:
    - agent
    - planning
    - core
created_at: 2025-12-17T11:00:00Z
updated_at: 2025-12-17T11:00:00Z
links:
    - parent: myHealth-agt0
---

# PlannerAgent

## Beschreibung
Agent für langfristige Trainingsplanung. Erstellt und modifiziert Trainingspläne basierend auf Zielen, Präferenzen und Kontext.

## Rolle
Der PlannerAgent ist der "Strategist" - er denkt in Wochen und Monaten, nicht in einzelnen Sets.

## Tools

### Read Tools
```typescript
get_user_profile()
// Returns: goals, experience_level, injuries, preferences

get_equipment_available()
// Returns: list of available equipment

get_training_history(days: number)
// Returns: summary of past workouts

get_current_plan()
// Returns: active training plan if exists

get_exercise_library(filters?)
// Returns: available exercises
```

### Write Tools
```typescript
create_plan(plan: TrainingPlan)
// Creates new training plan

update_plan(plan_id, changes)
// Modifies existing plan

archive_plan(plan_id)
// Archives old plan
```

## Conversations

### Neuen Plan erstellen
```
User: "Ich will einen Plan für Muskelaufbau, 4x pro Woche"

Agent (internally):
1. get_user_profile() → Intermediate, keine Verletzungen
2. get_equipment_available() → Full Gym
3. get_training_history(30) → War vorher 3x/Woche

Agent: "Cool, 4x pro Woche für Hypertrophie!

Basierend auf deinem Gym-Zugang und Level
schlage ich einen Upper/Lower Split vor:

Mo: Upper A (Horizontal Push/Pull Focus)
Di: Lower A (Quad Dominant)
Do: Upper B (Vertical Push/Pull Focus)
Fr: Lower B (Hip Dominant)

Jede Session ~60 Minuten, 4-5 Übungen.
Progression über 6 Wochen, dann Deload.

Soll ich das so erstellen oder willst du was ändern?"
```

### Plan modifizieren
```
User: "Ich kann nur noch 3x pro Woche"

Agent (internally):
1. get_current_plan() → 4x Upper/Lower
2. Überlegt: Wie konsolidieren?

Agent: "Kein Problem! Bei 3x hast du zwei Optionen:

A) Full Body (3x gleiche Struktur)
   - Mehr Compound, weniger Isolation
   - Jede Muskelgruppe 3x/Woche

B) Push/Pull/Legs
   - Jede Muskelgruppe 1x/Woche
   - Aber mehr Volumen pro Session

Was klingt besser für dich?"
```

### Deload planen
```
Agent (proaktiv nach 5 Wochen):

"Hey, du bist jetzt in Woche 5 deines Programms.

Ich sehe:
- Volume ist stetig gestiegen ✓
- Aber RPE war letzte Woche höher als sonst
- Und zwei PRs - nice!

Vorschlag: Nächste Woche Deload.
- Gleiche Übungen
- 50% des Volumens
- Fokus auf Technik

Dann starten wir frisch mit neuem Block.
Einverstanden?"
```

## Entscheidungs-Logik (im Agent, nicht im Code!)

### Split-Auswahl
Agent überlegt:
- Wie viele Tage? → Bestimmt Split-Optionen
- Erfahrungslevel? → Mehr/weniger Volumen
- Ziel? → Rep-Ranges, Übungsauswahl
- Präferenzen? → Vermiedene Übungen berücksichtigen

### Periodisierung
Agent plant:
- Volume-Phase → Intensity-Phase → Peak → Deload
- Aber FLEXIBEL basierend auf tatsächlichem Fortschritt
- Kein starrer 4-Wochen-Zyklus wenn User schneller/langsamer progressed

### Übungsauswahl
Agent wählt:
- Basierend auf Equipment
- Basierend auf User-Präferenzen
- Basierend auf Schwachstellen (von AnalystAgent)
- Mit Variation für Motivation

## Output Format

### Training Plan Schema
```yaml
plan:
  id: uuid
  name: "Hypertrophy Block 1"
  goal: hypertrophy
  duration_weeks: 6
  sessions_per_week: 4

  weekly_structure:
    monday:
      name: "Upper A"
      focus: "Horizontal Push/Pull"
      exercises:
        - exercise_id: bench_press
          sets: 4
          rep_target: "8-10"
          progression: "weight_when_10"
        - exercise_id: barbell_row
          sets: 4
          rep_target: "8-10"
        # ...

    tuesday:
      name: "Lower A"
      # ...

  progression_rules: null  # NO RULES - Agent decides!

  notes: "Created for intermediate lifter focusing on upper body mass"
```

## Definition of Done
- [ ] Agent kann Pläne erstellen
- [ ] Agent kann Pläne modifizieren
- [ ] Agent erklärt Entscheidungen
- [ ] Agent berücksichtigt User-Kontext
- [ ] KEINE hardcoded Periodisierung
