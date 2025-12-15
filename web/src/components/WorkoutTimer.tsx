import { useState, useEffect, useCallback } from 'react'
import { PlayIcon, PauseIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/solid'

interface WorkoutTimerProps {
  onClose?: () => void
}

const PRESET_TIMES = [
  { label: '30s', seconds: 30 },
  { label: '60s', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
]

export function WorkoutTimer({ onClose }: WorkoutTimerProps) {
  const [timeLeft, setTimeLeft] = useState(90) // Default 90 seconds
  const [initialTime, setInitialTime] = useState(90)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsFinished(true)
            // Play sound or vibrate
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
  }, [isRunning, timeLeft])

  const toggleTimer = useCallback(() => {
    if (isFinished) {
      setTimeLeft(initialTime)
      setIsFinished(false)
    }
    setIsRunning((prev) => !prev)
  }, [isFinished, initialTime])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(initialTime)
    setIsFinished(false)
  }, [initialTime])

  const setPreset = useCallback((seconds: number) => {
    setInitialTime(seconds)
    setTimeLeft(seconds)
    setIsRunning(false)
    setIsFinished(false)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((initialTime - timeLeft) / initialTime) * 100

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          ⏱️ Pausentimer
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Progress Ring */}
      <div className="relative flex items-center justify-center mb-6">
        <svg className="w-40 h-40 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={isFinished ? 'text-green-500' : 'text-health-primary'}
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
            style={{ transition: 'stroke-dashoffset 0.3s' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-4xl font-bold ${isFinished ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
            {formatTime(timeLeft)}
          </span>
          {isFinished && (
            <span className="text-sm text-green-500 font-medium">Fertig!</span>
          )}
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        {PRESET_TIMES.map(({ label, seconds }) => (
          <button
            key={seconds}
            onClick={() => setPreset(seconds)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              initialTime === seconds
                ? 'bg-health-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={resetTimer}
          className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowPathIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={toggleTimer}
          className={`p-4 rounded-full transition-colors ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600'
              : isFinished
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-health-primary hover:bg-health-primary/90'
          }`}
        >
          {isRunning ? (
            <PauseIcon className="w-8 h-8 text-white" />
          ) : (
            <PlayIcon className="w-8 h-8 text-white" />
          )}
        </button>
      </div>
    </div>
  )
}
