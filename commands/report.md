---
description: Generate health report (daily, weekly, monthly, or custom)
argument-hint: [period] - daily, weekly, monthly, or custom dates
allowed-tools: Read, Glob, Grep
---

# Health Report Generation

Generate comprehensive health report for specified period.

## Period: $ARGUMENTS

Interpret period:
- **daily** / **today** → Current day
- **weekly** / **this week** → Current week (Mon-Sun)
- **monthly** / **this month** → Current month
- **last week** / **last month** → Previous period
- **YYYY-MM-DD to YYYY-MM-DD** → Custom range

## Data Collection

Read all relevant data files for the period:

1. `data/daily/YYYY-MM-DD.yaml` - Weight, sleep, mood, steps
2. `data/workouts/YYYY-MM-DD-*.yaml` - Training sessions
3. `data/nutrition/YYYY-MM-DD.yaml` - Calories and macros
4. `data/vitals/YYYY-MM-DD.yaml` - Vital measurements

## Report Sections

### Daily Report

```
📅 Daily Report - [Date]

VITALS
  Weight: X kg (Δ from yesterday)
  Sleep: Xh, Quality: X/5
  Steps: X / 10,000
  Water: X L

TRAINING
  [✓/✗] Workout completed
  Type: [torso/limbs/rest]
  Highlights: PRs, notable sets

NUTRITION
  Calories: X / target
  Protein: Xg / target
  Compliance: [Good/Needs attention]

SUBJECTIVE
  Mood: X/5
  Energy: X/5
  Notes: [Any notes from the day]
```

### Weekly Report

```
📊 Weekly Report - Week X, YYYY

OVERVIEW
  Training Days: X/X
  Avg Calories: X
  Avg Sleep: Xh
  Weight Change: ±X kg

TRAINING SUMMARY
  Total Volume: X kg
  vs Last Week: ±X%
  PRs: [List any]

NUTRITION SUMMARY
  Avg Protein: Xg
  Target Compliance: X%

TRENDS
  [ASCII weight chart]

HIGHLIGHTS & AREAS TO IMPROVE
  ✓ [Wins]
  ! [Areas needing attention]
```

### Monthly Report

```
📈 Monthly Progress - [Month YYYY]

BODY COMPOSITION
  Start Weight: X kg
  End Weight: X kg
  Change: ±X kg
  [Weekly weight chart]

STRENGTH PROGRESS
  [Exercise]: X → X kg (+X%)
  [Exercise]: X → X kg (+X%)

NUTRITION
  Avg Daily Calories: X
  Protein Target Hit: X% of days

TRAINING
  Sessions Completed: X/X
  Consistency: X%

CORRELATIONS & INSIGHTS
  [Discovered patterns]

NEXT MONTH FOCUS
  [Recommendations]
```

## Formatting

- Use emoji sparingly for visual hierarchy
- Include ASCII charts for trends
- Bold key numbers
- Use ✓ and ✗ for status indicators

Use the health-analytics skill for calculations and visualization formats.
