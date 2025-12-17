---
title: 'Epic: AI Workout Generation'
status: todo
type: epic
priority: critical
tags:
    - ai
    - core
    - differentiator
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T10:00:00Z
links:
    - parent: myHealth-af01
---

# Epic: AI Workout Generation

## Beschreibung
**DAS Kern-Feature** - Workouts werden nicht durch UI-Klicks erstellt, sondern durch natürliche Sprache. Der AI Coach versteht Kontext, Einschränkungen und Präferenzen.

## Warum ist das wichtig?
Fitbod und andere Apps zwingen User durch starre Menüs. Mit AI:
- Keine Lernkurve für neue User
- Komplexe Anforderungen werden verstanden
- Anpassungen in Echtzeit möglich
- Fühlt sich an wie ein echter Personal Trainer

## Features
- Prompt-basierte Workout-Erstellung
- Conversational Workout-Modifikation
- Real-time AI Coaching während Workout
- Voice-to-Log (Spracheingabe für Sets)
- Natural Language Exercise Search

## User Stories
```
Als Fitness-Nutzer möchte ich sagen können:
- "Erstelle ein Brust-Workout für Zuhause"
- "Ich will heute leichter trainieren"
- "Ersetze Kniebeugen durch etwas ohne Knie-Belastung"
- "80kg, 10 Reps, war schwer" (während Workout)
```

## Tech Stack
- Claude Agent SDK für Conversation
- Supabase für Daten
- iOS Speech Recognition für Voice
- Streaming für Real-time Response

## Definition of Done
- [ ] Alle Features implementiert
- [ ] 95% der natürlichen Anfragen werden verstanden
- [ ] Response Time < 2 Sekunden
- [ ] Voice-Input funktioniert zuverlässig
