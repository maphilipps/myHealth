---
title: AI-Fitness Product Launch
status: todo
type: milestone
priority: high
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
---

# AI-Fitness Product Launch

## Vision
**100% Agent-basiertes Fitness-Training.** Keine Algorithmen, keine Business Logic im Code - ALLES läuft über AI Agents.

Der Agent IST die Logik:
- Progressive Overload? → Agent entscheidet basierend auf Kontext
- Recovery-Berechnung? → Agent analysiert und empfiehlt
- Periodisierung? → Agent plant intelligent
- Plateau-Erkennung? → Agent bemerkt Muster

## Architektur-Philosophie

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT-FIRST ARCHITEKTUR                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐      ┌─────────────┐      ┌────────────┐  │
│   │   User      │ ←──→ │   AGENTS    │ ←──→ │  Supabase  │  │
│   │   (Voice/   │      │             │      │  (Daten)   │  │
│   │    Text)    │      │ - Planner   │      │            │  │
│   └─────────────┘      │ - Coach     │      └────────────┘  │
│                        │ - Analyst   │                      │
│                        │ - Reporter  │                      │
│                        └─────────────┘                      │
│                                                              │
│   KEINE Business Logic im Code!                             │
│   Agents haben Tools (read/write data) und ENTSCHEIDEN     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Differenzierung zu Fitbod

| Fitbod | myHealth AI |
|--------|-------------|
| **Algorithmus** berechnet Gewichte | **Agent** entscheidet situativ |
| Feste Regeln für Recovery | **Agent** interpretiert Kontext |
| Statische Periodisierung | **Agent** plant flexibel |
| Code = Business Logic | **Agent = Business Logic** |
| UI-First | **Conversation-First** |

## Kern-Erlebnis
```
User: "Ich hab heute nur 30 Minuten und mein Rücken ist etwas steif"

Agent (denkt):
- Checkt letzte Workouts in Supabase
- Sieht: Gestern war Bein-Tag, Rücken nicht trainiert
- Versteht: "steif" = Mobility-Problem, nicht Übertraining
- Plant: Oberkörper ohne lower back stress

Agent: "Okay, ich plane ein kurzes Oberkörper-Workout ohne
        Übungen die den unteren Rücken belasten.

        Statt Kreuzheben machen wir Lat Pulldowns,
        und ich baue 5 Min Mobility am Anfang ein.

        Ready to start?"
```

## Agent-Rollen

### 1. PlannerAgent
- Erstellt Trainingspläne
- Plant Wochen/Monate voraus
- Versteht Periodisierung konzeptionell
- Passt Pläne dynamisch an

### 2. CoachAgent
- Leitet aktive Workouts
- Gibt Echtzeit-Empfehlungen
- Interpretiert RPE und Feedback
- Motiviert und korrigiert

### 3. AnalystAgent
- Analysiert Trends und Muster
- Erkennt Plateaus
- Identifiziert Schwachstellen
- Generiert Insights

### 4. ReporterAgent
- Erstellt Zusammenfassungen
- Wöchentliche/monatliche Reports
- Erklärt Fortschritt verständlich

## Erfolgskriterien
- [ ] KEINE hardcoded Business Logic für Training
- [ ] Agents haben nur Tools (CRUD auf Supabase)
- [ ] Alle "Algorithmen" sind Agent-Entscheidungen
- [ ] System funktioniert rein conversational
- [ ] Agents können untereinander delegieren

## Epics
1. **AI Workout Generation** - Agents erstellen & leiten Workouts
2. **Smart Analytics** - Agents analysieren & reporten
3. **Personalization Engine** - Agents lernen Präferenzen
4. **Enhanced UX Features** - Minimal UI für Agent-Output
5. **Nutrition Intelligence** - NutritionAgent für Essens-Tracking mit Pattern Recognition

## Nach Abschluss
- [ ] Beta-Tester Feedback einholen
- [ ] App Store Screenshots erstellen
- [ ] Marketing-Copy: "Your AI Personal Trainer"
