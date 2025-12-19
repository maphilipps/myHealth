---
title: AI Meal Planning
status: todo
type: task
priority: medium
tags:
    - nutrition
    - ai
    - planning
created_at: 2025-12-19T10:00:00Z
updated_at: 2025-12-19T10:00:00Z
links:
    - parent: myHealth-nut0
---

# AI Meal Planning

## Beschreibung
Der NutritionAgent plant Mahlzeiten basierend auf Makro-Zielen, Vorlieben und Kontext. Von einzelnen Meal-Vorschlägen bis zu kompletten Wochenplänen.

## Features

### 1. Single Meal Suggestions
```
User: "Was soll ich zu Abend essen?"

Agent: "Du brauchst noch:
        • 50g Protein
        • 80g Carbs
        • 25g Fett

        Basierend auf deinen Favoriten:

        🥗 Option 1: Lachs-Bowl
           200g Lachs, 150g Reis, Gemüse
           (46g P, 65g C, 18g F)

        🍗 Option 2: Hähnchen-Wrap
           2 Wraps mit Hähnchen, Avocado, Salat
           (52g P, 70g C, 24g F)

        🥩 Option 3: Steak mit Kartoffeln
           200g Steak, 250g Kartoffeln, Gemüse
           (54g P, 55g C, 20g F)

        Was klingt gut?"
```

### 2. Day Planning
```
User: "Plan meinen Essenstag morgen"

Agent: "Morgen ist Trainingstag (Beine) -
        ich plane mit 2.500 kcal, 180g Protein.

        🌅 Frühstück (07:30):
           Dein üblicher Shake + Haferflocken
           → 40g P, 55g C, 8g F (450 kcal)

        🌞 Mittagessen (12:30):
           Hähnchen-Reis-Bowl mit Gemüse
           → 50g P, 70g C, 15g F (620 kcal)

        🍌 Pre-Workout (16:00):
           Banane + Reiswaffeln
           → 3g P, 45g C, 2g F (200 kcal)

        💪 Post-Workout (19:00):
           Shake + Banane
           → 35g P, 30g C, 3g F (290 kcal)

        🌙 Abendessen (20:00):
           Lachs mit Quinoa und Brokkoli
           → 52g P, 45g C, 25g F (610 kcal)

        🍫 Snack-Buffer:
           ~330 kcal übrig für Snacks/Flexibilität

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Gesamt: 180g P | 245g C | 53g F | 2.170 kcal

        Passt das so?"
```

### 3. Week Planning
```
User: "Erstell mir einen Meal Plan für die Woche"

Agent: "Ich erstelle einen Plan basierend auf:
        • Dein Trainingsplan (Mo/Mi/Fr Kraft, Di/Do Cardio)
        • Deine Favoriten
        • Abwechslung

        Kurze Fragen:
        1. Meal Prep am Sonntag möglich?
        2. Budget-Präferenz? (günstig/mittel/egal)
        3. Irgendwelche No-Gos diese Woche?

        Dann personalisiere ich den Plan."
```

### 4. Grocery List Generation
```
Agent: "Hier deine Einkaufsliste für den Wochenplan:

        🥩 PROTEIN
        □ 1kg Hähnchenbrust
        □ 600g Lachsfilet
        □ 500g Rinderhack
        □ 12 Eier
        □ 1kg Magerquark

        🍚 CARBS
        □ 1kg Reis
        □ 500g Haferflocken
        □ 1 Packung Vollkorn-Wraps
        □ 500g Quinoa
        □ 1kg Kartoffeln

        🥦 GEMÜSE
        □ 2 Brokkoli
        □ 500g Spinat
        □ Paprika (3x)
        □ Zwiebeln
        □ Knoblauch

        🍌 OBST
        □ 7 Bananen
        □ Beeren (500g)
        □ Äpfel (4x)

        🧈 FETTE & SONSTIGES
        □ 1 Avocado
        □ Olivenöl
        □ Nüsse (200g)

        📱 Als Einkaufsliste in Reminders speichern?"
```

### 5. Meal Prep Guidance
```
Agent (Sonntag):

"Meal Prep Tag! 🍳

Hier ist dein Plan für effizientes Preppen:

1️⃣ REIS KOCHEN (20 min passiv)
   → 1kg für die ganze Woche

2️⃣ HÄHNCHEN MARINIEREN & BACKEN (40 min)
   → 1kg, verschiedene Gewürze
   → Aufteilen: 5 Portionen à 200g

3️⃣ GEMÜSE SCHNEIDEN & BLANCHIEREN
   → Brokkoli, Paprika vorbereiten
   → Hält 4-5 Tage im Kühlschrank

4️⃣ OVERNIGHT OATS VORBEREITEN
   → 5 Gläser für Mo-Fr

5️⃣ PORTIONIEREN
   → Lunch-Boxen für Mo-Mi vorbereiten

Geschätzte Zeit: 1.5-2 Stunden
Ersparnis unter der Woche: ~30 min/Tag 🎯"
```

## Context-Aware Planning

### Training-Day Awareness
```python
def plan_meals_for_day(user_id, date):
    training = get_workout_plan(user_id, date)

    if training:
        if training.type == 'heavy':
            # Mehr Carbs, Timing um Training
            carb_bias = 1.3
            include_pre_workout = True
            include_post_workout = True
        else:
            carb_bias = 1.15
            include_pre_workout = False
            include_post_workout = True
    else:
        # Rest Day
        carb_bias = 0.9
        include_pre_workout = False
        include_post_workout = False

    return generate_meal_plan(
        user_id,
        date,
        carb_bias=carb_bias,
        include_pre_workout=include_pre_workout,
        include_post_workout=include_post_workout
    )
```

### User Preferences
```yaml
meal_planning_preferences:
  cooking_skill: intermediate
  meal_prep_willing: true
  budget: moderate
  cuisine_preferences: [mediterranean, asian, german]
  dislikes: [fish_other_than_salmon, brussels_sprouts]
  dietary_restrictions: []
  eating_out_frequency: 1-2x/week
  cooking_time_available:
    weekday: 30min
    weekend: 1h
```

## Database Schema

```sql
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    date DATE,
    meals JSONB,
    -- {
    --   "breakfast": {...},
    --   "lunch": {...},
    --   "dinner": {...},
    --   "snacks": [...]
    -- }
    total_macros JSONB,
    created_by TEXT, -- 'ai' | 'user'
    status TEXT, -- 'planned' | 'partially_followed' | 'completed'
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE grocery_lists (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    week_start DATE,
    items JSONB,
    -- [
    --   {"name": "Hähnchenbrust", "amount": "1kg", "category": "protein", "checked": false}
    -- ]
    created_at TIMESTAMPTZ DEFAULT now()
);
```

## Definition of Done
- [ ] Single Meal Suggestions funktionieren
- [ ] Day Planning basiert auf Training
- [ ] Week Planning mit Meal Prep Support
- [ ] Grocery List Generation
- [ ] Export zu iOS Reminders/Notes
- [ ] Berücksichtigt User Präferenzen und Favoriten
