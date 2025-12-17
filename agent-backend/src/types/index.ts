/**
 * Type definitions for the Fitness Agents system
 */

export interface UserProfile {
  id: string;
  goals: string[];
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  injuries: string[];
  preferences: {
    preferred_exercises?: string[];
    avoided_exercises?: string[];
    available_days?: number;
    session_duration_minutes?: number;
  };
}

export interface Exercise {
  id: string;
  name: string;
  muscle_groups: string[];
  equipment_required: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string;
  form_cues?: string[];
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  date: string;
  plan_name?: string;
  notes?: string;
  duration_minutes?: number;
  created_at: string;
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  rpe?: number;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  user_id: string;
  name: string;
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'general';
  duration_weeks: number;
  sessions_per_week: number;
  structure: PlanDay[];
  notes?: string;
}

export interface PlanDay {
  day_name: string;
  focus: string;
  exercises: PlannedExercise[];
}

export interface PlannedExercise {
  exercise_id: string;
  exercise_name: string;
  sets: number;
  rep_target: string;
  notes?: string;
}

export interface Vitals {
  id: string;
  user_id: string;
  date: string;
  weight_kg?: number;
  sleep_hours?: number;
  steps?: number;
  notes?: string;
}

export interface Insight {
  id: string;
  user_id: string;
  type: 'plateau' | 'imbalance' | 'correlation' | 'milestone' | 'warning';
  title: string;
  content: string;
  severity: 'info' | 'warning' | 'success';
  actionable: boolean;
  action_suggestion?: string;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  type: 'weekly' | 'monthly' | 'custom';
  content: string;
  highlights: string[];
  concerns: string[];
  next_focus: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface ExerciseTrend {
  exercise_id: string;
  exercise_name: string;
  data_points: {
    date: string;
    avg_weight: number;
    avg_reps: number;
    total_volume: number;
  }[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface VolumeByMuscle {
  muscle_group: string;
  total_sets: number;
  total_volume_kg: number;
}

export interface PRRecord {
  exercise_id: string;
  exercise_name: string;
  weight_kg: number;
  reps: number;
  date: string;
  previous_pr?: {
    weight_kg: number;
    reps: number;
    date: string;
  };
}
