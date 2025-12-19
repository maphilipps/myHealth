/**
 * Fitness Agents - Agent-First Architecture
 *
 * This is the main orchestrator that provides access to all fitness agents.
 * The agents ARE the business logic - no hardcoded algorithms.
 *
 * Agent Team:
 * - PlannerAgent: Long-term planning, periodization, programs
 * - CoachAgent: Real-time coaching, weight recommendations, motivation
 * - AnalystAgent: Pattern recognition, insights, trends
 * - ReporterAgent: Summaries, reports, communication
 */

import { query } from "@anthropic-ai/claude-agent-sdk";
import { config } from "dotenv";
import { supabaseToolsServer } from "./tools/supabase.js";
import type {
  PlanChatMessageDTO,
  ConversationMessage,
  ContentBlock,
  PlannerConversationResult,
  GeneratedPlanPreview
} from "./types/conversation.js";

// Load environment variables
config();

// Validate required env vars
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is required");
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
}

/**
 * Agent Definitions
 *
 * Each agent has a specific role, system prompt, and tool access.
 * The main orchestrator automatically routes requests to the appropriate agent.
 */
const agentDefinitions = {
  // ==================== PLANNER AGENT ====================
  "planner-agent": {
    description: `Strategic fitness planner for long-term training program design.
Use this agent when the user wants to:
- Create or modify training plans
- Plan periodization and cycles
- Choose splits (Upper/Lower, PPL, Full Body)
- Design programs for specific goals
- Plan deload weeks
- Adjust training frequency`,

    prompt: `Du bist der PlannerAgent - ein erfahrener Trainingsplaner mit Expertise in Periodisierung und Programmdesign.

DEINE ROLLE:
Du denkst in WOCHEN und MONATEN, nicht in einzelnen Sets. Du bist der Stratege.

WICHTIG - KEINE ALGORITHMEN:
Du entscheidest NICHT mit festen Formeln. Stattdessen analysierst du:
- User-Profil: Ziele, Erfahrung, Verletzungen, Präferenzen
- Verfügbare Ausrüstung
- Trainingshistorie und bisherige Fortschritte
- Erholung und Lebenssituation

DEINE ENTSCHEIDUNGSFINDUNG:
- Split-Auswahl: Basierend auf Tagen, Erfahrung, Ziel, Präferenzen
- Periodisierung: Volume → Intensity → Peak → Deload (FLEXIBEL, nicht starr!)
- Übungsauswahl: Equipment, Präferenzen, Schwachstellen berücksichtigen

KOMMUNIKATION:
- Erkläre deine Entscheidungen
- Biete Alternativen an
- Frage nach wenn unklar
- Sei motivierend aber realistisch

WORKFLOW:
1. Hole User-Profil und Equipment
2. Analysiere Trainingshistorie
3. Erstelle oder modifiziere Plan
4. Erkläre die Entscheidungen`,

    tools: [
      "mcp__fitness-data__get_user_profile",
      "mcp__fitness-data__get_equipment_available",
      "mcp__fitness-data__get_training_history",
      "mcp__fitness-data__get_current_plan",
      "mcp__fitness-data__get_exercise_library",
      "mcp__fitness-data__create_plan",
      "mcp__fitness-data__update_plan"
    ],
    model: "sonnet" as const
  },

  // ==================== COACH AGENT ====================
  "coach-agent": {
    description: `Real-time personal trainer for live workout coaching.
Use this agent when the user wants to:
- Start a workout session
- Get weight/rep recommendations
- Log sets and exercises
- Get form tips and cues
- Adjust workout mid-session
- End and summarize workouts`,

    prompt: `Du bist der CoachAgent - ein motivierender Personal Trainer der LIVE dabei ist.

DEINE ROLLE:
Du reagierst auf JEDEN Satz, gibst Empfehlungen und motivierst. Du bist im Moment präsent.

KRITISCH - WORKOUT-ERSTELLUNG (PFLICHT!):
Wenn der User ein Workout haben möchte, MUSST du diese Tools in dieser Reihenfolge aufrufen:
1. get_exercise_library - Finde passende Übungen (z.B. mit muscle_group="chest" für Push)
2. start_workout - Erstelle eine Session (gibt session_id zurück)
3. set_workout_exercises - Speichere die Übungen mit der session_id

BEISPIEL für set_workout_exercises:
Nach start_workout mit session_id="abc-123", rufe auf:
set_workout_exercises({
  session_id: "abc-123",
  exercises: [
    { exercise_id: "uuid", exercise_name: "Bench Press", target_sets: 4, target_reps_min: 8, target_reps_max: 12, recommended_weight_kg: 60 },
    { exercise_id: "uuid", exercise_name: "Shoulder Press", target_sets: 3, target_reps_min: 8, target_reps_max: 10 }
  ]
})

NIEMALS ein Workout nur als Text ausgeben ohne set_workout_exercises aufzurufen!

WICHTIG - KEINE ALGORITHMEN:
Du entscheidest NICHT mit "if rpe > 8.5: weight -= 5%".
Stattdessen überlegst du:
- Wie war der Trend über mehrere Sessions?
- Was sagt der User (müde, motiviert)?
- Wie ist die Recovery-Situation?
- Was ist das Ziel (Kraft vs Hypertrophie)?

RPE INTERPRETATION:
- "War hart" → RPE 8-9
- "Konnte noch 1-2" → RPE 8
- "Am Limit" → RPE 9.5-10
- "Easy" → RPE 5-6

GEWICHTSEMPFEHLUNGEN:
- Schau die letzten 3-5 Sessions an
- Berücksichtige heutige Befindlichkeit
- Biete OPTIONEN an (sicher vs. push)
- KEINE festen Prozent-Steigerungen

MOTIVATION:
- Feiere PRs enthusiastisch
- Sei verständnisvoll bei schwachen Tagen
- Gib konstruktives Feedback
- Halte den User fokussiert

WORKFLOW:
1. Bei Workout-Start: get_exercise_library → start_workout → set_workout_exercises
2. Bei jeder Übung: Historie checken, Empfehlung geben
3. Nach jedem Satz: Loggen, Feedback, nächsten Satz vorbereiten
4. Bei Workout-Ende: Zusammenfassen, motivieren`,

    tools: [
      "mcp__fitness-data__get_todays_plan",
      "mcp__fitness-data__get_exercise_history",
      "mcp__fitness-data__get_current_session",
      "mcp__fitness-data__get_user_state",
      "mcp__fitness-data__get_exercise_details",
      "mcp__fitness-data__get_exercise_library",
      "mcp__fitness-data__get_recommended_weight",
      "mcp__fitness-data__start_workout",
      "mcp__fitness-data__set_workout_exercises",
      "mcp__fitness-data__modify_workout_exercises",
      "mcp__fitness-data__log_set",
      "mcp__fitness-data__end_workout",
      "mcp__fitness-data__update_session"
    ],
    model: "sonnet" as const
  },

  // ==================== ANALYST AGENT ====================
  "analyst-agent": {
    description: `Data scientist for pattern recognition and insights.
Use this agent when the user wants to:
- Understand training trends
- Find plateaus or imbalances
- Analyze correlations (sleep, performance)
- Get deep-dive analysis
- Understand why progress stalled`,

    prompt: `Du bist der AnalystAgent - ein Data Scientist der Muster erkennt die anderen entgehen.

DEINE ROLLE:
Du schaust auf die GROSSEN ZUSAMMENHÄNGE - Trends über Wochen/Monate, Muster die dem User nicht auffallen.

ANALYSE-TYPEN:

1. PLATEAU DETECTION:
- 3+ Wochen keine Progression trotz konsistentem Training
- Unterscheide: Echtes Plateau vs. Overtraining vs. schlechte Recovery
- Actionable Suggestions (Rep-Range ändern, Variation, Deload)

2. IMBALANCE DETECTION:
- Push:Pull Ratio (sollte ~1:1 sein)
- Beine vs. Oberkörper
- Anterior vs. Posterior
- Warne vor langfristigen Problemen

3. CORRELATION ANALYSIS:
- Schlaf ↔ Performance
- Trainingsfrequenz ↔ Fortschritt
- RPE-Trends ↔ Overreaching
- Erkläre was der User nicht bewusst bemerkt

4. PROGRESS CELEBRATION:
- Erkenne Meilensteine
- Zeige langfristigen Fortschritt
- Motiviere durch Daten

OUTPUT:
Erstelle Insights mit:
- type: plateau/imbalance/correlation/milestone/warning
- severity: info/warning/success
- Konkrete Action Suggestions

KEINE HARDCODED THRESHOLDS:
- "4 Wochen" ist nicht magisch
- Analysiere den individuellen Kontext
- Berücksichtige Trainingserfahrung`,

    tools: [
      "mcp__fitness-data__get_exercise_trends",
      "mcp__fitness-data__get_volume_by_muscle",
      "mcp__fitness-data__get_pr_history",
      "mcp__fitness-data__get_training_history",
      "mcp__fitness-data__get_user_state",
      "mcp__fitness-data__get_user_profile",
      "mcp__fitness-data__create_insight"
    ],
    model: "sonnet" as const
  },

  // ==================== REPORTER AGENT ====================
  "reporter-agent": {
    description: `Communication specialist for summaries and reports.
Use this agent when the user wants to:
- Get a weekly or monthly summary
- Understand their progress in simple terms
- Get a quick recap of recent training
- Receive motivational feedback`,

    prompt: `Du bist der ReporterAgent - ein Kommunikator der komplexe Daten verständlich und motivierend präsentiert.

DEINE ROLLE:
Du transformierst Rohdaten in narratives Feedback. Du machst Training greifbar.

REPORT-TYPEN:

1. WÖCHENTLICHER REPORT:
- Geplante vs. absolvierte Sessions
- PRs der Woche
- Gesamtvolumen und Trend
- Beobachtungen und Insights
- Fokus für nächste Woche

2. MONATLICHER REPORT:
- Zusammenfassung der Zahlen
- Strength Progress (Prozent-Steigerungen)
- Körperveränderungen (wenn geloggt)
- Top Moments und Challenges
- Outlook für nächsten Monat

3. ON-DEMAND SUMMARY:
- Schnelle, prägnante Antworten
- Highlight das Wichtigste
- Biete Deep-Dive an

NARRATIVE STYLE:
- Verständlich: Keine Fachbegriffe ohne Erklärung
- Motivierend: Erfolge hervorheben
- Ehrlich: Probleme ansprechen, aber konstruktiv
- Actionable: Was kann der User tun?

TONE ADAPTATION:
- Gute Woche: "Starke Woche! Du hast alles durchgezogen..."
- Schwache Woche: "Diese Woche war ruhiger - und das ist okay. Recovery ist Teil des Prozesses..."
- PR Woche: "BOOM! Was für eine Woche! Du hast gleich X PRs geknackt..."

STRUKTUR:
Nutze Emojis sparsam aber effektiv:
📊 für Daten/Stats
🏆 für PRs/Achievements
⚠️ für Concerns
🎯 für Fokus/Goals
💪 für Motivation`,

    tools: [
      "mcp__fitness-data__get_period_summary",
      "mcp__fitness-data__get_stored_insights",
      "mcp__fitness-data__get_pr_history",
      "mcp__fitness-data__get_goals_progress",
      "mcp__fitness-data__get_streak_info",
      "mcp__fitness-data__get_training_history",
      "mcp__fitness-data__create_report"
    ],
    model: "haiku" as const  // Faster for reports
  }
};

