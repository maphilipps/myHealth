---
description: Execute a .beans work plan for myHealth (iOS, Agent SDK, or Supabase)
argument-hint: "[.beans file path or feature ID like 'nut1']"
---

# Execute myHealth Work Plan

Execute a .beans work plan efficiently while maintaining quality.

## Input

<work_plan> #$ARGUMENTS </work_plan>

If argument is just an ID (e.g., `nut1`), resolve to `.beans/myHealth-nut1--*.md`

## Execution Workflow

### Phase 1: Understand & Setup

1. **Read the .beans file completely**
   - Parse YAML frontmatter (status, type, priority, links)
   - Understand acceptance criteria
   - Identify technical approach

2. **Check dependencies**
   - Find parent/child beans via `links:`
   - Verify blockers are resolved

3. **Setup environment**
   ```bash
   git checkout main && git pull
   git checkout -b feature/[beans-id]-[short-title]
   ```

4. **Update .beans status**
   - Change `status: todo` → `status: in_progress`
   - Update `updated_at` timestamp

5. **Create TodoWrite tasks**
   - Break acceptance criteria into actionable tasks
   - Include testing tasks
   - Include .beans status update tasks

### Phase 2: Execute by Domain

#### iOS Work (myhealth-ios/)

Spawn **ios-developer** agent:
- Follow SwiftUI patterns in existing Views/
- Use @MainActor for ViewModels
- Integrate with Supabase Swift SDK
- Test with **xcode-tester** agent

```bash
# Build and test iOS
cd myhealth-ios
xcodebuild -project myHealth.xcodeproj \
  -scheme myHealth \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro' \
  build test
```

#### Agent SDK Work (agent-backend/)

Spawn **agent-sdk-developer** agent:
- Follow tool patterns in `src/tools/`
- Use Zod schemas for parameters
- Test endpoints with curl

```bash
# Test agent backend
cd agent-backend
npm run dev:server &
curl http://localhost:3001/api/health
```

#### Supabase Work

- Create migrations in `supabase/migrations/`
- Test with `npx supabase db reset`
- Update TypeScript types

### Phase 3: Quality Check

1. **Run domain-specific tests**
   - iOS: `xcodebuild test`
   - Agent: `npm test`
   - Supabase: `npx supabase test`

2. **Verify acceptance criteria**
   - Check each criterion from .beans file
   - Document any deviations

3. **Code review with agents**
   - For iOS: Task ios-developer for patterns check
   - For agents: Task agent-sdk-developer for SDK patterns

### Phase 4: Ship It

1. **Update .beans file**
   ```yaml
   status: done
   updated_at: [new timestamp]
   ```

2. **Commit with .beans reference**
   ```bash
   git add .
   git commit -m "$(cat <<'EOF'
   feat(beans-id): Description of what was built

   Implements myHealth-[id] acceptance criteria.

   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

3. **Create PR**
   ```bash
   gh pr create --title "feat: [Title] (myHealth-[id])" --body "$(cat <<'EOF'
   ## .beans Reference
   Implements: `.beans/myHealth-[id]--[title].md`

   ## Summary
   - [What was built]

   ## Testing
   - [How it was tested]

   ## Acceptance Criteria
   - [x] Criterion 1
   - [x] Criterion 2
   EOF
   )"
   ```

## myHealth Quality Standards

### iOS Standards
- SwiftUI with proper state management
- Async/await for concurrency
- German user-facing strings

### Agent SDK Standards
- Single-responsibility tools
- Clear Zod schemas with descriptions
- Meaningful error messages

### Supabase Standards
- RLS policies for security
- Indexes for performance
- Proper migrations

## Progress Tracking

Keep TodoWrite updated throughout. Mark .beans as `done` only when:
- All acceptance criteria met
- Tests passing
- PR created or merged
