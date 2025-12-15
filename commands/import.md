---
description: Import data from Apple Health export or Yazio CSV
argument-hint: [source] [file-path] - e.g., "apple /path/to/export.xml" or "yazio /path/to/export.csv"
allowed-tools: Read, Write, Bash
---

# Health Data Import

Import health data from external sources.

## Source: $1
## File: $2

## Apple Health Import

If source is "apple" or "health":

Apple Health exports as `export.xml` containing:
- Body measurements (weight, body fat)
- Activity (steps, calories, distance)
- Vitals (heart rate, HRV, blood pressure)
- Sleep analysis
- Workouts

### Import Process

1. Parse XML file (large file, process in chunks)
2. Extract relevant records by type:
   - `HKQuantityTypeIdentifierBodyMass` → weight
   - `HKQuantityTypeIdentifierStepCount` → steps
   - `HKQuantityTypeIdentifierActiveEnergyBurned` → active_calories
   - `HKQuantityTypeIdentifierHeartRate` → heart_rate
   - `HKQuantityTypeIdentifierRestingHeartRate` → resting_heart_rate
   - `HKCategoryTypeIdentifierSleepAnalysis` → sleep
   - `HKQuantityTypeIdentifierHeartRateVariabilitySDNN` → hrv

3. Group by date
4. Merge into existing `data/daily/` and `data/vitals/` files
5. Report import summary

### Field Mapping

| Apple Health Type | myHealth Field | Location |
|-------------------|---------------|----------|
| BodyMass | weight_kg | daily |
| StepCount | steps | daily |
| ActiveEnergyBurned | active_calories | daily |
| RestingHeartRate | resting_heart_rate | daily |
| SleepAnalysis | sleep.hours | daily |
| HeartRateVariabilitySDNN | hrv.morning | vitals |
| BloodPressureSystolic | blood_pressure.systolic | vitals |
| BloodPressureDiastolic | blood_pressure.diastolic | vitals |

## Yazio Import

If source is "yazio":

Yazio exports nutrition data as CSV with columns:
- Date, Meal, Food Name, Amount, Unit
- Energy (kcal), Protein (g), Carbohydrates (g), Fat (g), Fiber (g)

### Import Process

1. Parse CSV file
2. Group entries by date and meal type
3. Transform to myHealth nutrition schema:

```yaml
date: YYYY-MM-DD
meals:
  - time: "HH:MM"  # estimated from meal type
    type: breakfast|lunch|dinner|snack
    items:
      - name: Food Name
        amount: "X Unit"
        calories: X
        protein_g: X
        carbs_g: X
        fat_g: X
        fiber_g: X
totals:
  calories: X
  protein_g: X
  carbs_g: X
  fat_g: X
```

4. Write to `data/nutrition/YYYY-MM-DD.yaml`
5. Report import summary

### Meal Time Estimation

| Meal Type | Estimated Time |
|-----------|---------------|
| Breakfast | 08:00 |
| Morning Snack | 10:30 |
| Lunch | 12:30 |
| Afternoon Snack | 15:30 |
| Dinner | 19:00 |
| Evening Snack | 21:00 |

## Conflict Handling

When data already exists for a date:

1. **Merge strategy** (default): Add new data, preserve existing
2. **Replace strategy**: Overwrite with imported data
3. **Skip strategy**: Keep existing, ignore import

Ask user for preference if significant conflicts detected.

## Import Summary

After import, report:
- Date range covered
- Records imported per type
- Any skipped or conflicting entries
- Validation warnings

```
✓ Apple Health Import Complete

Date Range: 2024-01-01 to 2024-01-15
Records Imported:
  - Weight: 15 entries
  - Steps: 15 entries
  - Sleep: 14 entries
  - Heart Rate: 210 entries

Files Created/Updated: 15
Conflicts Resolved: 2 (merged)
```
