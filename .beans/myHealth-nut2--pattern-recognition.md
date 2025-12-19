---
title: Nutrition Pattern Recognition
status: todo
type: task
priority: high
tags:
    - nutrition
    - ai
    - patterns
created_at: 2025-12-19T10:00:00Z
updated_at: 2025-12-19T10:00:00Z
links:
    - parent: myHealth-nut0
---

# Nutrition Pattern Recognition

## Beschreibung
Der NutritionAgent lernt Essgewohnheiten und erkennt Muster. Nach 7-14 Tagen Daten weiß er: wann du isst, was du isst, und kann Abweichungen erkennen.

## Pattern-Typen

### 1. Timing Patterns
```yaml
pattern_type: timing
examples:
  - "Frühstück werktags zwischen 7:00-8:00"
  - "Wochenende: Frühstück erst um 10:00"
  - "Abendessen nach dem Training"
  - "Snack um 15:00 (Nachmittagstief)"

detection:
  - Analysiere meal.logged_at über 14 Tage
  - Gruppiere nach Wochentag
  - Finde konsistente Zeitfenster (±30min)
  - Confidence basierend auf Konsistenz
```

### 2. Food Patterns
```yaml
pattern_type: recurring_food
examples:
  - "Morgens: 80% Eiweißshake"
  - "Mittags: Oft Salat mit Protein"
  - "Freitag abends: Pizza/Cheat Meal"
  - "Post-Workout: Immer Shake + Banane"

detection:
  - Finde häufige Foods pro Meal-Type
  - Korreliere mit Wochentagen
  - Identifiziere Food-Kombinationen
  - Erkenne "Rituale" (Post-Workout etc.)
```

### 3. Macro Patterns
```yaml
pattern_type: macro_distribution
examples:
  - "Montags (Post-Training): High Protein"
  - "Sonntags: Niedrigere Kalorien"
  - "Protein meist unterschritten"
  - "Carbs: Hoch an Trainingstagen"

detection:
  - Aggregiere Makros pro Wochentag
  - Vergleiche mit Zielen
  - Finde Tag-zu-Tag Varianz
  - Korreliere mit Training
```

### 4. Context Patterns
```yaml
pattern_type: contextual
examples:
  - "Nach schlechtem Schlaf: Mehr Carbs/Zucker"
  - "Stressige Wochen: Mehr Convenience Food"
  - "Vor wichtigem Training: Carb Loading"
  - "Rest Day: Weniger Hunger"

detection:
  - Verknüpfe Nutrition mit Vitals (Sleep, HRV)
  - Finde Korrelationen
  - Prüfe gegen Trainingsplan
```

## Pattern Detection Algorithm

```python
# Pseudo-Code für Pattern Detection

def detect_patterns(user_id, days=14):
    meals = get_meal_history(user_id, days)

    patterns = []

    # 1. TIMING PATTERNS
    timing_clusters = cluster_by_time(meals)
    for cluster in timing_clusters:
        if cluster.consistency > 0.7:  # 70% der Tage
            patterns.append({
                'type': 'timing',
                'meal_type': cluster.meal_type,
                'typical_time': cluster.median_time,
                'variance_minutes': cluster.std_dev,
                'weekday_specific': cluster.weekday_pattern,
                'confidence': cluster.consistency
            })

    # 2. FOOD PATTERNS
    food_frequency = count_foods_by_meal_type(meals)
    for meal_type, foods in food_frequency.items():
        top_foods = get_top_n(foods, n=3, min_frequency=0.5)
        for food in top_foods:
            patterns.append({
                'type': 'recurring_food',
                'meal_type': meal_type,
                'food_name': food.name,
                'frequency': food.occurrence_rate,
                'typical_amount': food.median_amount,
                'confidence': food.occurrence_rate
            })

    # 3. MACRO PATTERNS
    daily_macros = aggregate_macros_by_day(meals)
    for weekday in range(7):
        weekday_data = filter_by_weekday(daily_macros, weekday)
        if has_significant_pattern(weekday_data):
            patterns.append({
                'type': 'macro_distribution',
                'weekday': weekday,
                'avg_protein': weekday_data.mean_protein,
                'avg_carbs': weekday_data.mean_carbs,
                'correlation_with_training': check_training_correlation(weekday),
                'confidence': weekday_data.consistency
            })

    return patterns
```

## Agent Integration

### Proaktive Nutzung
```
Agent prüft jeden Morgen:

1. get_eating_patterns(user_id)
2. Vergleiche aktuelle Zeit mit timing patterns
3. Prüfe ob erwartete Mahlzeit fehlt

IF now > pattern.breakfast_time + 30min
   AND no_breakfast_logged
   AND pattern.confidence > 0.7:

   → Trigger proaktive Nachfrage
```

### Pattern-basierte Empfehlungen
```
Agent weiß:
- User isst freitags oft Pizza
- User's Protein ist freitags oft niedrig

Agent am Freitag Mittag:
"Hey! Freitag = oft Pizza abends bei dir. 🍕
 Heute schon mal extra Protein tanken?
 Wie wärs mit Thunfisch-Salat?"
```

## Confidence Levels

| Confidence | Bedeutung | Agent Verhalten |
|------------|-----------|-----------------|
| > 0.9 | Sehr sicher | "Du trinkst doch immer..." |
| 0.7 - 0.9 | Wahrscheinlich | "Normalerweise isst du..." |
| 0.5 - 0.7 | Möglich | "Manchmal isst du..." |
| < 0.5 | Unsicher | Keine proaktive Aktion |

## Database Schema

```sql
CREATE TABLE eating_patterns (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    pattern_type TEXT, -- 'timing', 'recurring_food', 'macro_distribution', 'contextual'
    pattern_data JSONB,
    -- Beispiel pattern_data:
    -- {
    --   "meal_type": "breakfast",
    --   "typical_time": "07:30",
    --   "typical_foods": ["shake", "banana"],
    --   "weekdays": [1,2,3,4,5],
    --   "avg_macros": {"protein": 35, "carbs": 45}
    -- }
    confidence DECIMAL,
    first_seen TIMESTAMPTZ,
    last_seen TIMESTAMPTZ,
    occurrence_count INT,
    is_active BOOLEAN DEFAULT true
);
```

## Definition of Done
- [ ] Pattern Detection läuft als Background Job
- [ ] Mindestens 4 Pattern-Typen werden erkannt
- [ ] Patterns werden in Supabase gespeichert
- [ ] Agent nutzt Patterns für Empfehlungen
- [ ] Confidence-basierte Entscheidungen
- [ ] Patterns aktualisieren sich bei neuen Daten
