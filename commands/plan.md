---
description: Create or view training plan with progressive overload
argument-hint: [action] - "new", "view", "next workout", or exercise-specific query
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Training Plan Management

Handle training plan operations.

## Request: $ARGUMENTS

## Actions

### "new" / "create" - Create New Training Plan

1. Ask for plan details if not provided:
   - Split type (torso-limbs, push-pull-legs, full body, etc.)
   - Training days per week
   - Goals (strength, hypertrophy, both)
   - Available equipment

2. Generate plan structure in `data/plans/[plan-name].yaml`

3. Include:
   - Weekly schedule
   - Exercise selection per day
   - Sets, rep ranges, rest periods
   - Progression rules

Use training-intelligence skill for exercise selection and periodization.

### "view" / "show" - View Current Plan

1. Find active plan in `data/plans/`
2. Display:
   - Schedule overview
   - This week's workouts
   - Current progression status

### "next" / "today" / "workout" - Get Next Workout

1. Determine what workout is scheduled today
2. Read recent workout history for each exercise
3. Apply progressive overload algorithm:

For each exercise:
```
1. Find last session data
2. Check performance (reps achieved, RPE)
3. Calculate target weight:
   - Hit top of rep range + RPE ≤ 8 → +2.5kg (barbell) or +2kg (dumbbell)
   - Hit top of rep range + RPE 9 → Maintain
   - Missed reps → Maintain or reduce
4. Set target reps (middle of rep range)
```

4. Output workout card:

```
🏋️ Today's Workout: [Type]

1. EXERCISE NAME
   Target: Xkg × X-X reps × X sets
   (Last: Xkg × X,X,X @ RPE X)
   Rest: X min

2. EXERCISE NAME
   ...

Notes:
- [Any relevant notes]
- [Form cues if needed]
```

### Exercise-specific query

If user asks about specific exercise ("what weight for bench?"):

1. Find that exercise in current plan
2. Look up last session performance
3. Apply progression logic
4. Return specific recommendation

### "adjust" / "modify" - Adjust Plan

If user wants to modify plan:

1. Identify what to change
2. Update plan file
3. Recalculate affected progressions

### "deload" - Plan Deload Week

1. Create deload version of current plan
2. Reduce volume (50% sets) or intensity (60% weight)
3. Schedule for 1 week

## Progressive Overload Logic

Use training-intelligence skill for:
- Double progression calculations
- Periodization decisions
- Plateau detection
- Deload timing

## Response

After any action, confirm:
- What was done
- Current plan status
- Next scheduled workout
