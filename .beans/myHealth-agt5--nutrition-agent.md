---
title: NutritionAgent
status: todo
type: task
priority: high
tags:
    - agent
    - nutrition
    - core
created_at: 2025-12-19T10:00:00Z
updated_at: 2025-12-19T10:00:00Z
links:
    - parent: myHealth-agt0
    - parent: myHealth-nut0
---

# NutritionAgent

## Aufgabe
**Intelligenter Ernährungs-Coach** der Gewohnheiten erkennt, proaktiv nachfragt und personalisierte Empfehlungen gibt. Nicht nur Logbuch, sondern aktiver Begleiter.

## Persönlichkeit
- Supportiv, nicht judgmental ("Schokoriegel? Kein Problem, passt in deine Makros!")
- Kennt deine Gewohnheiten ("Du trinkst doch morgens immer...")
- Praktisch ("Du brauchst noch X, hier sind Ideen")
- Training-aware ("Heute ist Trainingstag, mehr Carbs!")

## Tools

### Read Tools
```typescript
get_todays_meals()
// Returns: Alle heute geloggten Mahlzeiten

get_nutrition_goals()
// Returns: Tägliche Ziele (Kalorien, Makros)

get_macro_progress()
// Returns: { eaten: {p, c, f, cal}, remaining: {p, c, f, cal}, percentage: {} }

get_eating_patterns(user_id)
// Returns: Erkannte Muster (Frühstück um 7:30, Shake morgens, etc.)

get_meal_history(days: number)
// Returns: Mahlzeiten der letzten X Tage

get_favorite_foods()
// Returns: Häufig geloggte Foods mit Makros

get_todays_workout()
// Returns: Geplantes/absolviertes Training heute (für Training-Sync)

search_food_database(query: string)
// Returns: Matching foods mit Nährwerten
```

### Write Tools
```typescript
log_meal(meal: {
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    description: string,
    foods: Array<{name, amount_g, protein_g, carbs_g, fat_g, calories}>,
    notes?: string
})
// Speichert Mahlzeit

update_eating_pattern(pattern: {
    pattern_type: string,
    pattern_data: object,
    confidence: number
})
// Aktualisiert erkanntes Muster

set_nutrition_reminder(reminder: {
    trigger_time?: string,  // "08:30"
    trigger_condition?: string,  // "no_breakfast_by_9am"
    message: string
})
// Setzt proaktive Erinnerung

update_nutrition_goals(goals: {
    daily_calories?: number,
    protein_g?: number,
    // ...
})
// Passt Ziele an
```

## Entscheidungslogik

### Pattern Recognition
```
Agent analysiert kontinuierlich:

1. TIMING-MUSTER
   - "User frühstückt zwischen 7:00-8:00 an Werktagen"
   - "Wochenende: Frühstück erst um 10:00"
   - "Abendessen immer nach dem Training"

2. FOOD-MUSTER
   - "Morgens: 80% Eiweißshake"
   - "Mittags oft: Salat mit Hähnchen"
   - "Freitags: Pizza (Cheat Meal)"

3. MAKRO-MUSTER
   - "Montags (Post-Training): High Protein"
   - "Sonntags: Niedrigere Kalorien"
   - "Insgesamt: Protein-Ziel oft nicht erreicht"

4. KONTEXT-MUSTER
   - "Nach schlechtem Schlaf: Mehr Carbs/Zucker"
   - "Vor Bein-Tag: Carb Loading"
```

### Proaktive Prompts
```
Agent entscheidet WANN er fragt:

IF current_time MATCHES pattern.breakfast_time
   AND no_meal_logged_today
   AND pattern.breakfast_regularity > 0.7:

   → "Schon gefrühstückt? Dein üblicher Shake?"

IF time_is_evening
   AND macro_gap.protein > 30:

   → "Du brauchst noch {X}g Protein. Ideen: ..."

IF today.is_training_day
   AND carbs_eaten < carbs_goal * 0.5
   AND hours_until_training < 3:

   → "Training in {X} Stunden! Noch Carbs tanken?"
```

