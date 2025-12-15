---
description: Analyze health data for a period or metric
argument-hint: [metric or period] - e.g., "weight last week", "bench progress", "sleep this month"
allowed-tools: Read, Glob, Grep
---

# Health Data Analysis

Analyze health data based on user query.

## Query: $ARGUMENTS

## Analysis Types

### Time-Based Analysis

Keywords: "today", "yesterday", "this week", "last week", "this month", "last 7 days", "last 30 days"

1. Determine date range from query
2. Glob relevant data files in that range
3. Read and aggregate data
4. Calculate statistics (avg, min, max, trend)

### Metric-Based Analysis

Keywords: "weight", "sleep", "calories", "protein", "steps", exercise names

1. Identify target metric
2. Scan all relevant files
3. Extract metric values over time
4. Calculate progression and trends

### Exercise Progress Analysis

If query mentions an exercise name:

1. Search `data/workouts/*.yaml` for exercise
2. Extract weight × reps history
3. Calculate:
   - Volume trend (sets × reps × weight)
   - Max weight progression
   - Rep PRs at various weights
4. Identify plateaus or breakthroughs

### Correlation Analysis

If query asks about relationships:

1. Identify two metrics to correlate
2. Extract paired data points
3. Calculate relationship strength
4. Provide actionable insight

## Output Format

Present analysis with:

1. **Summary** - Key finding in one sentence
2. **Data** - Relevant numbers and trends
3. **Visualization** - ASCII chart if helpful
4. **Insight** - What this means for the user
5. **Recommendation** - Suggested action

## Example Analyses

**"How's my weight trending?"**
→ Pull weight from daily logs, calculate 7-day average, show trend direction

**"Bench press progress"**
→ Find all bench press sets, show max weight over time, identify PRs

**"Sleep quality this month"**
→ Average sleep hours and quality, best/worst nights, patterns

**"Am I eating enough protein?"**
→ Daily protein vs target, compliance percentage, recommendations

Use the health-analytics skill for statistical methods and visualization formats.
