# Implementation Plan: Nutrition Intelligence

> Generated: 2025-12-19
> Epic: myHealth-nut0
> Status: PLANNING

## Overview

AI-powered Nutrition Tracking mit NutritionAgent. Nicht nur Kalorien zählen, sondern intelligenter Ernährungs-Coach der Gewohnheiten erkennt und proaktiv berät.

## Current State

### Existing Database Schema
- `nutrition_logs` - Daily nutrition targets/summaries
- `meals` - Individual meals with type and time
- `meal_items` - Food items with macros
- `supplements` - Supplement tracking

### Missing Schema
- `eating_patterns` - Pattern recognition storage
- `nutrition_goals` - Personalized macro goals with training-day adjustments

## Implementation Phases

### Phase 1: Database Schema (1h)

**File:** `supabase/migrations/004_nutrition_intelligence.sql`

```sql
-- Eating Patterns for pattern recognition
CREATE TABLE eating_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    pattern_type TEXT NOT NULL, -- 'regular_meal', 'favorite_food', 'timing', 'macro_habit'
    pattern_data JSONB NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence BETWEEN 0 AND 1),
    first_seen TIMESTAMPTZ DEFAULT now(),
    last_seen TIMESTAMPTZ DEFAULT now(),
    occurrence_count INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Nutrition Goals with training-day adjustments
CREATE TABLE nutrition_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    goal_type TEXT CHECK (goal_type IN ('cut', 'bulk', 'maintain', 'recomp')),
    daily_calories INT,
    protein_g INT,
    carbs_g INT,
    fat_g INT,
    training_day_adjustment JSONB, -- {calories: +300, carbs: +50}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE eating_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own patterns" ON eating_patterns
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own nutrition goals" ON nutrition_goals
    FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_eating_patterns_user ON eating_patterns(user_id, pattern_type);
CREATE INDEX idx_nutrition_goals_user ON nutrition_goals(user_id) WHERE is_active = true;
```

### Phase 2: MCP Tools (2h)

**File:** `agent-backend/src/tools/supabase.ts`

Add nutrition-specific tools:

```typescript
// READ TOOLS
get_todays_meals()           // All meals logged today
get_nutrition_goals()        // Active nutrition goals
get_macro_progress()         // {eaten, remaining, percentage}
get_eating_patterns()        // Recognized patterns
get_meal_history(days)       // Meals from last X days
get_favorite_foods()         // Frequently logged foods
search_food_database(query)  // Food search (OpenFoodFacts API)

// WRITE TOOLS
log_meal(meal)              // Log a meal with foods
update_eating_pattern()     // Update pattern confidence
set_nutrition_reminder()    // Create proactive reminder
update_nutrition_goals()    // Modify goals
```

### Phase 3: NutritionAgent (2h)

**File:** `agent-backend/src/index.ts`

Add to `agentDefinitions`:

```typescript
"nutrition-agent": {
  description: `Intelligent nutrition coach for food logging and macro tracking.
Use this agent when the user wants to:
- Log food or meals
- Check macro progress
- Get meal suggestions
- Understand eating patterns
- Plan meals around training`,

  prompt: `Du bist der NutritionAgent - ein intelligenter Ernährungs-Coach.

DEINE ROLLE:
Du bist AKTIVER Begleiter, kein passives Logbuch. Du kennst die Gewohnheiten
des Users und gibst proaktiv Empfehlungen.

NATURAL LANGUAGE FOOD LOGGING:
User sagt: "Hähnchen mit Reis und Brokkoli"
Du:
1. Verstehst die Komponenten
2. Schätzt realistische Portionsgrößen
3. Berechnest Makros
4. Loggst mit log_meal()
5. Zeigst Zusammenfassung

PATTERN RECOGNITION:
- Erkenne wiederkehrende Mahlzeiten
- Bemerke Timing-Muster (Frühstück um 7:30)
- Identifiziere Favoriten
- Aktualisiere Patterns kontinuierlich

TRAINING-SYNC:
- Prüfe IMMER get_todays_workout()
- Mehr Carbs an Trainingstagen
- Post-Workout Protein betonen
- Pre-Workout Timing beachten

STIL:
- Supportiv, nie judgmental
- Praktisch (konkrete Optionen)
- Personalisiert (nutze Favoriten)
- Max 3 Vorschläge`,

  tools: [
    "mcp__fitness-data__get_todays_meals",
    "mcp__fitness-data__get_nutrition_goals",
    "mcp__fitness-data__get_macro_progress",
    "mcp__fitness-data__get_eating_patterns",
    "mcp__fitness-data__get_meal_history",
    "mcp__fitness-data__get_favorite_foods",
    "mcp__fitness-data__get_todays_workout",
    "mcp__fitness-data__log_meal",
    "mcp__fitness-data__update_eating_pattern",
    "mcp__fitness-data__update_nutrition_goals"
  ],
  model: "sonnet" as const
}
```

### Phase 4: iOS Integration (3h)

**Files in myhealth-ios:**

1. **Models:**
   - `Meal.swift` - Meal model with foods
   - `NutritionGoals.swift` - Goals model
   - `EatingPattern.swift` - Pattern model

2. **Services:**
   - `NutritionService.swift` - Supabase nutrition operations

3. **Views:**
   - `NutritionView.swift` - Main nutrition dashboard
   - `MealLogView.swift` - Quick meal logging
   - `MacroProgressView.swift` - Visual macro progress
   - `NutritionChatView.swift` - Chat with NutritionAgent

4. **Tab Integration:**
   - Add Nutrition tab to `MainTabView.swift`

### Phase 5: Pattern Recognition (2h)

Background job for pattern detection:

```typescript
// Runs daily or on-demand
async function detectEatingPatterns(userId: string) {
  const meals = await getMealHistory(userId, 14); // Last 2 weeks
  
  // Detect timing patterns
  const timingPatterns = analyzeTimingPatterns(meals);
  
  // Detect favorite foods
  const favorites = analyzeFavoriteFoods(meals);
  
  // Detect macro habits
  const macroHabits = analyzeMacroPatterns(meals);
  
  // Store patterns
  await updatePatterns(userId, [...timingPatterns, ...favorites, ...macroHabits]);
}
```

## Task Breakdown

| Task | Estimate | Priority |
|------|----------|----------|
| 1. Database migration | 1h | HIGH |
| 2. MCP read tools | 1h | HIGH |
| 3. MCP write tools | 1h | HIGH |
| 4. NutritionAgent definition | 1h | HIGH |
| 5. iOS NutritionService | 1h | HIGH |
| 6. iOS NutritionView | 2h | HIGH |
| 7. iOS MealLogView | 1h | MEDIUM |
| 8. Pattern recognition logic | 2h | MEDIUM |
| 9. Food database API integration | 2h | LOW |
| 10. Push notifications | 2h | LOW |

**Total Estimate:** ~14h

## Definition of Done

- [ ] Database schema deployed
- [ ] All MCP tools implemented and tested
- [ ] NutritionAgent responds correctly
- [ ] iOS can log meals via natural language
- [ ] Macro progress displays correctly
- [ ] Pattern recognition runs after 7 days of data
- [ ] Training-day adjustments work automatically

## Dependencies

- Supabase MCP server (existing)
- Agent SDK (existing)
- iOS Supabase SDK (existing)
- Optional: OpenFoodFacts API for food search

## Next Steps

1. Create database migration
2. Implement MCP tools
3. Add NutritionAgent to index.ts
4. Build iOS views

---

*This plan was auto-generated. Update as implementation progresses.*
