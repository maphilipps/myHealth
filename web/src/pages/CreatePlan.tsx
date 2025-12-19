import { useState } from 'react'
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { generatePlanFromText, type GeneratedPlan } from '../lib/claude-api'
import { saveTrainingPlan } from '../lib/data-service'
import type { TrainingPlan, TrainingDay, Exercise } from '../lib/training-plans'

export function CreatePlan() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setError(null)
    setGeneratedPlan(null)
    setSaved(false)

    try {
      const plan = await generatePlanFromText(input)
      setGeneratedPlan(plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler bei der Plan-Erstellung')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!generatedPlan) return

    const newPlan: TrainingPlan = {
      id: `plan-${Date.now()}`,
      name: generatedPlan.name,
      restDays: 7 - generatedPlan.daysPerWeek, // Rough approximation
      days: generatedPlan.days.map((day): TrainingDay => ({
        id: `day-${day.dayNumber}`,
        name: day.name,
        shortName: day.workoutType.substring(0, 3).toUpperCase(), // e.g. UPP, LOW
        exercises: day.exercises.map((ex): Exercise => ({
          id: ex.exerciseName.toLowerCase().replace(/\s+/g, '-'),
          name: ex.exerciseName,
          muscleGroup: 'Mixed', // API doesn't return muscle group yet
          defaultSets: ex.sets,
          defaultReps: `${ex.repsMin}-${ex.repsMax}`,
          notes: `Rest: ${ex.restSeconds}s`
        }))
      }))
    }

    saveTrainingPlan(newPlan)
    setSaved(true)
    // Optional: Redirect or show success
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-10 h-10 rounded-full bg-health-primary flex items-center justify-center text-white text-xl">
          📝
        </div>
        <div>
          <h1 className="font-semibold text-gray-900 dark:text-white">Neuen Plan erstellen</h1>
          <p className="text-sm text-gray-500">Beschreibe deine Ziele und Wünsche</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="z.B. 'Ich möchte einen 4-Tage Split für Muskelaufbau, Fokus auf Oberkörper. Equipment: Langhantel und Kurzhanteln.'"
          className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-health-primary focus:outline-none resize-none"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={!input.trim() || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-health-primary text-white rounded-lg disabled:opacity-50 hover:bg-emerald-600 transition-colors"
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Generiere...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-5 h-5" />
                Plan generieren
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {generatedPlan && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vorschau</h2>
            {saved ? (
              <span className="text-green-500 font-medium flex items-center gap-1">
                ✓ Gespeichert
              </span>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Plan speichern
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg">{generatedPlan.name}</h3>
              <p className="text-sm text-gray-500">{generatedPlan.description}</p>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                  {generatedPlan.daysPerWeek} Tage/Woche
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full capitalize">
                  {generatedPlan.goal}
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {generatedPlan.days.map((day) => (
                <div key={day.dayNumber} className="p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                      {day.dayNumber}
                    </span>
                    {day.name}
                  </h4>
                  <div className="space-y-2 pl-8">
                    {day.exercises.map((ex, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{ex.exerciseName}</span>
                        <span className="text-gray-500 font-mono">
                          {ex.sets} × {ex.repsMin}-{ex.repsMax}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
