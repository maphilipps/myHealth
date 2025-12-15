---
title: 'iOS: Progress Charts'
status: todo
type: feature
priority: normal
tags:
    - ios
    - ui
created_at: 2025-12-15T20:45:39Z
updated_at: 2025-12-15T20:45:39Z
links:
    - parent: myHealth-mudp
---

# iOS: Progress Charts

## Beschreibung
Visualisierung von Fortschritt mit Swift Charts.

## Charts

### Gewichts-Trend
- Line Chart über Zeit
- 7-Tage Moving Average
- Ziel-Linie

### Übungs-Progression
- Line Chart (Gewicht über Zeit)
- Bar Chart (Volume pro Woche)
- PR Markers

### Workout Frequency
- Calendar Heatmap
- Streaks anzeigen

### Body Metrics
- Multi-Line (Gewicht, Sleep, Steps)
- Korrelationen visualisieren

## Implementation
```swift
import Charts

struct WeightChart: View {
    let data: [WeightEntry]
    
    var body: some View {
        Chart(data) { entry in
            LineMark(
                x: .value("Date", entry.date),
                y: .value("Weight", entry.weight)
            )
        }
        .chartYScale(domain: 75...90)
    }
}
```

## Definition of Done
- [ ] Gewichts-Chart funktioniert
- [ ] Übungs-Progression Chart
- [ ] Interaktive Tooltips
- [ ] Smooth Animations
- [ ] `/code-review:code-review` ausführen
