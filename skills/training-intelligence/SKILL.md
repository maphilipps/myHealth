---
name: Training Intelligence
description: This skill should be used when the user asks about "progressive overload", "training plan", "workout planning", "what weight should I use", "increase my weights", "torso limbs split", "periodization", "deload", or wants to optimize their training. Provides intelligent workout coaching, progressive overload algorithms, and training plan management.
version: 0.1.0
---

# Training Intelligence

## Purpose

Provide intelligent workout coaching with automatic progressive overload calculations, training plan management, and performance-based recommendations. Replace Fitbod functionality with smarter, personalized training guidance.

## Progressive Overload Philosophy

Progressive overload is the gradual increase of stress placed on the body during training. The intelligent approach adapts based on individual performance rather than rigid rules.

### Intelligent Progression Algorithm

```
FOR each exercise:
  1. Analyze last 3-4 sessions
  2. Check if target rep range achieved consistently
  3. Evaluate RPE trends (getting easier = time to progress)
  4. Consider fatigue indicators
  5. Calculate appropriate adjustment
```

### Progression Decision Matrix

| Last Session | RPE Trend | Recommendation |
|--------------|-----------|----------------|
| Hit top of rep range | Decreasing (<8) | Increase weight |
| Hit top of rep range | Stable (8) | Increase weight slightly |
| Hit top of rep range | High (9-10) | Maintain, focus on form |
| Mid rep range | Decreasing | Add 1 rep next session |
| Mid rep range | Stable | Maintain current |
| Mid rep range | High | Reduce weight slightly |
| Missed reps | Any | Maintain or reduce |

### Weight Increments

| Equipment Type | Standard Increment | Micro Increment |
|----------------|-------------------|-----------------|
| Barbell | 2.5 kg | 1.25 kg |
| Dumbbell | 2 kg | 1 kg |
| Cable/Machine | 2.5-5 kg | Depends on stack |
| Bodyweight | Add reps first | Then add weight |

## Calculating Next Session Weights

To determine weights for next workout:

1. **Read last workout** for the exercise
2. **Check performance**:
   - All sets at top of rep range + RPE ≤ 8 → Increase weight
   - Most sets hit target + RPE 8-9 → Maintain, try +1 rep
   - Struggled or missed reps → Maintain or reduce
3. **Apply increment** based on equipment type
4. **Consider weekly volume** - don't increase if already high fatigue

### Example Calculation

```
Last session: Bench Press
  Set 1: 80kg × 10 reps, RPE 8
  Set 2: 80kg × 9 reps, RPE 9
  Set 3: 80kg × 8 reps, RPE 9

Analysis:
  - Rep range target: 6-10
  - Hit top of range on set 1
  - RPE trending up (fatigue)

Recommendation:
  - Next session: Try 82.5kg
  - Target: 6-8 reps
  - If fail to hit 6, drop back to 80kg
```

## Torso-Limbs Split

Marc's preferred training split alternating upper and lower body:

### Schedule Pattern

```
Week Structure:
  Mon: Torso (chest, back, shoulders)
  Tue: Limbs (legs, biceps, triceps)
  Wed: Rest
  Thu: Torso
  Fri: Limbs
  Sat: Rest (or optional cardio)
  Sun: Rest
```

### Torso Day Template

| Order | Exercise | Sets | Rep Range | Rest |
|-------|----------|------|-----------|------|
| 1 | Bench Press (or variation) | 3-4 | 6-10 | 2-3 min |
| 2 | Row (barbell or cable) | 3-4 | 8-12 | 2 min |
| 3 | Overhead Press | 3 | 8-12 | 2 min |
| 4 | Lat Pulldown / Pull-up | 3 | 8-12 | 90 sec |
| 5 | Chest Fly (cable or machine) | 3 | 10-15 | 60 sec |
| 6 | Face Pull / Rear Delt | 3 | 12-15 | 60 sec |

### Limbs Day Template

