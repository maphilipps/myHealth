---
title: 'iOS: Agent Chat Integration'
status: todo
type: feature
priority: high
tags:
    - ios
    - agent
created_at: 2025-12-15T20:45:34Z
updated_at: 2025-12-15T20:45:34Z
links:
    - parent: myHealth-mudp
---

# iOS: Agent Chat Integration

## Beschreibung
Chat-Interface für Kommunikation mit dem Fitness Coach Agent.

## UI Design
- Chat Bubble Style
- Markdown Rendering
- Typing Indicator
- Quick Actions (Buttons)

## API Integration
```swift
class AgentAPIService {
    private let baseURL = "http://localhost:3000" // Local dev
    
    func sendMessage(_ message: String) async throws -> AgentResponse {
        // POST to agent endpoint
    }
    
    func startWorkoutSession(type: String) async throws -> WorkoutPlan {
        // Get workout plan from agent
    }
}
```

## Quick Actions
- 'Start Torso Workout'
- 'Start Limbs Workout'
- 'Weekly Summary'
- 'Create New Plan'

## Features
- [ ] Text Input mit Send Button
- [ ] Voice Input (optional)
- [ ] Chat History
- [ ] Agent Response Streaming
- [ ] Error Handling
