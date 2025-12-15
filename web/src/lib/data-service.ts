// Data Service für myHealth
// Lädt und speichert Daten aus/in YAML-Dateien (localStorage für Web)

export interface DailyLog {
  date: string
  weight?: number
  water?: number
  sleep?: number
  mood?: 'great' | 'good' | 'okay' | 'bad'
  steps?: number
  notes?: string
}

export interface WorkoutSet {
  weight: number
  reps: number
  rpe?: number
}

export interface WorkoutExercise {
  name: string
  sets: WorkoutSet[]
  notes?: string
}

export interface Workout {
  date: string
  type: 'torso' | 'limbs' | 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'full'
  duration?: number
  exercises: WorkoutExercise[]
  notes?: string
}

export interface MealItem {
  name: string
  amount?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

export interface Meal {
  time: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  items: MealItem[]
}

export interface NutritionLog {
  date: string
  meals: Meal[]
  totals?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export interface Vitals {
  date: string
  heartRate?: {
    resting: number
    max?: number
  }
  bloodPressure?: {
    systolic: number
    diastolic: number
  }
  hrv?: number
  bodyFat?: number
}

// Storage Keys
const STORAGE_KEYS = {
  DAILY_LOGS: 'myhealth_daily_logs',
  WORKOUTS: 'myhealth_workouts',
  NUTRITION: 'myhealth_nutrition',
  VITALS: 'myhealth_vitals',
  SETTINGS: 'myhealth_settings'
}

// Sample data for initial load
const sampleDailyLogs: DailyLog[] = [
  { date: '2024-12-15', weight: 82.5, water: 2.1, sleep: 7.5, mood: 'good', steps: 6432 },
  { date: '2024-12-14', weight: 82.8, water: 2.5, sleep: 8.0, mood: 'great', steps: 8234 },
  { date: '2024-12-13', weight: 82.6, water: 2.0, sleep: 7.0, mood: 'okay', steps: 5123 },
  { date: '2024-12-12', weight: 82.9, water: 2.3, sleep: 7.5, mood: 'good', steps: 7456 },
  { date: '2024-12-11', weight: 83.0, water: 1.8, sleep: 6.5, mood: 'okay', steps: 4532 },
  { date: '2024-12-10', weight: 83.2, water: 2.2, sleep: 8.0, mood: 'great', steps: 9876 },
  { date: '2024-12-09', weight: 83.1, water: 2.0, sleep: 7.0, mood: 'good', steps: 6234 },
]

const sampleWorkouts: Workout[] = [
  {
    date: '2024-12-14',
    type: 'limbs',
    duration: 65,
    exercises: [
      { name: 'Squat', sets: [{ weight: 100, reps: 8, rpe: 8 }, { weight: 100, reps: 8, rpe: 8.5 }, { weight: 100, reps: 7, rpe: 9 }] },
      { name: 'Romanian Deadlift', sets: [{ weight: 80, reps: 10, rpe: 7 }, { weight: 80, reps: 10, rpe: 8 }, { weight: 80, reps: 9, rpe: 8.5 }] },
      { name: 'Bicep Curls', sets: [{ weight: 14, reps: 12, rpe: 7 }, { weight: 14, reps: 12, rpe: 8 }, { weight: 14, reps: 10, rpe: 9 }] },
    ]
  },
  {
    date: '2024-12-13',
    type: 'torso',
    duration: 70,
    exercises: [
      { name: 'Bench Press', sets: [{ weight: 80, reps: 8, rpe: 8 }, { weight: 80, reps: 8, rpe: 8.5 }, { weight: 80, reps: 7, rpe: 9 }] },
      { name: 'Barbell Row', sets: [{ weight: 70, reps: 10, rpe: 7 }, { weight: 70, reps: 10, rpe: 8 }, { weight: 70, reps: 9, rpe: 8.5 }] },
      { name: 'Overhead Press', sets: [{ weight: 45, reps: 10, rpe: 8 }, { weight: 45, reps: 9, rpe: 8.5 }, { weight: 45, reps: 8, rpe: 9 }] },
    ]
  },
  {
    date: '2024-12-11',
    type: 'limbs',
    duration: 60,
    exercises: [
      { name: 'Squat', sets: [{ weight: 97.5, reps: 8, rpe: 8 }, { weight: 97.5, reps: 8, rpe: 8 }, { weight: 97.5, reps: 8, rpe: 8.5 }] },
      { name: 'Leg Press', sets: [{ weight: 180, reps: 12, rpe: 7 }, { weight: 180, reps: 12, rpe: 8 }, { weight: 180, reps: 11, rpe: 8.5 }] },
    ]
  },
  {
    date: '2024-12-10',
    type: 'torso',
    duration: 75,
    exercises: [
      { name: 'Bench Press', sets: [{ weight: 77.5, reps: 8, rpe: 7.5 }, { weight: 77.5, reps: 8, rpe: 8 }, { weight: 77.5, reps: 8, rpe: 8.5 }] },
      { name: 'Pull-ups', sets: [{ weight: 0, reps: 10, rpe: 8 }, { weight: 0, reps: 9, rpe: 8.5 }, { weight: 0, reps: 8, rpe: 9 }] },
    ]
  },
]

// Initialize data if not present
function initializeData(): void {
  if (!localStorage.getItem(STORAGE_KEYS.DAILY_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(sampleDailyLogs))
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORKOUTS)) {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(sampleWorkouts))
  }
}

