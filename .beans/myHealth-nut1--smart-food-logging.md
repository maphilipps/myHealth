---
title: Smart Food Logging
status: todo
type: task
priority: high
tags:
    - nutrition
    - logging
    - nlp
created_at: 2025-12-19T10:00:00Z
updated_at: 2025-12-19T10:00:00Z
links:
    - parent: myHealth-nut0
---

# Smart Food Logging

## Beschreibung
Einfaches, natürlichsprachiges Essen-Logging. Kein mühsames Durchsuchen von Datenbanken - einfach sagen/schreiben was man gegessen hat.

## Features

### Natural Language Input
```
User: "Hähnchenbrust mit Reis und Brokkoli"

Agent: "Verstanden! Ich schätze:
        • 150g Hähnchenbrust: 46g P, 0g C, 4g F
        • 200g Reis gekocht: 4g P, 56g C, 1g F
        • 150g Brokkoli: 4g P, 10g C, 0g F

        Gesamt: 54g Protein, 66g Carbs, 5g Fett (530 kcal)

        Passt das oder soll ich Mengen anpassen?"
```

### Quick Log / Favoriten
```
User: "Das Übliche" (oder "Mein Frühstück")

Agent: "Dein üblicher Morgen-Shake mit Banane?
        (35g P, 45g C, 5g F - 365 kcal)

        ✓ Geloggt!"
```

### Mengen-Anpassung
```
User: "Hähnchen war mehr, so 250g"

Agent: "Angepasst! Neue Werte:
        • 250g Hähnchenbrust: 77g P, 0g C, 7g F

        Gesamt jetzt: 85g Protein (+31g)"
```

### Voice-to-Log (später)
```
[Voice Input]
User: "Ich hab grad ne Banane gegessen"

Agent: "🍌 Banane geloggt!
        27g Carbs, 1g Protein (105 kcal)"
```

## Food Database Integration

### Primär: Eigene Favoriten
- Häufig geloggte Foods werden priorisiert
- Personalisierte Portionsgrößen gespeichert
- "Dein Shake" = bekannte Zusammensetzung

### Sekundär: API Lookup
- OpenFoodFacts (kostenlos, Open Source)
- Nutritionix (genauer, kostenpflichtig)
- Fallback: Claude schätzt basierend auf Wissen

### Barcode Scanner (Future)
- iOS Camera für Produkt-Scan
- Automatische Nährwert-Erkennung

## UX Flow

```
┌─────────────────────────────────────────┐
│            Food Logging                  │
├─────────────────────────────────────────┤
│                                          │
│  [💬 "Was hast du gegessen?"]           │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │                                  │    │
│  │  Hähnchen mit Reis              │    │
│  │                                  │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ⚡ Quick Log:                          │
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │ Shake  │ │ Mittag │ │ Snack  │       │
│  │ 🥤     │ │ 🍱     │ │ 🍎     │       │
│  └────────┘ └────────┘ └────────┘       │
│                                          │
│  🎤 Voice    📷 Photo (soon)            │
│                                          │
└─────────────────────────────────────────┘
```

## Implementation

### Supabase Schema
```sql
-- Gespeicherte Favoriten
CREATE TABLE user_foods (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    name TEXT,
    default_amount_g DECIMAL,
    calories_per_100g INT,
    protein_per_100g DECIMAL,
    carbs_per_100g DECIMAL,
    fat_per_100g DECIMAL,
    times_logged INT DEFAULT 0,
    last_logged TIMESTAMPTZ,
    aliases TEXT[] -- ["Das Übliche", "Mein Shake"]
);
```

### Agent Tool
```typescript
parse_food_input(input: string): {
    foods: Array<{
        name: string,
        amount_g: number,
        macros: { protein, carbs, fat, calories },
        confidence: number,
        source: 'favorite' | 'database' | 'estimated'
    }>,
    needs_confirmation: boolean,
    suggestions?: string[]
}
```

## Definition of Done
- [ ] Natural Language Parsing funktioniert für 90% der Inputs
- [ ] Favoriten werden erkannt und priorisiert
- [ ] Mengen können nachträglich angepasst werden
- [ ] Quick-Log für Top 3 Favoriten
- [ ] Food Database API angebunden
