---
name: Health Analytics
description: This skill should be used when the user asks for "health report", "weekly summary", "trends", "progress", "correlations", "how am I doing", "analyze my data", "compare periods", or wants insights from their health data. Provides comprehensive health data analysis, trend detection, and actionable insights.
version: 0.1.0
---

# Health Analytics

## Purpose

Transform raw health data into actionable insights through trend analysis, correlation detection, and comprehensive reporting. Enable data-driven health decisions by surfacing patterns across workouts, nutrition, vitals, and lifestyle factors.

## Data Analysis Approach

### Data Sources

All analysis draws from YAML files in `data/`:

```
data/
├── daily/      → Weight, sleep, mood, steps, water
├── workouts/   → Training volume, PRs, exercise performance
├── nutrition/  → Calories, macros, meal patterns
├── vitals/     → Heart rate, blood pressure, HRV
└── plans/      → Training goals and targets
```

### Time Periods

Standard analysis periods:

| Period | Use Case |
|--------|----------|
| Daily | Current status, today vs targets |
| Weekly | Short-term trends, weekly summary |
| Monthly | Progress assessment, macro trends |
| Quarterly | Long-term progress, goal evaluation |
| Custom | Specific date range comparison |

## Report Generation

### Daily Status Report

Quick overview of today:

```
📅 Daily Status - 2024-01-15

VITALS
  Weight: 82.5 kg (↓0.3 from yesterday)
  Sleep: 7.5h, Quality: 4/5
  Steps: 8,432 (Goal: 10,000)
  Water: 2.5L (Goal: 3L)

TRAINING
  ✓ Torso workout completed
  Duration: 75 min
  PRs: Bench Press 82.5kg × 8 🎉

NUTRITION
  Calories: 2,543 / 2,767 (92%)
  Protein: 178g / 165g ✓
  Compliance: Good

MOOD & ENERGY
  Mood: 4/5, Energy: 4/5
  Notes: "Felt great, good workout"
```

### Weekly Summary Report

```
📊 Weekly Summary - Week 3, 2024

OVERVIEW
  Training Days: 4/4 ✓
  Avg Calories: 2,612 (target: 2,767)
  Avg Protein: 172g (target: 165g) ✓
  Avg Sleep: 7.2h

WEIGHT TREND
  Start: 83.1 kg
  End: 82.5 kg
  Change: -0.6 kg

  Mon ████████████████████░░░ 83.1
  Wed ███████████████████░░░░ 82.8
  Fri ██████████████████░░░░░ 82.5

TRAINING HIGHLIGHTS
  Total Volume: 45,230 kg
  vs Last Week: +8%

  PRs This Week:
  • Bench Press: 82.5kg × 8 (+2.5kg)
  • Squat: 100kg × 8 (+5kg)

AREAS FOR IMPROVEMENT
  • Sleep consistency (range: 6h-8.5h)
  • Water intake below target 4/7 days
  • Consider adding more vegetables

NEXT WEEK FOCUS
  • Maintain calorie deficit
  • Push for Deadlift PR
  • Improve sleep schedule
```

### Monthly Progress Report

```
📈 Monthly Progress - January 2024

BODY COMPOSITION
  Weight: 84.2 → 82.5 kg (-1.7 kg)
  Trend: Consistent loss, on track

  Week 1: ████████████████████████ 84.2
  Week 2: ██████████████████████░░ 83.5
  Week 3: ████████████████████░░░░ 83.1
  Week 4: ██████████████████░░░░░░ 82.5

STRENGTH PROGRESS
  Bench Press: 77.5 → 82.5 kg (+5 kg, +6.5%)
  Squat: 90 → 100 kg (+10 kg, +11%)
  Deadlift: 100 → 110 kg (+10 kg, +10%)
  OHP: 50 → 52.5 kg (+2.5 kg, +5%)

NUTRITION COMPLIANCE
  Calorie Target: 85% days within ±10%
  Protein Target: 92% days met
  Best Day: Jan 15 (perfect macros)
  Worst Day: Jan 22 (restaurant, +800 kcal)

TRAINING CONSISTENCY
  Planned Sessions: 16
  Completed Sessions: 15
  Completion Rate: 94%
  Missed: Jan 28 (sick day)

CORRELATIONS DISCOVERED
  • Better sleep (>7h) → Better workout performance
  • High protein days → Lower hunger reported
  • Stress level inversely correlates with sleep quality

NEXT MONTH GOALS
  1. Reach 81 kg
  2. Bench Press 85 kg × 8
  3. Improve sleep consistency
```

## Trend Analysis

### Weight Trend Calculation

```
To calculate weight trend:
1. Collect last 7-14 days of weight data
2. Calculate moving average (smooths daily fluctuations)
3. Apply linear regression for trend line
4. Express as weekly change rate

Example:
  Raw data: 83.2, 83.5, 82.9, 83.1, 82.8, 82.5, 82.6
  7-day avg: 82.94 kg
  Trend: -0.4 kg/week
  Projection: 81.7 kg in 3 weeks
```

