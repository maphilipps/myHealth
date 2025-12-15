import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

type HistoryTab = 'workouts' | 'nutrition' | 'weight'

// Sample data - in production this would come from YAML files via API
const workoutHistory = [
  {
    date: '2024-12-14',
    type: 'limbs',
    duration: 70,
    feeling: 4,
    highlights: ['Squat 102.5kg', 'RDL 82.5kg'],
  },
  {
    date: '2024-12-13',
    type: 'torso',
    duration: 75,
    feeling: 5,
    highlights: ['Bench PR! 82.5kg x 8', 'Row 72.5kg'],
  },
  {
    date: '2024-12-11',
    type: 'limbs',
    duration: 68,
    feeling: 3,
    highlights: ['Squat 100kg', 'Curls 30kg'],
  },
  {
    date: '2024-12-10',
    type: 'torso',
    duration: 72,
    feeling: 5,
    highlights: ['Bench 80kg x 8', 'OHP 50kg'],
  },
]

const nutritionHistory = [
  { date: '2024-12-15', calories: 1973, protein: 160, target: 2500 },
  { date: '2024-12-14', calories: 2317, protein: 220, target: 2500 },
  { date: '2024-12-13', calories: 2450, protein: 175, target: 2500 },
  { date: '2024-12-12', calories: 2100, protein: 145, target: 2500 },
  { date: '2024-12-11', calories: 2380, protein: 185, target: 2500 },
  { date: '2024-12-10', calories: 2520, protein: 195, target: 2500 },
  { date: '2024-12-09', calories: 2200, protein: 155, target: 2500 },
]

const weightHistory = [
  { date: '2024-12-15', weight: 82.5 },
  { date: '2024-12-14', weight: 82.6 },
  { date: '2024-12-13', weight: 82.7 },
  { date: '2024-12-12', weight: 82.9 },
  { date: '2024-12-11', weight: 82.8 },
  { date: '2024-12-10', weight: 83.0 },
  { date: '2024-12-09', weight: 83.2 },
]

export function History() {
  const [activeTab, setActiveTab] = useState<HistoryTab>('workouts')
  const [weekOffset, setWeekOffset] = useState(0)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const getWeekRange = () => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - start.getDay() + 1 - (weekOffset * 7))
    const end = new Date(start)
    end.setDate(end.getDate() + 6)

    return `${start.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Verlauf
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Deine Fortschritte im Überblick
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {(['workouts', 'nutrition', 'weight'] as HistoryTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {tab === 'workouts' && '🏋️ Workouts'}
            {tab === 'nutrition' && '🍽️ Ernährung'}
            {tab === 'weight' && '⚖️ Gewicht'}
          </button>
        ))}
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <span className="font-medium text-gray-900 dark:text-white">
          {getWeekRange()}
        </span>
        <button
          onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
          disabled={weekOffset === 0}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      {activeTab === 'workouts' && (
        <div className="space-y-3">
          {workoutHistory.map((workout) => (
            <div key={workout.date} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{formatDate(workout.date)}</p>
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {workout.type}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{workout.duration} min</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= workout.feeling ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {workout.highlights.map((highlight, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 text-xs rounded-full ${
                      highlight.includes('PR')
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="space-y-3">
          {nutritionHistory.map((day) => (
            <div key={day.date} className="card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{formatDate(day.date)}</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {day.calories} kcal
                </p>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Kalorien</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {Math.round((day.calories / day.target) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        day.calories >= day.target ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min((day.calories / day.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Protein</span>
                  <span className="text-health-primary font-medium">{day.protein}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'weight' && (
        <div className="space-y-4">
          {/* Mini Chart */}
          <div className="card">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Gewichtsverlauf
            </h3>
            <div className="h-32 flex items-end justify-between gap-1">
              {weightHistory.slice().reverse().map((day) => {
                const min = Math.min(...weightHistory.map(d => d.weight))
                const max = Math.max(...weightHistory.map(d => d.weight))
                const range = max - min || 1
                const height = ((day.weight - min) / range) * 80 + 20

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-health-primary rounded-t-sm transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-400">
                      {new Date(day.date).toLocaleDateString('de-DE', { weekday: 'narrow' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weight List */}
          <div className="space-y-2">
            {weightHistory.map((day, i) => {
              const prev = weightHistory[i + 1]
              const diff = prev ? day.weight - prev.weight : 0

              return (
                <div key={day.date} className="card flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{formatDate(day.date)}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {day.weight} kg
                    </p>
                  </div>
                  {diff !== 0 && (
                    <span className={`text-sm font-medium ${
                      diff < 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
