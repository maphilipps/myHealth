#!/bin/bash
# Apple Health Sync Script für myHealth
# Liest exportierte Apple Health Daten und konvertiert sie zu YAML

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
DATA_DIR="$PROJECT_ROOT/data"
EXPORT_DIR="$HOME/Documents/apple-health-export"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Prüfe ob Export-Verzeichnis existiert
check_export() {
    if [[ ! -d "$EXPORT_DIR" ]]; then
        log_warn "Apple Health Export nicht gefunden: $EXPORT_DIR"
        log_info "So exportierst du deine Apple Health Daten:"
        echo "  1. Öffne die Health App auf deinem iPhone"
        echo "  2. Tippe auf dein Profilbild (oben rechts)"
        echo "  3. Scrolle nach unten und tippe auf 'Alle Gesundheitsdaten exportieren'"
        echo "  4. Entpacke die ZIP-Datei nach: $EXPORT_DIR"
        return 1
    fi

    if [[ ! -f "$EXPORT_DIR/export.xml" ]]; then
        log_error "export.xml nicht gefunden in $EXPORT_DIR"
        return 1
    fi

    log_info "Apple Health Export gefunden"
    return 0
}

# Extrahiere Gewichtsdaten
sync_weight() {
    log_info "Synchronisiere Gewichtsdaten..."

    # Verwende xmllint oder python für XML-Parsing
    if command -v python3 &> /dev/null; then
        python3 << 'PYTHON_SCRIPT'
import xml.etree.ElementTree as ET
from datetime import datetime
import os
import yaml

export_file = os.path.expanduser("~/Documents/apple-health-export/export.xml")
data_dir = os.path.expanduser("~/Documents/myHealth/data/daily")

os.makedirs(data_dir, exist_ok=True)

tree = ET.parse(export_file)
root = tree.getroot()

weight_records = {}

for record in root.findall(".//Record[@type='HKQuantityTypeIdentifierBodyMass']"):
    date_str = record.get('startDate')[:10]
    value = float(record.get('value'))

    if date_str not in weight_records or value < weight_records[date_str]:
        weight_records[date_str] = round(value, 1)

for date_str, weight in sorted(weight_records.items())[-30:]:  # Letzte 30 Tage
    yaml_file = os.path.join(data_dir, f"{date_str}.yaml")

    if os.path.exists(yaml_file):
        with open(yaml_file, 'r') as f:
            data = yaml.safe_load(f) or {}
    else:
        data = {'date': date_str}

    data['weight'] = weight

    with open(yaml_file, 'w') as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True)

    print(f"  {date_str}: {weight} kg")

print(f"\n  {len(weight_records)} Gewichtsmessungen synchronisiert")
PYTHON_SCRIPT
    else
        log_warn "Python3 nicht gefunden - überspringe Gewichtssync"
    fi
}

# Extrahiere Schrittzahlen
sync_steps() {
    log_info "Synchronisiere Schritte..."

    if command -v python3 &> /dev/null; then
        python3 << 'PYTHON_SCRIPT'
import xml.etree.ElementTree as ET
from datetime import datetime
from collections import defaultdict
import os
import yaml

export_file = os.path.expanduser("~/Documents/apple-health-export/export.xml")
data_dir = os.path.expanduser("~/Documents/myHealth/data/daily")

os.makedirs(data_dir, exist_ok=True)

tree = ET.parse(export_file)
root = tree.getroot()

daily_steps = defaultdict(int)

for record in root.findall(".//Record[@type='HKQuantityTypeIdentifierStepCount']"):
    date_str = record.get('startDate')[:10]
    value = int(float(record.get('value')))
    daily_steps[date_str] += value

for date_str, steps in sorted(daily_steps.items())[-30:]:
    yaml_file = os.path.join(data_dir, f"{date_str}.yaml")

    if os.path.exists(yaml_file):
        with open(yaml_file, 'r') as f:
            data = yaml.safe_load(f) or {}
    else:
        data = {'date': date_str}

    data['steps'] = steps

    with open(yaml_file, 'w') as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True)

    print(f"  {date_str}: {steps:,} Schritte")

print(f"\n  {len(daily_steps)} Tage mit Schritten synchronisiert")
PYTHON_SCRIPT
    else
        log_warn "Python3 nicht gefunden - überspringe Schrittsync"
    fi
}

