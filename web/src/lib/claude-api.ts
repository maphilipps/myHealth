// Claude API Integration für Workout Chat
// Verwendet den Anthropic SDK

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface WorkoutContext {
  currentPlan?: string
  lastWorkout?: {
    date: string
    type: string
    exercises: Array<{
      name: string
      sets: Array<{ weight: number; reps: number; rpe?: number }>
    }>
  }
  bodyWeight?: number
}

const SYSTEM_PROMPT = `Du bist ein erfahrener Workout-Coach und Fitness-Experte. Du hilfst beim Training mit:

1. **Übungsauswahl**: Empfehle passende Übungen basierend auf dem Trainingsplan
2. **Progressive Overload**: Schlage Gewichtssteigerungen vor basierend auf vergangenen Leistungen
3. **Form-Tipps**: Gib Technik-Hinweise für saubere Ausführung
4. **Motivation**: Sei unterstützend und ermutigend

Antworte auf Deutsch, kurz und prägnant. Nutze Emojis sparsam.

Wenn der Nutzer ein Foto seines Trainings schickt, analysiere es und extrahiere:
- Übungsname
- Gewicht
- Wiederholungen
- Sätze

Formatiere Workout-Daten immer so, dass sie später als YAML gespeichert werden können.`

export async function sendMessage(
  messages: Message[],
  context?: WorkoutContext,
  apiKey?: string
): Promise<string> {
  // API Key aus localStorage oder Parameter
  const key = apiKey || localStorage.getItem('anthropic_api_key')

  if (!key) {
    throw new Error('API Key nicht konfiguriert. Gehe zu Einstellungen.')
  }

  // Context als System-Message-Erweiterung
  let systemMessage = SYSTEM_PROMPT
  if (context) {
    systemMessage += `\n\n## Aktueller Kontext\n`
    if (context.currentPlan) {
      systemMessage += `- Trainingsplan: ${context.currentPlan}\n`
    }
    if (context.bodyWeight) {
      systemMessage += `- Körpergewicht: ${context.bodyWeight} kg\n`
    }
    if (context.lastWorkout) {
      systemMessage += `- Letztes Training: ${context.lastWorkout.type} am ${context.lastWorkout.date}\n`
    }
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemMessage,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'API Fehler')
    }

    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Unbekannter Fehler bei der API-Anfrage')
  }
}

export async function analyzeWorkoutImage(
  imageBase64: string,
  apiKey?: string
): Promise<string> {
  const key = apiKey || localStorage.getItem('anthropic_api_key')

  if (!key) {
    throw new Error('API Key nicht konfiguriert')
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `Du analysierst Workout-Fotos und extrahierst die Trainingsdaten.
Gib die Daten in diesem Format zurück:

Übung: [Name]
Sätze:
  1. [Gewicht]kg x [Reps]
  2. [Gewicht]kg x [Reps]
  ...

Falls du das Bild nicht lesen kannst oder es kein Workout-Foto ist, sag das freundlich.`,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: 'Analysiere dieses Workout-Foto und extrahiere die Trainingsdaten.',
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'API Fehler')
    }

    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Fehler bei der Bildanalyse')
  }
}

// Hilfsfunktion zum Speichern des API Keys
export function saveApiKey(key: string): void {
  localStorage.setItem('anthropic_api_key', key)
}

// Hilfsfunktion zum Prüfen ob API Key vorhanden
export function hasApiKey(): boolean {
  return !!localStorage.getItem('anthropic_api_key')
}

// API Key löschen
export function clearApiKey(): void {
  localStorage.removeItem('anthropic_api_key')
}
