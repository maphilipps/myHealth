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

// ====== PHASE 2: Natural Language Workout Parser ======

export interface ParsedSet {
  exercise: string
  weight: number
  reps: number
  rpe?: number
  sets?: number // für "3x8" Format
}

export interface ParsedWorkout {
  sets: ParsedSet[]
  workoutType?: string
  notes?: string
}

export interface WorkoutParseContext {
  lastSession?: {
    type: string
    date: string
    exercises: Array<{ name: string; weight: number; reps: number }>
  }
  recentWeights?: Record<string, number> // exerciseName -> lastWeight
  availableExercises?: string[]
}

const WORKOUT_PARSER_PROMPT = `Du bist ein Workout-Text-Parser. Analysiere den Text und extrahiere strukturierte Workout-Daten.

## Eingabe-Formate die du verstehst:
- "3x8 Bankdrücken mit 80kg" → 3 Sätze, 8 Reps, 80kg
- "Bench 4x8 80kg RPE 8" → 4 Sätze, 8 Reps, 80kg, RPE 8
- "Heute Brust: Bench 4x8, Incline 3x10, Flyes 3x12" → Mehrere Übungen
- "Wie letzte Woche aber 2.5kg mehr" → Kontext-basiert
- "80kg 8 Wiederholungen Bankdrücken" → Freie Reihenfolge
- "3 Sätze Kniebeugen je 100kg 5 Reps" → Deutsche Begriffe

## Übungs-Aliase:
- Bench/Bankdrücken/BP → Bench Press
- Squat/Kniebeugen/KB → Barbell Squat
- DL/Kreuzheben → Deadlift
- OHP/Schulterdrücken → Overhead Press
- Row/Rudern → Barbell Row

## Ausgabe-Format:
Antworte NUR mit validem JSON:
{
  "sets": [
    {"exercise": "Bench Press", "weight": 80, "reps": 8, "rpe": 8, "sets": 3},
    {"exercise": "Incline Bench Press", "weight": 60, "reps": 10, "sets": 3}
  ],
  "workoutType": "upper",
  "notes": "Optional: Notizen aus dem Text"
}

Wenn du den Text nicht parsen kannst, antworte mit:
{"error": "Beschreibung des Problems", "sets": []}`

/**
 * Parse natural language workout text into structured data
 *
 * @example
 * parseWorkoutText("3x8 Bankdrücken 80kg RPE 8")
 * // Returns: { sets: [{ exercise: "Bench Press", weight: 80, reps: 8, rpe: 8, sets: 3 }] }
 *
 * @example
 * parseWorkoutText("Wie letzte Woche aber 2.5kg mehr", { recentWeights: { "Bench Press": 77.5 } })
 * // Returns: { sets: [{ exercise: "Bench Press", weight: 80, reps: 8 }] }
 */
export async function parseWorkoutText(
  text: string,
  context?: WorkoutParseContext,
  apiKey?: string
): Promise<ParsedWorkout> {
  const key = apiKey || localStorage.getItem('anthropic_api_key')

  if (!key) {
    throw new Error('API Key nicht konfiguriert')
  }

  // Build context-aware prompt
  let contextInfo = ''
  if (context) {
    if (context.lastSession) {
      contextInfo += `\n## Letzte Session:\n- Typ: ${context.lastSession.type}\n- Datum: ${context.lastSession.date}\n- Übungen: ${JSON.stringify(context.lastSession.exercises)}`
    }
    if (context.recentWeights) {
      contextInfo += `\n## Letzte Gewichte:\n${Object.entries(context.recentWeights).map(([ex, w]) => `- ${ex}: ${w}kg`).join('\n')}`
    }
    if (context.availableExercises) {
      contextInfo += `\n## Verfügbare Übungen:\n${context.availableExercises.join(', ')}`
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
        system: WORKOUT_PARSER_PROMPT + contextInfo,
        messages: [
          {
            role: 'user',
            content: `Parse diesen Workout-Text:\n\n"${text}"`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'API Fehler')
    }

    const data = await response.json()
    const responseText = data.content[0].text

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { sets: [], notes: 'Konnte Text nicht parsen' }
    }

    const parsed = JSON.parse(jsonMatch[0]) as ParsedWorkout

    // Expand sets if "sets" count is provided
    const expandedSets: ParsedSet[] = []
    for (const set of parsed.sets) {
      if (set.sets && set.sets > 1) {
        for (let i = 0; i < set.sets; i++) {
          expandedSets.push({
            exercise: set.exercise,
            weight: set.weight,
            reps: set.reps,
            rpe: set.rpe,
          })
        }
      } else {
        expandedSets.push({
          exercise: set.exercise,
          weight: set.weight,
          reps: set.reps,
          rpe: set.rpe,
        })
      }
    }

    return {
      sets: expandedSets,
      workoutType: parsed.workoutType,
      notes: parsed.notes,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Fehler beim Parsen des Workout-Texts')
  }
}

/**
 * Quick workout suggestions based on context
 */
export async function getWorkoutSuggestion(
  context: WorkoutParseContext,
  apiKey?: string
): Promise<string> {
  const key = apiKey || localStorage.getItem('anthropic_api_key')

  if (!key) {
    throw new Error('API Key nicht konfiguriert')
  }

  const prompt = `Basierend auf dem Kontext, schlage ein kurzes Workout vor.
Kontext:
- Letzte Session: ${context.lastSession?.type || 'unbekannt'} am ${context.lastSession?.date || 'unbekannt'}
- Letzte Gewichte: ${JSON.stringify(context.recentWeights || {})}

Gib eine kurze Empfehlung (2-3 Sätze) und dann ein Beispiel-Workout als Text, den der Nutzer direkt zum Parsen verwenden kann.`

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
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error('API Fehler')
    }

    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    throw new Error('Fehler bei der Workout-Empfehlung')
  }
}

