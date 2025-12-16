#!/bin/bash
# Auto-Beans: Runs Claude Code every 30 minutes to work on pending beans
# Usage: ./scripts/auto-beans.sh (or via launchd)

set -e

PROJECT_DIR="/Users/marc.philipps/Documents/myHealth"
LOG_FILE="$PROJECT_DIR/logs/auto-beans.log"
PROMPT="Arbeite die offenen Beans ab. Schaue in .beans/ nach Tasks mit status: pending oder in_progress. Priorisiere iOS-Features. Führe Tests aus wenn möglich. Committe deine Änderungen mit aussagekräftigen Messages."

# Create logs directory if not exists
mkdir -p "$(dirname "$LOG_FILE")"

# Log start
echo "===== Auto-Beans Run: $(date) =====" >> "$LOG_FILE"

cd "$PROJECT_DIR"

# Run Claude Code in yolo mode with the prompt
# --dangerously-skip-permissions is required for unattended mode
claude --dangerously-skip-permissions --print "$PROMPT" 2>&1 | tee -a "$LOG_FILE"

echo "===== Completed: $(date) =====" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
