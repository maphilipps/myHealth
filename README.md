# myHealth - Personal Health Tracking System

Ein umfassendes Gesundheits-Tracking-System mit Claude Code Integration für intelligente Analyse und Workout-Coaching.

## Features

- **Workout Tracking** mit Progressive Overload
- **Ernährungs-Tracking** mit Makro-Analyse
- **Vitaldaten-Monitoring** (Gewicht, Schlaf, Herzfrequenz)
- **Apple Health & Yazio Integration** (Auto-Sync)
- **Intelligente Analyse** via Claude Code Agents
- **Mobile Web-UI** für unterwegs
- **Git-versionierte YAML-Daten**

## Architektur

```
myHealth/
├── .claude-plugin/      # Claude Code Plugin
├── commands/            # Slash-Commands
├── agents/              # Spezialisierte Agents
├── skills/              # Wissens-Skills
├── hooks/               # Event-Hooks (Sync, Validierung)
├── data/                # YAML-Daten (Git-versioniert)
│   ├── daily/          # Tägliche Logs
│   ├── workouts/       # Training-Sessions
│   ├── nutrition/      # Ernährung
│   ├── vitals/         # Vitaldaten
│   ├── plans/          # Trainingspläne
│   └── exercises/      # Übungs-Bibliothek
├── web/                 # React + ShadCN Web-UI
└── scripts/             # Sync & Utility Scripts
```

## Quick Start

### Claude Code Plugin aktivieren

```bash
cd myHealth
claude
```

### Verfügbare Commands

- `/myhealth:log` - Schnelles Eintragen
- `/myhealth:analyze` - Daten analysieren
- `/myhealth:report` - Reports generieren
- `/myhealth:plan` - Trainingsplan erstellen
- `/myhealth:import` - Daten importieren

### Web-UI starten

```bash
cd web
npm install
npm run dev
```

## Datenformat

Alle Daten werden als YAML gespeichert und mit Git versioniert.

### Beispiel: Täglicher Log

```yaml
# data/daily/2024-01-15.yaml
date: 2024-01-15
weight: 82.5
water_ml: 2500
sleep_hours: 7.5
mood: 4
notes: "Gutes Training heute"
```

### Beispiel: Workout

```yaml
# data/workouts/2024-01-15-torso.yaml
date: 2024-01-15
type: torso
duration_min: 75
exercises:
  - name: Bench Press
    sets:
      - weight: 80
        reps: 8
        rpe: 8
      - weight: 80
        reps: 7
        rpe: 9
```

## Auto-Sync

Apple Health Daten werden automatisch beim Start von Claude Code synchronisiert (via SessionStart Hook).

## Lizenz

Private Nutzung