# Extrahiere Schlafdaten
sync_sleep() {
    log_info "Synchronisiere Schlafdaten..."

    if command -v python3 &> /dev/null; then
        python3 << 'PYTHON_SCRIPT'
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from collections import defaultdict
import os
import yaml

export_file = os.path.expanduser("~/Documents/apple-health-export/export.xml")
data_dir = os.path.expanduser("~/Documents/myHealth/data/daily")

os.makedirs(data_dir, exist_ok=True)

tree = ET.parse(export_file)
root = tree.getroot()

daily_sleep = defaultdict(float)

sleep_types = [
    'HKCategoryTypeIdentifierSleepAnalysis',
]

for record in root.findall(".//Record"):
    record_type = record.get('type')
    if 'Sleep' not in record_type:
        continue

    start = datetime.fromisoformat(record.get('startDate').replace(' ', 'T')[:19])
    end = datetime.fromisoformat(record.get('endDate').replace(' ', 'T')[:19])

    # Schlaf wird dem Aufwach-Tag zugeordnet
    date_str = end.strftime('%Y-%m-%d')
    duration = (end - start).total_seconds() / 3600  # Stunden

    if duration > 0 and duration < 14:  # Plausibilitätsprüfung
        daily_sleep[date_str] += duration

for date_str, hours in sorted(daily_sleep.items())[-30:]:
    yaml_file = os.path.join(data_dir, f"{date_str}.yaml")

    if os.path.exists(yaml_file):
        with open(yaml_file, 'r') as f:
            data = yaml.safe_load(f) or {}
    else:
        data = {'date': date_str}

    data['sleep_hours'] = round(hours, 1)

    with open(yaml_file, 'w') as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True)

    print(f"  {date_str}: {hours:.1f}h Schlaf")

print(f"\n  {len(daily_sleep)} Nächte synchronisiert")
PYTHON_SCRIPT
    else
        log_warn "Python3 nicht gefunden - überspringe Schlafsync"
    fi
}

# Extrahiere Herzfrequenz
sync_heart_rate() {
    log_info "Synchronisiere Herzfrequenz..."

    if command -v python3 &> /dev/null; then
        python3 << 'PYTHON_SCRIPT'
import xml.etree.ElementTree as ET
from datetime import datetime
from collections import defaultdict
import os
import yaml

export_file = os.path.expanduser("~/Documents/apple-health-export/export.xml")
data_dir = os.path.expanduser("~/Documents/myHealth/data/vitals")

os.makedirs(data_dir, exist_ok=True)

tree = ET.parse(export_file)
root = tree.getroot()

daily_hr = defaultdict(list)

for record in root.findall(".//Record[@type='HKQuantityTypeIdentifierHeartRate']"):
    date_str = record.get('startDate')[:10]
    value = float(record.get('value'))
    daily_hr[date_str].append(value)

for date_str, values in sorted(daily_hr.items())[-30:]:
    yaml_file = os.path.join(data_dir, f"{date_str}.yaml")

    if os.path.exists(yaml_file):
        with open(yaml_file, 'r') as f:
            data = yaml.safe_load(f) or {}
    else:
        data = {'date': date_str}

    data['heart_rate'] = {
        'resting': round(min(values)),
        'average': round(sum(values) / len(values)),
        'max': round(max(values))
    }

    with open(yaml_file, 'w') as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True)

    print(f"  {date_str}: Ruhe {min(values):.0f}, Avg {sum(values)/len(values):.0f}, Max {max(values):.0f} bpm")

print(f"\n  {len(daily_hr)} Tage mit Herzfrequenz synchronisiert")
PYTHON_SCRIPT
    else
        log_warn "Python3 nicht gefunden - überspringe HR-Sync"
    fi
}

# Hauptfunktion
main() {
    echo ""
    echo "╔═══════════════════════════════════════╗"
    echo "║     Apple Health Sync für myHealth    ║"
    echo "╚═══════════════════════════════════════╝"
    echo ""

    if ! check_export; then
        exit 1
    fi

    sync_weight
    echo ""
    sync_steps
    echo ""
    sync_sleep
    echo ""
    sync_heart_rate

    echo ""
    log_info "Sync abgeschlossen!"
    echo ""

    # Git Status anzeigen
    cd "$PROJECT_ROOT"
    if git status --porcelain | grep -q "data/"; then
        log_info "Neue Daten gefunden. Committen mit:"
        echo "  git add data/ && git commit -m 'sync: Apple Health Daten $(date +%Y-%m-%d)'"
    fi
}

main "$@"
