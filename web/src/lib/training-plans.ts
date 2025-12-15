// Training Plans und Übungen für myHealth

export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  defaultSets: number
  defaultReps: string // z.B. "8-12" oder "10"
  notes?: string
}

export interface TrainingDay {
  id: string
  name: string
  shortName: string
  exercises: Exercise[]
}

export interface TrainingPlan {
  id: string
  name: string
  days: TrainingDay[]
  restDays: number // Tage Pause zwischen Trainings
}

// Übungen-Datenbank
export const EXERCISES: Record<string, Exercise> = {
  // Brust
  benchPress: { id: 'benchPress', name: 'Bankdrücken', muscleGroup: 'Brust', defaultSets: 3, defaultReps: '8-10' },
  inclineBenchPress: { id: 'inclineBenchPress', name: 'Schrägbankdrücken', muscleGroup: 'Brust', defaultSets: 3, defaultReps: '8-12' },
  dips: { id: 'dips', name: 'Dips', muscleGroup: 'Brust/Trizeps', defaultSets: 3, defaultReps: '8-12' },
  cableFly: { id: 'cableFly', name: 'Cable Flys', muscleGroup: 'Brust', defaultSets: 3, defaultReps: '12-15' },

  // Rücken
  pullUps: { id: 'pullUps', name: 'Klimmzüge', muscleGroup: 'Rücken', defaultSets: 3, defaultReps: '6-10' },
  barbellRow: { id: 'barbellRow', name: 'Langhantelrudern', muscleGroup: 'Rücken', defaultSets: 3, defaultReps: '8-10' },
  latPulldown: { id: 'latPulldown', name: 'Latzug', muscleGroup: 'Rücken', defaultSets: 3, defaultReps: '10-12' },
  cableRow: { id: 'cableRow', name: 'Kabelrudern', muscleGroup: 'Rücken', defaultSets: 3, defaultReps: '10-12' },
  facePull: { id: 'facePull', name: 'Face Pulls', muscleGroup: 'Rücken/Schulter', defaultSets: 3, defaultReps: '15-20' },

  // Schultern
  overheadPress: { id: 'overheadPress', name: 'Schulterdrücken', muscleGroup: 'Schultern', defaultSets: 3, defaultReps: '8-10' },
  lateralRaise: { id: 'lateralRaise', name: 'Seitheben', muscleGroup: 'Schultern', defaultSets: 3, defaultReps: '12-15' },
  rearDeltFly: { id: 'rearDeltFly', name: 'Reverse Flys', muscleGroup: 'Schultern', defaultSets: 3, defaultReps: '15-20' },

  // Beine
  squat: { id: 'squat', name: 'Kniebeugen', muscleGroup: 'Beine', defaultSets: 3, defaultReps: '6-8' },
  legPress: { id: 'legPress', name: 'Beinpresse', muscleGroup: 'Beine', defaultSets: 3, defaultReps: '10-12' },
  romanianDeadlift: { id: 'romanianDeadlift', name: 'Rumänisches Kreuzheben', muscleGroup: 'Beine/Rücken', defaultSets: 3, defaultReps: '8-10' },
  legCurl: { id: 'legCurl', name: 'Beinbeuger', muscleGroup: 'Beine', defaultSets: 3, defaultReps: '10-12' },
  legExtension: { id: 'legExtension', name: 'Beinstrecker', muscleGroup: 'Beine', defaultSets: 3, defaultReps: '10-12' },
  calfRaise: { id: 'calfRaise', name: 'Wadenheben', muscleGroup: 'Waden', defaultSets: 3, defaultReps: '12-15' },

  // Arme
  bicepCurl: { id: 'bicepCurl', name: 'Bizeps Curls', muscleGroup: 'Bizeps', defaultSets: 3, defaultReps: '10-12' },
  hammerCurl: { id: 'hammerCurl', name: 'Hammer Curls', muscleGroup: 'Bizeps', defaultSets: 3, defaultReps: '10-12' },
  tricepPushdown: { id: 'tricepPushdown', name: 'Trizeps Pushdown', muscleGroup: 'Trizeps', defaultSets: 3, defaultReps: '10-12' },
  skullCrusher: { id: 'skullCrusher', name: 'Skull Crushers', muscleGroup: 'Trizeps', defaultSets: 3, defaultReps: '10-12' },
}

