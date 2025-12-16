---
title: 'iOS: Agent Chat Integration'
status: done
type: feature
priority: high
tags:
    - ios
    - agent
created_at: 2025-12-15T20:45:34Z
updated_at: 2025-12-16T07:20:00Z
links:
    - parent: myHealth-mudp
---

# iOS: Agent Chat Integration

## Beschreibung
Chat-Interface für Kommunikation mit dem Fitness Coach Agent.

## Implementiert

### AgentService (`Services/AgentService.swift`)
- `ChatMessage` model mit UUID, role, content, timestamp
- `QuickAction` struct für Quick Action Buttons
- `AgentService` class (@MainActor, ObservableObject)
- Mock response generation für Torso, Limbs, Summary, Plans
- Welcome message bei Init

### ChatView (`Views/Chat/ChatView.swift`)
- Chat Bubble UI mit User/Assistant Differenzierung
- `ChatBubble` mit custom `ChatBubbleShape` (Tail)
- `TypingIndicator` mit Animation
- `ChatQuickActionButton` für Quick Actions
- Collapsible Quick Actions Panel
- Auto-scroll bei neuen Messages
- Markdown Rendering via `LocalizedStringKey`

### MainTabView Integration
- Coach Tab zwischen Dashboard und Workout
- Icon: `message.fill`

### Fixes
- `NSHealthUpdateUsageDescription` in Info.plist für HealthKit
- Debug bypass flag in ContentView für Testing

## Quick Actions
- [x] 'Start Torso Workout'
- [x] 'Start Limbs Workout'
- [x] 'Weekly Summary'
- [x] 'Create New Plan'

## Features
- [x] Text Input mit Send Button
- [ ] Voice Input (optional) - Future
- [x] Chat History (in-memory)
- [ ] Agent Response Streaming - Future (needs backend)
- [x] Error Handling

## Commits
- `b2d8180` feat: Add Agent Chat integration with Coach tab
