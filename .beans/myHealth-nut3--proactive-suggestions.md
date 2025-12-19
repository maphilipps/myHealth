---
title: Proactive Nutrition Suggestions
status: todo
type: task
priority: high
tags:
    - nutrition
    - ai
    - notifications
    - ux
created_at: 2025-12-19T10:00:00Z
updated_at: 2025-12-19T10:00:00Z
links:
    - parent: myHealth-nut0
---

# Proactive Nutrition Suggestions

## Beschreibung
Der NutritionAgent fragt aktiv nach und gibt Empfehlungen - basierend auf erkannten Mustern, Makro-Lücken und Training. Nicht warten bis der User fragt, sondern proaktiv helfen.

## Trigger-Typen

### 1. Gewohnheits-basierte Trigger
```
WENN: Erwartete Mahlzeit nicht geloggt
      UND Zeit > übliche Zeit + 30min
      UND Pattern Confidence > 0.7

DANN: "Hey! Schon gefrühstückt? Dein üblicher Shake?"
```

### 2. Makro-Gap Trigger
```
WENN: Zeit > 17:00
      UND remaining_protein > 40g
      UND keine weitere Mahlzeit geplant

DANN: "Du brauchst noch 45g Protein.
       Ideen: [personalisierte Vorschläge]"
```

### 3. Training-Sync Trigger
```
WENN: Training in < 3 Stunden
      UND carbs_eaten < 50% of goal
      UND ist Kraft-Training

DANN: "Training um 18:00!
       Noch Carbs tanken für Power?"
```

```
WENN: Training gerade beendet
      UND kein Post-Workout Meal geloggt
      UND Zeit < 2 Stunden nach Training

DANN: "Starkes Workout! 💪
       Zeit für Protein - Shake ready?"
```

### 4. Hydration Trigger
```
WENN: Zeit > 14:00
      UND water_logged < 1000ml
      UND letztes Wasser-Log > 3 Stunden

DANN: "Reminder: Schon genug getrunken heute? 💧"
```

### 5. Wochenend-Muster Trigger
```
WENN: Ist Freitag
      UND User hat "Cheat Meal Freitag" Pattern
      UND Tages-Protein < 100g

DANN: "Freitag! Falls heute wieder Pizza:
       Vielleicht noch Protein-reich essen
       bevor's losgeht?"
```

## Empfehlungs-Logik

### Personalisierte Vorschläge
```python
def generate_food_suggestions(user_id, macro_gap):
    # 1. Priorisiere Favoriten des Users
    favorites = get_favorite_foods(user_id)
    matching_favorites = filter_by_macro_gap(favorites, macro_gap)

    # 2. Falls keine Favoriten passen, schlage Neues vor
    if len(matching_favorites) < 2:
        general_suggestions = get_high_protein_foods()  # oder andere Makros
        suggestions = matching_favorites + general_suggestions[:2]
    else:
        suggestions = matching_favorites[:3]

    # 3. Berücksichtige Kontext
    if is_evening():
        # Vollwertige Mahlzeiten bevorzugen
        suggestions = prioritize_meals(suggestions)
    elif is_snack_time():
        # Snack-artige Optionen bevorzugen
        suggestions = prioritize_snacks(suggestions)

    return suggestions
```

### Beispiel-Empfehlungen
```
Protein Gap = 50g, Abends:

Agent: "Du brauchst noch 50g Protein. Basierend auf
        deinen Favoriten:

        🍗 Hähnchen-Bowl (wie Mittwoch): 48g Protein
        🐟 Lachs mit Gemüse: 45g Protein
        🥩 Dein Steak-Abend: 52g Protein

        Was klingt gut?"
```

```
Protein Gap = 30g, Nachmittag (Snack):

Agent: "Noch 30g Protein bis zum Ziel.
        Snack-Ideen:

        🥛 Magerquark mit Beeren: 30g
        🥜 Dein Protein-Riegel: 20g
        🧀 Hüttenkäse: 25g

        Quick Win?"
```

## Notification System

### iOS Push Notifications
```swift
// Notification Categories
enum NutritionNotificationType {
    case mealReminder      // "Schon gefrühstückt?"
    case macroGap          // "Noch 40g Protein"
    case preWorkout        // "Carbs vor Training"
    case postWorkout       // "Protein nach Training"
    case hydration         // "Trink-Reminder"
    case weeklyInsight     // "Diese Woche: 5/7 Ziel erreicht"
}

// Rich Notification mit Quick Actions
struct NutritionNotification {
    let title: String
    let body: String
    let actions: [NotificationAction]
    // z.B. "Ja, geloggt", "Nein", "Snooze"
}
```

### Notification Timing Rules
```yaml
rules:
  - type: meal_reminder
    earliest: "07:00"
    latest: "22:00"
    min_gap_between: "2h"
    max_per_day: 4

  - type: macro_gap
    earliest: "17:00"  # Erst abends
    latest: "21:00"
    max_per_day: 2

  - type: hydration
    earliest: "09:00"
    latest: "20:00"
    min_gap_between: "3h"
    max_per_day: 3

  - type: training_sync
    trigger: "relative_to_workout"
    pre_workout: "-3h to -1h"
    post_workout: "0 to +2h"
```

### User Preferences
```sql
CREATE TABLE notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users,
    meal_reminders BOOLEAN DEFAULT true,
    macro_alerts BOOLEAN DEFAULT true,
    hydration_reminders BOOLEAN DEFAULT false,
    training_sync BOOLEAN DEFAULT true,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '07:00',
    frequency_preference TEXT DEFAULT 'normal' -- 'minimal', 'normal', 'frequent'
);
```

## Agent Conversation Flow

### Nach Notification
```
[User öffnet App nach Push]

Agent: "Hey! Du wolltest noch 40g Protein.
        Bist du am Essen oder brauchst du
        noch Inspiration?"

User: "Hab grad Quark gegessen"

Agent: "Perfekt! Wie viel war's?"

User: "So 300g mit Beeren"

Agent: "✓ Geloggt: 300g Magerquark + Beeren
        = 36g Protein, 15g Carbs

        Noch 4g Protein heute - quasi geschafft! 🎯"
```

### Feedback-Loop
```
Agent: "War der Reminder hilfreich?"

User: "Ja" / "Nein" / "Zu oft"

Agent passt an:
- "Nein" → Reduziere Frequenz
- "Zu oft" → Schalte diesen Trigger-Typ runter
- "Ja" → Bestätigt Pattern, beibehalten
```

## Definition of Done
- [ ] Alle 5 Trigger-Typen implementiert
- [ ] Personalisierte Empfehlungen basieren auf Favoriten
- [ ] iOS Push Notifications funktionieren
- [ ] User kann Notification-Präferenzen setzen
- [ ] Feedback-Loop passt Frequenz an
- [ ] Quiet Hours werden respektiert
