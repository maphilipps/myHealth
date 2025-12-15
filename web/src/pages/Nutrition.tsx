import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'

interface Meal {
  id: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  time: string
  items: string[]
  calories: number
  protein: number
}

const mealTypes = [
  { id: 'breakfast', label: 'Frühstück', icon: '🌅', time: '07:00 - 10:00' },
  { id: 'lunch', label: 'Mittagessen', icon: '☀️', time: '11:00 - 14:00' },
  { id: 'dinner', label: 'Abendessen', icon: '🌙', time: '17:00 - 21:00' },
  { id: 'snack', label: 'Snack', icon: '🍎', time: 'Jederzeit' },
]

export function Nutrition() {
  const [meals, _setMeals] = useState<Meal[]>([
    {
      id: '1',
      type: 'breakfast',
      time: '08:30',
      items: ['Haferflocken mit Beeren', 'Protein Shake'],
      calories: 500,
      protein: 42
    },
    {
      id: '2',
      type: 'lunch',
      time: '12:30',
      items: ['Hähnchenbrust 200g', 'Reis 150g', 'Brokkoli'],
      calories: 650,
      protein: 58
    }
  ])

  const [showAddMeal, setShowAddMeal] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null)

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0)
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0)

  const calorieTarget = 2500
  const proteinTarget = 165

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Ernährung
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Macro Overview */}
      <div className="card">
        <div className="grid grid-cols-2 gap-4">
          <MacroProgress
            label="Kalorien"
            current={totalCalories}
            target={calorieTarget}
            unit="kcal"
            color="bg-amber-500"
          />
          <MacroProgress
            label="Protein"
            current={totalProtein}
            target={proteinTarget}
            unit="g"
            color="bg-health-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round((totalProtein / totalCalories) * 400) || 0}%
            </p>
            <p className="text-sm text-gray-500">Protein-Anteil</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {meals.length}
            </p>
            <p className="text-sm text-gray-500">Mahlzeiten</p>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mahlzeiten
          </h2>
          <button
            onClick={() => setShowAddMeal(true)}
            className="flex items-center gap-1 text-health-primary text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            Hinzufügen
          </button>
        </div>

        {mealTypes.map((mealType) => {
          const mealForType = meals.find(m => m.type === mealType.id)

          return (
            <div key={mealType.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mealType.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {mealType.label}
                    </h3>
                    <p className="text-sm text-gray-500">{mealType.time}</p>
                  </div>
                </div>
                {mealForType && (
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {mealForType.calories} kcal
                    </p>
                    <p className="text-sm text-health-primary">
                      {mealForType.protein}g Protein
                    </p>
                  </div>
                )}
              </div>

              {mealForType ? (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {mealForType.items.join(' • ')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {mealForType.time} Uhr
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedMealType(mealType.id)
                    setShowAddMeal(true)
                  }}
                  className="mt-3 w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg text-gray-400 text-sm hover:border-health-primary hover:text-health-primary transition-colors"
                >
                  + Mahlzeit hinzufügen
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-t-2xl p-6 safe-area-inset">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Mahlzeit hinzufügen
              </h2>
              <button
                onClick={() => {
                  setShowAddMeal(false)
                  setSelectedMealType(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mahlzeit-Typ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedMealType(type.id)}
                      className={`p-3 rounded-lg flex items-center gap-2 transition-colors ${
                        selectedMealType === type.id
                          ? 'bg-health-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Was hast du gegessen?
                </label>
                <textarea
                  placeholder="z.B. Hähnchenbrust 200g, Reis 150g..."
                  className="input h-24 resize-none"
                />
              </div>

              <button
                onClick={() => {
                  // TODO: Parse and save meal
                  setShowAddMeal(false)
                  setSelectedMealType(null)
                }}
                className="w-full btn-primary"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface MacroProgressProps {
  label: string
  current: number
  target: number
  unit: string
  color: string
}

function MacroProgress({ label, current, target, unit, color }: MacroProgressProps) {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-xs text-gray-400">
          {current} / {target} {unit}
        </span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-right text-xs text-gray-500 mt-1">
        {Math.round(percentage)}%
      </p>
    </div>
  )
}
