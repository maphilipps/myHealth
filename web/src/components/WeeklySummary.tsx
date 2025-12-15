import { useMemo } from 'react'
import { getWeeklyStats, getDailyLogs, getWorkouts } from '../lib/data-service'

interface WeeklySummaryProps {
  weeksAgo?: number
}

export function WeeklySummary({ weeksAgo = 0 }: WeeklySummaryProps) {
  const stats = useMemo(() => getWeeklyStats(weeksAgo), [weeksAgo])
  const prevStats = useMemo(() => getWeeklyStats(weeksAgo + 1), [weeksAgo])

  const dailyLogs = useMemo(() => getDailyLogs(), [])
  const workouts = useMemo(() => getWorkouts(), [])

  // Calculate week dates
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() - (weeksAgo * 7))
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
  }

  const weekLabel = weeksAgo === 0
    ? 'Diese Woche'
    : weeksAgo === 1
    ? 'Letzte Woche'
    : `Vor ${weeksAgo} Wochen`

  // Calculate differences
  const weightDiff = stats.avgWeight && prevStats.avgWeight
    ? stats.avgWeight - prevStats.avgWeight
    : null
  const stepsDiff = stats.avgSteps && prevStats.avgSteps
    ? stats.avgSteps - prevStats.avgSteps
    : null
  const sleepDiff = stats.avgSleep && prevStats.avgSleep
    ? stats.avgSleep - prevStats.avgSleep
    : null

  // Get workout types this week
  const weekWorkouts = workouts.filter(w => {
    const date = new Date(w.date)
    return date >= startOfWeek && date <= endOfWeek
  })
  const workoutTypes = [...new Set(weekWorkouts.map(w => w.type))]

  // Calculate streak (consecutive days with logs)
  const calculateStreak = () => {
    const sortedLogs = [...dailyLogs].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]

      if (sortedLogs.some(log => log.date === dateStr)) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    return streak
  }

  const streak = calculateStreak()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            📊 {weekLabel}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(startOfWeek)} - {formatDate(endOfWeek)}
          </p>
        </div>
        {streak > 1 && (
          <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
              🔥 {streak} Tage Streak
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Weight */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">⚖️ Gewicht</span>
            {weightDiff !== null && (
              <span className={`text-xs font-medium ${weightDiff < 0 ? 'text-green-500' : weightDiff > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} kg
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.avgWeight ? `${stats.avgWeight.toFixed(1)} kg` : '-'}
          </p>
          <p className="text-xs text-gray-400">Ø Durchschnitt</p>
        </div>

        {/* Workouts */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <span className="text-sm text-gray-500 dark:text-gray-400">🏋️ Workouts</span>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.totalWorkouts}
          </p>
          <p className="text-xs text-gray-400">
            {workoutTypes.length > 0 ? workoutTypes.join(', ') : 'Keine'}
          </p>
        </div>

        {/* Sleep */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">😴 Schlaf</span>
            {sleepDiff !== null && (
              <span className={`text-xs font-medium ${sleepDiff > 0 ? 'text-green-500' : sleepDiff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {sleepDiff > 0 ? '+' : ''}{sleepDiff.toFixed(1)}h
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.avgSleep ? `${stats.avgSleep.toFixed(1)}h` : '-'}
          </p>
          <p className="text-xs text-gray-400">Ø pro Nacht</p>
        </div>

        {/* Steps */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">👣 Schritte</span>
            {stepsDiff !== null && (
              <span className={`text-xs font-medium ${stepsDiff > 0 ? 'text-green-500' : stepsDiff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {stepsDiff > 0 ? '+' : ''}{stepsDiff.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {stats.avgSteps ? stats.avgSteps.toLocaleString() : '-'}
          </p>
          <p className="text-xs text-gray-400">Ø pro Tag</p>
        </div>
      </div>

      {/* Water */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-600 dark:text-blue-400">💧 Wasser</span>
          <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {stats.avgWater ? `${stats.avgWater.toFixed(1)}L` : '-'} / Tag
          </span>
        </div>
        {stats.avgWater > 0 && (
          <div className="mt-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${Math.min((stats.avgWater / 3) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
