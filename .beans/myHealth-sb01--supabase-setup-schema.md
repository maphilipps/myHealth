---
title: Supabase Setup & Schema
status: done
type: epic
priority: critical
tags:
    - backend
    - supabase
    - database
created_at: 2025-12-15T22:00:00Z
updated_at: 2025-12-15T22:00:00Z
links:
    - parent: myHealth-a122
---

# Supabase Setup & Schema

## Beschreibung
Supabase als Backend-as-a-Service für myHealth einrichten. Ersetzt Custom MCP Server und Custom Auth System.

## Warum Supabase?
- **PostgreSQL** mit Row-Level Security → Multi-User out-of-the-box
- **Auth** fertig (Email, Apple, Google Sign-In)
- **MCP Server** offiziell verfügbar → Claude Code Integration
- **Swift SDK** für iOS App
- **Free Tier** ausreichend für MVP (500MB DB, 1GB Storage)

## Komponenten

### 1. Database Schema
- `exercises` - Übungsbibliothek (global)
- `user_profiles` - User-Daten
- `training_plans` - Trainingspläne
- `workout_sessions` - Training-Sessions
- `workout_sets` - Einzelne Sätze mit RPE
- `daily_logs` - Tägliche Metriken (Gewicht, Schlaf, etc.)

### 2. Row-Level Security
Jede User-Tabelle hat RLS Policy: `auth.uid() = user_id`

### 3. Auth Provider
- Email/Password (Development)
- Sign in with Apple (Production)
- Google Sign-In (optional)

### 4. Database Functions
- `get_next_weight()` - Progressive Overload Berechnung
- Views für `exercise_history` und `personal_records`

### 5. MCP Integration
Offizieller Supabase MCP Server in Claude Code einrichten.

## Akzeptanzkriterien
- [x] Supabase Projekt erstellt (rpixspaeamfzssinewuo)
- [x] Schema migriert (16 Tabellen, 4 Functions)
- [x] RLS Policies aktiv
- [x] Auth Provider konfigurieren (sb05)
- [x] Supabase MCP in Claude Code konfiguriert
- [ ] YAML-Daten migrieren (sb07) - optional, kann leer starten
- [x] Exercise Library befüllt (38 Übungen)

## Technischer Plan
Siehe: `docs/PLAN-supabase-migration.md`

## Nach Abschluss
- [ ] `/code-review:code-review` ausführen
