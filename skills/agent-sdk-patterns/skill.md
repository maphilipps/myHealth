---
name: agent-sdk-patterns
description: Best practices and patterns for Claude Agent SDK development in myHealth
---

# Claude Agent SDK Patterns for myHealth

Reference patterns for building AI agents in the myHealth agent-backend.

## Project Structure

```
agent-backend/
├── src/
│   ├── index.ts          # Agent orchestrator, main entry
│   ├── server.ts         # Express HTTP server
│   ├── tools/
│   │   └── supabase.ts   # Tool definitions
│   └── types/
│       └── conversation.ts
├── Dockerfile            # Fly.io deployment
├── fly.toml              # Fly.io config
└── package.json
```

## Tool Design Pattern

Tools are the core building blocks. Each tool should:

1. **Do one thing well** - Single responsibility
2. **Have clear names** - `get_`, `create_`, `update_`, `search_` prefixes
3. **Use Zod schemas** - Typed parameters with descriptions
4. **Return structured data** - JSON that agents can reason about

### Tool Template

```typescript
import { tool } from '@anthropic-ai/agent';
import { z } from 'zod';

export const getExerciseHistory = tool({
  name: 'get_exercise_history',
  description: 'Get recent performance data for a specific exercise. Returns weight, reps, and RPE from recent sessions.',
  parameters: z.object({
    exerciseId: z.string()
      .describe('UUID of the exercise from the exercises table'),
    limit: z.number()
      .optional()
      .default(5)
      .describe('Number of recent sessions to return (default: 5)'),
  }),
  execute: async ({ exerciseId, limit }) => {
    try {
      const { data, error } = await supabase
        .from('workout_sets')
        .select('weight_kg, reps, rpe, workout_sessions(date)')
        .eq('exercise_id', exerciseId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return {
        success: true,
        history: data,
        count: data.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
```

### Parameter Description Best Practices

```typescript
// Good - Clear, contextual descriptions
z.object({
  userId: z.string().describe('User UUID from Supabase auth'),
  exerciseId: z.string().describe('Exercise UUID from exercises table'),
  targetReps: z.number().describe('Target rep count for progression calculation'),
  rpe: z.number().min(1).max(10).describe('Rate of Perceived Exertion (1-10 scale)'),
})

// Bad - Vague or missing descriptions
z.object({
  id: z.string(),  // What kind of ID?
  value: z.number(),  // What value?
})
```

## Agent Definition Pattern

Agents have personalities and specific tool access.

```typescript
import { Agent } from '@anthropic-ai/agent';

export const coachAgent = new Agent({
  name: 'CoachAgent',
  model: 'claude-sonnet-4-20250514',
  systemPrompt: `Du bist ein erfahrener Fitness-Coach für die myHealth App.

## Deine Persönlichkeit
- Motivierend aber realistisch
- Basiert Empfehlungen auf Daten, nicht Vermutungen
- Spricht Deutsch, verwendet Du-Form
- Kennt Progressive Overload Prinzipien

## Deine Aufgaben
- Gewichtsempfehlungen für Übungen geben
- Trainingsfortschritt analysieren
- Formtipps bei Bedarf
- Deload-Timing erkennen

## Wichtige Regeln
- Nutze IMMER die verfügbaren Tools für Daten
- Gib keine Empfehlungen ohne Datengrundlage
- Bei Unsicherheit: Frag nach mehr Kontext`,

  tools: [
    getExerciseHistory,
    getNextWeight,
    getRecentWorkouts,
    getVitals,
  ],
});
```

## System Prompt Best Practices

### Structure
```markdown
# Rolle
Klare Definition der Agent-Persönlichkeit.

## Kernaufgaben
- Aufgabe 1
- Aufgabe 2

## Verhalten
- Wie der Agent kommuniziert
- Sprachstil und Tonalität

## Regeln
- Was der Agent IMMER tun soll
- Was der Agent NIE tun soll

## Kontext
Relevante Domänen-Informationen.
```

### Do's and Don'ts

**Do:**
- Be specific about the agent's domain
- Include language/cultural context (German for myHealth)
- Define when to use which tools
- Set clear behavioral boundaries

**Don't:**
- Make the prompt too long (keeps reasoning focused)
- Include implementation details
- Assume knowledge the agent doesn't have
- Leave ambiguous decision points

## Multi-Agent Orchestration

The main orchestrator routes to specialized agents:

```typescript
// index.ts
const agents = {
  planner: plannerAgent,
  coach: coachAgent,
  analyst: analystAgent,
  reporter: reporterAgent,
  nutrition: nutritionAgent,
};

export async function routeMessage(message: string, context: Context) {
  // Determine which agent handles this
  const agentType = classifyIntent(message);
  const agent = agents[agentType];

  return agent.run({
    messages: context.history,
    tools: agent.tools,
  });
}
```

## API Endpoint Pattern

```typescript
// server.ts
app.post('/api/chat', async (req, res) => {
  const { message, conversationId, userId } = req.body;

  try {
    // Get conversation history
    const history = await getConversationHistory(conversationId);

    // Route to appropriate agent
    const response = await routeMessage(message, {
      history,
      userId,
    });

    // Stream response
    res.setHeader('Content-Type', 'text/event-stream');
    for await (const chunk of response.stream()) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.end();

  } catch (error) {
    res.status(500).json({ error: 'Agent error' });
  }
});
```

## Testing Tools

```bash
# Start dev server
cd agent-backend
npm run dev:server

# Test health endpoint
curl http://localhost:3001/api/health

# Test chat
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Was soll ich heute bei Bankdrücken machen?"}'
```

## Deployment (Fly.io)

```bash
# Deploy
fly deploy -a myhealth-agents

# Set secrets
fly secrets set ANTHROPIC_API_KEY=xxx -a myhealth-agents
fly secrets set SUPABASE_URL=xxx -a myhealth-agents
fly secrets set SUPABASE_SERVICE_KEY=xxx -a myhealth-agents

# Check logs
fly logs -a myhealth-agents
```

## Common Patterns

### Supabase Integration
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
```

### Error Handling in Tools
```typescript
execute: async (params) => {
  try {
    // ... logic
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
```

### Streaming Responses
```typescript
for await (const chunk of response.stream()) {
  if (chunk.type === 'text') {
    res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
  }
}
```