// ====== PHASE 3: Text-to-Plan & Smart Suggestions ======

export interface GeneratedPlan {
  name: string
  description?: string
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'hybrid'
  daysPerWeek: number
  days: GeneratedPlanDay[]
}

export interface GeneratedPlanDay {
  dayNumber: number
  name: string
  workoutType: string
  exercises: GeneratedPlanExercise[]
}

export interface GeneratedPlanExercise {
  exerciseName: string
  sets: number
  repsMin: number
  repsMax: number
  restSeconds: number
}

export interface WorkoutSuggestion {
  recommendedType: string
  reasoning: string
  confidence: number
  alternativeType?: string
}

const TEXT_TO_PLAN_PROMPT = `Du bist ein Trainingsplan-Generator. Erstelle strukturierte Trainingspläne basierend auf Benutzerwünschen.

## Ausgabe-Format:
Antworte NUR mit validem JSON:
{
  "name": "Plan Name",
  "description": "Kurze Beschreibung",
  "goal": "hypertrophy|strength|endurance|hybrid",
  "daysPerWeek": 4,
  "days": [
    {
      "dayNumber": 1,
      "name": "Upper A",
      "workoutType": "upper|lower|push|pull|legs|torso|limbs|fullBody",
      "exercises": [
        {"exerciseName": "Bench Press", "sets": 4, "repsMin": 8, "repsMax": 12, "restSeconds": 90}
      ]
    }
  ]
}

## Regeln:
- Balanciere Push/Pull-Verhältnis
- Compound-Übungen zuerst
- Angemessene Rest-Zeiten (60-180s)
- Rep-Ranges passend zum Ziel`

/**
 * Generate a training plan from natural language
 *
 * @example
 * generatePlanFromText("4-Tage Upper/Lower Split für Hypertrophie")
 */
export async function generatePlanFromText(
  text: string,
  availableExercises?: string[],
  apiKey?: string
): Promise<GeneratedPlan> {
  const key = apiKey || localStorage.getItem('anthropic_api_key')

  if (!key) {
    throw new Error('API Key nicht konfiguriert')
  }

  let systemPrompt = TEXT_TO_PLAN_PROMPT
  if (availableExercises?.length) {
    systemPrompt += `\n\n## Verfügbare Übungen:\n${availableExercises.join(', ')}`
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
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Erstelle einen Trainingsplan: ${text}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'API Fehler')
    }

    const data = await response.json()
    const responseText = data.content[0].text

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Konnte Plan nicht parsen')
    }

    return JSON.parse(jsonMatch[0]) as GeneratedPlan
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Fehler bei der Plan-Generierung')
  }
}

/**
 * Get smart workout suggestion based on history
 */
export async function getSmartSuggestion(
  lastWorkouts: Array<{
    date: string
    workoutType: string
    exerciseCount: number
    totalSets: number
  }>,
  apiKey?: string
): Promise<WorkoutSuggestion> {
  const key = apiKey || localStorage.getItem('anthropic_api_key')

  if (!key) {
    throw new Error('API Key nicht konfiguriert')
  }

  const historyContext = lastWorkouts
    .map((w) => `- ${w.date}: ${w.workoutType} (${w.exerciseCount} Übungen, ${w.totalSets} Sätze)`)
    .join('\n')

  const systemPrompt = `Du bist ein Trainings-Coach. Analysiere die Trainingshistorie und empfehle das nächste Workout.

## Regeln:
- Achte auf ausreichende Regeneration (48h pro Muskelgruppe)
- Balanciere Push/Pull über die Woche
- Berücksichtige Frequenz pro Muskelgruppe

## Ausgabe-Format:
Antworte NUR mit validem JSON:
{
  "recommendedType": "torso|limbs|push|pull|legs|upper|lower|fullBody",
  "reasoning": "Kurze Begründung (1-2 Sätze)",
  "confidence": 0.85,
  "alternativeType": "optional alternative"
}`

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
        max_tokens: 512,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Letzte Workouts:\n${historyContext}\n\nWas soll ich heute trainieren?`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('API Fehler')
    }

    const data = await response.json()
    const responseText = data.content[0].text

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Konnte Empfehlung nicht parsen')
    }

    return JSON.parse(jsonMatch[0]) as WorkoutSuggestion
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Fehler bei der Workout-Empfehlung')
  }
}
