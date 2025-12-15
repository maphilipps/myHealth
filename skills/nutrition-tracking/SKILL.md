---
name: Nutrition Tracking
description: This skill should be used when the user asks about "calories", "macros", "protein", "meal tracking", "what should I eat", "nutrition analysis", "log a meal", "Yazio", or needs help with dietary tracking and analysis. Provides nutrition logging, macro calculations, and dietary recommendations.
version: 0.1.0
---

# Nutrition Tracking

## Purpose

Enable comprehensive nutrition tracking with macro analysis, meal logging, and dietary recommendations. Integrates with Yazio exports and supports manual entry for complete nutrition oversight.

## Macro Fundamentals

### Daily Targets Calculation

To calculate daily macro targets:

**Step 1: Calculate TDEE (Total Daily Energy Expenditure)**

```
BMR (Mifflin-St Jeor):
  Men: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
  Women: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161

Activity Multipliers:
  Sedentary (desk job): BMR × 1.2
  Lightly active (1-3 days/week): BMR × 1.375
  Moderately active (3-5 days/week): BMR × 1.55
  Very active (6-7 days/week): BMR × 1.725
  Athlete (2× daily): BMR × 1.9
```

**Step 2: Adjust for Goal**

| Goal | Calorie Adjustment |
|------|-------------------|
| Fat Loss (moderate) | TDEE - 500 |
| Fat Loss (aggressive) | TDEE - 750 |
| Maintenance | TDEE |
| Muscle Gain (lean) | TDEE + 250 |
| Muscle Gain (bulk) | TDEE + 500 |

**Step 3: Calculate Macros**

| Macro | Recommendation | Calories/gram |
|-------|---------------|---------------|
| Protein | 1.6-2.2g per kg bodyweight | 4 |
| Fat | 0.8-1.2g per kg bodyweight | 9 |
| Carbs | Remaining calories | 4 |

### Example Calculation

```
Marc: 82.5kg, 180cm, 35 years, moderately active, maintenance

BMR = (10 × 82.5) + (6.25 × 180) - (5 × 35) + 5 = 1785
TDEE = 1785 × 1.55 = 2767 kcal

Macros:
  Protein: 82.5 × 2.0 = 165g (660 kcal)
  Fat: 82.5 × 1.0 = 82g (738 kcal)
  Carbs: (2767 - 660 - 738) / 4 = 342g

Daily Targets:
  Calories: 2767
  Protein: 165g
  Fat: 82g
  Carbs: 342g
```

## Meal Logging

### Quick Log Format

For fast meal entry:

```
"Log lunch: Chicken breast 200g, rice 150g, broccoli 100g"
```

Parse and create/update `data/nutrition/YYYY-MM-DD.yaml`:

```yaml
meals:
  - time: "12:30"  # current time or specified
    type: lunch
    items:
      - name: Chicken breast
        amount: "200g"
        calories: 330
        protein_g: 62
        carbs_g: 0
        fat_g: 7
      - name: White rice
        amount: "150g cooked"
        calories: 195
        protein_g: 4
        carbs_g: 43
        fat_g: 0
      - name: Broccoli
        amount: "100g"
        calories: 34
        protein_g: 3
        carbs_g: 7
        fat_g: 0
```

### Common Foods Quick Reference

| Food | Serving | Calories | Protein | Carbs | Fat |
|------|---------|----------|---------|-------|-----|
| Chicken breast | 100g | 165 | 31g | 0g | 3.5g |
| Salmon | 100g | 208 | 20g | 0g | 13g |
| Eggs | 1 large | 78 | 6g | 0.6g | 5g |
| Oatmeal | 100g dry | 389 | 17g | 66g | 7g |
| Rice (white, cooked) | 100g | 130 | 2.7g | 28g | 0.3g |
| Banana | 1 medium | 105 | 1.3g | 27g | 0.4g |
| Greek yogurt | 100g | 97 | 9g | 4g | 5g |
| Almonds | 30g | 173 | 6g | 6g | 15g |
| Olive oil | 1 tbsp | 119 | 0g | 0g | 13.5g |
| Protein shake | 1 scoop | 120 | 24g | 3g | 1g |

## Daily Summary

Generate end-of-day nutrition summary:

