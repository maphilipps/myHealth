/**
 * Supabase MCP Tools for Fitness Agents
 *
 * These tools provide data access to the Supabase database.
 * Agents use these to read and write fitness data.
 */

import { config } from "dotenv";
import { createSdkMcpServer, tool } from "@anthropic-ai/claude-agent-sdk";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

// Load environment variables first
config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required in .env");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Default user for development
const getDefaultUserId = () => process.env.DEFAULT_USER_ID || '';

/**
 * Supabase Tools MCP Server
 * Provides read/write access to all fitness data
 */
export const supabaseToolsServer = createSdkMcpServer({
  name: "fitness-data",
  version: "1.0.0",
  tools: [
    // ==================== READ TOOLS ====================

    tool(
      "get_user_profile",
      "Get the user's profile including goals, experience level, and preferences",
      {
        user_id: z.string().optional().describe("User ID (defaults to current user)")
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    ),

    tool(
      "get_equipment_available",
      "Get list of equipment available to the user",
      {
        user_id: z.string().optional().describe("User ID")
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const { data, error } = await supabase
          .from('user_profiles')
          .select('available_equipment')
          .eq('id', userId)
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: JSON.stringify(data?.available_equipment || [], null, 2) }] };
      }
    ),

    tool(
      "get_training_history",
      "Get summary of past workouts for a period",
      {
        days: z.number().min(1).max(365).default(30).describe("Number of days to look back"),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - args.days);

        const { data, error } = await supabase
          .from('workout_sessions')
          .select(`
            *,
            workout_sets (
              *,
              exercises (name, muscle_groups)
            )
          `)
          .eq('user_id', userId)
          .gte('date', startDate.toISOString().split('T')[0])
          .order('date', { ascending: false });

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    ),

    tool(
      "get_current_plan",
      "Get the user's active training plan",
      {
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const { data, error } = await supabase
          .from('training_plans')
          .select(`
            *,
            plan_days (
              *,
              plan_exercises (
                *,
                exercises (name, muscle_groups)
              )
            )
          `)
          .eq('user_id', userId)
          .eq('is_active', true)
          .single();

        if (error && error.code !== 'PGRST116') {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: data ? JSON.stringify(data, null, 2) : "No active plan found" }] };
      }
    ),

    tool(
      "get_exercise_library",
      "Search the exercise library with optional filters",
      {
        muscle_group: z.string().optional().describe("Filter by muscle group"),
        equipment: z.string().optional().describe("Filter by equipment"),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        search: z.string().optional().describe("Search by exercise name"),
        limit: z.number().min(1).max(100).default(50)
      },
      async (args) => {
        let query = supabase.from('exercises').select('*');

        if (args.muscle_group) {
          query = query.contains('muscle_groups', [args.muscle_group]);
        }
        if (args.equipment) {
          query = query.contains('equipment_required', [args.equipment]);
        }
        if (args.difficulty) {
          query = query.eq('difficulty', args.difficulty);
        }
        if (args.search) {
          query = query.ilike('name', `%${args.search}%`);
        }

        const { data, error } = await query.limit(args.limit);

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    ),

    tool(
      "get_todays_plan",
      "Get the planned workout for today based on the active plan",
      {
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const { data: plan, error: planError } = await supabase
          .from('training_plans')
          .select(`
            *,
            plan_days!inner (
              *,
              plan_exercises (
                *,
                exercises (*)
              )
            )
          `)
          .eq('user_id', userId)
          .eq('is_active', true)
          .single();

        if (planError) {
          return { content: [{ type: "text", text: "No active plan or today is a rest day" }] };
        }

        // Find today's workout
        const todaysWorkout = plan?.plan_days?.find((d: { day_of_week: string }) =>
          d.day_of_week?.toLowerCase() === today
        );

        return {
          content: [{
            type: "text",
            text: todaysWorkout
              ? JSON.stringify(todaysWorkout, null, 2)
              : "Rest day or no workout scheduled for today"
          }]
        };
      }
    ),

    tool(
      "get_exercise_history",
      "Get past performance history for a specific exercise",
      {
        exercise_id: z.string().describe("Exercise UUID"),
        limit: z.number().min(1).max(50).default(10).describe("Number of sessions to return"),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        const { data, error } = await supabase
          .from('workout_sets')
          .select(`
            *,
            workout_sessions!inner (date, user_id)
          `)
          .eq('exercise_id', args.exercise_id)
          .eq('workout_sessions.user_id', userId)
          .order('workout_sessions(date)', { ascending: false })
          .limit(args.limit * 5); // Get more to group by session

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }

        // Group by session
        const sessions = new Map();
        for (const set of data || []) {
          const sessionDate = set.workout_sessions?.date;
          if (!sessions.has(sessionDate)) {
            sessions.set(sessionDate, []);
          }
          sessions.get(sessionDate).push(set);
        }

        return { content: [{ type: "text", text: JSON.stringify(Object.fromEntries(sessions), null, 2) }] };
      }
    ),

    tool(
      "get_current_session",
      "Get the current workout session if one is active today",
      {
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('workout_sessions')
          .select(`
            *,
            workout_sets (
              *,
              exercises (name)
            )
          `)
          .eq('user_id', userId)
          .eq('date', today)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: data ? JSON.stringify(data, null, 2) : "No active session today" }] };
      }
    ),

    tool(
      "get_user_state",
      "Get user's recent vitals and recovery state",
      {
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        // Get last 7 days of vitals
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: vitals, error: vitalsError } = await supabase
          .from('vitals')
          .select('*')
          .eq('user_id', userId)
          .gte('date', sevenDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: false });

        // Get last workout
        const { data: lastWorkout, error: workoutError } = await supabase
          .from('workout_sessions')
          .select('date, plan_name, duration_minutes')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(1)
          .single();

        const state = {
          recent_vitals: vitals || [],
          last_workout: lastWorkout || null,
          days_since_last_workout: lastWorkout
            ? Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24))
            : null,
          avg_sleep_hours: vitals?.length
            ? vitals.reduce((acc, v) => acc + (v.sleep_hours || 0), 0) / vitals.filter(v => v.sleep_hours).length
            : null
        };

        return { content: [{ type: "text", text: JSON.stringify(state, null, 2) }] };
      }
    ),

    tool(
      "get_exercise_trends",
      "Get weight/reps/volume trends for an exercise over time",
      {
        exercise_id: z.string().describe("Exercise UUID"),
        period_days: z.number().min(7).max(365).default(28).describe("Number of days to analyze"),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - args.period_days);

        const { data, error } = await supabase
          .from('workout_sets')
          .select(`
            weight_kg, reps, rpe,
            workout_sessions!inner (date, user_id)
          `)
          .eq('exercise_id', args.exercise_id)
          .eq('workout_sessions.user_id', userId)
          .gte('workout_sessions.date', startDate.toISOString().split('T')[0])
          .order('workout_sessions(date)', { ascending: true });

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }

        // Group by date and calculate stats
        const byDate = new Map();
        for (const set of (data || []) as unknown as Array<{ weight_kg: number; reps: number; workout_sessions: { date: string } }>) {
          const date = set.workout_sessions?.date;
          if (!byDate.has(date)) {
            byDate.set(date, { weights: [], reps: [], volumes: [] });
          }
          const d = byDate.get(date);
          d.weights.push(set.weight_kg);
          d.reps.push(set.reps);
          d.volumes.push(set.weight_kg * set.reps);
        }

        const trends = Array.from(byDate.entries()).map(([date, d]) => ({
          date,
          avg_weight: d.weights.reduce((a: number, b: number) => a + b, 0) / d.weights.length,
          avg_reps: d.reps.reduce((a: number, b: number) => a + b, 0) / d.reps.length,
          total_volume: d.volumes.reduce((a: number, b: number) => a + b, 0)
        }));

        return { content: [{ type: "text", text: JSON.stringify(trends, null, 2) }] };
      }
    ),

    tool(
      "get_volume_by_muscle",
      "Get training volume distribution by muscle group",
      {
        period_days: z.number().min(7).max(365).default(7).describe("Number of days to analyze"),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - args.period_days);

        const { data, error } = await supabase
          .from('workout_sets')
          .select(`
            weight_kg, reps,
            exercises!inner (muscle_groups),
            workout_sessions!inner (date, user_id)
          `)
          .eq('workout_sessions.user_id', userId)
          .gte('workout_sessions.date', startDate.toISOString().split('T')[0]);

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }

        // Aggregate by muscle group
        const volumeByMuscle: Record<string, { sets: number; volume: number }> = {};
        for (const set of (data || []) as unknown as Array<{ weight_kg: number; reps: number; exercises: { muscle_groups: string[] } }>) {
          const muscles = set.exercises?.muscle_groups || [];
          for (const muscle of muscles) {
            if (!volumeByMuscle[muscle]) {
              volumeByMuscle[muscle] = { sets: 0, volume: 0 };
            }
            volumeByMuscle[muscle].sets += 1;
            volumeByMuscle[muscle].volume += (set.weight_kg || 0) * (set.reps || 0);
          }
        }

        return { content: [{ type: "text", text: JSON.stringify(volumeByMuscle, null, 2) }] };
      }
    ),

    tool(
      "get_pr_history",
      "Get personal record history for an exercise or all exercises",
      {
        exercise_id: z.string().optional().describe("Exercise UUID (omit for all)"),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        let query = supabase
          .from('workout_sets')
          .select(`
            weight_kg, reps,
            exercise_id,
            exercises (name),
            workout_sessions!inner (date, user_id)
          `)
          .eq('workout_sessions.user_id', userId)
          .order('weight_kg', { ascending: false });

        if (args.exercise_id) {
          query = query.eq('exercise_id', args.exercise_id);
        }

        const { data, error } = await query;

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }

        // Find PRs (highest weight for each rep range)
        type PRSet = { exercise_id: string; weight_kg: number; reps: number; workout_sessions: { date: string }; exercises: { name: string } };
        const prs: Record<string, { weight_kg: number; reps: number; date: string; exercise_name: string }> = {};
        for (const set of (data || []) as unknown as PRSet[]) {
          const key = `${set.exercise_id}-${set.reps}`;
          if (!prs[key] || set.weight_kg > prs[key].weight_kg) {
            prs[key] = {
              weight_kg: set.weight_kg,
              reps: set.reps,
              date: set.workout_sessions?.date,
              exercise_name: set.exercises?.name
            };
          }
        }

        return { content: [{ type: "text", text: JSON.stringify(Object.values(prs), null, 2) }] };
      }
    ),

    tool(
      "get_period_summary",
      "Get aggregated stats for a time period",
      {
        start_date: z.string().describe("Start date (YYYY-MM-DD)"),
        end_date: z.string().describe("End date (YYYY-MM-DD)"),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        const { data: sessions, error: sessionsError } = await supabase
          .from('workout_sessions')
          .select(`
            *,
            workout_sets (weight_kg, reps, rpe)
          `)
          .eq('user_id', userId)
          .gte('date', args.start_date)
          .lte('date', args.end_date);

        if (sessionsError) {
          return { content: [{ type: "text", text: `Error: ${sessionsError.message}` }], isError: true };
        }

        const summary = {
          total_sessions: sessions?.length || 0,
          total_sets: sessions?.reduce((acc, s) => acc + (s.workout_sets?.length || 0), 0) || 0,
          total_volume: sessions?.reduce((acc, s) =>
            acc + (s.workout_sets?.reduce((v: number, set: { weight_kg: number; reps: number }) =>
              v + (set.weight_kg * set.reps), 0) || 0), 0) || 0,
          avg_duration_minutes: sessions?.length
            ? sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / sessions.length
            : 0,
          avg_rpe: (() => {
            const allSets = sessions?.flatMap(s => s.workout_sets || []).filter((set: { rpe?: number }) => set.rpe) || [];
            return allSets.length ? allSets.reduce((acc: number, set: { rpe?: number }) => acc + (set.rpe || 0), 0) / allSets.length : null;
          })()
        };

        return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
      }
    ),

    tool(
      "get_stored_insights",
      "Get previously generated insights for a period",
      {
        period: z.enum(['week', 'month', 'all']).default('week'),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        let startDate = new Date();
        if (args.period === 'week') {
          startDate.setDate(startDate.getDate() - 7);
        } else if (args.period === 'month') {
          startDate.setMonth(startDate.getMonth() - 1);
        } else {
          startDate = new Date(0); // All time
        }

        const { data, error } = await supabase
          .from('insights')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false });

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    ),

    tool(
      "get_goals_progress",
      "Get progress towards user's goals",
      {
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        // Get user profile with goals
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('goals, target_weight_kg')
          .eq('id', userId)
          .single();

        // Get current vitals
        const { data: vitals, error: vitalsError } = await supabase
          .from('vitals')
          .select('weight_kg')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(1)
          .single();

        // Get workout consistency (last 4 weeks)
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const { data: sessions, error: sessionsError } = await supabase
          .from('workout_sessions')
          .select('date')
          .eq('user_id', userId)
          .gte('date', fourWeeksAgo.toISOString().split('T')[0]);

        const progress = {
          goals: profile?.goals || [],
          weight: {
            current: vitals?.weight_kg,
            target: profile?.target_weight_kg
          },
          consistency: {
            sessions_last_4_weeks: sessions?.length || 0,
            avg_sessions_per_week: (sessions?.length || 0) / 4
          }
        };

        return { content: [{ type: "text", text: JSON.stringify(progress, null, 2) }] };
      }
    ),

    tool(
      "get_streak_info",
      "Get workout streak and consistency data",
      {
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        const { data, error } = await supabase
          .from('workout_sessions')
          .select('date')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(90);

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }

        // Calculate streaks
        const dates = new Set((data || []).map(s => s.date));
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const today = new Date();
        for (let i = 0; i < 90; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          const dateStr = checkDate.toISOString().split('T')[0];

          if (dates.has(dateStr)) {
            tempStreak++;
            if (i < 7) currentStreak = tempStreak; // Current week streak
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              current_streak: currentStreak,
              longest_streak: longestStreak,
              total_sessions_90_days: data?.length || 0
            }, null, 2)
          }]
        };
      }
    ),

    tool(
      "get_exercise_details",
      "Get detailed information about an exercise including form cues",
      {
        exercise_id: z.string().describe("Exercise UUID")
      },
      async (args) => {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', args.exercise_id)
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    ),

    // ==================== WRITE TOOLS ====================

    tool(
      "create_plan",
      "Create a new training plan",
      {
        name: z.string().describe("Plan name"),
        goal: z.enum(['strength', 'hypertrophy', 'endurance', 'general']),
        duration_weeks: z.number().min(1).max(52),
        sessions_per_week: z.number().min(1).max(7),
        notes: z.string().optional(),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        // Deactivate existing plans
        await supabase
          .from('training_plans')
          .update({ is_active: false })
          .eq('user_id', userId)
          .eq('is_active', true);

        const { data, error } = await supabase
          .from('training_plans')
          .insert({
            user_id: userId,
            name: args.name,
            goal: args.goal,
            duration_weeks: args.duration_weeks,
            sessions_per_week: args.sessions_per_week,
            notes: args.notes,
            is_active: true
          })
          .select()
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error creating plan: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Plan created successfully: ${JSON.stringify(data, null, 2)}` }] };
      }
    ),

    tool(
      "update_plan",
      "Update an existing training plan",
      {
        plan_id: z.string().describe("Plan UUID"),
        name: z.string().optional(),
        goal: z.enum(['strength', 'hypertrophy', 'endurance', 'general']).optional(),
        is_active: z.boolean().optional(),
        notes: z.string().optional()
      },
      async (args) => {
        const updates: Record<string, unknown> = {};
        if (args.name) updates.name = args.name;
        if (args.goal) updates.goal = args.goal;
        if (args.is_active !== undefined) updates.is_active = args.is_active;
        if (args.notes) updates.notes = args.notes;

        const { data, error } = await supabase
          .from('training_plans')
          .update(updates)
          .eq('id', args.plan_id)
          .select()
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error updating plan: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Plan updated: ${JSON.stringify(data, null, 2)}` }] };
      }
    ),

    tool(
      "start_workout",
      "Start a new workout session",
      {
        plan_name: z.string().optional().describe("Name of the workout (e.g., 'Push Day')"),
        notes: z.string().optional(),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('workout_sessions')
          .insert({
            user_id: userId,
            date: today,
            plan_name: args.plan_name,
            notes: args.notes
          })
          .select()
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error starting workout: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Workout started: ${JSON.stringify(data, null, 2)}` }] };
      }
    ),

    tool(
      "log_set",
      "Log a completed set in the current workout",
      {
        session_id: z.string().describe("Workout session UUID"),
        exercise_id: z.string().describe("Exercise UUID"),
        set_number: z.number().min(1).describe("Set number (1, 2, 3...)"),
        weight_kg: z.number().min(0).describe("Weight in kg"),
        reps: z.number().min(0).describe("Number of reps"),
        rpe: z.number().min(1).max(10).optional().describe("Rate of Perceived Exertion (1-10)"),
        notes: z.string().optional()
      },
      async (args) => {
        const { data, error } = await supabase
          .from('workout_sets')
          .insert({
            session_id: args.session_id,
            exercise_id: args.exercise_id,
            set_number: args.set_number,
            weight_kg: args.weight_kg,
            reps: args.reps,
            rpe: args.rpe,
            notes: args.notes
          })
          .select(`
            *,
            exercises (name)
          `)
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error logging set: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Set logged: ${data.exercises?.name} - ${args.weight_kg}kg × ${args.reps} reps` }] };
      }
    ),

    tool(
      "end_workout",
      "End the current workout session",
      {
        session_id: z.string().describe("Workout session UUID"),
        notes: z.string().optional().describe("Final notes for the session"),
        duration_minutes: z.number().optional()
      },
      async (args) => {
        const { data, error } = await supabase
          .from('workout_sessions')
          .update({
            notes: args.notes,
            duration_minutes: args.duration_minutes,
            completed_at: new Date().toISOString()
          })
          .eq('id', args.session_id)
          .select()
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error ending workout: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Workout ended: ${JSON.stringify(data, null, 2)}` }] };
      }
    ),

    tool(
      "update_session",
      "Update current workout session (add notes, skip exercises)",
      {
        session_id: z.string().describe("Workout session UUID"),
        notes: z.string().optional(),
        skipped_exercises: z.array(z.string()).optional().describe("List of skipped exercise names")
      },
      async (args) => {
        const updates: Record<string, unknown> = {};
        if (args.notes) updates.notes = args.notes;
        if (args.skipped_exercises) {
          updates.metadata = { skipped_exercises: args.skipped_exercises };
        }

        const { data, error } = await supabase
          .from('workout_sessions')
          .update(updates)
          .eq('id', args.session_id)
          .select()
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error updating session: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Session updated: ${JSON.stringify(data, null, 2)}` }] };
      }
    ),

    tool(
      "create_insight",
      "Store an insight for later retrieval",
      {
        type: z.enum(['plateau', 'imbalance', 'correlation', 'milestone', 'warning']),
        title: z.string(),
        content: z.string(),
        severity: z.enum(['info', 'warning', 'success']),
        actionable: z.boolean(),
        action_suggestion: z.string().optional(),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        const { data, error } = await supabase
          .from('insights')
          .insert({
            user_id: userId,
            type: args.type,
            title: args.title,
            content: args.content,
            severity: args.severity,
            actionable: args.actionable,
            action_suggestion: args.action_suggestion
          })
          .select()
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error creating insight: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Insight stored: ${args.title}` }] };
      }
    ),

    tool(
      "create_report",
      "Store a generated report",
      {
        type: z.enum(['weekly', 'monthly', 'custom']),
        content: z.string(),
        highlights: z.array(z.string()),
        concerns: z.array(z.string()),
        next_focus: z.string(),
        period_start: z.string(),
        period_end: z.string(),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        const { data, error } = await supabase
          .from('reports')
          .insert({
            user_id: userId,
            type: args.type,
            content: args.content,
            highlights: args.highlights,
            concerns: args.concerns,
            next_focus: args.next_focus,
            period_start: args.period_start,
            period_end: args.period_end
          })
          .select()
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error creating report: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Report stored: ${args.type} (${args.period_start} - ${args.period_end})` }] };
      }
    ),

    // ==================== WORKOUT CREATION TOOLS ====================

    tool(
      "set_workout_exercises",
      "Set planned exercises for a workout session. The agent uses this after analyzing the user's request and exercise history to create a personalized workout plan.",
      {
        session_id: z.string().describe("Workout session UUID"),
        exercises: z.array(z.object({
          exercise_id: z.string().describe("Exercise UUID from library"),
          exercise_name: z.string().describe("Exercise name for display"),
          target_sets: z.number().min(1).max(10).describe("Number of sets planned"),
          target_reps_min: z.number().min(1).describe("Minimum reps per set"),
          target_reps_max: z.number().min(1).describe("Maximum reps per set"),
          recommended_weight_kg: z.number().min(0).describe("Recommended weight based on history"),
          notes: z.string().optional().describe("Form cues or special instructions")
        })).describe("List of planned exercises with recommendations")
      },
      async (args) => {
        // Store planned exercises in session metadata
        const { data, error } = await supabase
          .from('workout_sessions')
          .update({
            metadata: {
              planned_exercises: args.exercises,
              plan_created_at: new Date().toISOString()
            }
          })
          .eq('id', args.session_id)
          .select()
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error setting workout plan: ${error.message}` }], isError: true };
        }

        // Format a nice preview
        const preview = args.exercises.map((ex, i) =>
          `${i + 1}. **${ex.exercise_name}**\n   ${ex.target_sets} sets × ${ex.target_reps_min}-${ex.target_reps_max} reps @ ${ex.recommended_weight_kg}kg${ex.notes ? `\n   💡 ${ex.notes}` : ''}`
        ).join('\n\n');

        return {
          content: [{
            type: "text",
            text: `Workout plan set!\n\n${preview}\n\nSession ID: ${args.session_id}`
          }]
        };
      }
    ),

    tool(
      "get_recommended_weight",
      "Calculate recommended weight for an exercise based on recent history. The agent calls this for each exercise when creating a workout.",
      {
        exercise_id: z.string().describe("Exercise UUID"),
        target_reps: z.number().describe("Target reps for today"),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();

        // Get last 3 sessions for this exercise
        const { data: history, error } = await supabase
          .from('workout_sets')
          .select(`
            weight_kg, reps, rpe,
            workout_sessions!inner (date, user_id)
          `)
          .eq('exercise_id', args.exercise_id)
          .eq('workout_sessions.user_id', userId)
          .order('workout_sessions(date)', { ascending: false })
          .limit(15);

        if (error || !history?.length) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                recommended_weight: null,
                reason: "No history found - start light and build up",
                last_weight: null,
                trend: "new"
              }, null, 2)
            }]
          };
        }

        // Group by session and get best set per session
        // Note: Supabase inner join returns workout_sessions as object, not array
        const sessions = new Map<string, { weight: number; reps: number; rpe: number | null }>();
        for (const set of history) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sessionData = (set as any).workout_sessions;
          const date = sessionData?.date as string;
          if (date && (!sessions.has(date) || set.weight_kg > (sessions.get(date)?.weight || 0))) {
            sessions.set(date, { weight: set.weight_kg, reps: set.reps, rpe: set.rpe });
          }
        }

        const recentSessions = Array.from(sessions.values()).slice(0, 3);
        const lastSession = recentSessions[0];

        // Calculate recommendation (agent can override this logic)
        let recommendedWeight = lastSession.weight;
        let trend = "maintain";
        let reason = "Maintaining current weight";

        if (lastSession.rpe !== null && lastSession.rpe < 7) {
          // Easy last time - suggest increase
          recommendedWeight = Math.ceil((lastSession.weight * 1.025) / 2.5) * 2.5; // Round to 2.5kg
          trend = "increase";
          reason = `Last session RPE ${lastSession.rpe} was low - time to progress`;
        } else if (lastSession.rpe !== null && lastSession.rpe >= 9.5) {
          // Very hard - suggest decrease or maintain
          recommendedWeight = lastSession.weight;
          trend = "careful";
          reason = `Last session RPE ${lastSession.rpe} was high - prioritize form`;
        } else if (lastSession.reps >= args.target_reps + 2) {
          // Hit more reps than target - can increase
          recommendedWeight = Math.ceil((lastSession.weight * 1.025) / 2.5) * 2.5;
          trend = "increase";
          reason = `Last time hit ${lastSession.reps} reps easily - ready for more weight`;
        }

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              recommended_weight: recommendedWeight,
              last_weight: lastSession.weight,
              last_reps: lastSession.reps,
              last_rpe: lastSession.rpe,
              trend,
              reason,
              history_sessions: recentSessions.length
            }, null, 2)
          }]
        };
      }
    ),

    tool(
      "modify_workout_exercises",
      "Modify the planned exercises in an active workout session. Use this for adding, removing, reordering, or swapping exercises mid-workout.",
      {
        session_id: z.string().describe("Workout session UUID"),
        action: z.enum(["add", "remove", "swap", "reorder", "adjust"]).describe("Type of modification"),
        exercise_index: z.number().optional().describe("Index of exercise to modify (0-based)"),
        new_exercise: z.object({
          exercise_id: z.string(),
          exercise_name: z.string(),
          target_sets: z.number().min(1).max(10),
          target_reps_min: z.number().min(1),
          target_reps_max: z.number().min(1),
          recommended_weight_kg: z.number().min(0),
          notes: z.string().optional()
        }).optional().describe("New exercise data (for add/swap)"),
        new_order: z.array(z.number()).optional().describe("New order of exercise indices (for reorder)"),
        adjustments: z.object({
          target_sets: z.number().optional(),
          target_reps_min: z.number().optional(),
          target_reps_max: z.number().optional(),
          recommended_weight_kg: z.number().optional()
        }).optional().describe("Adjustments to apply (for adjust action)")
      },
      async (args) => {
        // Get current session with planned exercises
        const { data: session, error: fetchError } = await supabase
          .from('workout_sessions')
          .select('metadata')
          .eq('id', args.session_id)
          .single();

        if (fetchError || !session) {
          return { content: [{ type: "text", text: `Error fetching session: ${fetchError?.message || 'Not found'}` }], isError: true };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const metadata = session.metadata as any || {};
        let exercises = metadata.planned_exercises || [];
        let actionDescription = "";

        switch (args.action) {
          case "add":
            if (!args.new_exercise) {
              return { content: [{ type: "text", text: "new_exercise required for add action" }], isError: true };
            }
            exercises.push(args.new_exercise);
            actionDescription = `Added ${args.new_exercise.exercise_name}`;
            break;

          case "remove":
            if (args.exercise_index === undefined || args.exercise_index >= exercises.length) {
              return { content: [{ type: "text", text: "Valid exercise_index required for remove action" }], isError: true };
            }
            const removed = exercises.splice(args.exercise_index, 1)[0];
            actionDescription = `Removed ${removed.exercise_name}`;
            break;

          case "swap":
            if (args.exercise_index === undefined || !args.new_exercise) {
              return { content: [{ type: "text", text: "exercise_index and new_exercise required for swap action" }], isError: true };
            }
            const swapped = exercises[args.exercise_index];
            exercises[args.exercise_index] = args.new_exercise;
            actionDescription = `Swapped ${swapped?.exercise_name || 'exercise'} with ${args.new_exercise.exercise_name}`;
            break;

          case "reorder":
            if (!args.new_order || args.new_order.length !== exercises.length) {
              return { content: [{ type: "text", text: "new_order array required with same length as exercises" }], isError: true };
            }
            exercises = args.new_order.map(i => exercises[i]);
            actionDescription = "Reordered exercises";
            break;

          case "adjust":
            if (args.exercise_index === undefined || !args.adjustments) {
              return { content: [{ type: "text", text: "exercise_index and adjustments required for adjust action" }], isError: true };
            }
            const exercise = exercises[args.exercise_index];
            if (args.adjustments.target_sets !== undefined) exercise.target_sets = args.adjustments.target_sets;
            if (args.adjustments.target_reps_min !== undefined) exercise.target_reps_min = args.adjustments.target_reps_min;
            if (args.adjustments.target_reps_max !== undefined) exercise.target_reps_max = args.adjustments.target_reps_max;
            if (args.adjustments.recommended_weight_kg !== undefined) exercise.recommended_weight_kg = args.adjustments.recommended_weight_kg;
            actionDescription = `Adjusted ${exercise.exercise_name}`;
            break;
        }

        // Update session with modified exercises
        const { error: updateError } = await supabase
          .from('workout_sessions')
          .update({
            metadata: {
              ...metadata,
              planned_exercises: exercises,
              last_modified_at: new Date().toISOString()
            }
          })
          .eq('id', args.session_id);

        if (updateError) {
          return { content: [{ type: "text", text: `Error updating workout: ${updateError.message}` }], isError: true };
        }

        // Format updated workout preview
        const preview = exercises.map((ex: { exercise_name: string; target_sets: number; target_reps_min: number; target_reps_max: number; recommended_weight_kg: number }, i: number) =>
          `${i + 1}. ${ex.exercise_name} - ${ex.target_sets}×${ex.target_reps_min}-${ex.target_reps_max} @ ${ex.recommended_weight_kg}kg`
        ).join('\n');

        return {
          content: [{
            type: "text",
            text: `✅ ${actionDescription}\n\n**Updated Workout:**\n${preview}`
          }]
        };
      }
    ),

    tool(
      "log_vitals",
      "Log daily vitals (weight, sleep, etc.)",
      {
        weight_kg: z.number().optional(),
        sleep_hours: z.number().min(0).max(24).optional(),
        steps: z.number().min(0).optional(),
        notes: z.string().optional(),
        user_id: z.string().optional()
      },
      async (args) => {
        const userId = args.user_id || getDefaultUserId();
        const today = new Date().toISOString().split('T')[0];

        // Upsert for today
        const { data, error } = await supabase
          .from('vitals')
          .upsert({
            user_id: userId,
            date: today,
            weight_kg: args.weight_kg,
            sleep_hours: args.sleep_hours,
            steps: args.steps,
            notes: args.notes
          }, {
            onConflict: 'user_id,date'
          })
          .select()
          .single();

        if (error) {
          return { content: [{ type: "text", text: `Error logging vitals: ${error.message}` }], isError: true };
        }
        return { content: [{ type: "text", text: `Vitals logged for ${today}` }] };
      }
    )
  ]
});

export default supabaseToolsServer;
