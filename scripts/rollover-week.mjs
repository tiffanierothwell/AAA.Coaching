// Weekly rollover — run every Sunday.
//
// Starts a FRESH current week and lets the prior week fall into the archive.
// Because WEEKLY_LOG is newest-first and the app shows [0] as "This week" and
// [1..] in the Archive accordion, "archiving last week" is simply prepending a
// new entry for the new week — the old current week becomes [1] automatically.
//
// Idempotent and safe: it only acts when WEEKLY_LOG[0] isn't already the
// current (Sunday-based) week, and it inserts by pure text splice so the
// existing entries and their formatting are never touched.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FILE = join(__dirname, '..', 'src', 'data', 'weeklyLog.js')

// Sunday that starts the current week.
const now = new Date()
const sunday = new Date(now)
sunday.setDate(now.getDate() - now.getDay())
const label = 'Week of ' + sunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

const src = readFileSync(FILE, 'utf8')

if (src.includes(`dates: "${label}"`)) {
  console.log(`✅  Already on "${label}" — no rollover needed.`)
  process.exit(0)
}

const fresh = `  {
    dates: "${label}",
    title: "This week's build-out",
    intro: "Just getting started — progress will land here as the week goes on.",
  },
`

const marker = 'export const WEEKLY_LOG = [\n'
const idx = src.indexOf(marker)
if (idx === -1) {
  console.error('❌  Could not find the WEEKLY_LOG array marker — aborting without changes.')
  process.exit(1)
}
const at = idx + marker.length
writeFileSync(FILE, src.slice(0, at) + fresh + src.slice(at))
console.log(`✅  Rolled over: prepended a fresh "${label}"; the prior week is now the top of the archive.`)