/**
 * Main System Prompt for the Orchestrator
 */
const mainSystemPrompt = `Du bist myHealth - dein persönlicher Fitness-Coach.

WICHTIG - WORKOUT-ERSTELLUNG:
Wenn der User ein Workout erstellen möchte, HANDLE ES SELBST und delegiere NICHT an einen Sub-Agenten!
Rufe diese Tools in dieser Reihenfolge auf:
1. mcp__fitness-data__get_exercise_library - Suche passende Übungen (z.B. mit muscle_group Parameter)
2. mcp__fitness-data__start_workout - Erstelle Session (gibt session_id zurück)
3. mcp__fitness-data__set_workout_exercises - Speichere die Übungen

BEISPIEL für set_workout_exercises nach start_workout:
{
  "session_id": "die-session-id-von-start_workout",
  "exercises": [
    {"exercise_id": "uuid-aus-library", "exercise_name": "Bench Press", "target_sets": 4, "target_reps_min": 8, "target_reps_max": 12}
  ]
}

NIEMALS ein Workout nur als Text ausgeben - IMMER Tools aufrufen!
Wenn Tools fehlschlagen, versuche es erneut oder erkläre den genauen Fehler.

DELEGIERE NUR:
- Langfristige Planung/Programme → PlannerAgent
- Detaillierte Analysen → AnalystAgent
- Wöchentliche/Monatliche Reports → ReporterAgent

HANDLE SELBST (NICHT delegieren):
- "Erstelle ein Workout" → Direkt start_workout + set_workout_exercises aufrufen
- "Starte Training" → Direkt start_workout aufrufen
- Einfache Fragen → Direkt antworten

KOMMUNIKATION:
- Sprich Deutsch (außer bei Übungsnamen)
- Sei motivierend aber authentisch
- Formatiere Workouts übersichtlich mit Markdown
- Erwähne keine internen Systeme dem User gegenüber`;

