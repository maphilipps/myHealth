import { useState } from 'react'

type LogType = 'weight' | 'water' | 'sleep' | 'mood' | 'workout'

interface QuickLogOption {
  id: LogType
  icon: string
  label: string
  unit?: string
}

const logOptions: QuickLogOption[] = [
  { id: 'weight', icon: '⚖️', label: 'Gewicht', unit: 'kg' },
  { id: 'water', icon: '💧', label: 'Wasser', unit: 'ml' },
  { id: 'sleep', icon: '😴', label: 'Schlaf', unit: 'h' },
  { id: 'mood', icon: '😊', label: 'Stimmung' },
  { id: 'workout', icon: '🏋️', label: 'Workout' },
]

export function QuickLog() {
  const [selectedType, setSelectedType] = useState<LogType | null>(null)
  const [value, setValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!selectedType || !value) return

    setIsSaving(true)
    // TODO: Save to YAML file via API
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSaving(false)
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
      setSelectedType(null)
      setValue('')
    }, 1500)
  }

  const renderInput = () => {
    switch (selectedType) {
      case 'weight':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <input
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-4xl font-bold text-center bg-transparent border-none outline-none w-32 text-gray-900 dark:text-white"
                placeholder="82.5"
                autoFocus
              />
              <span className="text-xl text-gray-500 ml-2">kg</span>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Letzter Eintrag: 82.8 kg (gestern)
            </p>
          </div>
        )

      case 'water':
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {[250, 500, 750, 1000].map((ml) => (
                <button
                  key={ml}
                  onClick={() => setValue(ml.toString())}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    value === ml.toString()
                      ? 'bg-health-accent text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {ml}ml
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center">
              Heute: 2.1L / 3L
            </p>
          </div>
        )

      case 'sleep':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-4xl font-bold text-center bg-transparent border-none outline-none w-24 text-gray-900 dark:text-white"
                placeholder="7.5"
                autoFocus
              />
              <span className="text-xl text-gray-500 ml-2">Stunden</span>
            </div>
            <div className="flex justify-center gap-2">
              <span className="text-sm text-gray-500">Qualität:</span>
              {[1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  className="text-xl hover:scale-110 transition-transform"
                >
                  {q <= 3 ? '😴' : q === 4 ? '😊' : '🌟'}
                </button>
              ))}
            </div>
          </div>
        )

      case 'mood':
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 dark:text-gray-300">
              Wie fühlst du dich?
            </p>
            <div className="flex justify-center gap-4">
              {[
                { value: '1', emoji: '😫' },
                { value: '2', emoji: '😕' },
                { value: '3', emoji: '😐' },
                { value: '4', emoji: '😊' },
                { value: '5', emoji: '🤩' },
              ].map(({ value: v, emoji }) => (
                <button
                  key={v}
                  onClick={() => setValue(v)}
                  className={`text-4xl hover:scale-110 transition-transform ${
                    value === v ? 'scale-125' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )

      case 'workout':
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 dark:text-gray-300">
              Was hast du trainiert?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {['Torso', 'Limbs', 'Cardio', 'Rest'].map((type) => (
                <button
                  key={type}
                  onClick={() => setValue(type)}
                  className={`p-3 rounded-lg transition-colors ${
                    value === type
                      ? 'bg-health-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gespeichert!
        </h2>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quick Log
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {selectedType ? 'Wert eingeben' : 'Was möchtest du eintragen?'}
        </p>
      </div>

      {!selectedType ? (
        <div className="grid grid-cols-2 gap-4">
          {logOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedType(option.id)}
              className="card flex flex-col items-center justify-center py-8 hover:border-health-primary transition-colors"
            >
              <span className="text-4xl mb-2">{option.icon}</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="card py-8">
          <div className="text-center mb-6">
            <span className="text-5xl">
              {logOptions.find(o => o.id === selectedType)?.icon}
            </span>
          </div>

          {renderInput()}

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => {
                setSelectedType(null)
                setValue('')
              }}
              className="flex-1 btn-secondary"
            >
              Zurück
            </button>
            <button
              onClick={handleSave}
              disabled={!value || isSaving}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {isSaving ? 'Speichern...' : 'Speichern'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
