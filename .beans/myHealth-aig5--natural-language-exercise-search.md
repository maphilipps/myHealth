---
title: 'AI: Natural Language Exercise Search'
status: done
type: feature
priority: medium
tags:
    - ai
    - search
    - nlp
created_at: 2025-12-17T10:00:00Z
updated_at: 2025-12-17T14:35:00Z
links:
    - parent: myHealth-aig0
---

# Natural Language Exercise Search

## Beschreibung
Übungen finden durch Beschreibung statt durch Suche in Listen. Der AI versteht was gemeint ist.

## Beispiele

### Beschreibung statt Name
```
User: "Die Übung wo man die Stange hochzieht"
AI: "Meinst du Kreuzheben oder Rudern?
     - Kreuzheben: Vom Boden hochziehen
     - Rudern: Zur Brust ziehen"
```

### Muskel-basiert
```
User: "Was für hinteren Schultern?"
AI: "Für die hintere Schulter (Rear Delts):
     - Face Pulls
     - Reverse Flys
     - Bent-Over Raises"
```

### Equipment-basiert
```
User: "Trizeps mit Kabel"
AI: "Trizeps am Kabel:
     - Cable Pushdowns
     - Overhead Cable Extension
     - Cable Kickbacks"
```

### Alternative finden
```
User: "Was wie Bankdrücken aber für Zuhause?"
AI: "Alternativen ohne Bank/Langhantel:
     - Liegestütze (progressiv mit Gewichtsweste)
     - Kurzhantel Floor Press
     - Dips zwischen Stühlen"
```

### Mobility/Stretching
```
User: "Was kann ich für meinen steifen Nacken machen?"
AI: "Für Nacken-Mobilität:
     - Neck CARs
     - Levator Scapulae Stretch
     - Chin Tucks"
```

## Smart Suggestions
- Zeigt relevante Alternativen
- Berücksichtigt User's Equipment
- Merkt sich häufige Suchen
- Lernt Synonyme (Bench = Bankdrücken)

## Implementation
- Semantic Search über Exercise Library
- Claude für Intent-Erkennung
- Embeddings für Similarity
- Caching für häufige Queries

## Definition of Done
- [x] Beschreibungen werden verstanden ✅ (Conversational AI)
- [x] Muskel-basierte Suche funktioniert ✅ (get_exercise_library tool)
- [x] Equipment wird berücksichtigt ✅ (Agent asks and filters)
- [x] Alternativen werden vorgeschlagen ✅ (Agent knowledge + library)

## Implementation Notes
- `get_exercise_library` tool with search/filter capabilities
- CoachAgent understands natural language queries
- Agent can suggest alternatives based on equipment/preferences
- Semantic search could be enhanced in future with embeddings