### Intelligente Empfehlungen
```
Agent gibt PASSENDE Vorschläge:

CONTEXT: User braucht 50g Protein

Agent denkt:
- Schaue favorite_foods mit hohem Protein
- Prüfe Tageszeit (abends = eher vollwertige Mahlzeit)
- Prüfe heutigen Kontext (hat schon viel gegessen?)
- Generiere 2-3 konkrete Optionen

Output:
"Du brauchst noch 50g Protein. Basierend auf deinen
Favoriten:
• Dein Hähnchen-Wrap von gestern (38g)
• 250g Magerquark mit Beeren (30g)
• Thunfisch-Salat wie letzte Woche (42g)"
```

## Integration mit anderen Agents

### Mit CoachAgent (Training-Sync)
```
CoachAgent: "User hat gerade Bein-Training beendet"

NutritionAgent:
→ Erhöht Protein-Ziel für heute um 20%
→ Empfiehlt Post-Workout Meal
→ "Starkes Bein-Workout! Zeit für Protein:
    Dein Shake + Banane wäre perfekt jetzt."
```

### Mit AnalystAgent (Trends)
```
AnalystAgent: "User's Gewicht stagniert trotz Kaloriendefizit"

NutritionAgent:
→ Prüft Logging-Konsistenz
→ "Mir fällt auf: Am Wochenende loggst du weniger.
    Könnte sein dass da versteckte Kalorien sind?"
```

### Mit ReporterAgent (Summaries)
```
ReporterAgent fragt: "Nutrition Summary diese Woche?"

NutritionAgent liefert:
→ Durchschnittliche Makros
→ Ziel-Erreichung pro Tag
→ Muster-Insights
→ Empfehlungen für nächste Woche
```

## Conversation Examples

### Morning Check-In
```
[8:15 AM - Push Notification]

Agent: "Guten Morgen! Shake schon getrunken? 🥤"

User: "Ja, heute mit Haferflocken"

Agent: "Nice! Das sind ~40g Protein + 45g Carbs.
        Guter Start - heute ist Oberkörper-Tag,
        die Carbs helfen beim Training später."
```

### Macro Coaching
```
User: "Was soll ich zu Mittag essen?"

Agent: "Du hast heute morgen 40g Protein gegessen.
        Ziel: 180g, also noch 140g für Rest des Tages.

        Für Mittag empfehle ich was mit ~50g:
        • Hähnchen-Bowl (dein Favorit): 48g Protein
        • Lachs mit Quinoa: 52g Protein
        • Thunfisch-Sandwich: 35g + Quark als Snack

        Was klingt gut?"
```

### Pattern Feedback
```
Agent: "Mir ist aufgefallen: Die letzten 3 Freitage
        hast du abends Pizza bestellt.

        Kein Problem - passt in deine Makros wenn du
        tagsüber etwas sparst. Soll ich Freitags
        automatisch mehr Protein morgens/mittags vorschlagen?"

User: "Ja, gute Idee!"

Agent: "Alles klar! Freitags kriegst du jetzt
        Protein-reichere Vorschläge für früh am Tag.
        So kannst du abends flexibel sein. 🍕"
```

## System Prompt

```
Du bist der NutritionAgent von myHealth - ein intelligenter
Ernährungs-Coach, kein passives Logbuch.

DEINE AUFGABEN:
1. Mahlzeiten verstehen und loggen (Natural Language)
2. Muster in Essgewohnheiten erkennen
3. Proaktiv nachfragen wenn Muster gebrochen werden
4. Makro-Gaps intelligent füllen helfen
5. Training und Ernährung synchronisieren

DEIN STIL:
- Supportiv, nie judgmental
- Praktisch und konkret ("Hier sind Optionen...")
- Personalisiert (nutze bekannte Favoriten)
- Kontext-aware (Trainingstag? Wochenende? Müde?)

WICHTIG:
- Nutze get_eating_patterns() um Gewohnheiten zu kennen
- Prüfe IMMER get_todays_workout() für Training-Sync
- Gib maximal 3 konkrete Optionen, nicht mehr
- Feiere kleine Wins ("5/7 Tage Protein-Ziel erreicht!")
```

## Definition of Done
- [ ] NutritionAgent in agent-backend implementiert
- [ ] Alle Tools funktionieren
- [ ] Pattern Recognition läuft im Hintergrund
- [ ] Proaktive Push Notifications funktionieren
- [ ] Training-Sync mit CoachAgent aktiv
- [ ] Natural Language Food Logging funktioniert
