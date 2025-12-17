---
title: 'Epic: Agent Architecture'
status: done
type: epic
priority: critical
tags:
    - agent
    - architecture
    - core
created_at: 2025-12-17T11:00:00Z
updated_at: 2025-12-17T11:00:00Z
links:
    - parent: myHealth-af01
---

# Epic: Agent Architecture

## Beschreibung
**FUNDAMENT** - Die Multi-Agent Architektur auf der alles basiert. Keine Business Logic im Code - Agents SIND die Logik.

## Architektur-Prinzip

```
┌─────────────────────────────────────────────────────────────┐
│                         iOS App                              │
│                    (Thin Client / UI only)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agent Orchestrator                        │
│              (Claude Agent SDK / Multi-Agent)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Planner    │  │   Coach     │  │  Analyst    │         │
│  │  Agent      │  │   Agent     │  │  Agent      │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                  │
│                    ┌─────┴─────┐                            │
│                    │   TOOLS   │                            │
│                    │           │                            │
│                    │ - read_*  │                            │
│                    │ - write_* │                            │
│                    │ - query_* │                            │
│                    └─────┬─────┘                            │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       Supabase                               │
│                    (Pure Data Store)                         │
│   exercises | workouts | sets | vitals | plans | prefs      │
└─────────────────────────────────────────────────────────────┘
```

## Kern-Prinzip: NO ALGORITHMS

### ❌ NICHT SO (traditionell):
```python
def calculate_next_weight(last_sets):
    avg_rpe = mean([s.rpe for s in last_sets])
    if avg_rpe < 7:
        return last_weight * 1.025  # +2.5%
    elif avg_rpe > 8.5:
        return last_weight * 0.95   # -5%
    return last_weight
```

### ✅ SO (Agent-based):
```
Agent erhält:
- Tool: get_recent_sets(exercise_id)
- Tool: get_user_preferences()
- Tool: write_recommendation()

Agent ENTSCHEIDET basierend auf:
- Kontext (Schlaf, Stress, Zeit seit letztem Training)
- Muster (Trend über Wochen, nicht nur letzte Session)
- Nuancen ("war krank letzte Woche")
- Common Sense (keine +20% Sprünge)
```

## Agents

### PlannerAgent
**Aufgabe:** Langfristige Planung und Programmdesign

**Tools:**
- `get_user_goals()` - Ziele des Users
- `get_training_history(days)` - Vergangene Workouts
- `get_user_preferences()` - Equipment, Zeit, Vorlieben
- `write_training_plan()` - Plan speichern
- `get_exercise_library()` - Verfügbare Übungen

**Entscheidet:**
- Welcher Split passt zum User?
- Wann sollte Deload sein?
- Wie sieht Periodisierung aus?
- Welche Übungen für welche Ziele?

---

### CoachAgent
**Aufgabe:** Echtzeit-Coaching während Workouts

**Tools:**
- `get_todays_plan()` - Was ist geplant?
- `get_exercise_history(exercise)` - Letzte Performances
- `log_set(exercise, weight, reps, rpe)` - Set speichern
- `get_current_workout_state()` - Was wurde schon gemacht?
- `update_plan()` - Plan on-the-fly anpassen

**Entscheidet:**
- Welches Gewicht für nächsten Satz?
- Braucht User mehr/weniger Rest?
- Soll Übung getauscht werden?
- Wann ist Workout fertig?

---

### AnalystAgent
**Aufgabe:** Muster erkennen und Insights generieren

**Tools:**
- `query_workouts(timeframe, filters)` - Daten abfragen
- `get_vitals_history()` - Schlaf, Gewicht, etc.
- `get_exercise_trends(exercise)` - Entwicklung über Zeit
- `write_insight(type, content)` - Insight speichern

**Entscheidet:**
- Ist das ein Plateau?
- Welche Muskeln sind untertrainiert?
- Gibt es Overtraining-Signale?
- Was läuft gut/schlecht?

---

### ReporterAgent
**Aufgabe:** Zusammenfassungen und Reports erstellen

**Tools:**
- `get_period_summary(start, end)` - Aggregierte Daten
- `get_insights(period)` - Gespeicherte Insights
- `get_prs(period)` - Personal Records
- `generate_report()` - Report formatieren

**Entscheidet:**
- Was ist report-worthy?
- Wie präsentiere ich Daten verständlich?
- Welche Narrative passt?

## Agent Coordination

### Handoffs
```
User: "Erstell mir einen Plan"
→ Orchestrator routet zu PlannerAgent

User: "Ich will jetzt trainieren"
→ Orchestrator routet zu CoachAgent
→ CoachAgent holt Plan von PlannerAgent (oder Supabase)

User: "Wie lief es diese Woche?"
→ Orchestrator routet zu ReporterAgent
→ ReporterAgent kann AnalystAgent für Insights fragen
```

### Shared Context
Alle Agents haben Zugriff auf:
- User Profile (Ziele, Präferenzen)
- Conversation History
- Supabase (via Tools)

## Implementation

### Tech Stack
- Claude Agent SDK (TypeScript)
- Supabase MCP für Data Access
- iOS App als Thin Client
- Real-time via Supabase Realtime

### Tool Design
```typescript
// Beispiel Tool-Definition
const tools = {
  get_recent_sets: {
    description: "Get recent sets for an exercise",
    parameters: {
      exercise_id: "string",
      limit: "number (default 10)"
    },
    execute: async (params) => {
      return supabase
        .from('workout_sets')
        .select('*')
        .eq('exercise_id', params.exercise_id)
        .order('performed_at', { ascending: false })
        .limit(params.limit || 10)
    }
  },

  log_set: {
    description: "Log a completed set",
    parameters: {
      exercise_id: "string",
      weight_kg: "number",
      reps: "number",
      rpe: "number (1-10)"
    },
    execute: async (params) => {
      return supabase
        .from('workout_sets')
        .insert(params)
    }
  }
}
```

## Definition of Done
- [ ] PlannerAgent funktioniert standalone
- [ ] CoachAgent leitet komplettes Workout
- [ ] AnalystAgent erkennt Muster
- [ ] ReporterAgent erstellt Reports
- [ ] Agents können untereinander kommunizieren
- [ ] KEINE Business Logic außerhalb der Agents
