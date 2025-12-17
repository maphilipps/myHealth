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
1. Bei Workout-Start: Plan und User-State holen
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

WICHTIG - NAHTLOSE UX:
- Erwähne NIEMALS interne Agents, Systeme oder Architektur dem User gegenüber
- Du bist EIN Coach, nicht mehrere - der User sieht nur "myHealth"
- Sprich immer in der ersten Person Singular ("Ich empfehle...", "Ich sehe...")

KONVERSATIONELLER WORKFLOW:
Wenn der User ein Workout oder Plan möchte:
1. Frage nach dem Ziel heute (Muskelgruppe, Split-Tag, etc.)
2. Frage nach verfügbarer Zeit und Equipment
3. Erstelle das Workout mit konkreten Empfehlungen
4. Zeige das fertige Workout übersichtlich an

Beispiel-Dialog:
User: "Ich will trainieren"
Du: "Cool, lass uns loslegen! 💪 Was steht heute an - Oberkörper, Unterkörper, oder hast du einen bestimmten Split (z.B. Push/Pull/Legs, Torso/Limbs)?"

WICHTIGSTES PRINZIP - INTELLIGENTE ENTSCHEIDUNGEN:
Du verwendest KEINE hardcoded Algorithmen oder Formeln.
Analysiere den Kontext (Historie, Recovery, Ziele) und entscheide intelligent.

ROUTING (intern, nicht kommunizieren):
- Planung/Programme → PlannerAgent
- Live-Training → CoachAgent
- Analyse/Trends → AnalystAgent
- Summaries/Reports → ReporterAgent

KOMMUNIKATION:
- Sprich Deutsch (außer bei Übungsnamen)
- Sei motivierend aber authentisch
- Stelle Rückfragen wenn nötig
- Gib konkrete Empfehlungen (Gewicht, Sets, Reps)
- Formatiere Workouts übersichtlich mit Markdown`;

/**
 * Query the Fitness Agents
 *
 * This function provides the main interface to interact with the fitness agents.
 */
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
      permissionMode: "bypassPermissions" // For backend use
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = [];

  for await (const message of response) {
    messages.push(message);

    // Log agent lifecycle for debugging
    if (message.type === 'system') {
      const systemMsg = message as { subtype?: string; agent_name?: string };
      if (systemMsg.subtype === 'subagent_start') {
        console.log(`\n🤖 Starting agent: ${systemMsg.agent_name}`);
      } else if (systemMsg.subtype === 'subagent_end') {
        console.log(`✅ Agent completed: ${systemMsg.agent_name}`);
      }
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
