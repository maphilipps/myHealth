import { useState, useEffect } from 'react'
import { saveApiKey, hasApiKey, clearApiKey } from '../lib/claude-api'

export function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [hasKey, setHasKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setHasKey(hasApiKey())
  }, [])

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim())
      setHasKey(true)
      setSaved(true)
      setApiKey('')
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleClear = () => {
    clearApiKey()
    setHasKey(false)
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
            <select className="input" defaultValue="torso-limbs">
              <option value="torso-limbs">Torso-Limbs Split</option>
              <option value="push-pull-legs">Push Pull Legs</option>
              <option value="upper-lower">Upper Lower</option>
              <option value="full-body">Full Body</option>
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
            <span className="font-medium">Apple Health Sync</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Importiere Daten aus Apple Health
            </p>
          </button>

          <button className="w-full py-3 text-left px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="font-medium">Yazio Import</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Importiere Ernährungsdaten aus Yazio
            </p>
          </button>

          <button className="w-full py-3 text-left px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="font-medium">Daten exportieren</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alle Daten als YAML herunterladen
            </p>
          </button>
        </div>
      </div>

      {/* Version */}
      <div className="text-center text-sm text-gray-400">
        myHealth v0.1.0
      </div>
    </div>
  )
}
