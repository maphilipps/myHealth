---
title: 'iOS: HealthKit Integration'
status: todo
type: feature
priority: critical
tags:
    - ios
    - healthkit
    - core
created_at: 2025-12-15T20:45:08Z
updated_at: 2025-12-15T20:45:08Z
links:
    - parent: myHealth-mudp
---

# iOS: HealthKit Integration

## Beschreibung
Integration mit Apple HealthKit für automatischen Import von Gesundheitsdaten.

## Zu importierende Daten
| Datentyp | HealthKit Identifier | Frequenz |
|----------|---------------------|----------|
| Schritte | HKQuantityTypeIdentifierStepCount | Täglich |
| Herzfrequenz | HKQuantityTypeIdentifierHeartRate | Kontinuierlich |
| Ruhe-HR | HKQuantityTypeIdentifierRestingHeartRate | Täglich |
| Schlaf | HKCategoryTypeIdentifierSleepAnalysis | Täglich |
| Gewicht | HKQuantityTypeIdentifierBodyMass | Täglich |
| HRV | HKQuantityTypeIdentifierHeartRateVariabilitySDNN | Täglich |
| Aktive Energie | HKQuantityTypeIdentifierActiveEnergyBurned | Täglich |

## Implementation

### HealthKitService
```swift
import HealthKit

class HealthKitService {
    private let healthStore = HKHealthStore()
    
    func requestAuthorization() async throws {
        let readTypes: Set<HKObjectType> = [
            HKQuantityType(.stepCount),
            HKQuantityType(.heartRate),
            HKQuantityType(.bodyMass),
            HKCategoryType(.sleepAnalysis)
        ]
        
        try await healthStore.requestAuthorization(
            toShare: [],
            read: readTypes
        )
    }
    
    func fetchSteps(for date: Date) async throws -> Int {
        // Implementation
    }
    
    func fetchSleep(for date: Date) async throws -> Double {
        // Implementation
    }
}
```

### Background Refresh
- Täglich morgens Daten vom Vortag holen
- Bei App-Start aktuelle Daten synchronisieren

### Permissions
- Nur Read-Access anfordern
- User über Datenschutz informieren
- Graceful Degradation wenn abgelehnt

## Definition of Done
- [ ] Alle Datentypen werden importiert
- [ ] Permission Request funktioniert
- [ ] Background Sync eingerichtet
- [ ] Daten werden in SwiftData gespeichert
