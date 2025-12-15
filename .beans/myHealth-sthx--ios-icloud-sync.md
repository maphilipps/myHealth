---
title: 'iOS: iCloud Sync'
status: todo
type: feature
priority: high
tags:
    - ios
    - sync
created_at: 2025-12-15T20:45:36Z
updated_at: 2025-12-15T20:45:36Z
links:
    - parent: myHealth-mudp
---

# iOS: iCloud Sync

## Beschreibung
Synchronisation der Workout-Daten über iCloud für Multi-Device Support und Backup.

## Optionen

### Option A: iCloud Drive (Empfohlen)
- YAML-Dateien direkt in iCloud Drive
- Claude Code auf Mac kann auch darauf zugreifen
- Simple Implementation

```swift
let iCloudURL = FileManager.default.url(
    forUbiquityContainerIdentifier: nil
)?.appendingPathComponent("Documents/myHealth")
```

### Option B: CloudKit
- Strukturierte Daten
- Komplexere Implementation
- Bessere Konflikt-Handling

## Implementation (iCloud Drive)
1. iCloud Capability in Xcode aktivieren
2. Container erstellen
3. File Coordination für Schreib-Zugriff
4. NSMetadataQuery für Sync-Status

## Sync-Strategie
- Bei App Start: Alle Files synchronisieren
- Bei Änderung: Debounced Write (500ms)
- Konflikt: Neuere Version gewinnt (mit Backup)

## Definition of Done
- [ ] Daten werden in iCloud geschrieben
- [ ] Mac kann Daten lesen
- [ ] Offline-Modus funktioniert
- [ ] Sync-Status wird angezeigt
