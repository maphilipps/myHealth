// Git Integration für myHealth Web-UI
// Ermöglicht Auto-Commit von Änderungen

export interface GitStatus {
  hasChanges: boolean
  staged: string[]
  unstaged: string[]
  untracked: string[]
}

export interface CommitResult {
  success: boolean
  message: string
  hash?: string
}

// Diese Funktionen würden in einer echten Implementierung
// mit einem Backend-Service kommunizieren (z.B. via Tauri oder Electron)

// Für die Web-Version speichern wir Änderungen lokal
// und zeigen an, dass sie noch nicht committed sind

const PENDING_CHANGES_KEY = 'myhealth_pending_changes'

interface PendingChange {
  type: 'daily' | 'workout' | 'nutrition' | 'vitals'
  date: string
  data: Record<string, unknown>
  timestamp: number
}

export function savePendingChange(change: Omit<PendingChange, 'timestamp'>): void {
  const pending = getPendingChanges()
  pending.push({ ...change, timestamp: Date.now() })
  localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pending))
}

export function getPendingChanges(): PendingChange[] {
  const stored = localStorage.getItem(PENDING_CHANGES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function clearPendingChanges(): void {
  localStorage.removeItem(PENDING_CHANGES_KEY)
}

export function hasPendingChanges(): boolean {
  return getPendingChanges().length > 0
}

export function getPendingChangesCount(): number {
  return getPendingChanges().length
}

// Generiere YAML aus den pending changes
export function generateYamlExport(): string {
  const changes = getPendingChanges()
  const grouped = changes.reduce((acc, change) => {
    const key = `${change.type}/${change.date}`
    acc[key] = change.data
    return acc
  }, {} as Record<string, Record<string, unknown>>)

  let yaml = '# myHealth Export\n'
  yaml += `# Generated: ${new Date().toISOString()}\n\n`

  for (const [key, data] of Object.entries(grouped)) {
    yaml += `# ${key}.yaml\n`
    yaml += objectToYaml(data, 0)
    yaml += '\n---\n\n'
  }

  return yaml
}

function objectToYaml(obj: Record<string, unknown>, indent: number): string {
  let yaml = ''
  const spaces = '  '.repeat(indent)

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue

    if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`
      for (const item of value) {
        if (typeof item === 'object') {
          yaml += `${spaces}  -\n`
          yaml += objectToYaml(item as Record<string, unknown>, indent + 2)
        } else {
          yaml += `${spaces}  - ${item}\n`
        }
      }
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n`
      yaml += objectToYaml(value as Record<string, unknown>, indent + 1)
    } else {
      yaml += `${spaces}${key}: ${value}\n`
    }
  }

  return yaml
}

// Download pending changes as YAML file
export function downloadPendingChanges(): void {
  const yaml = generateYamlExport()
  const blob = new Blob([yaml], { type: 'text/yaml' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `myhealth-export-${new Date().toISOString().split('T')[0]}.yaml`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Commit message generator
export function generateCommitMessage(changes: PendingChange[]): string {
  const types = [...new Set(changes.map(c => c.type))]
  const dates = [...new Set(changes.map(c => c.date))].sort()

  if (types.length === 1 && dates.length === 1) {
    return `data: Add ${types[0]} for ${dates[0]}`
  }

  if (dates.length === 1) {
    return `data: Add ${types.join(', ')} for ${dates[0]}`
  }

  const dateRange = `${dates[0]} to ${dates[dates.length - 1]}`
  return `data: Add ${types.join(', ')} (${dateRange})`
}
