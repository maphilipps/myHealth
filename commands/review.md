---
description: Review code changes with myHealth-specific agents (iOS, Agent SDK, Fitness)
argument-hint: "[PR number, branch name, or 'latest' for current branch]"
---

# myHealth Code Review

Perform code review using myHealth-specific agents for iOS, Agent SDK, and fitness domain expertise.

## Review Target

<review_target> #$ARGUMENTS </review_target>

If empty, review current branch changes: `git diff main...HEAD`

## Review Workflow

### 1. Setup & Context

```bash
# Get PR info if number provided
gh pr view [PR_NUMBER] --json title,body,files,baseRefName

# Or diff current branch
git diff main...HEAD --stat
git diff main...HEAD
```

### 2. Categorize Changes

Analyze changed files to determine which agents to spawn:

| Path Pattern | Agent to Use |
|--------------|--------------|
| `myhealth-ios/**` | ios-developer |
| `agent-backend/**` | agent-sdk-developer |
| `.beans/**` | beans-analyzer |
| `supabase/**` | (general review) |

### 3. Parallel Agent Reviews

Spawn relevant agents in parallel based on changed files:

#### iOS Changes
```
Task ios-developer: "Review iOS changes for:
- SwiftUI best practices
- State management (@State, @StateObject, @EnvironmentObject)
- Supabase Swift SDK patterns
- HealthKit integration patterns
- Async/await usage
- Memory management"
```

#### Agent SDK Changes
```
Task agent-sdk-developer: "Review agent changes for:
- Tool design (single responsibility, clear naming)
- Zod schema quality (descriptions, validation)
- System prompt effectiveness
- Error handling
- API endpoint design"
```

#### .beans Changes
```
Task beans-analyzer: "Review .beans changes for:
- Correct YAML frontmatter structure
- Proper naming convention
- Valid parent/child links
- Complete acceptance criteria"
```

### 4. Fitness Domain Review

For any fitness-related logic, verify:

- [ ] Progressive overload calculations correct
- [ ] Rep ranges and RPE handling appropriate
- [ ] Exercise categorization accurate
- [ ] Nutrition calculations (if applicable)

### 5. Cross-Cutting Concerns

Always check:

- [ ] **Security**: No hardcoded secrets, proper RLS policies
- [ ] **Performance**: No N+1 queries, proper caching
- [ ] **Testing**: New code has tests
- [ ] **Types**: Proper TypeScript/Swift types

### 6. Synthesize Findings

Categorize findings by severity:

| Severity | Description | Action |
|----------|-------------|--------|
| 🔴 **P1 Critical** | Blocks merge (security, data loss) | Must fix |
| 🟡 **P2 Important** | Should fix (bugs, bad patterns) | Should fix |
| 🔵 **P3 Nice-to-have** | Improvements (style, optimization) | Optional |

### 7. Output Format

```markdown
## myHealth Code Review: [PR Title / Branch]

### Files Reviewed
- `myhealth-ios/...` (iOS)
- `agent-backend/...` (Agent SDK)
- `.beans/...` (Planning)

### Agent Findings

#### iOS Developer Agent
- [Finding 1]
- [Finding 2]

#### Agent SDK Developer Agent
- [Finding 1]
- [Finding 2]

### Summary

| Severity | Count |
|----------|-------|
| 🔴 P1 | X |
| 🟡 P2 | X |
| 🔵 P3 | X |

### Required Actions (P1)
1. [Action item]

### Recommended Actions (P2)
1. [Action item]

### Suggestions (P3)
1. [Suggestion]
```

## Post-Review Options

Use **AskUserQuestion**:

1. **Fix P1 issues** - Address critical findings immediately
2. **Start /mh:work** - Fix all issues systematically
3. **Approve & merge** - If no P1 issues
4. **Request changes** - Post review comments to PR

## myHealth-Specific Checks

### iOS Specific
- [ ] German strings for user-facing text
- [ ] HealthKit permissions handled gracefully
- [ ] Offline support considered

### Agent SDK Specific
- [ ] Tools return structured JSON
- [ ] Agents have clear personas
- [ ] Streaming responses work

### Supabase Specific
- [ ] RLS policies tested
- [ ] Migrations reversible
- [ ] Indexes on query columns
