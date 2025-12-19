-- Migration: Add metadata column to workout_sessions
-- This column stores planned exercises as JSON for AI-generated workouts
-- Date: 2025-12-17

-- Add metadata column to store planned exercises
ALTER TABLE workout_sessions
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT NULL;

-- Add index for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_workout_sessions_metadata
ON workout_sessions USING gin (metadata);

-- Comment for documentation
COMMENT ON COLUMN workout_sessions.metadata IS 'Stores planned exercises, AI-generated workout structure, and session metadata as JSON';

-- Example metadata structure:
-- {
--   "planned_exercises": [
--     {
--       "exercise_id": "uuid",
--       "exercise_name": "Bench Press",
--       "target_sets": 4,
--       "target_reps_min": 8,
--       "target_reps_max": 12,
--       "recommended_weight_kg": 60,
--       "notes": "Form cues..."
--     }
--   ],
--   "plan_created_at": "2025-12-17T14:31:12Z"
-- }
