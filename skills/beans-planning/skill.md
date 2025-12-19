---
name: beans-planning
description: Knowledge about the .beans planning system for myHealth project tracking
---

# .beans Planning System

The `.beans/` folder is myHealth's project planning system using markdown files with YAML frontmatter.

## File Naming Convention

```
myHealth-{4-char-id}--{kebab-case-title}.md
```

**ID Structure:**
- 3-letter domain prefix + sequential number
- Examples: `nut0`, `aig1`, `dep2`, `eux3`

**Common Prefixes:**
| Prefix | Domain |
|--------|--------|
| `nut` | Nutrition |
| `aig` | AI Generation |
| `dep` | Deployment |
| `eux` | User Experience |
| `agt` | Agents |
| `san` | Smart Analytics |
| `af` | AI Fitness (main epic) |

## YAML Frontmatter Schema

```yaml
---
title: 'Type: Title Here'  # Type can be Epic, Feature, Task, Milestone
status: todo               # todo, in_progress, done, superseded
type: feature              # epic, feature, task, milestone
priority: high             # high, medium, low
tags:
  - tag1
  - tag2
created_at: 2025-12-19T11:00:00Z
updated_at: 2025-12-19T11:00:00Z
links:
  - parent: myHealth-af01    # Parent epic/milestone
  - blocks: myHealth-nut2    # This blocks nut2
  - blocked-by: myHealth-nut0  # Blocked by nut0
---
```

## Status Values

| Status | Description | When to Use |
|--------|-------------|-------------|
| `todo` | Not started | Initial state |
| `in_progress` | Being worked on | When development begins |
| `done` | Completed | All acceptance criteria met |
| `superseded` | Replaced | Another approach was chosen |

## Type Hierarchy

```
Milestone (Major Release)
└── Epic (Large Feature Set)
    └── Feature (User-Facing Functionality)
        └── Task (Implementation Work)
```

## Markdown Body Structure

### For Epics

```markdown
## Overview
Brief description of the epic scope.

## Goals
- Goal 1
- Goal 2

## Features
- [ ] Feature 1 (myHealth-xxx1)
- [ ] Feature 2 (myHealth-xxx2)

## Success Criteria
How we know the epic is complete.

## Technical Notes
Architecture decisions, patterns to follow.
```

### For Features

```markdown
## Overview
What this feature does and why.

## User Story
As a [user type], I want [goal] so that [benefit].

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Approach
How to implement this feature.

## Files to Create/Modify
- `path/to/file.swift` - Description
- `path/to/another.ts` - Description

## Testing Strategy
How to verify this works.

## Dependencies
- Requires myHealth-xxx0 complete
```

### For Tasks

```markdown
## Description
Specific work to be done.

## Checklist
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## Technical Details
Implementation specifics.

## Definition of Done
- Code complete
- Tests written
- PR merged
```

## Common Operations

### Find all items by status
```bash
grep -l "status: todo" .beans/*.md
grep -l "status: in_progress" .beans/*.md
grep -l "status: done" .beans/*.md
```

### Find children of an epic
```bash
grep -l "parent: myHealth-af01" .beans/*.md
```

### Count items by type
```bash
grep -l "type: epic" .beans/*.md | wc -l
grep -l "type: feature" .beans/*.md | wc -l
```

### Find blocked items
```bash
grep -l "blocked-by:" .beans/*.md
```

## Best Practices

1. **One .beans file per work item** - Don't combine features
2. **Always set parent link** - Maintain hierarchy
3. **Update status in real-time** - Reflect current state
4. **Include acceptance criteria** - Make testable
5. **Reference file paths** - Use `file.ts:42` format
6. **Update timestamps** - On every change

## Integration with Workflow

1. `/mh:plan` creates new .beans files
2. `/mh:work` executes .beans acceptance criteria
3. `/mh:review` references .beans in PR descriptions
4. `/mh:deploy` marks .beans as done
