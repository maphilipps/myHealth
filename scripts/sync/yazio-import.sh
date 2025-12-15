#!/bin/bash
# Yazio Import Script für myHealth
# Importiert Ernährungsdaten aus Yazio CSV Export

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
DATA_DIR="$PROJECT_ROOT/data/nutrition"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

usage() {
    echo "Usage: $0 <yazio-export.csv>"
    echo ""
    echo "So exportierst du deine Yazio-Daten:"
    echo "  1. Öffne Yazio App → Einstellungen"
    echo "  2. Tippe auf 'Daten exportieren'"
    echo "  3. Wähle 'CSV-Export'"
    echo "  4. Speichere die Datei und führe dieses Script aus"
    exit 1
}

if [[ $# -lt 1 ]]; then
    usage
fi

CSV_FILE="$1"

if [[ ! -f "$CSV_FILE" ]]; then
    log_error "Datei nicht gefunden: $CSV_FILE"
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║      Yazio Import für myHealth        ║"
echo "╚═══════════════════════════════════════╝"
echo ""

log_info "Lese Yazio-Export: $CSV_FILE"

mkdir -p "$DATA_DIR"

# Python-Script für CSV-Parsing
python3 << PYTHON_SCRIPT
import csv
import yaml
import os
from datetime import datetime
from collections import defaultdict

csv_file = "$CSV_FILE"
data_dir = "$DATA_DIR"

# Yazio CSV Format variiert je nach Export-Typ
# Typische Spalten: Datum, Mahlzeit, Lebensmittel, Menge, Kalorien, Protein, Kohlenhydrate, Fett

daily_data = defaultdict(lambda: {
    'meals': [],
    'totals': {'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0}
})

meal_type_map = {
    'Frühstück': 'breakfast',
    'Breakfast': 'breakfast',
    'Mittagessen': 'lunch',
    'Lunch': 'lunch',
    'Abendessen': 'dinner',
    'Dinner': 'dinner',
    'Snack': 'snack',
    'Snacks': 'snack',
}

try:
    with open(csv_file, 'r', encoding='utf-8-sig') as f:
        # Versuche verschiedene CSV-Dialekte
        sample = f.read(2048)
        f.seek(0)

        try:
            dialect = csv.Sniffer().sniff(sample, delimiters=',;\t')
        except:
            dialect = 'excel'

        reader = csv.DictReader(f, dialect=dialect)

        for row in reader:
            # Versuche verschiedene Spaltennamen
            date_str = row.get('Datum') or row.get('Date') or row.get('date')
            meal = row.get('Mahlzeit') or row.get('Meal') or row.get('meal_type')
            food = row.get('Lebensmittel') or row.get('Food') or row.get('food_name')
            amount = row.get('Menge') or row.get('Amount') or row.get('serving')
            calories = row.get('Kalorien') or row.get('Calories') or row.get('kcal') or '0'
            protein = row.get('Protein') or row.get('protein') or row.get('Eiweiß') or '0'
            carbs = row.get('Kohlenhydrate') or row.get('Carbs') or row.get('carbs') or '0'
            fat = row.get('Fett') or row.get('Fat') or row.get('fat') or '0'

            if not date_str or not food:
                continue

            # Parse Datum
            try:
                # Verschiedene Datumsformate
                for fmt in ['%Y-%m-%d', '%d.%m.%Y', '%d/%m/%Y', '%m/%d/%Y']:
                    try:
                        date = datetime.strptime(date_str.strip(), fmt)
                        date_key = date.strftime('%Y-%m-%d')
                        break
                    except:
                        continue
                else:
                    continue
            except:
                continue

            # Parse numerische Werte
            def parse_num(val):
                try:
                    return float(str(val).replace(',', '.').replace('g', '').replace('kcal', '').strip())
                except:
                    return 0

            cal = int(parse_num(calories))
            prot = int(parse_num(protein))
            carb = int(parse_num(carbs))
            fat_val = int(parse_num(fat))

            # Mahlzeit-Typ
            meal_type = meal_type_map.get(meal, 'snack') if meal else 'snack'

            # Füge zu täglichen Daten hinzu
            item = {
                'name': food.strip(),
                'amount': amount.strip() if amount else '',
                'calories': cal,
                'protein': prot
            }

            # Finde oder erstelle Mahlzeit
            meal_found = False
            for m in daily_data[date_key]['meals']:
                if m['type'] == meal_type:
                    m['items'].append(item)
                    meal_found = True
                    break

            if not meal_found:
                daily_data[date_key]['meals'].append({
                    'type': meal_type,
                    'items': [item]
                })

            # Update Totals
            daily_data[date_key]['totals']['calories'] += cal
            daily_data[date_key]['totals']['protein'] += prot
            daily_data[date_key]['totals']['carbs'] += carb
            daily_data[date_key]['totals']['fat'] += fat_val

    # Schreibe YAML-Dateien
    count = 0
    for date_key, data in sorted(daily_data.items()):
        yaml_file = os.path.join(data_dir, f"{date_key}.yaml")

        output = {
            'date': date_key,
            'target_calories': 2500,
            'target_protein': 165,
            'meals': data['meals'],
            'totals': data['totals'],
            'source': 'yazio'
        }

        with open(yaml_file, 'w') as f:
            yaml.dump(output, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        print(f"  {date_key}: {data['totals']['calories']} kcal, {data['totals']['protein']}g Protein")
        count += 1

    print(f"\n  {count} Tage importiert")

except Exception as e:
    print(f"Fehler beim Import: {e}")
    import traceback
    traceback.print_exc()
PYTHON_SCRIPT

echo ""
log_info "Import abgeschlossen!"
echo ""

# Git Status
cd "$PROJECT_ROOT"
if git status --porcelain | grep -q "data/nutrition"; then
    log_info "Neue Ernährungsdaten gefunden. Committen mit:"
    echo "  git add data/nutrition && git commit -m 'import: Yazio Ernährungsdaten'"
fi
