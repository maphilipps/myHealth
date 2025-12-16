#!/usr/bin/env npx ts-node
/**
 * YAML to Supabase Migration Script
 *
 * Migrates historical YAML data to Supabase PostgreSQL.
 *
 * Prerequisites:
 * - SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
 * - User must be authenticated (USER_ID in .env)
 *
 * Usage:
 *   npx ts-node scripts/migrate-yaml-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const USER_ID = process.env.USER_ID || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !USER_ID) {
  console.error('Missing required environment variables:');
  console.error('  SUPABASE_URL, SUPABASE_SERVICE_KEY, USER_ID');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const DATA_DIR = path.join(__dirname, '..', 'data');

interface YamlWorkout {
  date: string;
  type: string;
  plan?: string;
  duration_min?: number;
  feeling?: number;
  notes?: string;
  exercises: Array<{
    name: string;
    sets: Array<{
      weight: number;
      reps: number;
      rpe?: number;
    }>;
  }>;
}

interface YamlDaily {
  date: string;
  weight?: number;
  water_ml?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  mood?: number;
  steps?: number;
  notes?: string;
}

interface YamlVitals {
  date: string;
  weight_kg?: number;
  resting_hr?: number;
  hrv?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  notes?: string;
}

// Get exercise ID by name
async function getExerciseId(name: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('exercises')
    .select('id')
    .ilike('name', name)
    .limit(1)
    .single();

  if (error) {
    console.warn(`Exercise not found: ${name}`);
    return null;
  }
  return data?.id || null;
}

// Migrate workout sessions
async function migrateWorkouts(): Promise<void> {
  const workoutDir = path.join(DATA_DIR, 'workouts');
  if (!fs.existsSync(workoutDir)) {
    console.log('No workouts directory found');
    return;
  }

  const files = fs.readdirSync(workoutDir).filter(f => f.endsWith('.yaml'));
  console.log(`Found ${files.length} workout files`);

  for (const file of files) {
    const filePath = path.join(workoutDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const workout: YamlWorkout = yaml.parse(content);

    // Create workout session
    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: USER_ID,
        date: workout.date,
        type: workout.type,
        duration_min: workout.duration_min,
        notes: workout.notes,
        mood: workout.feeling,
        completed: true,
      })
      .select()
      .single();

    if (sessionError) {
      console.error(`Error creating session for ${file}:`, sessionError.message);
      continue;
    }

    console.log(`Created session: ${workout.date} (${workout.type})`);

    // Create workout sets
    for (const exercise of workout.exercises) {
      const exerciseId = await getExerciseId(exercise.name);
      if (!exerciseId) continue;

      for (let i = 0; i < exercise.sets.length; i++) {
        const set = exercise.sets[i];
        const { error: setError } = await supabase
          .from('workout_sets')
          .insert({
            session_id: session.id,
            user_id: USER_ID,
            exercise_id: exerciseId,
            set_order: i + 1,
            actual_weight_kg: set.weight,
            actual_reps: set.reps,
            rpe: set.rpe,
          });

        if (setError) {
          console.error(`Error creating set:`, setError.message);
        }
      }
    }
  }
}

// Migrate daily logs to vitals
async function migrateDaily(): Promise<void> {
  const dailyDir = path.join(DATA_DIR, 'daily');
  if (!fs.existsSync(dailyDir)) {
    console.log('No daily directory found');
    return;
  }

  const files = fs.readdirSync(dailyDir).filter(f => f.endsWith('.yaml'));
  console.log(`Found ${files.length} daily log files`);

  for (const file of files) {
    const filePath = path.join(dailyDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const daily: YamlDaily = yaml.parse(content);

    const { error } = await supabase
      .from('vitals')
      .upsert({
        user_id: USER_ID,
        date: daily.date,
        weight_kg: daily.weight,
        sleep_hours: daily.sleep_hours,
        sleep_quality: daily.sleep_quality,
        mood: daily.mood,
        steps: daily.steps,
        notes: daily.notes,
        source: 'yaml_migration',
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error(`Error creating daily for ${file}:`, error.message);
    } else {
      console.log(`Migrated daily: ${daily.date}`);
    }
  }
}

// Migrate vitals
async function migrateVitals(): Promise<void> {
  const vitalsDir = path.join(DATA_DIR, 'vitals');
  if (!fs.existsSync(vitalsDir)) {
    console.log('No vitals directory found');
    return;
  }

  const files = fs.readdirSync(vitalsDir).filter(f => f.endsWith('.yaml'));
  console.log(`Found ${files.length} vitals files`);

  for (const file of files) {
    const filePath = path.join(vitalsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const vitals: YamlVitals = yaml.parse(content);

    const { error } = await supabase
      .from('vitals')
      .upsert({
        user_id: USER_ID,
        date: vitals.date,
        weight_kg: vitals.weight_kg,
        resting_heart_rate: vitals.resting_hr,
        hrv_average: vitals.hrv,
        bp_systolic: vitals.bp_systolic,
        bp_diastolic: vitals.bp_diastolic,
        notes: vitals.notes,
        source: 'yaml_migration',
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error(`Error creating vitals for ${file}:`, error.message);
    } else {
      console.log(`Migrated vitals: ${vitals.date}`);
    }
  }
}

// Main
async function main(): Promise<void> {
  console.log('=== YAML to Supabase Migration ===\n');
  console.log(`User ID: ${USER_ID}`);
  console.log(`Data directory: ${DATA_DIR}\n`);

  await migrateWorkouts();
  console.log('');
  await migrateDaily();
  console.log('');
  await migrateVitals();

  console.log('\n=== Migration Complete ===');
}

main().catch(console.error);
