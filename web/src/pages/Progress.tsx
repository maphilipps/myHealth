import { useState } from 'react'

type TimeRange = '1w' | '1m' | '3m' | '6m' | '1y'

// Sample progress data
const exerciseProgress = {
  'Bench Press': [
    { date: '2024-10-01', weight: 70, reps: 8 },
    { date: '2024-10-15', weight: 72.5, reps: 8 },
    { date: '2024-11-01', weight: 75, reps: 8 },
    { date: '2024-11-15', weight: 77.5, reps: 7 },
    { date: '2024-12-01', weight: 80, reps: 8 },
    { date: '2024-12-13', weight: 82.5, reps: 8 },
  ],
  'Squat': [
    { date: '2024-10-01', weight: 85, reps: 8 },
    { date: '2024-10-15', weight: 90, reps: 8 },
    { date: '2024-11-01', weight: 92.5, reps: 7 },
    { date: '2024-11-15', weight: 95, reps: 8 },
    { date: '2024-12-01', weight: 100, reps: 8 },
    { date: '2024-12-14', weight: 102.5, reps: 7 },
  ],
  'Deadlift': [
    { date: '2024-10-01', weight: 100, reps: 5 },
    { date: '2024-10-15', weight: 105, reps: 5 },
    { date: '2024-11-01', weight: 110, reps: 5 },
    { date: '2024-11-15', weight: 115, reps: 5 },
    { date: '2024-12-01', weight: 120, reps: 5 },
  ],
}

const bodyStats = {
  weight: [
    { date: '2024-10-01', value: 85.0 },
    { date: '2024-10-15', value: 84.5 },
    { date: '2024-11-01', value: 84.0 },
    { date: '2024-11-15', value: 83.5 },
    { date: '2024-12-01', value: 83.0 },
    { date: '2024-12-15', value: 82.5 },
  ],
  bodyFat: [
    { date: '2024-10-01', value: 18.0 },
    { date: '2024-11-01', value: 17.0 },
    { date: '2024-12-01', value: 16.0 },
    { date: '2024-12-15', value: 15.2 },
  ],
}

export function Progress() {
  const [timeRange, setTimeRange] = useState<TimeRange>('3m')
  const [selectedExercise, setSelectedExercise] = useState('Bench Press')

  const exercises = Object.keys(exerciseProgress)
  const currentExerciseData = exerciseProgress[selectedExercise as keyof typeof exerciseProgress]

  // Calculate progress
  const firstWeight = currentExerciseData[0].weight
  const lastWeight = currentExerciseData[currentExerciseData.length - 1].weight
  const totalGain = lastWeight - firstWeight
  const percentGain = ((totalGain / firstWeight) * 100).toFixed(1)

  // Body stats
  const weightStart = bodyStats.weight[0].value
  const weightEnd = bodyStats.weight[bodyStats.weight.length - 1].value
  const weightLoss = weightStart - weightEnd

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Fortschritt
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Deine Entwicklung über Zeit
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['1w', '1m', '3m', '6m', '1y'] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              timeRange === range
                ? 'bg-health-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            {range === '1w' && '1 Woche'}
            {range === '1m' && '1 Monat'}
            {range === '3m' && '3 Monate'}
            {range === '6m' && '6 Monate'}
            {range === '1y' && '1 Jahr'}
          </button>
        ))}
      </div>

      {/* Body Stats Summary */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          Körper
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Gewicht</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {weightEnd} kg
            </p>
            <p className="text-sm text-green-500">
              -{weightLoss.toFixed(1)} kg
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Körperfett</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {bodyStats.bodyFat[bodyStats.bodyFat.length - 1].value}%
            </p>
            <p className="text-sm text-green-500">
              -{(bodyStats.bodyFat[0].value - bodyStats.bodyFat[bodyStats.bodyFat.length - 1].value).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="mt-4 h-24 flex items-end justify-between gap-1">
          {bodyStats.weight.map((point) => {
            const min = Math.min(...bodyStats.weight.map(p => p.value)) - 1
            const max = Math.max(...bodyStats.weight.map(p => p.value)) + 1
            const height = ((point.value - min) / (max - min)) * 100

            return (
              <div key={point.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-health-primary/60 rounded-t-sm"
                  style={{ height: `${height}%` }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Strength Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Kraft
          </h2>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="input w-auto text-sm"
          >
            {exercises.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500">Start</p>
            <p className="font-bold text-gray-900 dark:text-white">{firstWeight}kg</p>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-500">Aktuell</p>
            <p className="font-bold text-health-primary">{lastWeight}kg</p>
          </div>
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-gray-500">Zuwachs</p>
            <p className="font-bold text-green-600">+{totalGain}kg</p>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="h-32 flex items-end justify-between gap-2">
          {currentExerciseData.map((point) => {
            const min = Math.min(...currentExerciseData.map(p => p.weight)) - 5
            const max = Math.max(...currentExerciseData.map(p => p.weight)) + 5
            const height = ((point.weight - min) / (max - min)) * 100

            return (
              <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{point.weight}</span>
                <div
                  className="w-full bg-health-primary rounded-t-sm transition-all"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400">
                  {new Date(point.date).toLocaleDateString('de-DE', { month: 'short' })}
                </span>
              </div>
            )
          })}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          +{percentGain}% in {currentExerciseData.length - 1} Einheiten
        </p>
      </div>

      {/* PRs */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          🏆 Personal Records
        </h2>
        <div className="space-y-3">
          {exercises.map((ex) => {
            const data = exerciseProgress[ex as keyof typeof exerciseProgress]
            const pr = data[data.length - 1]
            return (
              <div key={ex} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-gray-700 dark:text-gray-300">{ex}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {pr.weight}kg × {pr.reps}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
