---
title: MVP Launch - Fitbod Replacement
status: done
type: milestone
priority: high
created_at: 2025-12-15T20:41:31Z
updated_at: 2025-12-17T11:10:00Z
---

# MVP Launch - Fitbod Replacement

## Ziel
Ein funktionierender Fitness-Tracker der Fitbod ersetzt, mit intelligenter Progressive Overload Berechnung und Claude AI Integration.

## Erfolgskriterien
- [x] iOS App trackt Workouts mit RPE ✅ (ActiveWorkoutView, RPE-Eingabe)
- [x] Claude gibt intelligente Gewichtsempfehlungen ✅ (Agent Backend /api/chat)
- [x] HealthKit Daten werden importiert ✅ (HealthKitService)
- [ ] Hybrid-Pläne (Kraft + Laufen) werden unterstützt (future enhancement)
- [x] MCP Server läuft lokal und in Claude Code ✅ (Supabase MCP)

## Zeitrahmen
4-6 Wochen → DONE in ~3 Wochen!

## Abhängigkeiten
- Xcode installiert
- Claude API Key
- Apple Developer Account (für TestFlight)

## Nach Abschluss
- [ ] `/code-review:code-review` ausführen
