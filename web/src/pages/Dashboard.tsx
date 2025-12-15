import { useState, useEffect } from 'react'

interface DailyStats {
  weight?: number
  steps?: number
  calories?: number
  protein?: number
  sleep?: number
  workoutCompleted?: boolean
}

export function Dashboard() {
  const [stats, setStats] = useState<DailyStats>({})
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Guten Morgen')
    else if (hour < 18) setGreeting('Guten Tag')
    else setGreeting('Guten Abend')

    // TODO: Load actual data from API/files
    setStats({
      weight: 82.5,
      steps: 6432,
      calories: 1850,
      protein: 142,
      sleep: 7.5,
      workoutCompleted: true
    })
  }, [])

  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {greeting}, Marc 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{today}</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Gewicht"
          value={stats.weight ? `${stats.weight} kg` : '-'}
          icon="⚖️"
          trend={-0.3}
        />
        <StatCard
          label="Schritte"
          value={stats.steps?.toLocaleString() ?? '-'}
          icon="👣"
          progress={stats.steps ? stats.steps / 10000 : 0}
        />
        <StatCard
          label="Kalorien"
          value={stats.calories?.toLocaleString() ?? '-'}
          icon="🔥"
          subtitle="/ 2,500 kcal"
        />
        <StatCard
          label="Protein"
          value={stats.protein ? `${stats.protein}g` : '-'}
          icon="💪"
          subtitle="/ 165g"
        />
      </div>

      {/* Today's Summary */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Heute
        </h2>
        <div className="space-y-3">
          <SummaryItem
            icon="😴"
            label="Schlaf"
            value={stats.sleep ? `${stats.sleep}h` : '-'}
            status={stats.sleep && stats.sleep >= 7 ? 'good' : 'warning'}
          />
          <SummaryItem
            icon="🏋️"
            label="Training"
            value={stats.workoutCompleted ? 'Torso - Erledigt' : 'Geplant: Torso'}
            status={stats.workoutCompleted ? 'good' : 'pending'}
          />
          <SummaryItem
            icon="💧"
            label="Wasser"
            value="2.1 / 3L"
            status="warning"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Schnellaktionen
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <QuickAction icon="🏋️" label="Workout starten" />
          <QuickAction icon="🍽️" label="Mahlzeit loggen" />
          <QuickAction icon="⚖️" label="Gewicht eintragen" />
          <QuickAction icon="💧" label="Wasser trinken" />
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  icon: string
  trend?: number
  progress?: number
  subtitle?: string
}

function StatCard({ label, value, icon, trend, progress, subtitle }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{icon}</span>
        {trend !== undefined && (
          <span className={`text-sm ${trend < 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend} kg
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-health-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

interface SummaryItemProps {
  icon: string
  label: string
  value: string
  status: 'good' | 'warning' | 'pending'
}

function SummaryItem({ icon, label, value, status }: SummaryItemProps) {
  const statusColors = {
    good: 'text-green-500',
    warning: 'text-amber-500',
    pending: 'text-gray-400'
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
      </div>
      <span className={`font-medium ${statusColors[status]}`}>{value}</span>
    </div>
  )
}

interface QuickActionProps {
  icon: string
  label: string
}

function QuickAction({ icon, label }: QuickActionProps) {
  return (
    <button className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
      <span>{icon}</span>
      <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
    </button>
  )
}
