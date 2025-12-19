import { useState, useEffect } from 'react'
import { saveApiKey, hasApiKey, clearApiKey } from '../lib/claude-api'
import { getAllTrainingPlans, type TrainingPlan } from '../lib/training-plans'
import {
  getPendingChangesCount,
  downloadPendingChanges,
  clearPendingChanges,
  generateCommitMessage,
  getPendingChanges
} from '../lib/git-integration'
import { useTheme } from '../contexts/ThemeContext'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

export function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [hasKey, setHasKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [commitMessage, setCommitMessage] = useState('')
  const [availablePlans, setAvailablePlans] = useState<TrainingPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState('torso-limbs')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setHasKey(hasApiKey())
    updatePendingStatus()
    setAvailablePlans(getAllTrainingPlans())
    
    const settings = localStorage.getItem('myhealth_settings')
    if (settings) {
      try {
        const parsed = JSON.parse(settings)
        if (parsed.trainingPlan) setSelectedPlan(parsed.trainingPlan)
      } catch (e) {
        console.error('Error parsing settings', e)
      }
    }
  }, [])

  const updatePendingStatus = () => {
    const count = getPendingChangesCount()
    setPendingCount(count)
    if (count > 0) {
      setCommitMessage(generateCommitMessage(getPendingChanges()))
    }
  }

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim())
      setHasKey(true)
      setSaved(true)
      setApiKey('')
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId)
    const settings = localStorage.getItem('myhealth_settings')
    const currentSettings = settings ? JSON.parse(settings) : {}
    localStorage.setItem('myhealth_settings', JSON.stringify({
      ...currentSettings,
      trainingPlan: planId
    }))
  }

  const handleClear = () => {
    clearApiKey()
    setHasKey(false)
  }

  const handleExport = () => {
    downloadPendingChanges()
  }

  const handleClearPending = () => {
    if (confirm('Alle ausstehenden Änderungen verwerfen?')) {
      clearPendingChanges()
      updatePendingStatus()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Einstellungen
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          App-Konfiguration
        </p>
      </div>

      {/* Pending Changes Alert */}
      {pendingCount > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-200">
                📝 {pendingCount} ausstehende Änderung{pendingCount > 1 ? 'en' : ''}
              </h3>
              <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                {commitMessage}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors"
            >
              Als YAML exportieren
            </button>
            <button
              onClick={handleClearPending}
              className="px-3 py-1.5 text-amber-600 text-sm hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
            >
              Verwerfen
            </button>
          </div>
        </div>
      )}

      {/* Appearance Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Erscheinungsbild
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Farbschema
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  theme === 'light'
                    ? 'border-health-primary bg-health-primary/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <SunIcon className={`w-6 h-6 ${theme === 'light' ? 'text-health-primary' : 'text-gray-500'}`} />
                <span className={`text-sm ${theme === 'light' ? 'text-health-primary font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                  Hell
                </span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-health-primary bg-health-primary/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <MoonIcon className={`w-6 h-6 ${theme === 'dark' ? 'text-health-primary' : 'text-gray-500'}`} />
                <span className={`text-sm ${theme === 'dark' ? 'text-health-primary font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                  Dunkel
                </span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  theme === 'system'
                    ? 'border-health-primary bg-health-primary/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <ComputerDesktopIcon className={`w-6 h-6 ${theme === 'system' ? 'text-health-primary' : 'text-gray-500'}`} />
                <span className={`text-sm ${theme === 'system' ? 'text-health-primary font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                  System
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Claude API
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Anthropic API Key
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Für den Workout-Chat wird ein Anthropic API Key benötigt.
              Du kannst einen Key auf{' '}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-health-primary hover:underline"
              >
                console.anthropic.com
              </a>
              {' '}erstellen.
            </p>

            {hasKey ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <span className="text-green-700 dark:text-green-400">
                    ✓ API Key konfiguriert
                  </span>
                </div>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Entfernen
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-api..."
                  className="input"
                />
                <button
                  onClick={handleSave}
                  disabled={!apiKey.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Speichern
                </button>
              </div>
            )}

            {saved && (
              <p className="mt-2 text-sm text-green-600">
                API Key gespeichert!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Profil
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              defaultValue="Marc"
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ziel-Kalorien
              </label>
              <input
                type="number"
                defaultValue={2500}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ziel-Protein (g)
              </label>
              <input
                type="number"
                defaultValue={165}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trainingsplan
            </label>
            <select 
              className="input" 
              value={selectedPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
            >
              {availablePlans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daten
        </h2>

        <div className="space-y-3">
          <button className="w-full py-3 text-left px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="font-medium text-gray-900 dark:text-white">Apple Health Sync</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Importiere Daten aus Apple Health
            </p>
          </button>

          <button className="w-full py-3 text-left px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="font-medium text-gray-900 dark:text-white">Yazio Import</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Importiere Ernährungsdaten aus Yazio
            </p>
          </button>

          <button
            onClick={handleExport}
            className="w-full py-3 text-left px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">Daten exportieren</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alle Daten als YAML herunterladen
            </p>
          </button>
        </div>
      </div>

      {/* Git Integration Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Git Integration
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Änderungen werden lokal gespeichert und können als YAML exportiert werden.
          Um sie in Git zu committen:
        </p>
        <pre className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs overflow-x-auto">
          <code className="text-gray-800 dark:text-gray-200">
{`cd ~/Documents/myHealth
git add data/
git commit -m "data: Update health data"`}
          </code>
        </pre>
      </div>

      {/* Version */}
      <div className="text-center text-sm text-gray-400">
        myHealth v0.1.0
      </div>
    </div>
  )
}