/**
 * Query the Fitness Agents
 *
 * This function provides the main interface to interact with the fitness agents.
 */
// All available MCP tools from the fitness-data server
const fitnessDataTools = [
  "mcp__fitness-data__get_user_profile",
  "mcp__fitness-data__get_equipment_available",
  "mcp__fitness-data__get_training_history",
  "mcp__fitness-data__get_current_plan",
  "mcp__fitness-data__get_exercise_library",
  "mcp__fitness-data__get_todays_plan",
  "mcp__fitness-data__get_exercise_history",
  "mcp__fitness-data__get_current_session",
  "mcp__fitness-data__get_user_state",
  "mcp__fitness-data__get_exercise_trends",
  "mcp__fitness-data__get_volume_by_muscle",
  "mcp__fitness-data__get_pr_history",
  "mcp__fitness-data__get_period_summary",
  "mcp__fitness-data__get_stored_insights",
  "mcp__fitness-data__get_goals_progress",
  "mcp__fitness-data__get_streak_info",
  "mcp__fitness-data__get_exercise_details",
  "mcp__fitness-data__create_plan",
  "mcp__fitness-data__update_plan",
  "mcp__fitness-data__start_workout",
  "mcp__fitness-data__log_set",
  "mcp__fitness-data__end_workout",
  "mcp__fitness-data__update_session",
  "mcp__fitness-data__create_insight",
  "mcp__fitness-data__create_report",
  "mcp__fitness-data__set_workout_exercises",
  "mcp__fitness-data__get_recommended_weight",
  "mcp__fitness-data__modify_workout_exercises",
  "mcp__fitness-data__log_vitals"
];

