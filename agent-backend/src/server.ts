/**
 * Fitness Agents API Server
 *
 * HTTP API for iOS App and Web clients to communicate with the Fitness Agents.
 * Endpoints:
 *   POST /api/chat - Send a message to the agents
 *   GET /api/health - Health check
 */

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { queryFitnessAgents, queryPlannerConversation } from "./index.js";
import type { PlanChatRequest, PlanChatResponse, PlanChatMessageDTO } from "./types/conversation.js";

// Load environment variables
config();

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', '*'], // Allow local dev and all origins for demo
  credentials: true
}));
app.use(express.json());

// Serve static files (Web Demo)
app.use(express.static(path.join(__dirname, '../public')));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 */
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "fitness-agents",
    timestamp: new Date().toISOString(),
    agents: ["PlannerAgent", "CoachAgent", "AnalystAgent", "ReporterAgent"]
  });
});

/**
 * Chat endpoint - Send message to Fitness Agents
 *
 * Request body:
 *   { "message": "string", "userId"?: "string" }
 *
 * Response:
 *   { "response": "string", "success": boolean, "agentsUsed"?: string[] }
 */
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({
        error: "Message is required",
        success: false
      });
      return;
    }

    console.log(`\n📨 Incoming message from ${userId || "anonymous"}:`);
    console.log(`   "${message}"`);

    // Query the fitness agents
    const result = await queryFitnessAgents(message);

    console.log(`\n✅ Response generated successfully`);

    res.json({
      response: result.result,
      success: result.success,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({
      error: "Failed to process message",
      success: false,
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Streaming chat endpoint (for future use with real-time updates)
 */
app.post("/api/chat/stream", async (req: Request, res: Response) => {
  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Set headers for SSE (Server-Sent Events)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log(`\n📨 Streaming message from ${userId || "anonymous"}:`);
    console.log(`   "${message}"`);

    // For now, just send the complete response as one event
    // In the future, we can stream token by token
    const result = await queryFitnessAgents(message);

    res.write(`data: ${JSON.stringify({ type: "message", content: result.result })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();

  } catch (error) {
    console.error("Error in streaming chat:", error);
    res.write(`data: ${JSON.stringify({ type: "error", error: "Failed to process message" })}\n\n`);
    res.end();
  }
});

/**
 * Quick actions endpoint - Get available quick actions
 */
app.get("/api/quick-actions", (_req: Request, res: Response) => {
  res.json({
    actions: [
      { id: "start-workout", label: "Ich will trainieren", icon: "dumbbell" },
      { id: "weekly-summary", label: "Wie war meine Woche?", icon: "chart" },
      { id: "create-plan", label: "Erstelle mir einen Plan", icon: "calendar" },
      { id: "analyze", label: "Analysiere meinen Fortschritt", icon: "magnifyingglass" }
    ]
  });
});

// ==================== PLAN WIZARD ENDPOINTS ====================

/**
 * Generate a training plan from wizard answers
 *
 * Request body:
 *   {
 *     "answers": {
 *       "goal": "hypertrophy" | "strength" | "endurance",
 *       "daysPerWeek": number,
 *       "experienceLevel": "beginner" | "intermediate" | "advanced",
 *       "availableEquipment": string[],
 *       "sessionDuration": number,
 *       "focusAreas": string[],
 *       "injuries"?: string[]
 *     },
 *     "userId"?: string
 *   }
 */
app.post("/api/plan/generate", async (req: Request, res: Response) => {
  try {
    const { answers, userId } = req.body;

    if (!answers) {
      res.status(400).json({ error: "Answers object is required", success: false });
      return;
    }

    console.log(`\n📋 Plan generation request from ${userId || "anonymous"}:`);
    console.log(`   Goal: ${answers.goal}, Days: ${answers.daysPerWeek}, Level: ${answers.experienceLevel}`);

    // Build a structured prompt for the PlannerAgent
    const prompt = `
Erstelle einen vollständigen Trainingsplan basierend auf diesen Vorgaben:

**Nutzerprofil:**
- Ziel: ${answers.goal || 'hypertrophy'}
- Trainingstage pro Woche: ${answers.daysPerWeek || 4}
- Erfahrungslevel: ${answers.experienceLevel || 'intermediate'}
- Verfügbares Equipment: ${answers.availableEquipment?.join(', ') || 'Langhantel, Kurzhanteln, Kabelzug, Maschinen'}
- Session-Dauer: ${answers.sessionDuration || 60} Minuten
- Fokus-Bereiche: ${answers.focusAreas?.join(', ') || 'Alle Muskelgruppen'}
${answers.injuries?.length ? `- Einschränkungen/Verletzungen: ${answers.injuries.join(', ')}` : ''}

**Anweisungen:**
1. Wähle einen passenden Split basierend auf den Trainingstagen
2. Wähle konkrete Übungen aus der Exercise Library (nutze get_exercise_library)
3. Setze realistische Sets/Reps basierend auf dem Ziel und Level
4. Erstelle den Plan mit create_plan_with_exercises

Erstelle jetzt den Plan!
    `.trim();

    const result = await queryFitnessAgents(prompt);

    console.log(`\n✅ Plan generated successfully`);

    res.json({
      success: result.success,
      response: result.result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error generating plan:", error);
    res.status(500).json({
      error: "Failed to generate plan",
      success: false,
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// ==================== PLAN CHAT ENDPOINT ====================

/**
 * Conversational plan creation with image support
 *
 * Request body:
 *   {
 *     "messages": [
 *       { "id": "uuid", "role": "user", "content": "text", "timestamp": "ISO", "imageData"?: "base64" }
 *     ],
 *     "userId"?: string
 *   }
 *
 * Response:
 *   {
 *     "success": boolean,
 *     "message": { "id", "role", "content", "timestamp", "planPreview"?, "suggestsActivation" },
 *     "planPreview"?: {...},
 *     "suggestsActivation": boolean
 *   }
 */
app.post("/api/plan/chat", async (req: Request, res: Response) => {
  try {
    const { messages, userId } = req.body as PlanChatRequest;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        error: "Messages array is required",
        success: false
      });
      return;
    }

    console.log(`\n💬 Plan chat request from ${userId || "anonymous"}:`);
    console.log(`   Messages: ${messages.length}, Latest: "${messages[messages.length - 1]?.content?.slice(0, 50)}..."`);

    // Query the planner conversation agent
    const result = await queryPlannerConversation(messages);

    // Build response message
    const responseMessage: PlanChatMessageDTO = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: result.text,
      timestamp: new Date().toISOString(),
      planPreview: result.plan,
      suggestsActivation: result.suggestsActivation
    };

    console.log(`\n✅ Plan chat response generated`);
    console.log(`   Suggests activation: ${result.suggestsActivation}`);
    console.log(`   Has plan preview: ${!!result.plan}`);

    const response: PlanChatResponse = {
      success: true,
      message: responseMessage,
      planPreview: result.plan,
      suggestsActivation: result.suggestsActivation
    };

    res.json(response);

  } catch (error) {
    console.error("Error in plan chat:", error);
    res.status(500).json({
      error: "Failed to process plan chat",
      success: false,
      suggestsActivation: false,
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// ==================== WORKOUT ASSISTANT ENDPOINTS ====================

/**
 * Get weight recommendation for an exercise
 *
 * Request body:
 *   {
 *     "exerciseId": "uuid",
 *     "targetReps": { "min": number, "max": number },
 *     "userId"?: string
 *   }
 */
app.post("/api/workout/recommendation", async (req: Request, res: Response) => {
  try {
    const { exerciseId, targetReps, userId } = req.body;

    if (!exerciseId) {
      res.status(400).json({ error: "exerciseId is required", success: false });
      return;
    }

    console.log(`\n💪 Weight recommendation request for exercise ${exerciseId}`);

    // Query the coach agent for recommendation
    const prompt = `
Ich brauche eine Gewichtsempfehlung für die nächste Übung.

**Details:**
- Exercise ID: ${exerciseId}
- Ziel-Wiederholungen: ${targetReps?.min || 8}-${targetReps?.max || 12}

Nutze get_recommended_weight um die Empfehlung zu berechnen und gib mir:
1. Empfohlenes Gewicht
2. Letztes Gewicht/Reps/RPE
3. Trend (steigern/halten/reduzieren)
4. Kurze Begründung

Antworte im JSON Format.
    `.trim();

    const result = await queryFitnessAgents(prompt);

    // Try to parse the response as JSON, fallback to text
    let recommendation;
    try {
      // Extract JSON from the response if wrapped in markdown
      const jsonMatch = result.result.match(/```json\n?([\s\S]*?)\n?```/) ||
                        result.result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        recommendation = { raw: result.result };
      }
    } catch {
      recommendation = { raw: result.result };
    }

    res.json({
      success: true,
      recommendation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error getting recommendation:", error);
    res.status(500).json({
      error: "Failed to get recommendation",
      success: false,
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Get coaching feedback after completing a set
 * Only called for special events (PR, high RPE, deviation, first set)
 *
 * Request body:
 *   {
 *     "exerciseId": "uuid",
 *     "exerciseName": string,
 *     "weight": number,
 *     "reps": number,
 *     "rpe": number,
 *     "setNumber": number,
 *     "trigger": "pr" | "highEffort" | "deviation" | "warmup" | "custom",
 *     "sessionId"?: string,
 *     "userId"?: string
 *   }
 */
app.post("/api/workout/feedback", async (req: Request, res: Response) => {
  try {
    const { exerciseId, exerciseName, weight, reps, rpe, setNumber, trigger, sessionId } = req.body;

    if (!exerciseId || weight === undefined || reps === undefined) {
      res.status(400).json({ error: "exerciseId, weight, and reps are required", success: false });
      return;
    }

    console.log(`\n🏋️ Coach feedback request: ${exerciseName || exerciseId} - ${weight}kg × ${reps} @ RPE ${rpe}`);
    console.log(`   Trigger: ${trigger || 'custom'}`);

    // Build context-aware prompt based on trigger
    let contextPrompt = "";
    switch (trigger) {
      case "pr":
        contextPrompt = "Der Nutzer hat gerade einen neuen Personal Record aufgestellt! Feiere diesen Erfolg!";
        break;
      case "highEffort":
        contextPrompt = `RPE ${rpe} ist sehr hoch. Gib Tipps zur Erholung und ob er das Gewicht anpassen sollte.`;
        break;
      case "deviation":
        contextPrompt = "Das Gewicht weicht stark vom Plan ab. Frage nach dem Grund und gib Anpassungsvorschläge.";
        break;
      case "warmup":
        contextPrompt = "Dies ist der erste Satz. Gib Aufwärm-Tipps und Form-Cues für die Übung.";
        break;
      default:
        contextPrompt = "Gib kurzes, hilfreiches Feedback.";
    }

    const prompt = `
Der Nutzer hat gerade Set ${setNumber} abgeschlossen:
- Übung: ${exerciseName || exerciseId}
- Gewicht: ${weight}kg
- Wiederholungen: ${reps}
- RPE: ${rpe || 'nicht angegeben'}

${contextPrompt}

Gib ein kurzes (2-3 Sätze), motivierendes Coaching-Feedback auf Deutsch.
Sei positiv aber ehrlich. Fokussiere auf den nächsten Satz.
    `.trim();

    const result = await queryFitnessAgents(prompt);

    res.json({
      success: true,
      feedback: result.result,
      trigger,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error getting feedback:", error);
    res.status(500).json({
      error: "Failed to get feedback",
      success: false,
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * Get exercise details with form cues
 */
app.get("/api/exercise/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const prompt = `Nutze get_exercise_details um Details zur Übung mit ID ${id} zu holen.`;
    const result = await queryFitnessAgents(prompt);

    res.json({
      success: true,
      exercise: result.result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error getting exercise:", error);
    res.status(500).json({
      error: "Failed to get exercise",
      success: false
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
🏋️  Fitness Agents API Server
════════════════════════════════════════

  Server:     http://localhost:${PORT}
  Web Demo:   http://localhost:${PORT}/

  API Endpoints:
    GET  /api/health        - Health check
    POST /api/chat          - Send message to agents
    POST /api/chat/stream   - Streaming response (SSE)
    GET  /api/quick-actions - Get quick action buttons

  Agents:
    • PlannerAgent  - Trainingspläne & Periodisierung
    • CoachAgent    - Live-Coaching & Empfehlungen
    • AnalystAgent  - Muster & Insights
    • ReporterAgent - Summaries & Reports

  Ready for iOS App connections! 📱
════════════════════════════════════════
`);
});

export { app };
