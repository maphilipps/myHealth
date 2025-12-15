#!/bin/bash
# Check for recent Apple Health export files
# Returns path if found, empty if not

SEARCH_DIRS=("$HOME/Downloads" "$HOME/Desktop")
EXPORT_PATTERNS=("export.xml" "apple_health_export")

for dir in "${SEARCH_DIRS[@]}"; do
  if [[ -d "$dir" ]]; then
    # Look for export.xml files modified in last 24 hours
    result=$(find "$dir" -name "export.xml" -mtime -1 2>/dev/null | head -1)
    if [[ -n "$result" ]]; then
      echo "$result"
      exit 0
    fi

    # Look for apple_health_export directory
    result=$(find "$dir" -type d -name "apple_health_export" -mtime -1 2>/dev/null | head -1)
    if [[ -n "$result" ]]; then
      echo "$result/export.xml"
      exit 0
    fi
  fi
done

# No recent export found
exit 1