### Workout Volume Tracking

```
Volume = Sets × Reps × Weight

Weekly volume per muscle group:
  Chest: 15 sets × avg 10 reps × avg 75kg = 11,250 kg
  Back: 15 sets × avg 10 reps × avg 70kg = 10,500 kg
  Legs: 12 sets × avg 8 reps × avg 90kg = 8,640 kg

Total weekly volume trend:
  Week 1: 42,000 kg
  Week 2: 44,500 kg (+6%)
  Week 3: 45,230 kg (+2%)
```

### Sleep Pattern Analysis

```
Sleep Metrics:
  Average duration: 7.2h
  Quality average: 3.8/5
  Best night: Friday (8.5h, quality 5)
  Worst night: Monday (6h, quality 2)

Pattern: Sleep debt accumulates Mon-Thu, recovered weekend
Recommendation: Aim for consistent 7.5h schedule
```

## Correlation Detection

### Analyzed Correlations

| Factor A | Factor B | Correlation | Insight |
|----------|----------|-------------|---------|
| Sleep hours | Workout RPE | Negative | More sleep → Lower perceived effort |
| Protein intake | Hunger level | Negative | More protein → Less hunger |
| Stress level | Sleep quality | Negative | High stress → Poor sleep |
| Steps | Mood | Positive | More activity → Better mood |
| Water intake | Energy level | Positive | Hydration → Energy |
| Training volume | Next day fatigue | Positive | Expected relationship |

### Correlation Analysis Process

```
To find correlations:
1. Collect data pairs (e.g., sleep hours + workout RPE)
2. Normalize both variables
3. Calculate Pearson correlation coefficient
4. Filter for |r| > 0.3 (meaningful correlation)
5. Validate with domain knowledge
6. Present actionable insights
```

## Data Queries

### Common Analysis Questions

**"How am I progressing on [exercise]?"**
→ Pull all sessions with that exercise, plot weight/reps over time

**"What's my calorie average this week?"**
→ Sum daily totals, divide by days with data

**"When do I sleep best?"**
→ Correlate sleep quality with day of week, preceding activities

**"Am I overtraining?"**
→ Check: RPE trending up? Recovery declining? Performance plateau?

### Query Implementation

Read and parse YAML files:

```bash
# Find all bench press data
grep -A 10 "Bench Press" data/workouts/*.yaml

# Sum calories for date range
for f in data/nutrition/2024-01-*.yaml; do
  grep "calories:" "$f" | head -1
done
```

For complex queries, parse YAML and aggregate in Python script.

## Insights Engine

### Automatic Insights

Generate insights by detecting:

1. **PRs and Achievements**
   - New weight PR for exercise
   - Streak achievements (7 days logging)
   - Target hit (weight goal, macro consistency)

2. **Warnings**
   - Sleep deficit accumulating
   - Calorie significantly over/under
   - Missed training sessions
   - High stress + poor recovery combination

3. **Recommendations**
   - "Consider deload week" (high fatigue detected)
   - "Increase protein on training days"
   - "Sleep earlier on weekdays"

### Insight Priority

| Priority | Type | Example |
|----------|------|---------|
| High | Health risk | "BP elevated 3 days in a row" |
| Medium | Performance | "Strength plateau detected" |
| Low | Optimization | "Consider more vegetables" |

## Visualization Concepts

### ASCII Charts for Terminal

Weight trend:
```
82.5 ┤                              ╭─
83.0 ┤                         ╭────╯
83.5 ┤                   ╭─────╯
84.0 ┤         ╭─────────╯
84.5 ┤─────────╯
     └─────────────────────────────────
       W1    W2    W3    W4    W5
```

Macro distribution:
```
Protein ████████████████████ 35%
Carbs   ████████████████████████████ 49%
Fat     █████████ 16%
```

## Report Scheduling

### Automated Report Triggers

| Trigger | Report Type |
|---------|-------------|
| End of day | Daily summary (if data exists) |
| Sunday evening | Weekly summary |
| 1st of month | Monthly progress |
| Session complete | Workout summary |

### Manual Report Commands

```
/myhealth:report daily
/myhealth:report weekly
/myhealth:report monthly
/myhealth:report custom 2024-01-01 2024-01-31
/myhealth:report exercise "Bench Press"
```

## Additional Resources

### Reference Files

- **`references/statistics-formulas.md`** - Statistical calculations explained
- **`references/insight-rules.md`** - Rules engine for automatic insights
- **`references/visualization-templates.md`** - ASCII chart templates

### Example Files

- **`examples/weekly-report.md`** - Sample weekly report output
- **`examples/correlation-analysis.md`** - Sample correlation analysis