| Order | Exercise | Sets | Rep Range | Rest |
|-------|----------|------|-----------|------|
| 1 | Squat (or Leg Press) | 3-4 | 6-10 | 3 min |
| 2 | Romanian Deadlift | 3 | 8-12 | 2-3 min |
| 3 | Leg Extension | 3 | 10-15 | 90 sec |
| 4 | Leg Curl | 3 | 10-15 | 90 sec |
| 5 | Barbell Curl | 3 | 8-12 | 60 sec |
| 6 | Tricep Pushdown | 3 | 10-15 | 60 sec |

## Workout Preparation from Screenshot/Text

When user shares screenshot or describes last workout:

1. **Extract exercise names and weights**
2. **Look up exercise in library** (`data/exercises/`)
3. **Find last logged session** for each exercise
4. **Calculate progression** using algorithm above
5. **Output clear workout card**:

```
Today's Workout: Torso

1. BENCH PRESS
   Target: 82.5kg × 6-8 reps × 3 sets
   (Last: 80kg × 10,9,8 @ RPE 8-9)
   Rest: 2-3 min

2. BENT OVER ROW
   Target: 70kg × 8-10 reps × 3 sets
   (Last: 70kg × 10,10,9 @ RPE 8)
   Rest: 2 min

[...]
```

## Periodization

### Linear Periodization (Beginners)

Steady progression each week:
- Week 1-4: Moderate weight, higher reps (10-12)
- Week 5-8: Increase weight, lower reps (8-10)
- Week 9-12: Heavy weight, low reps (6-8)

### Undulating Periodization (Intermediate+)

Vary intensity within the week:
- Day 1: Heavy (6-8 reps)
- Day 2: Moderate (8-12 reps)
- Day 3: Light/Volume (12-15 reps)

### Deload Protocol

Every 4-6 weeks or when:
- RPE consistently 9-10
- Sleep/recovery declining
- Motivation dropping
- Plateau for 2+ weeks

Deload options:
- **Volume deload**: Same weight, 50% fewer sets
- **Intensity deload**: Same sets/reps, 60% weight
- **Full rest**: 3-5 days off, light activity only

## Training Log Analysis

To analyze training history:

```bash
# Find all workouts for an exercise
grep -l "Bench Press" data/workouts/*.yaml

# Get progression over time
# Parse weight/reps from each file
```

### Key Metrics to Track

| Metric | Calculation | Goal |
|--------|-------------|------|
| Volume (sets × reps × weight) | Sum per exercise/week | Gradual increase |
| Intensity (avg weight) | Average across sets | Progressive increase |
| Frequency | Sessions per muscle/week | 2× optimal |
| RPE average | Mean RPE per session | 7-8 sustainable |

## Handling Plateaus

When progress stalls for 2+ weeks:

1. **Check recovery**: Sleep, nutrition, stress
2. **Vary rep ranges**: If stuck at 8 reps, try 5×5
3. **Change exercise variation**: Incline instead of flat
4. **Add volume**: Extra set or accessory
5. **Take deload**: Reset and rebuild

## Workout Flow Commands

### Before Workout

"What weight should I use for [exercise]?"
→ Look up history, calculate progression, show target

"Plan my [torso/limbs] workout today"
→ Generate full workout card with all exercises and targets

### During Workout

"Log: Bench 80kg × 8,8,7"
→ Parse and save to today's workout file

"That felt hard" / "RPE 9"
→ Note high RPE, adjust remaining sets if needed

### After Workout

"How was my session?"
→ Summarize performance, note PRs, compare to plan

"Update my plan"
→ Adjust upcoming sessions based on today's performance

## Additional Resources

### Reference Files

- **`references/exercise-library.md`** - Complete exercise database with form cues
- **`references/periodization-models.md`** - Detailed periodization strategies
- **`references/plateau-breaking.md`** - Advanced plateau-breaking techniques

### Example Files

- **`examples/workout-card-output.md`** - Sample workout card format
- **`examples/progression-calculation.md`** - Step-by-step calculation example
