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
import { queryFitnessAgents } from "./index.js";

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
