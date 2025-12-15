# myHealth - Claude Code Projekt-Instruktionen

## Projektübersicht

**myHealth** ist ein persönliches Gesundheits-Tracking-System mit:
- YAML-basierter Datenspeicherung (Git-versioniert)
- Claude Code Plugin für intelligente Analyse
- React Web-UI für mobilen Zugriff
- Progressive Overload Training-Algorithmen

## Datenstruktur

```
data/
├── daily/          # Tägliche Logs (Gewicht, Schlaf, Schritte, Stimmung)
├── workouts/       # Training-Sessions mit Sätzen und RPE
├── nutrition/      # Mahlzeiten und Makros
├── vitals/         # Herzfrequenz, Blutdruck, HRV
├── plans/          # Trainingspläne (YAML-Definitionen)
└── exercises/      # Übungs-Bibliothek mit Form-Cues
```

## Verfügbare Commands

- `/myhealth:log` - Schnelles Eintragen von Daten
- `/myhealth:analyze` - Daten analysieren
- `/myhealth:report` - Reports generieren
- `/myhealth:plan` - Trainingsplan erstellen/anpassen
- `/myhealth:import` - Daten aus Apple Health/Yazio importieren

## Verfügbare Agents

- **training-coach** - Workout-Empfehlungen und Progressive Overload
- **nutrition-analyst** - Ernährungsanalyse und Makro-Empfehlungen
- **health-reporter** - Trend-Analyse und Health-Reports

## Wichtige Konventionen

### Dateinamen
- Daily: `YYYY-MM-DD.yaml`
- Workouts: `YYYY-MM-DD-[type].yaml` (z.B. `2024-12-15-torso.yaml`)
- Nutrition: `YYYY-MM-DD.yaml`

### YAML-Struktur
Alle Dateien müssen dem Schema in `skills/health-schema/SKILL.md` entsprechen.

### Progressive Overload Regeln
1. Bei RPE < 8: Gewicht erhöhen (2.5kg bei Compound, 1.25kg bei Isolation)
2. Bei RPE 8-9: Wiederholungen erhöhen bis oberes Rep-Range
3. Bei RPE > 9 für 2+ Wochen: Deload einplanen

## Web-UI

```bash
cd web && npm run dev
```

Features:
- Dashboard mit Tages-Übersicht
- Workout Chat mit Claude API
- Quick Log für schnelle Einträge
- Nutrition Tracking
- Settings für API Key und Profil

## Sync-Scripts

```bash
# Apple Health importieren
./scripts/sync/apple-health-sync.sh

# Yazio importieren
./scripts/sync/yazio-import.sh <export.csv>
```

## Git Workflow

Nach Datenänderungen immer committen:
```bash
git add data/
git commit -m "data: [Beschreibung]"
```

## Spezifische Hinweise

1. **Gewichts-Empfehlungen**: Immer auf Basis der letzten 2-3 Workouts berechnen
2. **RPE-Tracking**: Bei allen Sätzen erfassen für bessere Progression
3. **Ernährung**: Protein-Ziel ist 2g/kg Körpergewicht
4. **Schlaf**: Mindestens 7h für optimale Regeneration

## Beispiel-Abfragen

- "Wie war mein Training diese Woche?"
- "Was soll ich heute bei Bankdrücken machen?"
- "Zeig mir meinen Gewichtsverlauf"
- "Analyse meine Ernährung der letzten 7 Tage"
- "Erstelle einen Weekly Report"