```
📊 Nutrition Summary - 2024-01-15

Calories: 2543 / 2767 (92%)
━━━━━━━━━━━━━━━━━━░░

Protein: 178g / 165g (108%) ✓
━━━━━━━━━━━━━━━━━━━━

Carbs: 298g / 342g (87%)
━━━━━━━━━━━━━━━━━░░░

Fat: 74g / 82g (90%)
━━━━━━━━━━━━━━━━━━░░

Meals: 4
Water: 2.5L / 3L

Notes:
- Protein target exceeded ✓
- Slight calorie deficit (good for cut)
- Consider adding healthy fats tomorrow
```

## Yazio Integration

### Import Process

Yazio exports nutrition data as CSV. Import process:

1. Export from Yazio (Settings → Export → CSV)
2. Run `/myhealth:import yazio /path/to/export.csv`
3. Data parsed and merged into `data/nutrition/`

### Yazio Field Mapping

| Yazio Field | myHealth Field |
|-------------|---------------|
| Date | date |
| Meal | meals[].type |
| Food Name | meals[].items[].name |
| Energy (kcal) | calories |
| Protein (g) | protein_g |
| Carbohydrates (g) | carbs_g |
| Fat (g) | fat_g |
| Fiber (g) | fiber_g |

## Meal Planning

### Pre-Workout Nutrition

**2-3 hours before**: Full meal
- Moderate protein (20-30g)
- Complex carbs (40-60g)
- Low fat (for faster digestion)

**30-60 min before**: Light snack
- Simple carbs (banana, rice cake)
- Small protein if hungry

### Post-Workout Nutrition

**Within 1 hour**:
- Protein: 30-40g (shake or meal)
- Carbs: 40-80g (replenish glycogen)
- Timing less critical than daily totals

### Meal Frequency

No magic number - personal preference:
- 3 meals + 2 snacks (traditional)
- 4-5 smaller meals (bodybuilding style)
- 2-3 larger meals (intermittent fasting compatible)

Key: Hit daily macro targets consistently.

## Analysis Commands

### Current Day Status

"How are my macros today?"
→ Sum all meals, compare to targets, show remaining

### Weekly Average

"Nutrition this week?"
→ Average daily calories/macros, identify patterns

### Protein Distribution

"Am I getting enough protein?"
→ Check daily intake, distribution across meals

## Dietary Adjustments

### For Fat Loss

```
Calorie Reduction Strategy:
1. Start: TDEE - 300-500
2. If plateau after 2 weeks: Reduce another 100-200
3. Minimum: BMR (never go below)
4. Protein: Keep at 2.0-2.2g/kg (preserve muscle)
5. Reduce carbs/fats proportionally
```

### For Muscle Gain

```
Calorie Surplus Strategy:
1. Start: TDEE + 200-300 (lean bulk)
2. If not gaining: Add 100-200 weekly
3. Protein: 1.6-2.0g/kg sufficient
4. Extra calories from carbs (training fuel)
5. Monitor: Aim for 0.25-0.5kg/week gain
```

## Supplements Tracking

Track supplements in daily nutrition:

```yaml
supplements:
  - name: Creatine Monohydrate
    amount: "5g"
    timing: post-workout
  - name: Vitamin D3
    amount: "4000 IU"
    timing: morning
  - name: Omega-3
    amount: "2g EPA/DHA"
    timing: with meals
  - name: Magnesium
    amount: "400mg"
    timing: evening
```

### Evidence-Based Supplements

| Supplement | Benefit | Dose |
|------------|---------|------|
| Creatine | Strength, recovery | 3-5g daily |
| Vitamin D | Hormone, immunity | 2000-4000 IU |
| Omega-3 | Inflammation, heart | 1-3g EPA+DHA |
| Magnesium | Sleep, recovery | 300-400mg |
| Protein powder | Convenience | As needed for targets |

## Additional Resources

### Reference Files

- **`references/food-database.md`** - Extended food nutrition database
- **`references/meal-templates.md`** - Pre-built meal ideas by goal
- **`references/yazio-import-guide.md`** - Detailed Yazio import instructions

### Example Files

- **`examples/nutrition-day-cut.yaml`** - Sample cutting day
- **`examples/nutrition-day-bulk.yaml`** - Sample bulking day
