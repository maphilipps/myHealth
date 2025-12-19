---
description: Transform feature ideas into well-structured .beans plans for myHealth
argument-hint: "[feature description, bug report, or improvement idea]"
---

# Create a myHealth Feature Plan

Transform feature descriptions into well-structured .beans markdown files following myHealth conventions.

## Feature Description

<feature_description> #$ARGUMENTS </feature_description>

**If empty, ask:** "What would you like to plan? Describe the feature, bug fix, or improvement."

## Planning Workflow

### 1. Context Gathering (Parallel)

Run these agents in parallel to gather context:

- **Task beans-analyzer**: Find related epics/features in `.beans/`
- **Task ios-developer**: Research iOS patterns if UI-related
- **Task agent-sdk-developer**: Research agent patterns if AI-related

### 2. Determine Scope

Based on the feature description:

| Type | Naming Pattern | Example |
|------|----------------|---------|
| **Epic** | `myHealth-{4char}--{title}.md` | `myHealth-nut0--nutrition-intelligence.md` |
| **Feature** | `myHealth-{4char}--{title}.md` | `myHealth-nut1--smart-food-logging.md` |
| **Task** | `myHealth-{4char}--{title}.md` | `myHealth-nut1a--calorie-api-integration.md` |

Generate a unique 4-character ID by:
1. Using first 3 letters of domain (e.g., `nut` for nutrition, `aig` for AI generation)
2. Adding sequential number (0, 1, 2...)

### 3. Research Existing Patterns

- [ ] Check similar features in `.beans/` directory
- [ ] Review iOS app structure in `myhealth-ios/`
- [ ] Review agent structure in `agent-backend/`
- [ ] Find similar Supabase patterns

### 4. Create .beans File

**Template:**

```yaml
---
title: 'Feature: [Title]'
status: todo
type: feature  # epic, feature, task, milestone
priority: high  # high, medium, low
tags:
  - [relevant-tag]
created_at: [ISO timestamp]
updated_at: [ISO timestamp]
links:
  - parent: myHealth-[parent-id]  # If child of an epic
---
```

**Markdown body includes:**

1. **Overview** - What and why
2. **User Story** - As a [user], I want [goal] so that [benefit]
3. **Acceptance Criteria** - Checkboxes for testable requirements
4. **Technical Approach** - How to implement
5. **Files to Create/Modify** - With line references
6. **Dependencies** - Other beans this requires
7. **Testing Strategy** - How to verify

### 5. Link to Parent Epic

If this is a feature under an epic:
- Add `parent: myHealth-[epic-id]` to links
- Update parent epic's updated_at timestamp

## Output

Write the plan to `.beans/myHealth-{id}--{title}.md`

## Post-Creation Options

Use **AskUserQuestion** to present:

1. **Start /mh:work** - Begin implementing this plan
2. **Review with agents** - Get feedback from relevant agents
3. **Create child features** - Break into smaller tasks
4. **View in Typora** - Open for review

## myHealth-Specific Considerations

### iOS Features
- SwiftUI view patterns from `myhealth-ios/myHealth/Sources/Views/`
- ViewModel patterns with @MainActor
- Supabase Swift SDK integration

### Agent Features
- Claude Agent SDK patterns from `agent-backend/src/`
- Tool design with Zod schemas
- System prompt engineering

### Database Features
- Supabase PostgreSQL with RLS
- Migration files in `supabase/migrations/`
- Type generation for Swift/TypeScript