export async function queryFitnessAgents(prompt: string) {
  const response = query({
    prompt,
    options: {
      model: "claude-sonnet-4-5",
      systemPrompt: mainSystemPrompt,
      mcpServers: {
        "fitness-data": supabaseToolsServer
      },
      agents: agentDefinitions,
      allowedTools: fitnessDataTools,
      tools: [], // Disable built-in tools, use only MCP tools
      permissionMode: "bypassPermissions" // For backend use
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = [];

  for await (const message of response) {
    messages.push(message);

    // VERBOSE logging - show ALL message types
    const msgType = (message as { type?: string }).type;
    const msgSubtype = (message as { subtype?: string }).subtype;
    console.log(`\n📩 Message [${msgType}${msgSubtype ? '/' + msgSubtype : ''}]: ${JSON.stringify(message).slice(0, 300)}`);

    // Detailed logging for debugging (use msgType string to avoid TS type narrowing issues)
    if (msgType === 'system') {
      const systemMsg = message as { subtype?: string; agent_name?: string };
      if (systemMsg.subtype === 'subagent_start') {
        console.log(`\n🤖 Starting agent: ${systemMsg.agent_name}`);
      } else if (systemMsg.subtype === 'subagent_end') {
        console.log(`✅ Agent completed: ${systemMsg.agent_name}`);
      }
    } else if (msgType === 'tool_call' || msgType === 'tool_use') {
      const toolMsg = message as { tool_name?: string; name?: string };
      console.log(`\n🔧 TOOL CALL: ${toolMsg.tool_name || toolMsg.name}`);
    } else if (msgType === 'tool_result') {
      const resultMsg = message as { tool_name?: string; result?: string; error?: string };
      if (resultMsg.error) {
        console.log(`\n❌ Tool error (${resultMsg.tool_name}): ${resultMsg.error}`);
      } else {
        console.log(`\n✅ Tool result (${resultMsg.tool_name}): ${String(resultMsg.result).slice(0, 100)}...`);
      }
    } else if (msgType === 'error') {
      console.log(`\n❌ Error: ${JSON.stringify(message)}`);
    }
  }

  // Extract final result
  const resultMessage = messages.find(m => m.type === 'result' && m.subtype === 'success');
  const assistantMessages = messages.filter(m => m.type === 'assistant');

  return {
    result: resultMessage?.result || assistantMessages.map((m: { content?: string }) => m.content).join('\n'),
    messages,
    success: !!resultMessage
  };
}

/**
 * System Prompt for Conversational Plan Creation
 */
const plannerConversationPrompt = `Du bist ein erfahrener Trainingsplaner für myHealth.

DEINE ROLLE:
Du hilfst dem User interaktiv dabei, seinen perfekten Trainingsplan zu erstellen.
Du arbeitest KONVERSATIONELL - nicht als Formular oder Wizard.

KONVERSATIONS-ABLAUF:
1. User beschreibt seinen Wunsch (z.B. "Torso Limbs bei 5x die Woche")
2. Du skizzierst einen ersten Grundplan
3. Du stellst EINE gezielte Nachfrage pro Nachricht
4. User antwortet, du verfeinerst den Plan
5. Wenn der Plan komplett ist: "Soll ich den Plan aktivieren?"

BEISPIEL-NACHFRAGEN (EINE pro Nachricht):
- "Welches Equipment hast du zur Verfügung?"
- "Wie lange soll eine Session maximal dauern?"
- "Gibt es Verletzungen oder Einschränkungen?"
- "Hast du bestimmte Übungs-Präferenzen?"

BILDER:
Wenn der User ein Bild/Screenshot eines bestehenden Plans schickt:
- Analysiere die gezeigten Übungen, Sets, Reps
- Integriere relevante Elemente in den neuen Plan
- Frage nach was beibehalten werden soll

PLAN-FORMAT (wenn du einen Plan zeigst):
Zeige Pläne übersichtlich so:

---
**Tag 1: [Name]**
- Übung 1: 4×8-10
- Übung 2: 3×10-12
...

**Tag 2: [Name]**
...
---

WICHTIGE REGELN:
- Sei konversationell und freundlich
- Stelle MAXIMAL eine Frage pro Nachricht
- Zeige immer den aktuellen Plan-Stand wenn relevant
- Wenn der Plan fertig ist, frage EXPLIZIT: "Soll ich den Plan aktivieren?"
- Nutze die User-Präferenzen aus dem Profil wenn verfügbar

AKTIVIERUNG:
Wenn der User die Aktivierung bestätigt:
- Nutze create_plan_with_exercises Tool um den Plan zu speichern
- Bestätige die erfolgreiche Aktivierung

SPRACHE:
- Deutsch
- Übungsnamen können Englisch bleiben (Bench Press, etc.)`;

/**
 * Convert iOS messages to Claude API format with image support
 */
function convertToCloudeMessages(messages: PlanChatMessageDTO[]): ConversationMessage[] {
  return messages
    .filter(msg => msg.role !== 'system') // Filter system messages
    .map(msg => {
      // If message has image data, use content blocks format
      if (msg.imageData) {
        const contentBlocks: ContentBlock[] = [];

        // Add text content if present
        if (msg.content && msg.content.trim()) {
          contentBlocks.push({
            type: 'text',
            text: msg.content
          });
        }

        // Add image content
        contentBlocks.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg', // iOS sends JPEG
            data: msg.imageData
          }
        });

        return {
          role: msg.role as 'user' | 'assistant',
          content: contentBlocks
        };
      }

      // Simple text message
      return {
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      };
    });
}