// Daily Logs
export function getDailyLogs(): DailyLog[] {
  initializeData()
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS)
  return data ? JSON.parse(data) : []
}

export function getDailyLog(date: string): DailyLog | undefined {
  return getDailyLogs().find(log => log.date === date)
}

export function saveDailyLog(log: DailyLog): void {
  const logs = getDailyLogs()
  const index = logs.findIndex(l => l.date === log.date)
  if (index >= 0) {
    logs[index] = log
  } else {
    logs.unshift(log)
  }
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs))
}

// Workouts
export function getWorkouts(): Workout[] {
  initializeData()
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS)
  return data ? JSON.parse(data) : []
}

export function getWorkout(date: string): Workout | undefined {
  return getWorkouts().find(w => w.date === date)
}

export function saveWorkout(workout: Workout): void {
  const workouts = getWorkouts()
  const index = workouts.findIndex(w => w.date === workout.date && w.type === workout.type)
  if (index >= 0) {
    workouts[index] = workout
  } else {
    workouts.unshift(workout)
  }
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts))
}

// Nutrition
export function getNutritionLogs(): NutritionLog[] {
  const data = localStorage.getItem(STORAGE_KEYS.NUTRITION)
  return data ? JSON.parse(data) : []
}

export function getNutritionLog(date: string): NutritionLog | undefined {
  return getNutritionLogs().find(n => n.date === date)
}

export function saveNutritionLog(log: NutritionLog): void {
  const logs = getNutritionLogs()
  const index = logs.findIndex(l => l.date === log.date)
  if (index >= 0) {
    logs[index] = log
  } else {
    logs.unshift(log)
  }
  localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(logs))
}

// Vitals
export function getVitals(): Vitals[] {
  const data = localStorage.getItem(STORAGE_KEYS.VITALS)
  return data ? JSON.parse(data) : []
}

export function getVital(date: string): Vitals | undefined {
  return getVitals().find(v => v.date === date)
}

export function saveVital(vital: Vitals): void {
  const vitals = getVitals()
  const index = vitals.findIndex(v => v.date === vital.date)
  if (index >= 0) {
    vitals[index] = vital
  } else {
    vitals.unshift(vital)
  }
  localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals))
}

// Statistics
export function getWeeklyStats(weeksAgo = 0): {
  avgWeight: number
  totalWorkouts: number
  avgSleep: number
  avgSteps: number
  avgWater: number
} {
  const logs = getDailyLogs()
  const workouts = getWorkouts()

  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() - (weeksAgo * 7))
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  const weekLogs = logs.filter(log => {
    const date = new Date(log.date)
    return date >= startOfWeek && date < endOfWeek
  })

  const weekWorkouts = workouts.filter(w => {
    const date = new Date(w.date)
    return date >= startOfWeek && date < endOfWeek
  })

  const weights = weekLogs.filter(l => l.weight).map(l => l.weight!)
  const sleeps = weekLogs.filter(l => l.sleep).map(l => l.sleep!)
  const steps = weekLogs.filter(l => l.steps).map(l => l.steps!)
  const waters = weekLogs.filter(l => l.water).map(l => l.water!)

  return {
    avgWeight: weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : 0,
    totalWorkouts: weekWorkouts.length,
    avgSleep: sleeps.length ? sleeps.reduce((a, b) => a + b, 0) / sleeps.length : 0,
    avgSteps: steps.length ? Math.round(steps.reduce((a, b) => a + b, 0) / steps.length) : 0,
    avgWater: waters.length ? waters.reduce((a, b) => a + b, 0) / waters.length : 0,
  }
}

// Personal Records
export function getPersonalRecords(): Record<string, { weight: number; reps: number; date: string }> {
  const workouts = getWorkouts()
  const prs: Record<string, { weight: number; reps: number; date: string }> = {}

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      for (const set of exercise.sets) {
        const current = prs[exercise.name]
        // Simple PR logic: higher weight wins, then higher reps
        if (!current || set.weight > current.weight || (set.weight === current.weight && set.reps > current.reps)) {
          prs[exercise.name] = { weight: set.weight, reps: set.reps, date: workout.date }
        }
      }
    }
  }

  return prs
}

// Export all data as JSON (for backup/YAML conversion)
export function exportAllData(): string {
  return JSON.stringify({
    dailyLogs: getDailyLogs(),
    workouts: getWorkouts(),
    nutrition: getNutritionLogs(),
    vitals: getVitals(),
    exportedAt: new Date().toISOString()
  }, null, 2)
}

// Import data from JSON
export function importData(jsonString: string): void {
  const data = JSON.parse(jsonString)
  if (data.dailyLogs) localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(data.dailyLogs))
  if (data.workouts) localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(data.workouts))
  if (data.nutrition) localStorage.setItem(STORAGE_KEYS.NUTRITION, JSON.stringify(data.nutrition))
  if (data.vitals) localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(data.vitals))
}
