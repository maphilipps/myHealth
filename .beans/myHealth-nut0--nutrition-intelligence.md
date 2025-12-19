---
title: 'Epic: Nutrition Intelligence'
status: todo
type: epic
priority: high
tags:
    - ai
    - nutrition
    - core
    - differentiator
created_at: 2025-12-19T10:00:00Z
updated_at: 2025-12-19T10:00:00Z
links:
    - parent: myHealth-af01
---

# Epic: Nutrition Intelligence

## Beschreibung
**AI-powered Nutrition Tracking** - Nicht nur Kalorien zählen, sondern ein intelligenter Ernährungs-Coach der Gewohnheiten erkennt, proaktiv nachfragt und personalisierte Empfehlungen gibt.

## Warum ist das wichtig?
Ernährung ist 70% des Fitness-Erfolgs. Aber:
- Die meisten Apps sind passive Logbücher
- User vergessen zu loggen
- Keine intelligente Beratung
- Keine Verbindung zum Training

Mit dem NutritionAgent:
- **Proaktive Nachfragen** basierend auf erkannten Mustern
- **Intelligente Empfehlungen** für Makro-Ziele
- **Training-Nutrition Sync** - Mehr Protein an Trainingstagen
- **Gewohnheits-Erkennung** - Kennt deine Routinen

## Kern-Erlebnis

```
Morgens um 8:30:
Agent: "Hey! Du trinkst normalerweise morgens deinen Eiweißshake.
        Schon getrunken? 🥤"

User: "Ja, mit Banane"

Agent: "Top! Das sind 35g Protein + Carbs vor dem Training.
        Perfekt für später - heute ist ja Brust-Tag."
```

```
Abends um 19:00:
Agent: "Du brauchst noch 45g Protein heute.
        Ideen:
        • 200g Hähnchenbrust (46g Protein)
        • 250g Magerquark + Beeren (32g) + 2 Eier (12g)
        • Dein übliches Thunfisch-Wrap (38g)

        Was klingt gut?"
```

## Features

### 1. Smart Food Logging (nut1)
- Natural Language Input ("Hähnchen mit Reis und Brokkoli")
- Foto-Erkennung (später)
- Schnelle Favoriten ("Das Übliche")
- Voice-to-Log

### 2. Pattern Recognition (nut2)
- Erkennt Essgewohnheiten (Frühstück immer um 7:30)
- Identifiziert regelmäßige Mahlzeiten
- Bemerkt Abweichungen ("Heute kein Mittagessen?")
- Analysiert Makro-Verteilung über Wochentage

### 3. Proactive Suggestions (nut3)
- Erinnerungen basierend auf Gewohnheiten
- Makro-Gap Empfehlungen
- Training-angepasste Vorschläge
- Hydration Reminders

### 4. Macro Intelligence (nut4)
- Automatische Makro-Berechnung
- Ziel-Anpassung (Cut/Bulk/Maintain)
- Training-Sync (mehr Carbs an Trainingstagen)
- Flexible Dieting Support (IIFYM)

### 5. Meal Planning (nut5)
- AI-generierte Mahlzeitenvorschläge
- Einkaufslisten
- Meal Prep Empfehlungen
- Restaurant-Tipps

## Differenzierung

| Andere Apps | myHealth NutritionAgent |
|-------------|-------------------------|
| Passive Logging | **Proaktive Nachfragen** |
| Generische Empfehlungen | **Personalisiert auf Gewohnheiten** |
| Nur Kalorien | **Training-Nutrition Integration** |
| Manuelle Eingabe | **"Das Übliche" + Voice** |
| Isoliert | **Versteht Kontext** (müde = comfort food ok) |

## Beispiel-Interaktionen

### Muster-Erkennung
```
Agent: "Mir fällt auf: Montags (nach Brust-Tag) isst du
        durchschnittlich 180g Protein - Top!

        Aber Freitags nur 120g. Das ist der Tag VOR
        deinem schweren Bein-Training.

        Soll ich Freitags an mehr Protein erinnern?"
```

### Kontext-Verständnis
```
User: "Heute keine Lust zu kochen"

Agent: "Verstehe! Hier sind schnelle Optionen die deine
        Makros treffen:

        • Subway: 6" Chicken Teriyaki (30g Protein)
        • Dein Supermarkt: Fertig-Salat + Hähnchenbrust
        • Lieferando: Thai Basil Chicken von deinem Stamm-Thai

        Du brauchst noch 50g Protein heute."
```

### Gewohnheits-Tracking
```
Agent: "Diese Woche 5/7 Tage Eiweißshake morgens -
        stark für die Routine!

        Dein Protein-Timing ist übrigens perfekt:
        ~40g früh, ~50g mittags, ~60g abends.
        Das optimiert die Muskelproteinsynthese."
```

## Tech Stack
- NutritionAgent (Claude Agent SDK)
- Supabase Tables: `meals`, `foods`, `nutrition_goals`, `eating_patterns`
- Food Database API (OpenFoodFacts / Nutritionix)
- iOS Push Notifications für proaktive Prompts

## Database Schema Erweiterung

```sql
-- Mahlzeiten
CREATE TABLE meals (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    logged_at TIMESTAMPTZ,
    meal_type TEXT, -- breakfast, lunch, dinner, snack
    description TEXT,
    foods JSONB, -- [{name, amount_g, macros}]
    total_calories INT,
    total_protein_g DECIMAL,
    total_carbs_g DECIMAL,
    total_fat_g DECIMAL,
    notes TEXT,
    source TEXT -- manual, voice, photo, quick_log
);

-- Erkannte Muster
CREATE TABLE eating_patterns (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    pattern_type TEXT, -- 'regular_meal', 'favorite_food', 'timing'
    pattern_data JSONB,
    confidence DECIMAL,
    first_seen TIMESTAMPTZ,
    last_seen TIMESTAMPTZ,
    occurrence_count INT
);

-- Ernährungsziele
CREATE TABLE nutrition_goals (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    goal_type TEXT, -- cut, bulk, maintain
    daily_calories INT,
    protein_g INT,
    carbs_g INT,
    fat_g INT,
    training_day_adjustment JSONB, -- {calories: +300, carbs: +50}
    active BOOLEAN DEFAULT true
);
```

## Definition of Done
- [ ] NutritionAgent implementiert (agt5)
- [ ] Food Logging via Natural Language
- [ ] Pattern Recognition aktiv nach 7 Tagen Daten
- [ ] Proaktive Suggestions funktionieren
- [ ] Training-Nutrition Sync automatisch
- [ ] iOS Push Notifications für Reminders

## Children
- nut1: Smart Food Logging
- nut2: Pattern Recognition
- nut3: Proactive Suggestions
- nut4: Macro Intelligence
- nut5: Meal Planning
- agt5: NutritionAgent
