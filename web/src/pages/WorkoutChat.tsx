import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon, CameraIcon } from '@heroicons/react/24/solid'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function WorkoutChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hey! 💪 Bereit fürs Training? Ich kann dir bei deinem Workout helfen - schick mir einfach ein Foto deines letzten Trainings oder sag mir, welche Übung du machen willst.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // TODO: Connect to Claude API
    // Simulate response for now
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(input),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-10 h-10 rounded-full bg-health-primary flex items-center justify-center text-white text-xl">
          🏋️
        </div>
        <div>
          <h1 className="font-semibold text-gray-900 dark:text-white">Workout Coach</h1>
          <p className="text-sm text-green-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`chat-bubble ${
                message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-bubble chat-bubble-assistant">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-end gap-2">
          <button
            className="p-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title="Foto aufnehmen"
          >
            <CameraIcon className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nachricht schreiben..."
              rows={1}
              className="input resize-none pr-12"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-health-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function getSimulatedResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes('bench') || lowerInput.includes('bankdrücken')) {
    return `Basierend auf deinem letzten Training empfehle ich:

**Bankdrücken heute:**
• Satz 1: 82.5kg × 6-8 Wdh
• Satz 2: 82.5kg × 6-8 Wdh
• Satz 3: 80kg × 8-10 Wdh

Letzte Woche: 80kg × 8, 8, 7 @ RPE 8

Da du alle Sätze gut geschafft hast, erhöhen wir auf 82.5kg! 💪

Brauchst du Form-Tipps?`
  }

  if (lowerInput.includes('squat') || lowerInput.includes('kniebeuge')) {
    return `Für Kniebeugen heute:

**Kniebeugen:**
• Satz 1: 100kg × 6-8 Wdh
• Satz 2: 100kg × 6-8 Wdh
• Satz 3: 95kg × 8-10 Wdh

Form-Fokus:
• Schulterblätter zusammen
• Core anspannen
• Tiefe: Hüfte unter Knie

Ready? 🏋️`
  }

  if (lowerInput.includes('training') || lowerInput.includes('workout') || lowerInput.includes('plan')) {
    return `Heute steht **Torso-Training** an! Hier dein Plan:

1. **Bankdrücken**: 4×6-8
2. **Rudern**: 3×8-10
3. **Schulterdrücken**: 3×8-10
4. **Latzug**: 3×10-12
5. **Cable Fly**: 3×12-15
6. **Face Pull**: 3×15

Soll ich dir die Gewichte für jede Übung berechnen?`
  }

  return `Alles klar! Ich kann dir helfen mit:

• 📊 Gewichte für heute berechnen
• 📝 Dein Training planen
• 💪 Form-Tipps geben
• 📈 Deinen Fortschritt analysieren

Was möchtest du machen?`
}
