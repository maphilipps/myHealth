-- Migration: Fix schema mismatches and add missing tables
-- Date: 2025-12-17

-- 1. Fix training_plans table
ALTER TABLE training_plans RENAME COLUMN type TO goal;
ALTER TABLE training_plans RENAME COLUMN days_per_week TO sessions_per_week;
ALTER TABLE training_plans ALTER COLUMN goal TYPE TEXT;
-- Update check constraint for goal if it exists (dropping and recreating)
-- In 001 it was: type TEXT CHECK (type IN ('strength', 'hypertrophy', 'hybrid', 'cutting', 'maintenance'))
ALTER TABLE training_plans DROP CONSTRAINT IF EXISTS training_plans_type_check;
ALTER TABLE training_plans ADD CONSTRAINT training_plans_goal_check 
  CHECK (goal IN ('strength', 'hypertrophy', 'endurance', 'general', 'hybrid', 'cutting', 'maintenance'));

-- 2. Fix plan_days table
ALTER TABLE plan_days RENAME COLUMN day_of_week TO day_number;
ALTER TABLE plan_days ADD COLUMN IF NOT EXISTS name TEXT;
-- workout_type already exists

-- 3. Fix plan_exercises table
-- The current schema has plan_id, we need plan_day_id to match the nested structure
ALTER TABLE plan_exercises RENAME COLUMN exercise_order TO order_index;
ALTER TABLE plan_exercises RENAME COLUMN sets TO target_sets;
ALTER TABLE plan_exercises RENAME COLUMN rep_range_min TO target_reps_min;
ALTER TABLE plan_exercises RENAME COLUMN rep_range_max TO target_reps_max;
ALTER TABLE plan_exercises RENAME COLUMN rest_sec TO rest_seconds;

-- Add plan_day_id if it doesn't exist, and migrate data if possible
ALTER TABLE plan_exercises ADD COLUMN IF NOT EXISTS plan_day_id UUID REFERENCES plan_days(id) ON DELETE CASCADE;

-- 4. Create insights table if not exists (checked earlier, it exists but let's ensure schema)
-- If it exists, we just ensure columns. Since it was problematic, let's recreate it or fix it.
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('plateau', 'imbalance', 'correlation', 'milestone', 'warning')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'success')),
  actionable BOOLEAN DEFAULT false,
  action_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly', 'custom')),
  content TEXT NOT NULL,
  highlights TEXT[],
  concerns TEXT[],
  next_focus TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for new tables
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own insights" ON insights FOR ALL USING (auth.uid() = user_id);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own reports" ON reports FOR ALL USING (auth.uid() = user_id);

-- 6. Add sessions_per_week to user_profiles if missing (useful for AI)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS sessions_per_week INT DEFAULT 3;