// Trainingspläne
export const TRAINING_PLANS: TrainingPlan[] = [
  {
    id: 'torso-limbs',
    name: 'Torso-Limbs Split',
    restDays: 1,
    days: [
      {
        id: 'torso',
        name: 'Torso',
        shortName: 'Torso',
        exercises: [
          EXERCISES.benchPress,
          EXERCISES.barbellRow,
          EXERCISES.overheadPress,
          EXERCISES.latPulldown,
          EXERCISES.cableFly,
          EXERCISES.facePull,
        ]
      },
      {
        id: 'limbs',
        name: 'Limbs (Arme & Beine)',
        shortName: 'Limbs',
        exercises: [
          EXERCISES.squat,
          EXERCISES.romanianDeadlift,
          EXERCISES.legPress,
          EXERCISES.bicepCurl,
          EXERCISES.tricepPushdown,
          EXERCISES.calfRaise,
        ]
      }
    ]
  },
  {
    id: 'push-pull-legs',
    name: 'Push Pull Legs',
    restDays: 1,
    days: [
      {
        id: 'push',
        name: 'Push',
        shortName: 'Push',
        exercises: [
          EXERCISES.benchPress,
          EXERCISES.inclineBenchPress,
          EXERCISES.overheadPress,
          EXERCISES.lateralRaise,
          EXERCISES.tricepPushdown,
          EXERCISES.dips,
        ]
      },
      {
        id: 'pull',
        name: 'Pull',
        shortName: 'Pull',
        exercises: [
          EXERCISES.pullUps,
          EXERCISES.barbellRow,
          EXERCISES.latPulldown,
          EXERCISES.facePull,
          EXERCISES.bicepCurl,
          EXERCISES.hammerCurl,
        ]
      },
      {
        id: 'legs',
        name: 'Legs',
        shortName: 'Legs',
        exercises: [
          EXERCISES.squat,
          EXERCISES.legPress,
          EXERCISES.romanianDeadlift,
          EXERCISES.legCurl,
          EXERCISES.legExtension,
          EXERCISES.calfRaise,
        ]
      }
    ]
  },
  {
    id: 'upper-lower',
    name: 'Upper Lower',
    restDays: 1,
    days: [
      {
        id: 'upper',
        name: 'Upper Body',
        shortName: 'Upper',
        exercises: [
          EXERCISES.benchPress,
          EXERCISES.barbellRow,
          EXERCISES.overheadPress,
          EXERCISES.pullUps,
          EXERCISES.lateralRaise,
          EXERCISES.bicepCurl,
          EXERCISES.tricepPushdown,
        ]
      },
      {
        id: 'lower',
        name: 'Lower Body',
        shortName: 'Lower',
        exercises: [
          EXERCISES.squat,
          EXERCISES.romanianDeadlift,
          EXERCISES.legPress,
          EXERCISES.legCurl,
          EXERCISES.legExtension,
          EXERCISES.calfRaise,
        ]
      }
    ]
  },
  {
    id: 'full-body',
    name: 'Full Body',
    restDays: 1,
    days: [
      {
        id: 'full',
        name: 'Ganzkörper',
        shortName: 'Full',
        exercises: [
          EXERCISES.squat,
          EXERCISES.benchPress,
          EXERCISES.barbellRow,
          EXERCISES.overheadPress,
          EXERCISES.romanianDeadlift,
          EXERCISES.pullUps,
        ]
      }
    ]
  }
]

// Hilfsfunktionen
export function getTrainingPlan(planId: string): TrainingPlan | undefined {
  return TRAINING_PLANS.find(p => p.id === planId)
}

export function getTodaysWorkout(planId: string, lastWorkoutType?: string): TrainingDay | undefined {
  const plan = getTrainingPlan(planId)
  if (!plan) return undefined

  // Wenn kein letztes Workout, nimm den ersten Tag
  if (!lastWorkoutType) return plan.days[0]

  // Finde den nächsten Tag im Plan
  const lastIndex = plan.days.findIndex(d => d.id === lastWorkoutType)
  if (lastIndex === -1) return plan.days[0]

  const nextIndex = (lastIndex + 1) % plan.days.length
  return plan.days[nextIndex]
}

// Finde letzte Session für eine Übung
export function getLastExerciseSession(
  exerciseName: string,
  workouts: { date: string; exercises: { name: string; sets: { weight: number; reps: number }[] }[] }[]
): { weight: number; reps: number }[] | undefined {
  for (const workout of workouts) {
    const exercise = workout.exercises.find(e => e.name === exerciseName)
    if (exercise && exercise.sets.length > 0) {
      return exercise.sets
    }
  }
  return undefined
}