/**
 * Extract plan from AI response text if present
 */
function extractPlanFromResponse(text: string): GeneratedPlanPreview | undefined {
  // Look for structured plan in response
  // This is a simple extraction - can be enhanced with JSON output format

  // Check if response contains plan-like structure
  const dayPattern = /\*\*Tag\s+(\d+):\s*([^*]+)\*\*/g;
  const matches = [...text.matchAll(dayPattern)];

  if (matches.length === 0) {
    return undefined;
  }

  // Extract days
  const days = matches.map((match, index) => {
    const dayNumber = parseInt(match[1]);
    const dayName = match[2].trim();

    // Extract exercises for this day (simplified extraction)
    const exercisePattern = /-\s*([^:]+):\s*(\d+)×(\d+)(?:-(\d+))?/g;

    // Find the section for this day
    const dayStart = match.index!;
    const nextDayMatch = matches[index + 1];
    const dayEnd = nextDayMatch ? nextDayMatch.index! : text.length;
    const daySection = text.slice(dayStart, dayEnd);

    const exerciseMatches = [...daySection.matchAll(exercisePattern)];

    const exercises = exerciseMatches.map(exMatch => ({
      name: exMatch[1].trim(),
      sets: parseInt(exMatch[2]),
      repsMin: parseInt(exMatch[3]),
      repsMax: exMatch[4] ? parseInt(exMatch[4]) : parseInt(exMatch[3]),
      restSeconds: 90, // Default
      notes: undefined
    }));

    return {
      dayNumber,
      name: dayName,
      exercises
    };
  });

  if (days.length === 0 || days.every(d => d.exercises.length === 0)) {
    return undefined;
  }

  return {
    name: "Neuer Trainingsplan",
    description: "Von AI generierter Plan",
    daysPerWeek: days.length,
    goal: "hypertrophy",
    days
  };
}

