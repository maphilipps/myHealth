---
description: Start a Ralph Wiggum loop with myHealth-specific agents for autonomous development
argument-hint: "[task description] --max-iterations <n>"
---

# myHealth Ralph Loop

Start an autonomous development loop using the Ralph Wiggum technique with myHealth-specific agents.

## Task Description

<task> #$ARGUMENTS </task>

## How This Works

Ralph is a self-referential loop that:
1. Works on your task
2. Checks progress against criteria
3. Uses domain agents for guidance
4. Continues until complete or max iterations

**Key difference from generic Ralph:** Uses myHealth-specific agents (ios-developer, agent-sdk-developer, beans-analyzer) instead of generic code reviewers.

## Configuration

Extract from arguments or ask:
- `--max-iterations <n>` - Safety limit (default: 20)
- `--completion-promise <text>` - Signal completion (default: "MYHEALTH_COMPLETE")

## Ralph Loop Structure

### Initial Setup

```bash
# Ensure ralph-wiggum plugin is active
/ralph-loop "[task]" --max-iterations [n] --completion-promise "MYHEALTH_COMPLETE"
```

### Loop Prompt Template

The Ralph loop will iterate with this prompt structure:

```markdown
## myHealth Autonomous Development Loop

### Task
[User's task description]

### Current Iteration: [N] of [MAX]

### Previous Work Check
1. Read git status and recent commits
2. Check for test results
3. Review any error logs

### Domain Expert Consultation
Based on task type, consult:
- iOS work → Task ios-developer for SwiftUI patterns
- Agent work → Task agent-sdk-developer for SDK patterns
- Planning → Task beans-analyzer for .beans structure

### Work Strategy
1. Identify next actionable step
2. Implement using domain patterns
3. Test the implementation
4. Document in .beans if applicable

### Completion Criteria
[Criteria from original task]

### If Complete
Output: <promise>MYHEALTH_COMPLETE</promise>

### If Blocked (after 15+ iterations)
- Document what's blocking progress
- List attempted solutions
- Suggest manual intervention needed
- Output: <promise>MYHEALTH_BLOCKED</promise>
```

## Example Usage

### iOS Feature Development
```bash
/mh:ralph "Implement the NutritionLogView with:
- Food search with barcode scanning
- Manual entry form
- Recent foods list
- Save to Supabase nutrition_logs

Use ios-developer agent for SwiftUI patterns.
Run xcode-tester for verification.

Completion criteria:
- View renders without errors
- Data saves to Supabase
- Unit tests pass

Output <promise>MYHEALTH_COMPLETE</promise> when done."
--max-iterations 30
```

### Agent Development
```bash
/mh:ralph "Create the NutritionAgent with:
- Food search tool (OpenFoodFacts API)
- Calorie calculation tool
- Meal planning suggestions

Use agent-sdk-developer patterns from existing agents.

Completion criteria:
- All tools functional
- curl tests pass
- Integrated with main agent router

Output <promise>MYHEALTH_COMPLETE</promise> when done."
--max-iterations 25
```

### .beans Implementation
```bash
/mh:ralph "Implement .beans/myHealth-nut1--smart-food-logging.md

Read the .beans file for acceptance criteria.
Use /mh:work patterns for execution.

Completion criteria:
- All acceptance criteria met
- .beans status changed to done
- PR created

Output <promise>MYHEALTH_COMPLETE</promise> when done."
--max-iterations 40
```

## Domain Agent Integration

Each iteration should consult domain agents:

### iOS Development Loop
```
Each iteration:
1. Check xcodebuild status
2. If errors → Consult ios-developer for fix patterns
3. If tests fail → Consult xcode-tester for debugging
4. Apply fixes and retry
```

### Agent SDK Loop
```
Each iteration:
1. Check npm test status
2. If tool errors → Consult agent-sdk-developer
3. Test endpoint with curl
4. Apply fixes and retry
```

### .beans Management Loop
```
Each iteration:
1. Read current .beans status
2. Check acceptance criteria progress
3. Update status appropriately
4. Consult beans-analyzer for structure
```

## Safety Features

1. **Max iterations** - Always set a limit (default 20)
2. **Blocked detection** - After 15 iterations without progress, document and exit
3. **Error accumulation** - If same error 3 times, escalate to user
4. **Manual intervention** - Use `/cancel-ralph` to stop

## Cancel

```bash
/cancel-ralph
```

## Best Practices for myHealth Ralph

1. **Clear acceptance criteria** - Define testable completion
2. **Domain-specific agents** - Always use myHealth agents, not generic ones
3. **Test-driven** - Include test commands in criteria
4. **Incremental goals** - Break large tasks into phases
5. **.beans tracking** - Update .beans throughout

## When NOT to Use Ralph

- Design decisions requiring human input
- First-time architecture choices
- Unclear requirements
- Tasks requiring external API keys not yet configured
