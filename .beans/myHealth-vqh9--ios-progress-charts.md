---
title: 'iOS: Progress Charts'
status: done
type: feature
priority: normal
tags:
    - ios
    - ui
created_at: 2025-12-15T20:45:39Z
updated_at: 2025-12-15T23:55:00Z
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
- [x] Gewichts-Chart funktioniert (weightChartSection mit LineMark/AreaMark)
- [x] Übungs-Progression Chart (strengthChartSection)
- [x] Volume Chart (volumeChartSection mit BarMark)
- [x] PRs und Big 3 Total mit Wilks Score
- [ ] Interaktive Tooltips (später)
- [ ] Smooth Animations (pending Simulator test)
- [ ] `/code-review:code-review` ausführen
