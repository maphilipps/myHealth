---
title: 'iOS: iCloud Sync'
status: superseded
type: feature
priority: low
tags:
    - ios
    - sync
created_at: 2025-12-15T20:45:36Z
updated_at: 2025-12-16T09:30:00Z
links:
    - parent: myHealth-mudp
---

# iOS: iCloud Sync

> ⚠️ **SUPERSEDED** by Supabase - Multi-device sync und Backup werden automatisch durch Supabase PostgreSQL gehandhabt. iCloud Sync würde zu Datenkonflikten führen.

## Beschreibung
~~Synchronisation der Workout-Daten über iCloud für Multi-Device Support und Backup.~~

**Warum superseded:** Die ursprüngliche YAML-basierte Architektur benötigte iCloud für Multi-Device-Support. Mit der Supabase-Migration werden alle Daten zentral in PostgreSQL gespeichert und sind automatisch auf allen Geräten verfügbar.

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
- [ ] `/code-review:code-review` ausführen
