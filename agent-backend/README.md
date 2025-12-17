# Fitness Agents - Agent-First Architecture

AI-powered fitness coaching system using Claude Agent SDK with Supabase backend.

**Kernprinzip:** Agents SIND die Business Logic - keine hardcoded Algorithmen.

## Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                     Fitness Agents                          │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ PlannerAgent │ CoachAgent   │ AnalystAgent │ ReporterAgent │
│ (Strategie)  │ (Echtzeit)   │ (Muster)     │ (Reports)     │
└──────┬───────┴──────┬───────┴──────┬───────┴───────┬───────┘
       │              │              │               │
       └──────────────┴──────────────┴───────────────┘
                             │
                    ┌────────▼────────┐
                    │ Supabase MCP    │
                    │ (30 Tools)      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ PostgreSQL (RLS)│
                    └─────────────────┘
```

## Agent-Team

| Agent | Rolle | Verantwortung |
|-------|-------|---------------|
| **PlannerAgent** | Strategist | Trainingspläne, Periodisierung, Programme |
| **CoachAgent** | Personal Trainer | Live-Coaching, Gewichte, Motivation |
| **AnalystAgent** | Data Scientist | Muster, Plateaus, Insights |
| **ReporterAgent** | Kommunikator | Summaries, Reports, Feedback |

## Setup

```bash
# 1. Dependencies installieren
npm install

# 2. Environment konfigurieren
cp .env.example .env
# .env bearbeiten mit deinen Keys

# 3. Development starten
npm run dev
```

## Environment Variables

| Variable | Beschreibung | Required |
|----------|--------------|----------|
| `ANTHROPIC_API_KEY` | Anthropic API Key | ✅ |
| `SUPABASE_URL` | Supabase Project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase Anonymous Key | ✅ |
| `SUPABASE_SERVICE_KEY` | Supabase Service Role Key | ✅ |
| `DEFAULT_USER_ID` | Default User UUID (dev) | ❌ |

## Verwendung

### CLI Mode

```bash
npm run dev

# Beispiele:
# > Erstelle mir einen 4x/Woche Plan für Muskelaufbau
# > Ich will trainieren
# > Warum stagniert mein Bankdrücken?
# > Wie war meine Woche?
```

### Programmatisch

```typescript
import { queryFitnessAgents } from './src/index.js';

const result = await queryFitnessAgents("Was soll ich heute bei Bankdrücken machen?");
console.log(result.result);
```

## Supabase Tools

30 Tools für Fitness-Datenoperationen:

### Read Tools
- `get_user_profile` - User-Profil mit Zielen und Präferenzen
- `get_equipment_available` - Verfügbare Ausrüstung
- `get_training_history` - Trainingshistorie
- `get_current_plan` - Aktiver Trainingsplan
- `get_exercise_library` - Übungsbibliothek
- `get_todays_plan` - Heutiges Workout
- `get_exercise_history` - Historie einer Übung
- `get_current_session` - Aktive Session
- `get_user_state` - Recovery-Status
- `get_exercise_trends` - Trends über Zeit
- `get_volume_by_muscle` - Volumen pro Muskelgruppe
- `get_pr_history` - Personal Records
- `get_period_summary` - Zeitraum-Statistiken
- `get_stored_insights` - Gespeicherte Insights
- `get_goals_progress` - Fortschritt zu Zielen
- `get_streak_info` - Workout-Streaks
- `get_exercise_details` - Übungsdetails

### Write Tools
- `create_plan` - Neuen Plan erstellen
- `update_plan` - Plan aktualisieren
- `start_workout` - Workout starten
- `log_set` - Satz loggen
- `end_workout` - Workout beenden
- `update_session` - Session aktualisieren
- `create_insight` - Insight speichern
- `create_report` - Report speichern
- `log_vitals` - Vitals loggen

## Entwicklung

```bash
# TypeScript kompilieren
npm run build

# Type-Check ohne Emit
npm run typecheck

# Tests
npm run test
```

## Das Agent-First Prinzip

```
❌ NICHT: Code mit Algorithmen
   if (rpe > 8.5) weight -= 5%

✅ STATTDESSEN: Agents entscheiden situativ
   Agent analysiert Kontext, Historie, User-Feedback
   und trifft intelligente Entscheidungen
```

Die Agents nutzen KEINE hardcoded Regeln. Jede Entscheidung basiert auf:
- User-Kontext (Ziele, Erfahrung, Präferenzen)
- Trainingshistorie (Trends, Plateaus, PRs)
- Recovery-Status (Schlaf, letzte Workouts)
- Situative Faktoren (wie fühlt sich der User?)

## Lizenz

MIT
