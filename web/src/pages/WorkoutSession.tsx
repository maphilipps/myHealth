import { useState, useEffect, useCallback } from 'react'
import { PlayIcon, CheckIcon, PlusIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { ClockIcon } from '@heroicons/react/24/outline'
import { getWorkouts, saveWorkout, type Workout, type WorkoutExercise } from '../lib/data-service'
import { getTodaysWorkout, getLastExerciseSession, type Exercise, type TrainingDay } from '../lib/training-plans'

interface ActiveSet {
  weight: string
  reps: string
  completed: boolean
}

interface ExerciseState {
  exercise: Exercise
  sets: ActiveSet[]
  lastSession?: { weight: number; reps: number }[]
  expanded: boolean
  completed: boolean
}

export function WorkoutSession() {
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [workoutDay, setWorkoutDay] = useState<TrainingDay | null>(null)
  const [exercises, setExercises] = useState<ExerciseState[]>([])
  const [workoutDuration, setWorkoutDuration] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  // Rest Timer
  const [restTime, setRestTime] = useState(90)
  const [restTimeLeft, setRestTimeLeft] = useState(0)
  const [restTimerActive, setRestTimerActive] = useState(false)

  // Load settings and determine today's workout
  useEffect(() => {
    const settings = localStorage.getItem('myhealth_settings')
    const planId = settings ? JSON.parse(settings).trainingPlan : 'torso-limbs'

    const workouts = getWorkouts()
    const lastWorkout = workouts[0]
    const lastType = lastWorkout?.type

    const todaysWorkout = getTodaysWorkout(planId, lastType)
    if (todaysWorkout) {
      setWorkoutDay(todaysWorkout)

      // Initialize exercises with last session data
      const exerciseStates: ExerciseState[] = todaysWorkout.exercises.map(exercise => {
        const lastSession = getLastExerciseSession(exercise.name, workouts)
        return {
          exercise,
          sets: Array(exercise.defaultSets).fill(null).map((_, i) => ({
            weight: lastSession?.[i]?.weight.toString() || '',
            reps: '',
            completed: false
          })),
          lastSession,
          expanded: false,
          completed: false
        }
      })

      // Expand first exercise by default
      if (exerciseStates.length > 0) {
        exerciseStates[0].expanded = true
      }

      setExercises(exerciseStates)
    }
  }, [])

  // Workout duration timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (workoutStarted && timerRunning) {
      interval = setInterval(() => {
        setWorkoutDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [workoutStarted, timerRunning])

  // Rest timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (restTimerActive && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setRestTimerActive(false)
            // Vibrate when done
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200])
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [restTimerActive, restTimeLeft])

  const loadLastSet = useCallback((exerciseIndex: number, setIndex: number) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exerciseIndex) return ex
      const lastSessionSet = ex.lastSession?.[setIndex]
      if (!lastSessionSet) return ex
      
      const newSets = [...ex.sets]
      newSets[setIndex] = { 
        ...newSets[setIndex], 
        weight: lastSessionSet.weight.toString(),
        reps: lastSessionSet.reps.toString()
      }
      return { ...ex, sets: newSets }
    }))
  }, [])

  const startWorkout = useCallback(() => {
    setWorkoutStarted(true)
    setTimerRunning(true)
  }, [])

  const startRestTimer = useCallback(() => {
    setRestTimeLeft(restTime)
    setRestTimerActive(true)
  }, [restTime])

  const toggleExercise = useCallback((index: number) => {
    setExercises(prev => prev.map((ex, i) => ({
      ...ex,
      expanded: i === index ? !ex.expanded : ex.expanded
    })))
  }, [])

  const updateSet = useCallback((exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exerciseIndex) return ex
      const newSets = [...ex.sets]
      newSets[setIndex] = { ...newSets[setIndex], [field]: value }
      return { ...ex, sets: newSets }
    }))
  }, [])

  const completeSet = useCallback((exerciseIndex: number, setIndex: number) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exerciseIndex) return ex
      const newSets = [...ex.sets]
      newSets[setIndex] = { ...newSets[setIndex], completed: true }

      // Check if exercise is completed
      const allCompleted = newSets.every(s => s.completed)

      return { ...ex, sets: newSets, completed: allCompleted }
    }))

    // Start rest timer automatically
    startRestTimer()
  }, [startRestTimer])

  const addSet = useCallback((exerciseIndex: number) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exerciseIndex) return ex
      const lastSet = ex.sets[ex.sets.length - 1]
      return {
        ...ex,
        sets: [...ex.sets, { weight: lastSet?.weight || '', reps: '', completed: false }]
      }
    }))
  }, [])

  const removeSet = useCallback((exerciseIndex: number, setIndex: number) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exerciseIndex || ex.sets.length <= 1) return ex
      return {
        ...ex,
        sets: ex.sets.filter((_, si) => si !== setIndex)
      }
    }))
  }, [])

  const finishWorkout = useCallback(() => {
    if (!workoutDay) return

    // Build workout data
    const workoutExercises: WorkoutExercise[] = exercises
      .filter(ex => ex.sets.some(s => s.completed))
      .map(ex => ({
        name: ex.exercise.name,
        sets: ex.sets
          .filter(s => s.completed && s.weight && s.reps)
          .map(s => ({
            weight: parseFloat(s.weight),
            reps: parseInt(s.reps)
          }))
      }))

    const workout: Workout = {
      date: new Date().toISOString().split('T')[0],
      type: workoutDay.id as Workout['type'],
      duration: Math.round(workoutDuration / 60),
      exercises: workoutExercises
    }

    saveWorkout(workout)
    setWorkoutStarted(false)
    setTimerRunning(false)

    // Reset for next time
    alert('Workout gespeichert! Gut gemacht!')
  }, [workoutDay, exercises, workoutDuration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const completedExercises = exercises.filter(ex => ex.completed).length
  const totalExercises = exercises.length

  if (!workoutDay) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workout</h1>
        <div className="card">
          <p className="text-gray-600 dark:text-gray-400">Kein Trainingsplan gefunden. Bitte in den Einstellungen konfigurieren.</p>
        </div>
      </div>
    )
  }

  // Pre-workout screen
  if (!workoutStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Bereit für heute?
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-health-primary/10 flex items-center justify-center">
              <span className="text-2xl">🏋️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {workoutDay.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {exercises.length} Übungen
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {exercises.map((ex, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                  {i + 1}
                </span>
                <span className="text-gray-900 dark:text-white">{ex.exercise.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                  {ex.exercise.defaultSets} × {ex.exercise.defaultReps}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={startWorkout}
            className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2"
          >
            <PlayIcon className="w-6 h-6" />
            Workout starten
          </button>
        </div>
      </div>
    )
  }

  // Active workout screen
  return (
    <div className="space-y-4 pb-4">
      {/* Header with timer */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {workoutDay.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {completedExercises}/{totalExercises} Übungen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            <span className="font-mono text-gray-900 dark:text-white">{formatTime(workoutDuration)}</span>
          </div>
          <button
            onClick={finishWorkout}
            className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Beenden
          </button>
        </div>
      </div>

      {/* Rest Timer */}
      {restTimerActive && (
        <div className="card bg-health-primary/10 border-health-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⏱️</div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pause</p>
                <p className="text-2xl font-bold text-health-primary">{formatTime(restTimeLeft)}</p>
              </div>
            </div>
            <button
              onClick={() => setRestTimerActive(false)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Quick rest timer buttons */}
      {!restTimerActive && (
        <div className="flex gap-2">
          {[60, 90, 120, 180].map(seconds => (
            <button
              key={seconds}
              onClick={() => {
                setRestTime(seconds)
                setRestTimeLeft(seconds)
                setRestTimerActive(true)
              }}
              className="flex-1 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {seconds < 120 ? `${seconds}s` : `${seconds / 60}m`}
            </button>
          ))}
        </div>
      )}

      {/* Exercise list */}
      <div className="space-y-3">
        {exercises.map((exerciseState, exerciseIndex) => (
          <div
            key={exerciseIndex}
            className={`card transition-all ${
              exerciseState.completed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : exerciseState.expanded
                  ? 'ring-2 ring-health-primary'
                  : ''
            }`}
          >
            {/* Exercise header */}
            <button
              onClick={() => toggleExercise(exerciseIndex)}
              className="w-full flex items-center gap-3"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                exerciseState.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {exerciseState.completed ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{exerciseIndex + 1}</span>
                )}
              </div>
              <div className="flex-1 text-left">
                <h3 className={`font-semibold ${
                  exerciseState.completed
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {exerciseState.exercise.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {exerciseState.exercise.muscleGroup} • {exerciseState.sets.filter(s => s.completed).length}/{exerciseState.sets.length} Sets
                </p>
              </div>
              {exerciseState.expanded ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Expanded content */}
            {exerciseState.expanded && (
              <div className="mt-4 space-y-3">
                {/* Last session info */}
                {exerciseState.lastSession && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                    <span className="font-medium">Letzte Session:</span>{' '}
                    {exerciseState.lastSession.map((s, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {s.weight}kg × {s.reps}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => {
                      const activeSetIndex = exerciseState.sets.findIndex(s => !s.completed)
                      if (activeSetIndex === -1) return
                      const currentWeight = parseFloat(exerciseState.sets[activeSetIndex].weight) || 0
                      updateSet(exerciseIndex, activeSetIndex, 'weight', (currentWeight + 2.5).toString())
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 whitespace-nowrap"
                  >
                    +2.5kg
                  </button>
                  <button
                    onClick={() => {
                      const activeSetIndex = exerciseState.sets.findIndex(s => !s.completed)
                      if (activeSetIndex === -1) return
                      const currentReps = parseInt(exerciseState.sets[activeSetIndex].reps) || 0
                      updateSet(exerciseIndex, activeSetIndex, 'reps', (currentReps + 1).toString())
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 whitespace-nowrap"
                  >
                    +1 Rep
                  </button>
                  <button
                    onClick={() => {
                      const activeSetIndex = exerciseState.sets.findIndex(s => !s.completed)
                      if (activeSetIndex !== -1) loadLastSet(exerciseIndex, activeSetIndex)
                    }}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 whitespace-nowrap flex items-center gap-1"
                  >
                    <ArrowPathIcon className="w-3 h-3" />
                    Wie letztes Mal
                  </button>
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  {exerciseState.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        set.completed
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <span className="w-8 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        {setIndex + 1}
                      </span>

                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="kg"
                          value={set.weight}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                          disabled={set.completed}
                          className="w-20 px-2 py-1.5 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        />
                        <span className="text-gray-400">×</span>
                        <input
                          type="number"
                          placeholder="reps"
                          value={set.reps}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                          disabled={set.completed}
                          className="w-20 px-2 py-1.5 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                        />
                      </div>

                      {set.completed ? (
                        <CheckIcon className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => completeSet(exerciseIndex, setIndex)}
                            disabled={!set.weight || !set.reps}
                            className="p-1.5 bg-health-primary hover:bg-health-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white"
                          >
                            <CheckIcon className="w-5 h-5" />
                          </button>
                          {exerciseState.sets.length > 1 && (
                            <button
                              onClick={() => removeSet(exerciseIndex, setIndex)}
                              className="p-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg"
                            >
                              <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add set button */}
                <button
                  onClick={() => addSet(exerciseIndex)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-health-primary hover:text-health-primary transition-colors flex items-center justify-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Set hinzufügen
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}