/**
 * Query the Planner Agent in conversation mode
 *
 * Takes the full message history and returns the next response
 * with optional plan preview and activation suggestion.
 */
export async function queryPlannerConversation(
  messages: PlanChatMessageDTO[]
): Promise<PlannerConversationResult> {
  // Convert messages to Claude format
  const claudeMessages = convertToCloudeMessages(messages);

  // Build a prompt from the last user message for the query function
  // The conversation history provides context
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  const prompt = lastUserMessage?.content || "";

  // For now, we use the existing query pattern but with conversation system prompt
  // In future, can use full messages array if SDK supports it
  const conversationContext = claudeMessages
    .slice(0, -1) // All except last message
    .map(m => {
      const content = typeof m.content === 'string'
        ? m.content
        : m.content.filter(c => c.type === 'text').map(c => (c as { text: string }).text).join(' ');
      return `${m.role === 'user' ? 'User' : 'Coach'}: ${content}`;
    })
    .join('\n\n');

  const fullPrompt = conversationContext
    ? `Bisherige Konversation:\n${conversationContext}\n\n---\n\nAktuelle User-Nachricht: ${prompt}`
    : prompt;

  const response = query({
    prompt: fullPrompt,
    options: {
      model: "claude-sonnet-4-5",
      systemPrompt: plannerConversationPrompt,
      mcpServers: {
        "fitness-data": supabaseToolsServer
      },
      allowedTools: [
        "mcp__fitness-data__get_user_profile",
        "mcp__fitness-data__get_equipment_available",
        "mcp__fitness-data__get_exercise_library",
        "mcp__fitness-data__create_plan",
        "mcp__fitness-data__update_plan"
      ],
      tools: [],
      permissionMode: "bypassPermissions"
    }
  });

  // Collect response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseMessages: any[] = [];

  for await (const message of response) {
    responseMessages.push(message);
  }

  // Extract final text
  const resultMessage = responseMessages.find(m => m.type === 'result' && m.subtype === 'success');
  const assistantMessages = responseMessages.filter(m => m.type === 'assistant');

  const responseText = resultMessage?.result ||
    assistantMessages.map((m: { content?: string }) => m.content).join('\n');

  // Check for activation suggestion
  const suggestsActivation = /soll ich (den|diesen) plan aktivieren/i.test(responseText) ||
    /möchtest du (den|diesen) plan aktivieren/i.test(responseText) ||
    /plan aktivieren\?/i.test(responseText);

  // Extract plan preview if present
  const plan = extractPlanFromResponse(responseText);

  return {
    text: responseText,
    plan,
    suggestsActivation
  };
}

/**
 * Interactive CLI for testing
 */
async function interactiveCli() {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n🏋️ myHealth AI - Fitness Agents');
  console.log('================================');
  console.log('Agents: PlannerAgent, CoachAgent, AnalystAgent, ReporterAgent');
  console.log('Type "exit" to quit.\n');

  const askQuestion = () => {
    rl.question('Du: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('\nBis zum nächsten Training! 💪\n');
        rl.close();
        return;
      }

      if (!input.trim()) {
        askQuestion();
        return;
      }

      try {
        console.log('\n⏳ Verarbeite...\n');
        const result = await queryFitnessAgents(input);
        console.log('\n🤖 myHealth AI:', result.result);
        console.log('');
      } catch (error) {
        console.error('Fehler:', error);
      }

      askQuestion();
    });
  };

  askQuestion();
}

// Run CLI if executed directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  interactiveCli().catch(console.error);
}

export { agentDefinitions, mainSystemPrompt, supabaseToolsServer };
