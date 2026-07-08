import './App.css'
import { useState, useEffect } from 'react'
import { PM_DETAILS } from './data/pmDetails'

function useIsMobile(bp = 640) {
  const [mobile, setMobile] = useState(() => window.innerWidth < bp)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < bp)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [bp])
  return mobile
}

// ── Design tokens ─────────────────────────────────────────────
const INK   = "#0A0A0A"
const INK2  = "#4A4A4A"
const INK3  = "#9A9A9A"
const RULE  = "#E8E8E8"
const CHIP  = "#F0F0F0"
const FONT  = "'Montserrat', 'Inter', sans-serif"
const SH    = "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)"

// Severity colours
const SEV_LOW    = "#22C55E"
const SEV_MED    = "#F59E0B"
const SEV_HIGH   = "#EF4444"
const SEV_LIVE   = "#22C55E"

// ── Card surface ──────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  boxShadow: SH,
  overflow: "hidden",
}

// ── Pill ─────────────────────────────────────────────────────
type PillKind = "solid" | "outline" | "muted"
function Pill({ label, kind = "outline" }: { label: string; kind?: PillKind }) {
  const isMobile = useIsMobile()
  const s: Record<PillKind, React.CSSProperties> = {
    solid:   { background: INK,   color: "#fff", border: `1px solid ${INK}` },
    outline: { background: "transparent", color: INK2, border: "1px solid rgba(0,0,0,0.25)" },
    muted:   { background: CHIP, color: INK3,  border: `1px solid ${RULE}` },
  }
  return (
    <span style={{
      fontFamily: FONT, fontSize: isMobile ? 7 : 8, fontWeight: 800,
      letterSpacing: isMobile ? 0.8 : 1.5,
      textTransform: "uppercase" as const,
      padding: isMobile ? "2px 7px" : "3px 9px", borderRadius: 99,
      whiteSpace: "nowrap" as const, flexShrink: 0, ...s[kind],
    }}>{label}</span>
  )
}

// ── Section label ─────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 4, height: 4, background: INK, borderRadius: 1, flexShrink: 0 }} />
      <span style={{
        fontFamily: FONT, fontSize: 9, fontWeight: 700,
        letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3,
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: RULE }} />
    </div>
  )
}

// ── Row ───────────────────────────────────────────────────────
function Row({ label, value, pill }: { label: string; value: string; pill?: React.ReactNode }) {
  const isMobile = useIsMobile()
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: isMobile ? 8 : 12,
      padding: "9px 0", borderBottom: `1px solid ${RULE}`,
    }}>
      <span style={{ fontFamily: FONT, fontSize: isMobile ? 9 : 10, fontWeight: 300, color: INK3, minWidth: isMobile ? 76 : 112, flexShrink: 0, letterSpacing: 0.2 }}>{label}</span>
      <span style={{ fontFamily: FONT, fontSize: isMobile ? 11 : 12, fontWeight: 500, color: INK2, flex: 1, lineHeight: 1.4, minWidth: 0 }}>{value}</span>
      {pill}
    </div>
  )
}

// ── Modal shell ───────────────────────────────────────────────
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "5vh 4vw", overflowY: "auto" as const,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, maxWidth: 920, width: "100%",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute" as const, top: 18, right: 18, zIndex: 2,
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontFamily: FONT, fontWeight: 700,
          }}
        >×</button>
        {children}
      </div>
    </div>
  )
}

function ModalSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
          {label}
        </span>
        <div style={{ flex: 1, height: 1, background: RULE }} />
      </div>
      <div style={{ fontFamily: FONT, fontSize: 13, color: INK2, lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  )
}

// Decode HTML entities (the source data uses &apos; &amp; &#x27; etc.)
function decodeEntities(s: string): string {
  return s
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function CodeChip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: 11, fontWeight: 500,
      background: CHIP, color: INK,
      border: `1px solid ${RULE}`,
      padding: "3px 10px", borderRadius: 5,
      display: "inline-block",
    }}>{children}</span>
  )
}

// ── Tag chip (light) ──────────────────────────────────────────
function TagChip({ label, kind = "light" }: { label: string; kind?: "light" | "dark" }) {
  const dark = kind === "dark"
  return (
    <span style={{
      fontFamily: FONT, fontWeight: 600, fontSize: 9.5,
      color: dark ? "rgba(255,255,255,0.85)" : INK2,
      background: dark ? "rgba(255,255,255,0.08)" : CHIP,
      border: dark ? "1px solid rgba(255,255,255,0.12)" : `1px solid ${RULE}`,
      padding: "3px 10px", borderRadius: 99,
      whiteSpace: "nowrap" as const,
      letterSpacing: 0.2,
    }}>{label}</span>
  )
}

// ── Severity dot pill ─────────────────────────────────────────
function SevPill({ count, kind }: { count: number; kind: "low" | "med" | "high" | "total" }) {
  const palette = {
    low:   { bg: "transparent", color: SEV_LOW,  border: SEV_LOW,  label: "LOW" },
    med:   { bg: "transparent", color: SEV_MED,  border: SEV_MED,  label: "MED" },
    high:  { bg: "transparent", color: SEV_HIGH, border: SEV_HIGH, label: "HIGH" },
    total: { bg: INK,           color: "#fff",   border: INK,      label: "TOTAL" },
  }[kind]
  return (
    <span style={{
      fontFamily: FONT, fontWeight: 800, fontSize: 9.5,
      letterSpacing: 1, textTransform: "uppercase" as const,
      padding: "4px 10px", borderRadius: 99,
      background: palette.bg, color: palette.color,
      border: `1.5px solid ${palette.border}`,
      display: "inline-flex", alignItems: "center", gap: 6,
      whiteSpace: "nowrap" as const,
    }}>
      {kind !== "total" && (
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.color, display: "inline-block" }}/>
      )}
      {count} {palette.label}
    </span>
  )
}

// ════════════════════════════════════════════════════════════════
// PROGRESS TIMELINE
// ════════════════════════════════════════════════════════════════
type MS = "done" | "now" | "later"
type Phase = {
  num: number
  name: string
  note: string
  milestones: { label: string; sub: string; status: MS }[]
  emptyNote?: string
}

const PHASES: Phase[] = [
  {
    num: 1, name: "LTV Hub Command Center", note: "Complete · demoed to Mike last week",
    milestones: [
      { label: "Stack chosen",    sub: "Python · FastAPI",        status: "done" },
      { label: "Server live",     sub: "Andre · Caddy + SSL",     status: "done" },
      { label: "Supabase",        sub: "supabase.mjmspace.com",   status: "done" },
      { label: "Littletree data", sub: "~789k rows · read-only",  status: "done" },
      { label: "Schema built",    sub: "masterdash · 25 tables",  status: "done" },
      { label: "Supabase MCP",    sub: "Connected · Claude",      status: "done" },
      { label: "Daily AI intel",  sub: "GitHub Action + Claude",  status: "done" },
      { label: "Telegram bots",   sub: "CommandOS live",          status: "done" },
      { label: "Task management", sub: "Capture · route · assign", status: "done" },
      { label: "Demo to Mike",    sub: "Ended last week",         status: "done" },
    ],
  },
  {
    num: 2, name: "MJM Command Center", note: "In progress · demo day today",
    milestones: [
      { label: "Demo Prep",              sub: "Deck · data · dry run",   status: "done"  },
      { label: "Demo Day",               sub: "TODAY · MJM Group",       status: "now"   },
      { label: "Needs Analysis Prep",    sub: "Questions for the team",  status: "later" },
      { label: "Needs Analysis Received", sub: "Requirements in",        status: "later" },
      { label: "Plan Proposal",          sub: "Scope · phases · cost",   status: "later" },
      { label: "Proposal Day",           sub: "Present to MJM",          status: "later" },
      { label: "Phase 1 execution build", sub: "Build sprint 1",         status: "later" },
      { label: "Phase 1 Approval & testing", sub: "Sign-off + QA",       status: "later" },
      { label: "Phase 2 execution build", sub: "Build sprint 2",         status: "later" },
      { label: "Phase 2 Approval & testing", sub: "Sign-off + QA",       status: "later" },
      { label: "Phase 3 AIOS",           sub: "Full AIOS rollout",       status: "later" },
      { label: "Phase 4 Training",       sub: "Team onboarding",         status: "later" },
      { label: "Phase 5 Evolve & Improve", sub: "Iterate + optimize",    status: "later" },
    ],
  },
]

function PhaseTimeline({ phase }: { phase: Phase }) {
  const isMobile = useIsMobile()
  const empty = phase.milestones.length === 0
  const list = empty
    ? Array.from({ length: 5 }, () => ({ label: "", sub: "", status: "later" as MS }))
    : phase.milestones
  const total    = list.length
  const doneCount = phase.milestones.filter(m => m.status === "done").length
  const nowIdx   = list.findIndex(m => m.status === "now")
  const halfStep = 100 / total / 2
  const allDone  = !empty && doneCount === total
  const fillPct  = allDone ? 100 : nowIdx >= 0 ? halfStep + (nowIdx / (total - 1)) * (100 - 2 * halfStep) : halfStep

  return (
    <div style={{ ...CARD, padding: isMobile ? "20px 16px 22px" : "26px 32px 28px", opacity: empty ? 0.85 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap" as const, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: FONT, fontSize: 9, fontWeight: 800, letterSpacing: 1.5,
            padding: "3px 9px", borderRadius: 4,
            background: empty ? CHIP : INK, color: empty ? INK3 : "#fff",
            border: empty ? `1px solid ${RULE}` : "none",
            textTransform: "uppercase" as const,
          }}>Phase {phase.num}</span>
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 800, letterSpacing: -0.2, color: INK }}>
            {phase.name}
          </span>
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 10, color: INK3, letterSpacing: 0.3 }}>
          {empty ? phase.note : <><span style={{ fontWeight: 800, color: INK }}>{doneCount}</span> / {total} · {phase.note}</>}
        </span>
      </div>

      <div style={{ position: "relative" as const }}>
        <div style={{
          position: "absolute" as const,
          top: isMobile ? 10 : 27, left: `${halfStep}%`, right: `${halfStep}%`,
          height: 2, background: RULE, borderRadius: 99, zIndex: 0,
        }}/>
        {!empty && (
          <div style={{
            position: "absolute" as const,
            top: isMobile ? 10 : 27, left: `${halfStep}%`,
            width: `${fillPct - halfStep}%`,
            height: 2, background: INK, borderRadius: 99, zIndex: 1,
          }}/>
        )}

        <div style={{ display: "flex", position: "relative" as const, zIndex: 2 }}>
          {list.map((m, i) => {
            const done  = m.status === "done"
            const now   = m.status === "now"
            const later = m.status === "later"
            const circleSize = isMobile ? 16 : 24
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 0 }}>
                {!isMobile && (
                  <div style={{ height: 18, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
                    {now && (
                      <span style={{
                        fontFamily: FONT, fontWeight: 800, fontSize: 7.5, letterSpacing: 1.5,
                        textTransform: "uppercase" as const,
                        background: INK, color: "#fff",
                        padding: "2px 7px", borderRadius: 99,
                      }}>Today</span>
                    )}
                  </div>
                )}
                <div style={{
                  width: circleSize, height: circleSize, borderRadius: "50%", flexShrink: 0,
                  background: done ? INK : "#fff",
                  border: done ? `2px solid ${INK}` : now ? `2.5px solid ${INK}` : `2px solid ${empty ? "#E4E4E4" : "#D8D8D8"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: now ? "0 0 0 4px rgba(0,0,0,0.09)" : "none",
                }}>
                  {done && (
                    <svg width={isMobile ? 7 : 10} height={isMobile ? 7 : 10} viewBox="0 0 12 12">
                      <polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {now && <div style={{ width: isMobile ? 6 : 8, height: isMobile ? 6 : 8, borderRadius: "50%", background: INK }}/>}
                  {later && <div style={{ width: isMobile ? 4 : 5, height: isMobile ? 4 : 5, borderRadius: "50%", background: empty ? "#E4E4E4" : "#D8D8D8" }}/>}
                </div>
                {!isMobile && !empty && (
                  <div style={{ marginTop: 9, textAlign: "center" as const, lineHeight: 1.3, padding: "0 2px" }}>
                    <div style={{
                      fontFamily: FONT, fontSize: 9,
                      fontWeight: now ? 800 : done ? 600 : 400,
                      color: now ? INK : done ? INK2 : INK3,
                      letterSpacing: now ? 0.2 : 0,
                    }}>{m.label}</div>
                    <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 8, color: now ? INK2 : INK3, marginTop: 2, letterSpacing: 0.2 }}>{m.sub}</div>
                  </div>
                )}
                {isMobile && now && (
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: INK, marginTop: 4 }}/>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {empty && (
        <div style={{ textAlign: "center" as const, marginTop: 16, fontFamily: FONT, fontWeight: 300, fontSize: 10.5, color: INK3, letterSpacing: 0.3 }}>
          {phase.emptyNote}
        </div>
      )}
    </div>
  )
}

function ProgressTimeline() {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
      {PHASES.map(p => <PhaseTimeline key={p.num} phase={p} />)}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// THE STACK SECTION DATA
// ════════════════════════════════════════════════════════════════
const STACK_CARDS = [
  {
    num: "01 · AUTOMATION ENGINE",
    title: "Python + FastAPI",
    desc: "All automations are Python scripts, served by FastAPI on Andre's server at /opt/automations. Webhook endpoints receive third-party events → Python logic → AI calls → write to Supabase → notify via Telegram or email. Cron timer handles scheduled jobs. Developed in Claude Code + Cursor.",
    chips: ["FastAPI Webhook", "Python Cron", "httpx / requests", "Supabase-py", "OpenAI / Claude API", "Python Scripts", "Background Tasks", "Telegram Bot"],
  },
  {
    num: "02 · DATABASE",
    title: "Supabase + Littletree MySQL",
    desc: "Two-database architecture. \"Littletree\" = Andre's existing MySQL transactional DB (read-only, nightly midnight refresh — source of truth for POS / gas station data). \"Mike's World\" = new Supabase Postgres DB built iteratively, service-by-service, for all AIOS-supporting data. Self-hosted via Docker on Andre's server (13 containers live, full Studio access). Postgres with row-level security per company. Supabase Auth (email/password, manual role provisioning) replaces the current localStorage gate. Storage holds every PDF, voice memo, and uploaded asset. Realtime channels push live KPI updates without refresh.",
    chips: ["Postgres 15", "Row-Level Security", "Auth (email + password)", "Storage (PDF, MP3)", "Realtime channels", "Self-hosted Docker", "pgvector"],
  },
  {
    num: "03 · INFRASTRUCTURE",
    title: "Andre's Server",
    desc: "Dedicated server already provisioned and live. Python 3.14 with automations user, PHP 8.5 + FPM for any web layer, Docker running the full Supabase stack, Caddy as reverse proxy with SSL (5 certs, all subdomains live). Zero per-operation cost — everything runs on metal.",
    chips: ["Python 3.14", "PHP 8.5 + FPM", "Docker (13 containers)", "Caddy + SSL", "5 live subdomains", "Cron service", "Webhook service"],
  },
]

const SERVER_STRIP = [
  "Python 3.14 + /opt/automations",
  "PHP 8.5 + FPM + Composer",
  "Docker + Supabase · supabase.mjmspace.com",
  "GitHub Actions · daily AI intelligence",
  "EasyCron · scheduled server jobs",
  "Caddy + SSL · all subdomains live",
]

const INTEGRATIONS = [
  "Claude API · Opus 4.8", "GitHub Actions", "EasyCron", "Supabase Realtime",
  "Telegram", "Fireflies", "Calendly", "Zoom",
  "Google Workspace", "Gmail", "Whisper",
]

function StackSection() {
  const isMobile = useIsMobile()
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
      {/* Hero white card */}
      <div style={{ ...CARD, padding: isMobile ? "22px 18px" : "36px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
          <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
            Foundation · Phase 1 · Live in production
          </span>
        </div>
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 38 : 56, color: INK, letterSpacing: -2, lineHeight: 1, margin: "0 0 18px" }}>
          The <span style={{ color: INK3 }}>Stack.</span>
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 18 }}>
          {["Python + FastAPI", "Supabase", "GitHub Actions", "EasyCron", "Claude API · Opus 4.8", "Telegram CommandOS"].map(t => (
            <span key={t} style={{
              fontFamily: FONT, fontWeight: 700, fontSize: 10,
              padding: "5px 12px", borderRadius: 99,
              background: CHIP, color: INK, border: `1px solid ${RULE}`,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: INK }}/>
              {t}
            </span>
          ))}
        </div>
        <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: isMobile ? 13 : 14, color: INK2, lineHeight: 1.7, margin: 0, maxWidth: 720 }}>
          Automations are Python scripts; FastAPI serves the webhook endpoints. Supabase (self-hosted via Docker on Andre's
          server, at <strong style={{ color: INK }}>supabase.mjmspace.com</strong>) is the database of record. Schedules run two ways: a
          nightly <strong style={{ color: INK }}>GitHub Action</strong> that calls the <strong style={{ color: INK }}>Claude API (Opus 4.8)</strong> to generate the daily
          AI intelligence (executive read + signal chips), and <strong style={{ color: INK }}>EasyCron</strong> for the server-side jobs. Results land in
          Supabase tables the dashboards read in real time via Supabase Realtime. Built and maintained in Claude Code. No n8n.
        </p>
      </div>

      {/* 3 dark cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
        {STACK_CARDS.map(c => (
          <div key={c.num} style={{
            background: INK, borderRadius: 20, padding: isMobile ? "22px 18px" : "26px 22px",
            display: "flex", flexDirection: "column" as const, gap: 14,
          }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 9, letterSpacing: 1.8, color: "rgba(255,255,255,0.5)" }}>
              {c.num}
            </div>
            <h3 style={{ fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 22 : 24, color: "#fff", letterSpacing: -0.6, lineHeight: 1.05, margin: 0 }}>
              {c.title}
            </h3>
            <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: 0 }}>
              {c.desc}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginTop: "auto" }}>
              {c.chips.map(chip => <TagChip key={chip} label={chip} kind="dark" />)}
            </div>
          </div>
        ))}
      </div>

      {/* Server live strip */}
      <div style={{ background: INK, borderRadius: 16, padding: isMobile ? "14px 16px" : "16px 22px", display: "flex", flexWrap: "wrap" as const, gap: 8, alignItems: "center" }}>
        <span style={{
          fontFamily: FONT, fontWeight: 900, fontSize: 10, letterSpacing: 1.5,
          padding: "5px 12px", borderRadius: 99,
          background: SEV_LIVE, color: INK,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: INK }}/>
          ✓ SERVER LIVE
        </span>
        {SERVER_STRIP.map(s => (
          <span key={s} style={{
            fontFamily: FONT, fontWeight: 600, fontSize: 10,
            padding: "5px 11px", borderRadius: 99,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.85)",
          }}>· {s}</span>
        ))}
      </div>

      {/* Integrations strip */}
      <div style={{ ...CARD, padding: isMobile ? "16px 18px" : "20px 28px", display: "flex", flexWrap: "wrap" as const, gap: 8, alignItems: "center" }}>
        <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" as const, color: INK3, marginRight: 8 }}>
          Integrations
        </span>
        {INTEGRATIONS.map(i => (
          <span key={i} style={{
            fontFamily: FONT, fontWeight: 600, fontSize: 10,
            padding: "4px 11px", borderRadius: 99,
            background: CHIP, color: INK2, border: `1px solid ${RULE}`,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: INK }}/>
            {i}
          </span>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MIKE'S TEAM HUB · DEEP DIVE DATA
// ════════════════════════════════════════════════════════════════
type Sev = "low" | "med" | "high"
type Auto = { id: string; sev: Sev; title: string; trigger: string; tags: string[]; phase?: string; shipped?: boolean }
type Sub = {
  title: string
  counts: { low: number; med: number; high: number; total: number }
  workflowTitle: string
  workflowMeta: string
  flow: { kind: string; text: string }[]
  rows: Auto[]
  flow2?: { title: string; meta: string; steps: { kind: string; text: string }[] }
}

const CONNECTIONS = [
  "Google Calendar · Mike", "Calendly · Mike", "Zoom", "Supabase",
  "Notion · Task Board", "Airtable · Vision Form", "Make.com", "Fireflies",
  "Telegram", "Loom", "LT Capital · external", "LT Fuel · external",
  "Jayi · external", "AAA Coaching · external", "ITAC · Indigenous Tourism",
  "Telegram Bot", "Anthropic Claude", "Whisper · OpenAI", "Claude",
]

const SECTIONS_FIT: { title: string; desc: string }[] = [
  { title: "Wrapper + Little Tree Ventures Hub", desc: "auth gate, hero, weekly calendar, quick links to the four venture dashboards." },
  { title: "PM Dashboards", desc: "single sign-on into LT Capital · LT Fuel · Jayi · AAA, plus a live activity ticker on hover." },
  { title: "Meeting Prep", desc: "every upcoming meeting gets an AI-generated prep doc (Background · Goal · Strategic Questions) + a 24h Telegram brief." },
  { title: "Resources", desc: "the mentor library (Tony · Jay · Strategic Coach · A360 · AI Bali). Cmd+K semantic search across every PDF." },
  { title: "Skills", desc: "downloadable .skill modules + a recommendation engine that surfaces the right skill at the right moment." },
  { title: "Weekly Snapshots — PM Row", desc: "Watch · Building · Next · Mike's Ideas · Blockers, narrated by Claude every Monday." },
  { title: "Weekly Snapshots — Leah Row", desc: "5 day cards · win input · Friday digest of Leah's week." },
]

const SUBS: Sub[] = [
  {
    title: "MIKE.HTML WRAPPER · AUTH · HERO · IFRAME · QUICK LINKS",
    counts: { low: 7, med: 3, high: 0, total: 10 },
    workflowTitle: "Workflow · Page Load → Auth → Little Tree Ventures Iframe Bridge",
    workflowMeta: "page load · postMessage JWT",
    flow: [
      { kind: "TRIGGER", text: "Page load" },
      { kind: "CHECK",   text: "Supabase Auth · session valid" },
      { kind: "READ",    text: "Supabase · users · Mike" },
      { kind: "UI",      text: "Render Hi Mike + Quick Links" },
      { kind: "IFRAME",  text: "Mount /ltv/index.html" },
      { kind: "BRIDGE",  text: "postMessage JWT · iframe trusts" },
    ],
    rows: [
      { id: "110", sev: "med", title: "Auth gate · Supabase Auth (replace localStorage)", trigger: "Page load", tags: ["auth.session", "users"], phase: "P1" },
      { id: "111", sev: "low", title: "Hi Mike greeting personalization", trigger: "Page load", tags: ["users", "Supabase read"], phase: "P1" },
      { id: "112", sev: "low", title: "Today / Role meta strip in hero", trigger: "Page load", tags: ["JS Date", "users.role"], phase: "P1" },
      { id: "113", sev: "low", title: "Little Tree Ventures iframe auth bridge · postMessage JWT", trigger: "Iframe load", tags: ["upgrade P1"], shipped: true },
      { id: "114", sev: "low", title: "Mike's Quick Links rendered (5 tools)", trigger: "Page load", tags: [], phase: "P0", shipped: true },
      { id: "115", sev: "low", title: "Quick Link click analytics · per-user", trigger: "Click", tags: ["beacon", "link_clicks"], phase: "P1" },
      { id: "116", sev: "low", title: "Calendly auth-expiry check (Mike's connection)", trigger: "Cron daily", tags: ["API ping"], phase: "P1" },
      { id: "117", sev: "med", title: "Telegram CommandOS slash commands for Mike", trigger: "Telegram cmd", tags: ["CommandOS"], phase: "P2" },
      { id: "118", sev: "low", title: "Activity log beacon on mike.html", trigger: "Page view + clicks", tags: ["activity_log"], phase: "P1" },
      { id: "119", sev: "med", title: "Mike's calendar overlay sync (Mike-specific GCal)", trigger: "GCal webhook", tags: ["Supabase calendar_events"], phase: "P2" },
    ],
  },
  {
    title: "LITTLE TREE VENTURES HUB · HERO + WEEKLY CALENDAR",
    counts: { low: 5, med: 5, high: 2, total: 12 },
    workflowTitle: "Workflow · Mike's Calendar Sync & Pre-Meeting Prep",
    workflowMeta: "cron · 5min · pre-meeting brief 24h",
    flow: [
      { kind: "TRIGGER", text: "Cron · 5 min" },
      { kind: "SERVICE", text: "Google Calendar API · Mike" },
      { kind: "CLAUDE",  text: "Tag venture · LT Capital / LT Fuel / Jayi / AAA" },
      { kind: "STORAGE", text: "Supabase · calendar_events" },
      { kind: "UI",      text: "Little Tree Ventures calendar grid + popup" },
      { kind: "OUTPUT",  text: "Pre-meeting brief 24h · Telegram" },
    ],
    rows: [
      { id: "120", sev: "low", title: "Hi Mike greeting · Little Tree Ventures-specific (inside iframe)", trigger: "Iframe load", tags: ["users"], phase: "P1" },
      { id: "121", sev: "low", title: "Today · Week · Quarter · Year auto-calc", trigger: "Page load", tags: ["JS Date"], phase: "P1" },
      { id: "122", sev: "low", title: "Meetings-this-week count in hero", trigger: "Page load", tags: ["Supabase query"], phase: "P1" },
      { id: "123", sev: "med", title: "Google Calendar sync · Mike (5min cron)", trigger: "Cron · 5 min", tags: ["GCal API", "Supabase upsert"], phase: "P1" },
      { id: "124", sev: "low", title: "Calendar grid render Mon–Fri", trigger: "Page load", tags: [], phase: "P0", shipped: true },
      { id: "125", sev: "low", title: "Click event → popup with details", trigger: "Click", tags: [], phase: "P0", shipped: true },
      { id: "126", sev: "low", title: "Open in Google Calendar deep link", trigger: "Click", tags: [], phase: "P0", shipped: true },
      { id: "127", sev: "low", title: "Prev / Next / Today week navigation", trigger: "Click", tags: [], phase: "P0", shipped: true },
      { id: "128", sev: "med", title: "Color-code events by venture (LT Capital · LT Fuel · Jayi · AAA · Internal)", trigger: "On sync", tags: ["Claude classify"], phase: "P2" },
      { id: "129", sev: "med", title: "Click event → opens long-form Meeting Prep modal", trigger: "Click", tags: ["modal", "load prep doc"], phase: "P2" },
      { id: "130", sev: "high", title: "Pre-meeting brief 24h before · Telegram", trigger: "Cron hourly", tags: ["Claude", "Telegram"], phase: "P3" },
      { id: "131", sev: "med", title: "Post-meeting Fireflies transcript auto-attach", trigger: "Fireflies webhook", tags: ["Supabase link"], phase: "P2" },
      { id: "131.5", sev: "high", title: "Daily Brief delivered to Mike's Telegram (06:00 morning)", trigger: "Cron 06:00", tags: ["Claude", "CommandOS"], phase: "P3" },
    ],
  },
  {
    title: "PM DASHBOARDS · 4 EXTERNAL VENTURE SITES",
    counts: { low: 5, med: 1, high: 2, total: 8 },
    workflowTitle: "Workflow · Click Folder → SSO → Open External Dashboard",
    workflowMeta: "click · JWT pass-through",
    flow: [
      { kind: "TRIGGER", text: "Click venture folder" },
      { kind: "SSO",     text: "JWT signed by AIOS" },
      { kind: "UI",      text: "Open ltcdashboard.org / ltfdashboard.org / etc" },
      { kind: "LOG",     text: "activity_log + venture_visits" },
      { kind: "PARALLEL",text: "Cron pulls KPI badges hourly" },
    ],
    rows: [
      { id: "132", sev: "low", title: "LT Capital folder click → ltcdashboard.org", trigger: "Click", tags: [], phase: "P0", shipped: true },
      { id: "133", sev: "low", title: "LT Fuel folder click → ltfdashboard.org", trigger: "Click", tags: [], phase: "P0", shipped: true },
      { id: "134", sev: "low", title: "Jayi folder click → external dashboard", trigger: "Click", tags: [], phase: "P0", shipped: true },
      { id: "135", sev: "low", title: "AAA Coaching folder click → external dashboard", trigger: "Click", tags: [], phase: "P0", shipped: true },
      { id: "136", sev: "med", title: "Live KPI badge per folder (revenue · deals · pipeline)", trigger: "Cron hourly", tags: ["HTTP×4", "Supabase"], phase: "P2" },
      { id: "137", sev: "high", title: "Single sign-on across 4 external venture dashboards", trigger: "Click folder", tags: ["JWT sign", "postMessage"], phase: "P3" },
      { id: "138", sev: "high", title: "Cross-venture activity ticker (recent events from all 4)", trigger: "Hover folder", tags: ["Supabase stream"], phase: "P3" },
      { id: "139", sev: "low", title: "Last-updated timestamp per folder", trigger: "Cron hourly", tags: ["HEAD probe"], phase: "P1" },
    ],
  },
  {
    title: "MEETING PREP · THIS WEEK · LONG-FORM MODAL PER MEETING",
    counts: { low: 2, med: 7, high: 1, total: 10 },
    workflowTitle: "Workflow · AI-Generated Prep Doc per Meeting",
    workflowMeta: "cron · daily 06:00",
    flow: [
      { kind: "TRIGGER", text: "Cron · daily 06:00" },
      { kind: "PULL",    text: "This week's meetings" },
      { kind: "JOIN",    text: "Fireflies history · attendees · open tasks · related KPIs" },
      { kind: "CLAUDE",  text: "Generate prep doc · Background · Goal · Materials · Questions · Actions" },
      { kind: "STORAGE", text: "Supabase · meeting_prep" },
      { kind: "UI",      text: "Prep grid + click → long-form modal" },
    ],
    rows: [
      { id: "140", sev: "med", title: "Auto-populate prep grid from this week's calendar", trigger: "Page load", tags: ["Supabase calendar_events"], phase: "P2" },
      { id: "141", sev: "high", title: "AI-generate prep doc per meeting (Background · Goal · Materials · Questions · Actions)", trigger: "Cron 06:00", tags: ["Claude", "multi-table join"], phase: "P3" },
      { id: "142", sev: "low", title: "Click prep card → opens long-form modal", trigger: "Click", tags: ["modal"], phase: "P2" },
      { id: "143", sev: "low", title: "Long-form modal sections render (5 sections)", trigger: "Modal open", tags: ["render"], phase: "P2" },
      { id: "144", sev: "med", title: "AI suggest 3 strategic questions per meeting", trigger: "Prep gen", tags: ["Claude"], phase: "P2" },
      { id: "145", sev: "med", title: "Pull prior Fireflies notes for same attendees", trigger: "Prep gen", tags: ["Supabase meetings join"], phase: "P2" },
      { id: "146", sev: "med", title: "Pull related open tasks/decisions", trigger: "Prep gen", tags: ["Supabase tasks/decisions"], phase: "P2" },
      { id: "147", sev: "med", title: "Pull related KPIs that matter for this meeting topic", trigger: "Prep gen", tags: ["Supabase kpis"], phase: "P2" },
      { id: "148", sev: "med", title: "Export prep doc as PDF", trigger: "Click Export", tags: ["Puppeteer", "Storage"], phase: "P2" },
      { id: "149", sev: "med", title: "Submit prep notes back to AIOS post-meeting", trigger: "Form submit", tags: ["Supabase update"], phase: "P2" },
    ],
  },
  {
    title: "RESOURCES · 5 PREMIUM TABS · TONY · JAY · STRATEGIC COACH · A360 · AI BALI",
    counts: { low: 4, med: 6, high: 2, total: 12 },
    workflowTitle: "Workflow · PDF Drop · Tag · Summarize · Search · Digest",
    workflowMeta: "file watcher · pgvector · weekly digest",
    flow: [
      { kind: "TRIGGER", text: "PDF dropped /pdfs/" },
      { kind: "CLAUDE",  text: "Tag mentor (Tony / Jay / Coach / A360 / AIBali)" },
      { kind: "CLAUDE",  text: "Summary + 5 takeaways" },
      { kind: "EMBED",   text: "pgvector · search_index" },
      { kind: "UI",      text: "5-tab folder render" },
      { kind: "DIGEST",  text: "Sunday Telegram · 2 quotes per mentor" },
    ],
    rows: [
      { id: "150", sev: "low", title: "PDF upload → AIOS Storage bucket", trigger: "File drop", tags: ["Storage"], phase: "P1" },
      { id: "151", sev: "med", title: "AI auto-tag PDF by mentor (Tony / Jay / Coach / A360 / AIBali)", trigger: "New PDF", tags: ["Claude classify"], phase: "P2" },
      { id: "152", sev: "med", title: "AI generate per-PDF summary + 5 takeaways", trigger: "New PDF", tags: ["Claude"], phase: "P2" },
      { id: "153", sev: "low", title: "Tab switching · 5 mentor tabs", trigger: "Click", tags: [], phase: "P0", shipped: true },
      { id: "154", sev: "low", title: "Click PDF → opens + tracks read", trigger: "Click", tags: ["activity_log"], phase: "P1" },
      { id: "155", sev: "high", title: "Semantic search across all mentor PDFs (Cmd+K)", trigger: "Cmd+K", tags: ["pgvector", "Claude rerank"], phase: "P3" },
      { id: "156", sev: "med", title: "Sunday Telegram digest · 2 quotes per mentor", trigger: "Cron Sun 18:00", tags: ["Claude curate", "Telegram"], phase: "P2" },
      { id: "157", sev: "low", title: "New-PDF Telegram notification", trigger: "File drop", tags: ["Telegram"], phase: "P1" },
      { id: "158", sev: "low", title: "Per-tab unread badge", trigger: "Page load", tags: ["Supabase count"], phase: "P1" },
      { id: "159", sev: "med", title: "Cross-link PDFs to current decisions/snapshots", trigger: "On synthesis", tags: ["pgvector match"], phase: "P2" },
      { id: "160", sev: "high", title: "Mike's question of the week → mentor synthesis", trigger: "Mike asks · Telegram", tags: ["Claude per-mentor"], phase: "P3" },
      { id: "161", sev: "med", title: "Voice reflection recording per PDF (Mike voice-records insight)", trigger: "Click record", tags: ["Whisper", "Supabase reflections"], phase: "P2" },
    ],
  },
  {
    title: "SKILLS · DOWNLOADABLE .SKILL MODULES",
    counts: { low: 2, med: 5, high: 1, total: 8 },
    workflowTitle: "Workflow · Skill Upload · Parse · Categorize · Recommend",
    workflowMeta: "file ingest · AI metadata · share",
    flow: [
      { kind: "TRIGGER",   text: "Upload .skill file" },
      { kind: "CLAUDE",    text: "Parse skill metadata · description · triggers" },
      { kind: "CLAUDE",    text: "Categorize + version" },
      { kind: "STORAGE",   text: "Supabase skills + Storage .skill" },
      { kind: "UI",        text: "Skills grid render" },
      { kind: "RECOMMEND", text: "AI suggests skills based on Mike's focus" },
    ],
    rows: [
      { id: "162", sev: "low", title: ".skill file download tracker", trigger: "Click download", tags: ["activity_log"], phase: "P1" },
      { id: "163", sev: "med", title: "Upload Skill flow (form/file upload)", trigger: "Click Upload", tags: ["file picker", "Storage"], phase: "P2" },
      { id: "164", sev: "med", title: "AI parse uploaded skill metadata (description · triggers · prerequisites)", trigger: "Upload event", tags: ["Claude"], phase: "P2" },
      { id: "165", sev: "low", title: "Skill categorization (Personal / Business / Coaching / Tech)", trigger: "After parse", tags: ["Claude classify"], phase: "P1" },
      { id: "166", sev: "med", title: "Skill versioning · keep history when updated", trigger: "Re-upload", tags: ["Supabase skill_versions"], phase: "P2" },
      { id: "167", sev: "med", title: "Telegram command \"/skill X\" · fetch on demand", trigger: "Telegram cmd", tags: ["CommandOS"], phase: "P2" },
      { id: "168", sev: "high", title: "Skill recommendation engine · based on Mike's current focus", trigger: "Page load", tags: ["pgvector match focus"], phase: "P3" },
      { id: "169", sev: "med", title: "Skill sharing flow · export to other AIOS workspaces", trigger: "Click Share", tags: ["generate share link"], phase: "P2" },
    ],
  },
  {
    title: "WEEKLY SNAPSHOTS · PM ROW · 3 COLS · WATCH/BUILDING/NEXT · MIKE'S IDEAS · BLOCKERS",
    counts: { low: 3, med: 11, high: 1, total: 15 },
    workflowTitle: "Workflow A · PM Watch / Building / Next (auto-pull)",
    workflowMeta: "cron · Mon 06:00",
    flow: [
      { kind: "TRIGGER", text: "Cron · Mon 06:00" },
      { kind: "SERVICE", text: "Loom + commits + Supabase tasks" },
      { kind: "CLAUDE",  text: "Synthesize Watch / Building / Next" },
      { kind: "STORAGE", text: "Supabase tiffanie_snapshot" },
      { kind: "UI",      text: "3-column render + video hero" },
    ],
    flow2: {
      title: "Workflow B · Mike's Ideas · Capture · Classify · Track",
      meta: "Airtable form · Make · priority 1/2/3",
      steps: [
        { kind: "TRIGGER",   text: "Mike submits idea" },
        { kind: "SERVICE",   text: "Airtable / Make webhook" },
        { kind: "CLAUDE",    text: "Classify priority · 1=Immediate / 2=ASAP / 3=When free" },
        { kind: "STORAGE",   text: "Supabase mike_ideas" },
        { kind: "UI",        text: "Past Ideas list + status flags" },
        { kind: "FOLLOW-UP", text: "Idle ideas auto-bumped" },
      ],
    },
    rows: [
      { id: "170", sev: "med", title: "PM's Loom video hero · auto-refresh latest", trigger: "Cron daily", tags: ["Loom API"], phase: "P2" },
      { id: "171", sev: "med", title: "\"What I'm Building\" auto-pulled from commits + tasks", trigger: "Cron Mon 06:00", tags: ["GitHub", "Supabase"], phase: "P2" },
      { id: "172", sev: "med", title: "\"What's Next to Build\" auto-pulled from queue", trigger: "Cron Mon 06:00", tags: ["Supabase API"], phase: "P2" },
      { id: "173", sev: "high", title: "PM's weekly status synthesis (Watch · Building · Next narrative)", trigger: "Cron Mon 06:00", tags: ["Claude"], phase: "P3" },
      { id: "174", sev: "med", title: "Mike's Vision Form (Airtable submit)", trigger: "Click \"Got an idea?\"", tags: ["Airtable form"], phase: "P2" },
      { id: "175", sev: "med", title: "Form submission webhook · Airtable + AIOS sync", trigger: "Submit", tags: ["webhook", "Supabase"], phase: "P2" },
      { id: "176", sev: "med", title: "AI classify priority · 1=Immediate / 2=ASAP / 3=When free", trigger: "New idea", tags: ["Claude"], phase: "P2" },
      { id: "177", sev: "low", title: "Past Ideas list auto-populated from mike_ideas", trigger: "Page load", tags: ["Supabase"], phase: "P1" },
      { id: "178", sev: "med", title: "Idea status tracking · Queued / PDF→MJM / Intro / Done", trigger: "Status change", tags: ["Supabase update"], phase: "P2" },
      { id: "179", sev: "med", title: "AI follow-up reminder · idle ideas auto-bumped", trigger: "Cron weekly", tags: ["Claude", "Telegram nudge"], phase: "P2" },
      { id: "180", sev: "med", title: "\"Enter A Brilliant Idea\" via Make.com webhook", trigger: "Voice/text capture", tags: ["Make.com", "Supabase"], phase: "P2" },
      { id: "181", sev: "med", title: "INPUT YOUR WIN · Mike → weekly roll-up via Make", trigger: "Click", tags: ["Make", "Supabase wins"], phase: "P2" },
      { id: "182", sev: "low", title: "AI categorize Mike's win (Process / Strategy / Relationship / Sales)", trigger: "New win", tags: ["Claude"], phase: "P1" },
      { id: "183", sev: "med", title: "Auto-detect blockers from team tasks (where blocked_by=mike)", trigger: "Cron 5min", tags: ["Supabase scan", "tasks"], phase: "P2" },
      { id: "184", sev: "med", title: "SLA timer on blockers · escalate if Mike sits on it", trigger: "Cron hourly", tags: ["Telegram escalate"], phase: "P2" },
    ],
  },
  {
    title: "WEEKLY SNAPSHOTS · LEAH ROW · 5 DAY CARDS · WIN INPUT",
    counts: { low: 5, med: 2, high: 0, total: 7 },
    workflowTitle: "Workflow · Leah Daily Log → 5-Day Grid → Friday Digest",
    workflowMeta: "Telegram · form · Make · cron Fri 17:00",
    flow: [
      { kind: "TRIGGER", text: "Leah logs · Telegram or form" },
      { kind: "SERVICE", text: "Make.com webhook" },
      { kind: "CLAUDE",  text: "Parse · categorize entry" },
      { kind: "STORAGE", text: "Supabase leah_log" },
      { kind: "UI",      text: "5-day grid render" },
      { kind: "DIGEST",  text: "Friday 17:00 → Mike" },
    ],
    rows: [
      { id: "185", sev: "med", title: "Leah's 5 day cards auto-populated from time-tracking", trigger: "Leah logs", tags: ["Make webhook", "Supabase"], phase: "P2" },
      { id: "187", sev: "low", title: "Manual log shift form (button on empty days)", trigger: "Click", tags: ["form open"], phase: "P1" },
      { id: "188", sev: "low", title: "Compute daily total hours per card", trigger: "Render", tags: ["SUM"], phase: "P1" },
      { id: "189", sev: "low", title: "Compute weekly total hours", trigger: "Render", tags: ["SUM"], phase: "P1" },
      { id: "190", sev: "med", title: "INPUT YOUR WIN · Leah → Make webhook → roll-up", trigger: "Click", tags: ["Make", "Supabase wins"], phase: "P2" },
      { id: "191", sev: "low", title: "AI categorize Leah's wins", trigger: "New win", tags: ["Claude"], phase: "P1" },
      { id: "192", sev: "low", title: "Friday digest of Leah's week → Mike via email/Telegram", trigger: "Cron Fri 17:00", tags: ["aggregate"], phase: "P1" },
    ],
  },
]

function FlowDiagram({ flow }: { flow: { kind: string; text: string }[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, alignItems: "center" }}>
      {flow.map((step, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{
            display: "inline-flex", flexDirection: "column" as const,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "6px 10px",
            fontFamily: FONT,
          }}>
            <span style={{ fontSize: 7.5, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: 1.2, textTransform: "uppercase" as const }}>{step.kind}</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: "#fff" }}>{step.text}</span>
          </span>
          {i < flow.length - 1 && (
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 700 }}>→</span>
          )}
        </span>
      ))}
    </div>
  )
}

function AutoRow({ a, onOpen }: { a: Auto; onOpen: (id: string) => void }) {
  const isMobile = useIsMobile()
  const dotColor = a.sev === "low" ? SEV_LOW : a.sev === "med" ? SEV_MED : SEV_HIGH
  const hasDetail = !!PM_DETAILS[a.id]
  return (
    <div
      onClick={() => hasDetail && onOpen(a.id)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "10px 0",
        borderBottom: `1px solid ${RULE}`,
        cursor: hasDetail ? "pointer" : "default",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => { if (hasDetail) (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.02)" }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
    >
      <span style={{
        fontFamily: FONT, fontWeight: 800, fontSize: 9.5, color: INK3,
        minWidth: 28, flexShrink: 0, paddingTop: 3, letterSpacing: 0.5,
      }}>{a.id}</span>
      <span style={{
        width: 8, height: 8, borderRadius: "50%", background: dotColor,
        marginTop: 7, flexShrink: 0,
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: isMobile ? 11 : 12, color: INK, lineHeight: 1.4 }}>
            {a.title}
          </span>
          {a.shipped && (
            <span style={{
              fontFamily: FONT, fontSize: 8, fontWeight: 900, letterSpacing: 1,
              padding: "2px 7px", borderRadius: 4,
              background: SEV_LIVE, color: INK,
            }}>SHIPPED</span>
          )}
          {a.phase && (
            <span style={{
              fontFamily: FONT, fontSize: 8, fontWeight: 800, letterSpacing: 0.5,
              padding: "2px 7px", borderRadius: 4,
              background: CHIP, color: INK3, border: `1px solid ${RULE}`,
            }}>{a.phase}</span>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, alignItems: "center" }}>
          <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 9.5, color: INK3, letterSpacing: 0.3 }}>
            Trigger: {a.trigger}
          </span>
          {a.tags.map(t => (
            <span key={t} style={{
              fontFamily: FONT, fontSize: 9, fontWeight: 500,
              padding: "2px 7px", borderRadius: 4,
              background: CHIP, color: INK2, border: `1px solid ${RULE}`,
              fontStyle: "italic", letterSpacing: 0.1,
            }}>{t}</span>
          ))}
          {hasDetail && (
            <span style={{
              fontFamily: FONT, fontSize: 8.5, fontWeight: 700, letterSpacing: 0.5,
              padding: "2px 7px", borderRadius: 4,
              color: INK3, marginLeft: "auto",
            }}>
              Click for detail →
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Automation row modal content ──────────────────────────────
function AutoRowModalContent({ a }: { a: Auto }) {
  const d = PM_DETAILS[a.id]
  const sevLabel = a.sev === "low" ? "LOW" : a.sev === "med" ? "MEDIUM" : "HIGH"
  const sevColor = a.sev === "low" ? SEV_LOW : a.sev === "med" ? SEV_MED : SEV_HIGH
  return (
    <div>
      {/* Dark header */}
      <div style={{ background: INK, padding: "30px 36px 24px", color: "#fff" }}>
        <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
          AUTOMATION · #{a.id}
        </div>
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, color: "#fff", letterSpacing: -0.5, lineHeight: 1.25, margin: "0 0 12px", paddingRight: 36 }}>
          {decodeEntities(a.title)}
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
          <span style={{
            fontFamily: FONT, fontWeight: 800, fontSize: 9.5, letterSpacing: 1,
            padding: "3px 9px", borderRadius: 99,
            border: `1.5px solid ${sevColor}`, color: sevColor,
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: sevColor }}/>
            {sevLabel}
          </span>
          {a.phase && (
            <span style={{
              fontFamily: FONT, fontSize: 9.5, fontWeight: 800, letterSpacing: 1,
              padding: "3px 9px", borderRadius: 99,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.85)",
            }}>PHASE {a.phase.replace("P", "")}</span>
          )}
          {a.shipped && (
            <span style={{
              fontFamily: FONT, fontSize: 9.5, fontWeight: 800, letterSpacing: 1,
              padding: "3px 9px", borderRadius: 99,
              background: SEV_LIVE, color: INK,
            }}>SHIPPED</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 36px 32px" }}>
        {d?.diagram && (
          <div
            style={{ marginBottom: 22 }}
            dangerouslySetInnerHTML={{ __html: d.diagram }}
          />
        )}
        {d?.what && (
          <ModalSection label="What it does">
            <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: d.what }} />
          </ModalSection>
        )}
        {d?.how && d.how.length > 0 && (
          <ModalSection label="How it works">
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {d.how.map((h, i) => <li key={i} style={{ marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: h }} />)}
            </ol>
          </ModalSection>
        )}
        {d?.modules && d.modules.length > 0 && (
          <ModalSection label="Modules & services">
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
              {d.modules.map(m => <CodeChip key={m}>{decodeEntities(m)}</CodeChip>)}
            </div>
          </ModalSection>
        )}
        {d?.tables && d.tables.length > 0 && (
          <ModalSection label="Tables / storage">
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
              {d.tables.map(t => <CodeChip key={t}>{decodeEntities(t)}</CodeChip>)}
            </div>
          </ModalSection>
        )}
        {d?.accept && d.accept.length > 0 && (
          <ModalSection label="Acceptance criteria">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {d.accept.map((a, i) => <li key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: a }} />)}
            </ul>
          </ModalSection>
        )}
        {d?.notes && (
          <ModalSection label="Notes">
            <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: d.notes }} />
          </ModalSection>
        )}
        {d?.longExplain && (
          <ModalSection label="Detailed explanation">
            <div className="long-explain" dangerouslySetInnerHTML={{ __html: d.longExplain }} />
          </ModalSection>
        )}
        {!d && (
          <p style={{ fontFamily: FONT, fontSize: 13, color: INK3, fontStyle: "italic", margin: 0 }}>
            Detailed write-up for this automation is in progress.
          </p>
        )}
      </div>
    </div>
  )
}

function SubBlock({ s, onOpenRow }: { s: Sub; onOpenRow: (id: string) => void }) {
  const isMobile = useIsMobile()
  return (
    <div style={{ ...CARD, padding: 0, overflow: "hidden", marginTop: 14 }}>
      {/* Header strip */}
      <div style={{
        background: CHIP, padding: isMobile ? "14px 18px" : "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap" as const, gap: 10,
        borderBottom: `1px solid ${RULE}`,
      }}>
        <span style={{
          fontFamily: FONT, fontWeight: 800, fontSize: isMobile ? 10 : 11,
          color: INK, letterSpacing: 1.2, textTransform: "uppercase" as const,
          flex: 1, minWidth: 0, lineHeight: 1.3,
        }}>{s.title}</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          {s.counts.low  > 0 && <SevPill count={s.counts.low}  kind="low"  />}
          {s.counts.med  > 0 && <SevPill count={s.counts.med}  kind="med"  />}
          {s.counts.high > 0 && <SevPill count={s.counts.high} kind="high" />}
          <SevPill count={s.counts.total} kind="total" />
        </div>
      </div>

      {/* Workflow A (dark) */}
      <div style={{ background: INK, padding: isMobile ? "16px 18px" : "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 10, color: "#fff", letterSpacing: 1, textTransform: "uppercase" as const }}>
            {s.workflowTitle}
          </span>
          <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>
            {s.workflowMeta}
          </span>
        </div>
        <FlowDiagram flow={s.flow} />

        {s.flow2 && (
          <>
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 10, color: "#fff", letterSpacing: 1, textTransform: "uppercase" as const }}>
                {s.flow2.title}
              </span>
              <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>
                {s.flow2.meta}
              </span>
            </div>
            <FlowDiagram flow={s.flow2.steps} />
          </>
        )}
      </div>

      {/* Automation rows */}
      <div style={{ padding: isMobile ? "12px 18px 18px" : "16px 24px 22px" }}>
        {s.rows.map((a, i) => (
          <div key={a.id} style={i === s.rows.length - 1 ? { marginBottom: -1 } : undefined}>
            <AutoRow a={a} onOpen={onOpenRow} />
          </div>
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _DeepDiveSection() {
  const isMobile = useIsMobile()
  const [openId, setOpenId] = useState<string | null>(null)
  const allRows: Auto[] = SUBS.flatMap(s => s.rows)
  const openRow = openId ? allRows.find(r => r.id === openId) : null
  const TOTAL_LOW = SUBS.reduce((s, x) => s + x.counts.low,  0)
  const TOTAL_MED = SUBS.reduce((s, x) => s + x.counts.med,  0)
  const TOTAL_HI  = SUBS.reduce((s, x) => s + x.counts.high, 0)
  const TOTAL     = SUBS.reduce((s, x) => s + x.counts.total, 0)

  return (
    <div>
      {/* Hero header card */}
      <div style={{ ...CARD, padding: isMobile ? "22px 18px" : "32px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 12, marginBottom: 14 }}>
          <span style={{
            fontFamily: FONT, fontWeight: 800, fontSize: 10,
            padding: "5px 12px", borderRadius: 6,
            background: INK, color: "#fff", letterSpacing: 1.5, textTransform: "uppercase" as const,
          }}>
            Page · 02 · Deep Dive
          </span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            <SevPill count={TOTAL_LOW} kind="low"   />
            <SevPill count={TOTAL_MED} kind="med"   />
            <SevPill count={TOTAL_HI}  kind="high"  />
            <SevPill count={TOTAL}     kind="total" />
          </div>
        </div>

        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 36 : 52, color: INK, letterSpacing: -2, lineHeight: 1, margin: "0 0 6px" }}>
          Mike's <span style={{ color: INK3 }}>Team Hub.</span>
        </h2>
        <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11, color: INK3, letterSpacing: 0.4, margin: "0 0 22px", textTransform: "uppercase" as const }}>
          /mike.html + /ltv/index.html · 8 sections · {TOTAL} automations · 18 connections
        </p>

        <div style={{ height: 1, background: RULE, margin: "0 0 22px" }} />

        {/* Two columns */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 28 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3, marginBottom: 12 }}>
              What this is
            </div>
            <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: INK, lineHeight: 1.5, margin: "0 0 12px" }}>
              Mike's first AIOS deployment — a personal operating system for running 4 ventures.
            </p>
            <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: INK2, lineHeight: 1.7, margin: "0 0 10px" }}>
              Mike is the operator of <strong style={{ color: INK }}>Little Tree Ventures</strong> (Little Tree Gas, LT Capital, LT Pay, LT Fuel, Ai Agency, Jayi, and more). This hub wraps an <strong style={{ color: INK }}>AI Operating System</strong> around his daily work so he stops being the bottleneck. Calendar, meetings, task routing, mentor library, and weekly snapshots all flow through one place — Supabase as the database, Claude as the brain, and a Telegram bot called <strong style={{ color: INK }}>CommandOS</strong> that lives in his pocket.
            </p>
            <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: INK2, lineHeight: 1.7, margin: 0 }}>
              Built across two files: <code style={{ background: CHIP, padding: "1px 6px", borderRadius: 4, fontSize: 11 }}>/mike.html</code> (the auth wrapper) and <code style={{ background: CHIP, padding: "1px 6px", borderRadius: 4, fontSize: 11 }}>/ltv/index.html</code> (the inner hub). One identity, one screen, every venture rolling up.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3, marginBottom: 12 }}>
              How the 8 sections fit together
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {SECTIONS_FIT.map(s => (
                <li key={s.title} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ width: 16, height: 1.5, background: INK, marginTop: 9, flexShrink: 0 }} />
                  <span style={{ fontFamily: FONT, fontSize: 12, color: INK2, lineHeight: 1.55 }}>
                    <strong style={{ color: INK, fontWeight: 800 }}>{s.title}</strong> — {s.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Connections bar */}
      <div style={{ background: INK, borderRadius: 16, padding: isMobile ? "14px 16px" : "18px 22px", display: "flex", flexWrap: "wrap" as const, gap: 8, alignItems: "center", marginTop: 14 }}>
        <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)", marginRight: 6 }}>
          Connections · 19
        </span>
        {CONNECTIONS.map(c => (
          <span key={c} style={{
            fontFamily: FONT, fontWeight: 600, fontSize: 10,
            padding: "4px 11px", borderRadius: 99,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.85)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: SEV_LIVE }}/>
            {c}
          </span>
        ))}
      </div>

      {/* 8 sub-blocks */}
      {SUBS.map((s, i) => <SubBlock key={i} s={s} onOpenRow={setOpenId} />)}

      <Modal open={!!openRow} onClose={() => setOpenId(null)}>
        {openRow && <AutoRowModalContent a={openRow} />}
      </Modal>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// BUILD CALENDAR · THE REAL 7-WEEK HISTORY
// ════════════════════════════════════════════════════════════════
type BuildWeek = {
  num: number
  theme: string
  dates: string
  did: React.ReactNode
  trialError?: React.ReactNode[]
  stack: string
}

const BUILD_WEEKS: BuildWeek[] = [
  {
    num: 1, theme: "Research & planning", dates: "late April → May 5",
    did: (
      <>Decided to <strong style={{ color: INK }}>build</strong> an AI Operating System for Mike's portfolio instead of buying off-the-shelf tools. Made the foundational calls: <strong style={{ color: INK }}>Python + FastAPI</strong> for automations, <strong style={{ color: INK }}>self-hosted Supabase</strong> on Andre's own server (not the paid cloud — zero per-operation cost and full control), and <strong style={{ color: INK }}>Telegram</strong> as the primary notification channel, email as backup. Andre and Valera ran a tech Q&amp;A to pressure-test the approach; a GM tech-systems setup session locked it in. The repo was created May 5 — “Initial commit, MJM Dashboard / Little Tree Ventures AI Operating System.”</>
    ),
    stack: "Planning + coaching calls (recorded in Fireflies), Claude for strategy, Git for the first commit.",
  },
  {
    num: 2, theme: "Andre's server + self-hosted Supabase", dates: "early–mid May",
    did: (
      <>Andre stood up the foundation on his Linux server (<strong style={{ color: INK }}>mjmspace.com</strong>): <strong style={{ color: INK }}>Caddy</strong> as the reverse proxy with SSL on every subdomain, <strong style={{ color: INK }}>Docker</strong> running the full Supabase stack, and Postgres exposed for direct reads. Supabase came alive at <strong style={{ color: INK }}>supabase.mjmspace.com</strong> (Studio at studio.mjmspace.com). A coaching call with Teemu on May 11 walked through firewall setup and Supabase prep. Andre shared the full server credential set (the “Server Info” file, dated May 6).</>
    ),
    stack: "Andre's Linux server over SSH/terminal, Docker, Caddy, self-hosted Supabase, Postgres.",
  },
  {
    num: 3, theme: "Little Tree data migration + the hard server corrections", dates: "mid–late May",
    did: (
      <>Migrated roughly <strong style={{ color: INK }}>ten years of Little Tree Gas POS data</strong> from Andre's existing MySQL into Supabase Postgres — schema <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>littletree</code>, 36 tables, ~2.1M transaction headers back to 2017 and 8M+ line items, on a nightly sync.</>
    ),
    trialError: [
      <>The sync crashed on May 2 with <em>“number of parameters must be between 0 and 65535”</em> — Postgres's hard limit on a very wide table. Andre patched it with a batch-size cap, but the cap then made the nightly sync drain only one batch at a time, so <strong style={{ color: INK }}>~80% of line-item rows were being skipped</strong> (lines-per-sale fell to ~1.5 instead of ~7.5). That quietly broke anything computed from line items.</>,
      <>The server got locked behind an <strong style={{ color: INK }}>IP firewall</strong> — the database can't be reached from a laptop or from Claude Code at all (every port times out). Only allowlisted machines connect. This is why real numbers can only be produced by code we deploy, never by querying locally.</>,
      <>Several feeds “froze” around the migration (customer signups, referrals), which we had to design around later.</>,
    ],
    stack: "MySQL, Postgres, Andre's Python migration scripts, nightly cron on the server.",
  },
  {
    num: 4, theme: "Re-engaging & connecting the brain", dates: "June 9 → June 24",
    did: (
      <>A June 9 project-continuation call with Andre re-scoped the work and planned the actual dashboard. A June 24 coaching call with Nik Volynkin connected the <strong style={{ color: INK }}>Supabase MCP to Claude</strong> so Claude Code could see the schema directly. This is the point where the backend foundation was solid enough to start building on top of.</>
    ),
    stack: "Supabase MCP, Claude Code, Fireflies (call capture).",
  },
  {
    num: 5, theme: "The LTV Hub Command Center sprint", dates: "June 25 → July 1",
    did: (
      <>The build exploded here (~44 commits on June 25 alone). We shipped the site on <strong style={{ color: INK }}>Vercel</strong>, auto-deploying from the private GitHub repo, on <strong style={{ color: INK }}>mjmdashboard.org</strong> (Namecheap DNS), behind a single Basic Auth password gate (middleware.js). Built the <strong style={{ color: INK }}>Little Tree Gas CEO Pulse dashboard</strong>: today's sales with deltas and YoY, month-to-date, 14-day trend, hourly curve, busiest days, cashier leaderboard, top customers, cash position, purchasing, loyalty, margin-by-department, supplier spend, a fuel section, inventory, and a self-printing monthly report — all reading through a secure <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>/api</code> proxy so the service key never touches the browser (the DB has aggregates disabled and a 1,000-row cap, so the proxy paginates and aggregates server-side). Stood up the first <strong style={{ color: INK }}>Telegram automations</strong> — team briefs (Monday week-ahead, daily brief, 5 PM recap) plus an inbound task-bot that turns a group message into a dashboard task (parsed by Claude). Scoped everything to Store 1 and fixed “today” to mean the last complete business day.</>
    ),
    trialError: [
      <>The old per-user Supabase email login had auto-paused on the free tier and was throwing <em>“Failed to fetch,”</em> so we retired it for one site password.</>,
      <>The first Telegram briefs ran on GitHub Actions' built-in cron. Google blocked service-account keys at the org level, so the calendar had to read a secret <strong style={{ color: INK }}>iCal link</strong> instead of the Google API.</>,
    ],
    stack: "Claude Code + terminal, Vercel serverless functions (Node + one Python), self-hosted Supabase via the proxy, GitHub + GitHub Actions, Telegram Bot API, Anthropic Claude API (Opus 4.8), Namecheap, and the Claude for Chrome extension for the Vercel/Namecheap setup.",
  },
  {
    num: 6, theme: "Reliability & AI intelligence — the EasyCron switch", dates: "July 2 → July 5",
    did: (
      <>Shipped the <strong style={{ color: INK }}>Leah shift bot</strong> (asks Leah at 4 PM what she worked on, feeds her weekly card) and added Mike as a task-board profile. Andre ran a <strong style={{ color: INK }}>parity audit</strong> confirming MySQL and Supabase matched month-by-month (8.2M rows, zero missing), so we unpinned the dashboard from its April-only fallback and made it fully live and self-maintaining. Built the <strong style={{ color: INK }}>“What Claude Sees Today”</strong> AI intelligence layer (<code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>/api/lt-intel</code>, cached daily): an executive read, signal chips, and the top three highest-leverage moves, generated by Claude from the live numbers. Made Mike's calendar auto-update from the iCal feed, and built the customer-behavior deep dive (the bag-sales decline analysis plus an AI action plan and promo ideas).</>
    ),
    trialError: [
      <><strong style={{ color: INK }}>The big one:</strong> GitHub Actions' cron turned out to be unreliable for timed sends — it dropped the very first scheduled run, and top-of-hour timing drifted. Since these briefs have to land at 8 AM and 5 PM, we switched the scheduler to <strong style={{ color: INK }}>EasyCron</strong> (a paid, DST-safe timer with email-on-failure). EasyCron now fires three jobs at the right local times and calls GitHub to run each workflow. Verified working July 2.</>,
    ],
    stack: "EasyCron, GitHub Actions (now just the executor), Vercel serverless (Node + Python api/calendar.py), self-hosted Supabase (cloud Supabase for the small cache tables), Anthropic Claude API, Telegram Bot API.",
  },
  {
    num: 7, theme: "Mike's AIOS demo · the MJM 360 Command Center", dates: "July 6 → now (July 8)",
    did: (
      <>The two biggest days in the whole project (78 commits July 6, 48 July 7). Built the full <strong style={{ color: INK }}>“Mike's AIOS” demo</strong> — the multi-page experience that pitches the MJM 360 Command Center: One Dashboard, Daily Brief &amp; Meeting Prep, Reports, Categories of Improvement, the Project &amp; Task board, Social Media, “Other Possibilities,” Next Steps, and The Architecture. Added the <strong style={{ color: INK }}>AI-Employee capabilities library</strong> (expanded to the full four-layer roster), the cinematic “The Org, Amplified” walkthrough with the AIOS sentinel finale, clean URLs per section, and a full pass to the collaborative “our/we” voice. This is the demo that stands on everything built in Weeks 1–6.</>
    ),
    stack: "Claude Code + terminal, static HTML/CSS/vanilla JS, Vercel, Git, plus curl/PIL for imagery and headless Chrome for the PDFs.",
  },
]

function BuildCalendar() {
  const isMobile = useIsMobile()
  return (
    <div style={{ ...CARD, padding: isMobile ? "22px 18px" : "32px 36px" }}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
          <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
            The real build calendar
          </span>
        </div>
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 27 : 38, color: INK, letterSpacing: -1.3, lineHeight: 1.05, margin: "0 0 8px" }}>
          LTV Hub <span style={{ color: INK3 }}>→</span> MJM Command Center.
        </h2>
        <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12.5, color: INK2, lineHeight: 1.6, margin: 0, maxWidth: 620 }}>
          Seven weeks, week by week — what we built, what broke, and what we learned. The honest version, trial and error included.
        </p>
      </div>

      <div style={{ height: 1, background: RULE, marginBottom: 4 }} />

      {/* Weeks */}
      <div style={{ display: "flex", flexDirection: "column" as const }}>
        {BUILD_WEEKS.map((w, i) => (
          <div key={w.num} style={{ padding: "22px 0", borderBottom: i < BUILD_WEEKS.length - 1 ? `1px solid ${RULE}` : "none" }}>
            {/* Week header */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10, flexWrap: "wrap" as const }}>
              <span style={{
                fontFamily: FONT, fontSize: 9, fontWeight: 800, letterSpacing: 2,
                padding: "4px 10px", borderRadius: 4,
                background: INK, color: "#fff", textTransform: "uppercase" as const, flexShrink: 0,
              }}>Week {w.num}</span>
              <span style={{ fontFamily: FONT, fontSize: isMobile ? 14 : 16, fontWeight: 800, letterSpacing: -0.3, color: INK, flex: 1, minWidth: 0 }}>
                {w.theme}
              </span>
              <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 400, color: INK3, letterSpacing: 0.3, flexShrink: 0 }}>
                {w.dates}
              </span>
            </div>

            {/* What we did */}
            <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: isMobile ? 12 : 12.5, color: INK2, lineHeight: 1.7, margin: 0 }}>
              {w.did}
            </p>

            {/* Trial & error */}
            {w.trialError && (
              <div style={{ background: "rgba(255,20,147,0.05)", border: "1px solid rgba(255,20,147,0.22)", borderRadius: 10, padding: "12px 14px", marginTop: 14 }}>
                <div style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" as const, color: "#FF1493", marginBottom: 8 }}>
                  Trial &amp; error
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  {w.trialError.map((t, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#FF1493", fontWeight: 900, fontSize: 11, lineHeight: 1.6, flexShrink: 0 }}>•</span>
                      <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: isMobile ? 11 : 11.5, color: INK2, lineHeight: 1.65, margin: 0 }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stack */}
            <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" as const }}>
              <span style={{ fontFamily: FONT, fontSize: 8, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" as const, color: INK3, flexShrink: 0 }}>Stack</span>
              <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 10.5, color: INK3, lineHeight: 1.55 }}>{w.stack}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// QUESTIONS FOR COACH — EMAIL THREAD WITH ANDRE
// ════════════════════════════════════════════════════════════════
type EmailMsg = {
  from: string
  fromShort: "Tiffanie" | "Andre"
  to: string
  date: string
  subject?: string
  body: React.ReactNode
  askCoach?: boolean
  highlight?: string
}

const EMAIL_THREAD: EmailMsg[] = [
  {
    from: "Tiffanie Rothwell <tiffanie@mjmventures.ai>",
    fromShort: "Tiffanie",
    to: "Andre Boudreault, Mike David",
    date: "Tue, May 5 · 2:06 PM",
    subject: "Little Tree Ventures Hub — schema proposal + next steps from today's call",
    body: (
      <>
        <p style={{ margin: "0 0 8px" }}>Hey Andre, first thank you. You stole a day and a half from yourself in the middle of a year-end audit to get the Supabase stack live and I don't take that lightly. Today's call with Valera was a real pivot point — way more clarity, much more honest plan.</p>
        <p style={{ margin: "0 0 8px", fontWeight: 700, color: INK }}>WHAT WE AGREED ON TODAY:</p>
        <p style={{ margin: "0 0 8px" }}>1. Two databases — Littletree MySQL stays read-only, build a 2nd Supabase Postgres ("Little Tree Ventures") for everything outside the transactional layer. 2. Service-by-service schema (don't design upfront). 3. Drop Google SSO from Week 1. 4. No dev/test DB yet. 5. Timeline compressed 5 weeks → 3 weeks per Valera.</p>
        <p style={{ margin: "0 0 8px", fontWeight: 700, color: INK }}>SCHEMA PROPOSAL:</p>
        <p style={{ margin: "0 0 8px" }}>Saved as <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>mikes-world-schema.sql</code> — <a href="https://drive.google.com/file/d/1WpVNLR25b_RApnffXMyvmYB1w7xbW7q4/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ color: "#FF1493", fontWeight: 700, textDecoration: "underline" }}>open in Google Drive</a>. 25 tables in 7 service blocks (foundation, ingestion, workflow, intelligence, cross-venture, mentors/RAG, snapshots). 10 migration blocks M001–M010 to apply in clean steps via Supabase CLI. RLS via <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>has_company_access(company_id)</code> helper. Companies seeded with all 10 entities. pgvector(1536) for mentor PDF search.</p>
        <p style={{ margin: "0 0 0" }}>Asked Andre to review M001 + M002 first — profiles, companies, company_access, auth_audit, activity_log.</p>
      </>
    ),
  },
  {
    from: "andre.guy.b@gmail.com",
    fromShort: "Andre",
    to: "Tiffanie · cc Mike",
    date: "Wed, May 6 · 6:34 AM",
    askCoach: true,
    highlight: "Credentials strategy",
    body: (
      <>
        <p style={{ margin: "0 0 8px" }}><strong style={{ color: INK }}>"This looks good to me."</strong></p>
        <p style={{ margin: "0 0 8px" }}>"We need to nail down database credentials such as User, Password for the application. <strong style={{ color: INK }}>I believe that we should use the same user and password for every database.</strong> In case that we need to have different database setup information, ask Valera what he thinks but it may be interesting to put database info in here:"</p>
        <ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>
          <li>Server</li>
          <li>Database name</li>
          <li>User</li>
          <li>Password</li>
        </ul>
        <p style={{ margin: 0, fontStyle: "italic", color: INK3 }}>(Andre also re-pasted the companies CREATE TABLE + the 10 INSERT rows for the seed.)</p>
      </>
    ),
  },
  {
    from: "andre.guy.b@gmail.com",
    fromShort: "Andre",
    to: "Tiffanie · cc Mike",
    date: "Wed, May 6 · 7:07 AM",
    askCoach: true,
    highlight: "masterdash deployment plan",
    body: (
      <>
        <p style={{ margin: "0 0 8px" }}>"Based on what I know regarding the Supabase server, this is what Claude recommended we do. <strong style={{ color: INK }}>I have changed the 'Mike's World' to 'masterdash'.</strong>"</p>
        <p style={{ margin: "0 0 8px" }}><strong style={{ color: INK }}>The plan:</strong> create the schema + grants, set role search paths so RLS policies can find <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>has_company_access()</code> unqualified, then run the script with a one-line search_path prefix on top so every table lands in <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>masterdash</code> (not <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>public</code>).</p>
        <p style={{ margin: "0 0 6px", fontWeight: 700, color: INK }}>4 steps:</p>
        <ol style={{ margin: "0 0 8px", paddingLeft: 18 }}>
          <li><code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>scp</code> the .sql file to the server.</li>
          <li>Create schema, grants, role search paths (block to paste in SSH as <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>supabase_admin</code>).</li>
          <li>Run the schema script inside <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>masterdash</code> with <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>-v ON_ERROR_STOP=1</code>.</li>
          <li>Sanity check — list tables + companies seed.</li>
        </ol>
        <p style={{ margin: "0 0 8px" }}>"<strong style={{ color: INK }}>Watch-item:</strong> RLS policies call <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>has_company_access(company_id)</code> without a schema prefix. The setup block fixes that by adding <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>masterdash</code> to the authenticated role's search path."</p>
        <p style={{ margin: "0 0 8px" }}>"<strong style={{ color: INK }}>If pgvector complains</strong> (could not open extension control file), it isn't installed in this Supabase image — let me know and we'll either install it or comment out <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>mentor_resources</code> + <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>pdf_chunks</code> for now."</p>
        <p style={{ margin: 0 }}><strong style={{ color: INK }}>Follow-up (not today):</strong> add <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>masterdash</code> to <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>PGRST_DB_SCHEMAS</code> in <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>/opt/supabase/supabase/docker/.env</code> and restart kong + rest containers — to expose <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>masterdash</code> through the REST/GraphQL API.</p>
      </>
    ),
  },
  {
    from: "andre.guy.b@gmail.com",
    fromShort: "Andre",
    to: "Tiffanie · cc Mike",
    date: "Mon, May 11 · 10:37 AM",
    subject: "ITGen firewall",
    askCoach: true,
    highlight: "SSH access via firewall",
    body: (
      <>
        <p style={{ margin: "0 0 8px" }}>"Before using SSH, you need to do the following:"</p>
        <p style={{ margin: "0 0 8px" }}><a href="https://login.itgeneration.ca" target="_blank" rel="noopener noreferrer" style={{ color: "#FF1493", fontWeight: 700, textDecoration: "underline" }}>https://login.itgeneration.ca</a></p>
        <p style={{ margin: "0 0 8px" }}>User: <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>littletree_user</code><br/>Password: <span style={{ fontStyle: "italic", color: INK3 }}>(sent privately — not stored on this page)</span></p>
        <p style={{ margin: 0 }}>"This will get you thru the firewall. If it does not work as you have been blocked once, I will get you IP corrected."</p>
      </>
    ),
  },
]

const COACH_RESOURCES = [
  { title: "Self-host Supabase · Enable MCP", desc: "Reading now — relevant to wiring Claude/Cursor straight into the self-hosted Supabase instance.", url: "https://supabase.com/docs/guides/self-hosting/enable-mcp", tag: "Read now" },
  { title: "Self-host Supabase · Edge Functions", desc: "Next step — running serverless functions inside the self-hosted stack.", url: "https://supabase.com/docs/guides/self-hosting/self-hosted-functions", tag: "Next step" },
]

// Today's live questions for the coach (June 24) — grounded in the
// May 11 coach call + June 9 Andre call. These are the things I still
// need a decision or a walkthrough on this session.
const COACH_QUESTIONS: { q: string; topic: string; detail: React.ReactNode }[] = [
  {
    q: "Self-hosted Supabase + masterdash schema",
    topic: "Data foundation",
    detail: (
      <>
        <p style={{ margin: "0 0 8px" }}>Andre's self-hosted Supabase (Postgres 15, Docker) is live at <code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>supabase.mjmspace.com</code>.</p>
        <ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>
          <li><strong style={{ color: INK }}>masterdash</strong> schema — 25 tables — built and live.</li>
          <li><code style={{ background: CHIP, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>littletree</code> retail data (~789k rows) mirrored in, read-only.</li>
          <li>pgvector installed for mentor-PDF embeddings.</li>
        </ul>
      </>
    ),
  },
  {
    q: "Claude ↔ Supabase MCP connected",
    topic: "AI access",
    detail: (
      <>
        <p style={{ margin: "0 0 8px" }}>The Supabase MCP is enabled through Kong over an SSH tunnel and connected in <strong style={{ color: INK }}>both Claude Code and Claude Desktop</strong>.</p>
        <p style={{ margin: 0 }}>Claude can now query and manage the database directly — the backbone for every automation and the daily intelligence.</p>
      </>
    ),
  },
  {
    q: "Daily AI intelligence — GitHub Action → Claude",
    topic: "Automation",
    detail: (
      <>
        <p style={{ margin: "0 0 8px" }}>A <strong style={{ color: INK }}>GitHub Action</strong> runs every morning (7 AM ET), calls the <strong style={{ color: INK }}>Claude API (Opus 4.8)</strong>, and publishes a structured read to the dashboard:</p>
        <ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>
          <li>An executive summary in plain English</li>
          <li>Four signal chips (e.g. month-to-date, margin, loyalty)</li>
          <li>The top-3 highest-leverage moves that week</li>
        </ul>
        <p style={{ margin: 0 }}><strong style={{ color: INK }}>EasyCron</strong> handles the server-side scheduled jobs.</p>
      </>
    ),
  },
  {
    q: "CEO Command Center — 8 live KPI cards",
    topic: "CEO view",
    detail: (
      <>
        <p style={{ margin: "0 0 8px" }}>Angie's CEO Command Center across all five MJM companies — eight strategic KPI cards (Net Cash, Costs, CFO, Innovation, Marketing, Sales, Raving Fan, Value Chain), Tony Robbins' RPM method.</p>
        <p style={{ margin: 0 }}>Refreshed via <strong style={{ color: INK }}>Supabase Realtime</strong>; each card drills down to its source data. (Phase 2 wires them to live per-company numbers.)</p>
      </>
    ),
  },
  {
    q: "Company dashboards + secure-by-design",
    topic: "Dashboards",
    detail: (
      <>
        <p style={{ margin: "0 0 8px" }}>Per-company dashboards scaffolded under the command center — <strong style={{ color: INK }}>MedBox · Le Roi · KCF · Moccasin Joe · Little Tree</strong> — with a login gate. Little Tree is the deepest (live retail intelligence).</p>
        <p style={{ margin: 0 }}>Security: the browser ships the <strong style={{ color: INK }}>anon key only</strong> with RLS protecting per-company data; the service-role key stays server-side. Firewall + SSH key for admin.</p>
      </>
    ),
  },
]

type PopupContent = { avatar: string; avatarOnPink: boolean; name: string; meta: string; subject?: string; tag?: string; body: React.ReactNode }

function EmailThreadCard() {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState<PopupContent | null>(null)

  return (
    <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
      <div style={{ height: 3, background: "#FF1493", width: "100%" }} />
      <div style={{ padding: isMobile ? "20px 16px 22px" : "28px 32px 30px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 10, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
            <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
              Phase 1 · what we shipped
            </span>
          </div>
          <span style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, background: "#FF1493", color: "#fff", padding: "4px 11px", borderRadius: 99 }}>
            Demoing today
          </span>
        </div>
        <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11, color: INK3, margin: "8px 0 14px", lineHeight: 1.5 }}>
          The foundation that's live and going in front of the MJM Group today. Tap any item for the detail — this is the base Phase 2 builds on.
        </p>

        {/* What shipped in Phase 1 */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {COACH_QUESTIONS.map((item, i) => (
            <button
              key={i}
              onClick={() => setOpen({ avatar: "✓", avatarOnPink: true, name: item.q, meta: `${item.topic} · Phase 1`, subject: item.q, tag: "Shipped", body: item.detail })}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 12px", borderRadius: 10, textAlign: "left" as const, cursor: "pointer",
                background: "rgba(255,20,147,0.05)", border: "1px solid rgba(255,20,147,0.25)",
                fontFamily: FONT,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: "#FF1493", color: "#fff",
                fontFamily: FONT, fontWeight: 900, fontSize: 11,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✓</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 11.5, color: INK, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>{item.q}</div>
                <div style={{ fontWeight: 300, fontSize: 9.5, color: INK3 }}>{item.topic}</div>
              </div>
              <span style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, background: "#FF1493", color: "#fff", padding: "2px 6px", borderRadius: 99, flexShrink: 0 }}>Shipped</span>
              <span style={{ fontSize: 13, color: INK3, flexShrink: 0, fontWeight: 300 }}>›</span>
            </button>
          ))}
        </div>

        {/* Resources from coach */}
        <div style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: INK3, margin: "18px 0 8px" }}>
          Resources to read
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {COACH_RESOURCES.map(r => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 12px", borderRadius: 10, textDecoration: "none",
                background: CHIP, border: `1px solid ${RULE}`, fontFamily: FONT,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: "#3ECF8E", color: "#fff",
                fontFamily: FONT, fontWeight: 900, fontSize: 11,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>S</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 11.5, color: INK, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                <div style={{ fontWeight: 300, fontSize: 9.5, color: INK3 }}>Resource from coach</div>
              </div>
              <span style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, background: r.tag === "Read now" ? INK : "#fff", color: r.tag === "Read now" ? "#fff" : INK3, border: `1px solid ${r.tag === "Read now" ? INK : RULE}`, padding: "2px 6px", borderRadius: 99, flexShrink: 0 }}>{r.tag}</span>
              <span style={{ fontSize: 12, color: INK3, flexShrink: 0, fontWeight: 300 }}>↗</span>
            </a>
          ))}
        </div>

      </div>

      {/* Full-content popup */}
      <Modal open={open !== null} onClose={() => setOpen(null)}>
        {open && (
          <div>
            <div style={{ background: INK, padding: isMobile ? "22px 20px" : "26px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: open.avatarOnPink ? "#FF1493" : "#fff",
                  color: open.avatarOnPink ? "#fff" : INK,
                  fontFamily: FONT, fontWeight: 900, fontSize: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 0.3,
                }}>{open.avatar}</div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13, color: "#fff" }}>{open.name}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{open.meta}</div>
                </div>
              </div>
              {open.subject && (
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.35 }}>{open.subject}</div>
              )}
              {open.tag && (
                <span style={{ display: "inline-block", marginTop: 8, fontFamily: FONT, fontSize: 8.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, background: open.tag === "Resolved" ? "rgba(255,255,255,0.15)" : "#FF1493", color: "#fff", padding: "3px 9px", borderRadius: 99 }}>{open.tag}</span>
              )}
            </div>
            <div style={{ padding: isMobile ? "20px 20px 26px" : "26px 32px 32px", fontFamily: FONT, fontWeight: 400, fontSize: isMobile ? 12 : 13, color: INK2, lineHeight: 1.7 }}>
              {open.body}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// NEXT STEP · CONNECT SUPABASE (30-MIN COACH RUNBOOK)
// ════════════════════════════════════════════════════════════════
const RUNBOOK_STEPS: { title: string; detail: React.ReactNode; status: "done" | "now" | "next" }[] = [
  { status: "done", title: "Demo Prep",                 detail: <>Deck, data, and dry run pulled together for the MJM Group.</> },
  { status: "now",  title: "Demo Day",                  detail: <>Today — walking the MJM Group through the MJM 360 Command Center.</> },
  { status: "next", title: "Needs Analysis Prep",       detail: <>Prep the discovery questions for each company and role.</> },
  { status: "next", title: "Needs Analysis Received",   detail: <>Requirements back from the team, captured and organized.</> },
  { status: "next", title: "Plan Proposal",             detail: <>Scope, phases, timeline, and cost written up.</> },
  { status: "next", title: "Proposal Day",              detail: <>Present the plan to MJM for the go-ahead.</> },
  { status: "next", title: "Phase 1 execution build",   detail: <>First build sprint of the approved scope.</> },
  { status: "next", title: "Phase 1 Approval & testing", detail: <>Sign-off + QA before moving on.</> },
  { status: "next", title: "Phase 2 execution build",   detail: <>Second build sprint.</> },
  { status: "next", title: "Phase 2 Approval & testing", detail: <>Sign-off + QA.</> },
  { status: "next", title: "Phase 3 AIOS",              detail: <>Full AIOS rollout across the portfolio.</> },
  { status: "next", title: "Phase 4 Training",          detail: <>Team onboarding and enablement.</> },
  { status: "next", title: "Phase 5 Evolve and Improve", detail: <>Ongoing iteration and optimization.</> },
]

function CoachRunbookCard() {
  const isMobile = useIsMobile()
  return (
    <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
      <div style={{ height: 3, background: "#FF1493", width: "100%" }} />
      <div style={{ padding: isMobile ? "20px 16px 22px" : "28px 32px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
            <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
              Phase 2 roadmap · MJM Command Center
            </span>
          </div>
          <span style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, background: "#FF1493", color: "#fff", padding: "4px 11px", borderRadius: 99 }}>
            Demo day
          </span>
        </div>
        <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: INK2, margin: "8px 0 18px", lineHeight: 1.6 }}>
          The full sequence for the MJM Command Center engagement — from today's demo through needs analysis, proposal, the phased build, and into training and ongoing improvement. Would love your coaching on how we sequence it.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gridTemplateRows: isMobile ? undefined : "repeat(7, auto)", gridAutoFlow: isMobile ? "row" : "column", gap: 10, alignItems: "start" }}>
          {RUNBOOK_STEPS.map((s, i) => {
            const done = s.status === "done"
            const now  = s.status === "now"
            return (
            <div key={i} style={{
              display: "flex", gap: 14, padding: "14px 16px", borderRadius: 12,
              background: now ? "rgba(255,20,147,0.05)" : CHIP,
              border: `1px solid ${now ? "rgba(255,20,147,0.25)" : RULE}`,
              opacity: done ? 0.8 : 1,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: done ? INK : now ? "#FF1493" : "#fff",
                border: now || done ? "none" : `1.5px solid ${RULE}`,
                color: done || now ? "#fff" : INK3,
                fontFamily: FONT, fontWeight: 800, fontSize: 12,
                display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
              }}>{done ? "✓" : i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: INK, lineHeight: 1.35 }}>{s.title}</span>
                  <span style={{
                    fontFamily: FONT, fontSize: 7.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const,
                    padding: "2px 6px", borderRadius: 99,
                    background: done ? "#fff" : now ? "#FF1493" : "#fff",
                    color: done ? INK3 : now ? "#fff" : INK3,
                    border: `1px solid ${now ? "#FF1493" : RULE}`,
                  }}>{done ? "Done" : now ? "Now" : "Next"}</span>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: isMobile ? 11.5 : 12, color: INK2, lineHeight: 1.65 }}>{s.detail}</div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// RECORDINGS + EMAIL THREADS (bottom of page)
// Hidden from the site (set to true to show again). Data kept below.
// ════════════════════════════════════════════════════════════════
const SHOW_RECORDINGS = false
const RECORDINGS: { title: string; sub: string; date: string; url?: string; pdf?: string }[] = [
  {
    title: "Tiffanie + Coach (Nik Volynkin) — Connect Supabase MCP",
    sub:   "Coach session · wiring the CLI + Supabase MCP",
    date:  "Jun 24, 2026",
    url:   "https://app.fireflies.ai/view/Tiffanie-Rothwell-and-Nik-Volynkin::01KVBA1XY7M109JCMYZJAYBQ3S",
    pdf:   "fireflies-nik-volynkin.pdf",
  },
  {
    title: "Andre + Tiffanie — Project Continuation",
    sub:   "Firewall open · connect Supabase · next steps",
    date:  "Jun 9, 2026",
    url:   "https://app.fireflies.ai/view/Andre-Tiffanie-Project-Continuation::01KTKT6G7AF12R9FSCBMFCV71T",
    pdf:   "fireflies-andre-tiffanie-jun9.pdf",
  },
  {
    title: "Tiffanie + Coach (Teemu) — Firewall + Supabase prep",
    sub:   "Diagnosed firewall block · CLI + MCP plan",
    date:  "May 11, 2026",
    pdf:   "fireflies-coach-teemu-may11.pdf",
  },
  {
    title: "GM · Tech Systems set-up",
    sub:   "Andre + Valera + Mike + Tiffanie",
    date:  "May 5, 2026",
  },
  {
    title: "Andre + Valera — Tech Q&A",
    sub:   "Systems & tech stack discussion",
    date:  "Apr 2026",
  },
]

function RecordingsThreadsCard() {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState<PopupContent | null>(null)

  return (
    <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px" }}>
      <SectionLabel label="Recordings & email threads" />

      {/* Fireflies recordings */}
      <div style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: INK3, margin: "4px 0 10px" }}>
        Fireflies meeting recordings
      </div>
      {RECORDINGS.map(({ title, sub, date, url, pdf }) => (
        <div key={title} style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "13px 14px", borderRadius: 12,
          background: CHIP, border: `1px solid ${RULE}`, marginBottom: 10,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "#fff", border: `1px solid ${RULE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔥</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 12, color: INK, marginBottom: 2, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
            <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 10, color: INK3 }}>{sub}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
            <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: INK3 }}>{date}</span>
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 8, letterSpacing: 0.5, textTransform: "uppercase" as const, color: "#FF1493", textDecoration: "none" }}>Watch ▸</a>
            )}
            {pdf && (
              <a href={`${import.meta.env.BASE_URL}${pdf}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 8, letterSpacing: 0.5, textTransform: "uppercase" as const, color: INK2, textDecoration: "underline", textUnderlineOffset: 2 }}>Transcript PDF</a>
            )}
          </div>
        </div>
      ))}

      {/* Email threads with Andre */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
        <span style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: INK3 }}>
          Email threads with Andre (resolved)
        </span>
        <a href={`${import.meta.env.BASE_URL}email-thread-andre.pdf`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const, color: INK2, textDecoration: "underline", textUnderlineOffset: 2 }}>Full PDF ↗</a>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
        {EMAIL_THREAD.map((m, i) => {
          const isAndre = m.fromShort === "Andre"
          return (
            <button
              key={i}
              onClick={() => setOpen({ avatar: isAndre ? "AB" : "TR", avatarOnPink: !isAndre, name: isAndre ? "André Boudreault" : "Tiffanie Rothwell", meta: `→ ${m.to} · ${m.date}`, subject: m.subject || m.highlight, tag: "Resolved", body: m.body })}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 12px", borderRadius: 10, textAlign: "left" as const, cursor: "pointer",
                background: CHIP, border: `1px solid ${RULE}`, fontFamily: FONT, opacity: 0.9,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: isAndre ? INK : "#FF1493", color: "#fff",
                fontFamily: FONT, fontWeight: 900, fontSize: 8,
                display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 0.3,
              }}>{isAndre ? "AB" : "TR"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 11.5, color: INK, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {m.highlight || m.subject || (isAndre ? "André Boudreault" : "Tiffanie Rothwell")}
                </div>
                <div style={{ fontWeight: 300, fontSize: 9.5, color: INK3 }}>
                  {isAndre ? "André" : "Tiffanie"} · {m.date}
                </div>
              </div>
              <span style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, background: "#fff", color: INK3, border: `1px solid ${RULE}`, padding: "2px 6px", borderRadius: 99, flexShrink: 0 }}>Resolved</span>
              <span style={{ fontSize: 13, color: INK3, flexShrink: 0, fontWeight: 300 }}>›</span>
            </button>
          )
        })}
      </div>

      <Modal open={open !== null} onClose={() => setOpen(null)}>
        {open && (
          <div>
            <div style={{ background: INK, padding: isMobile ? "22px 20px" : "26px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: open.avatarOnPink ? "#FF1493" : "#fff",
                  color: open.avatarOnPink ? "#fff" : INK,
                  fontFamily: FONT, fontWeight: 900, fontSize: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 0.3,
                }}>{open.avatar}</div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13, color: "#fff" }}>{open.name}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{open.meta}</div>
                </div>
              </div>
              {open.subject && (
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.35 }}>{open.subject}</div>
              )}
              {open.tag && (
                <span style={{ display: "inline-block", marginTop: 8, fontFamily: FONT, fontSize: 8.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, background: "rgba(255,255,255,0.15)", color: "#fff", padding: "3px 9px", borderRadius: 99 }}>{open.tag}</span>
              )}
            </div>
            <div style={{ padding: isMobile ? "20px 20px 26px" : "26px 32px 32px", fontFamily: FONT, fontWeight: 400, fontSize: isMobile ? 12 : 13, color: INK2, lineHeight: 1.7 }}>
              {open.body}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// TASK BOT · TELEGRAM TASK-MANAGEMENT WORKFLOW
// ════════════════════════════════════════════════════════════════
const TASKBOT_STAGES: { n: number; sys: string; title: string; body: string }[] = [
  { n: 1, sys: "Telegram",   title: "Capture",         body: "Someone posts in the team group starting with a trigger phrase, e.g. “New task for Leah, due Friday: send the LTC PR invoices.” Only messages that start with ‘new task’, ‘add task’, ‘task for’, or ‘/task’ wake the bot; normal chatter is left alone." },
  { n: 2, sys: "Claude",     title: "Parse it",        body: "Claude (Opus 4.8) reads the message and pulls out three things: who it’s for, what to do, and the due date. Date phrases like ‘Friday’ or ‘end of month’ resolve to a real date." },
  { n: 3, sys: "Supabase",   title: "Match the person", body: "The first name is matched to a teammate in the profiles table: exact first name, then a partial match, then email." },
  { n: 4, sys: "Supabase",   title: "Create the task", body: "A row lands in the tasks table with the title, assignee, due date, who sent it, source ‘team_board’, and status ‘open’." },
  { n: 5, sys: "Telegram",   title: "Confirm",         body: "The bot replies in the thread: “✅ Task Added”. If it can’t tell who or what, it asks a quick follow-up instead of guessing." },
  { n: 6, sys: "Dashboards", title: "Surface it",      body: "The task shows on the task board and in the next morning brief. Mark it done on the board and it clears from both." },
]

function TaskBotSection() {
  const isMobile = useIsMobile()
  return (
    <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
      <div style={{ height: 4, background: INK, width: "100%" }} />
      <div style={{ padding: isMobile ? "22px 18px 24px" : "34px 40px 38px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
          <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
            Task Bot · CommandOS on Telegram
          </span>
        </div>
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 30 : 44, color: INK, letterSpacing: -1.6, lineHeight: 1.02, margin: "0 0 10px" }}>
          Say it once. <span style={{ color: INK3 }}>It gets done.</span>
        </h2>
        <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: isMobile ? 12.5 : 13.5, color: INK2, lineHeight: 1.7, margin: 0, maxWidth: 640 }}>
          Task capture runs through a CommandOS bot in the same team Telegram group as the morning brief (its own bot, same group). A quick text becomes an assigned, due-dated task on the board and in the next brief, without anyone opening a project tool.
        </p>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : 32, marginTop: 24, alignItems: "flex-start" }}>
          {/* Workflow flow */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 0, width: "100%" }}>
            {TASKBOT_STAGES.map((s, i) => (
              <div key={s.n} style={{ display: "flex", gap: 14, position: "relative" as const }}>
                {/* Rail + node */}
                <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: INK, color: "#fff",
                    fontFamily: FONT, fontWeight: 800, fontSize: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{s.n}</div>
                  {i < TASKBOT_STAGES.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 22, background: RULE }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, paddingBottom: i < TASKBOT_STAGES.length - 1 ? 16 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const, marginBottom: 3 }}>
                    <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13.5, color: INK, letterSpacing: -0.2 }}>{s.title}</span>
                    <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 8, letterSpacing: 1, textTransform: "uppercase" as const, background: CHIP, color: INK2, border: `1px solid ${RULE}`, padding: "2px 7px", borderRadius: 99 }}>{s.sys}</span>
                  </div>
                  <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11.5, color: INK2, lineHeight: 1.6, margin: 0 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Telegram mockup */}
          <div style={{
            width: isMobile ? "100%" : 300, flexShrink: 0,
            background: INK, borderRadius: 20, padding: isMobile ? "18px 16px 20px" : "22px 20px 24px",
            display: "flex", flexDirection: "column" as const,
          }}>
            {/* Bot header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#FF1493", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>OS</div>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13, color: "#fff" }}>CommandOS</div>
                <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 9.5, color: "rgba(255,255,255,0.45)" }}>online · task routing</div>
              </div>
            </div>

            {/* Chat */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, paddingTop: 14 }}>
              {/* inbound */}
              <div style={{ alignSelf: "flex-end", maxWidth: "88%", background: "#FF1493", color: "#fff", borderRadius: "12px 12px 3px 12px", padding: "8px 11px" }}>
                <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 11.5, lineHeight: 1.45 }}>New task for Leah, due Friday: send the LTC PR invoices.</div>
              </div>
              {/* outbound */}
              <div style={{ alignSelf: "flex-start", maxWidth: "92%", background: "rgba(255,255,255,0.07)", color: "#fff", borderRadius: "12px 12px 12px 3px", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11.5, marginBottom: 5 }}>✅ Task Added</div>
                <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 10.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
                  <strong style={{ color: "#fff" }}>Leah</strong> · Send the LTC PR invoices<br/>
                  due Fri · on the board + in tomorrow’s brief
                </div>
              </div>
              {/* inbound 2 */}
              <div style={{ alignSelf: "flex-end", maxWidth: "88%", background: "#FF1493", color: "#fff", borderRadius: "12px 12px 3px 12px", padding: "8px 11px", marginTop: 4 }}>
                <div style={{ fontFamily: FONT, fontWeight: 400, fontSize: 11.5, lineHeight: 1.45 }}>Task for Andre: finish the MedBox API integration by end of month</div>
              </div>
              {/* outbound 2 */}
              <div style={{ alignSelf: "flex-start", maxWidth: "92%", background: "rgba(255,255,255,0.07)", color: "#fff", borderRadius: "12px 12px 12px 3px", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11.5, marginBottom: 4 }}>✅ Task Added</div>
                <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 10.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
                  <strong style={{ color: "#fff" }}>Andre</strong> · Finish the MedBox API integration<br/>
                  due Jul 31 · on the board + in tomorrow’s brief
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)", fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>
              Text in the team group · parsed by Claude · assigned + due-dated · tracked on the board
            </div>
          </div>
        </div>

        {/* Data trail */}
        <div style={{ marginTop: 22, paddingTop: 16, borderTop: `1px solid ${RULE}`, display: "flex", flexWrap: "wrap" as const, gap: 8, alignItems: "center" }}>
          <span style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: INK3, marginRight: 4 }}>Tables it touches</span>
          {["profiles", "tasks"].map(t => (
            <span key={t} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 10, background: CHIP, color: INK2, border: `1px solid ${RULE}`, padding: "3px 9px", borderRadius: 6 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// COACHING SESSIONS CALENDAR
// ════════════════════════════════════════════════════════════════
type Coach = "Valera Tumash" | "Teemu Lahdenpera" | "Nik Volynkin" | "Gareth Davies" | "James Latos"
const COACH_COLOR: Record<Coach, string> = {
  "Valera Tumash":    "#111111",
  "Teemu Lahdenpera": "#FF1493",
  "Nik Volynkin":     "#2563EB",
  "Gareth Davies":    "#059669",
  "James Latos":      "#D97706",
}
type CoachSession = { date: string; coach: Coach; time: string }
const COACHING_SESSIONS: CoachSession[] = [
  { date: "2026-04-07", coach: "Valera Tumash", time: "7:30 AM" },
  { date: "2026-04-09", coach: "Valera Tumash", time: "7:00 AM" },
  { date: "2026-04-14", coach: "Valera Tumash", time: "8:00 AM" },
  { date: "2026-04-15", coach: "Valera Tumash", time: "8:15 AM" },
  { date: "2026-04-16", coach: "Valera Tumash", time: "8:30 AM" },
  { date: "2026-04-20", coach: "Valera Tumash", time: "9:00 AM" },
  { date: "2026-04-23", coach: "Valera Tumash", time: "9:00 AM" },
  { date: "2026-04-27", coach: "Valera Tumash", time: "9:45 AM" },
  { date: "2026-05-05", coach: "Valera Tumash", time: "10:00 AM" },
  { date: "2026-05-06", coach: "Nik Volynkin",  time: "9:15 AM" },
  { date: "2026-05-08", coach: "Teemu Lahdenpera", time: "9:15 AM" },
  { date: "2026-05-11", coach: "Teemu Lahdenpera", time: "10:00 AM" },
  { date: "2026-05-13", coach: "Teemu Lahdenpera", time: "11:30 AM" },
  { date: "2026-05-14", coach: "Teemu Lahdenpera", time: "8:00 AM" },
  { date: "2026-06-16", coach: "Gareth Davies", time: "3:30 PM" },
  { date: "2026-06-24", coach: "Nik Volynkin",  time: "9:15 AM" },
  { date: "2026-06-30", coach: "Teemu Lahdenpera", time: "11:00 AM" },
  { date: "2026-07-08", coach: "James Latos",   time: "9:00 AM" },
  { date: "2026-07-13", coach: "Teemu Lahdenpera", time: "9:00 AM" },
]
const COACHING_MONTHS = [
  { name: "April 2026", y: 2026, m: 3 },
  { name: "May 2026",   y: 2026, m: 4 },
  { name: "June 2026",  y: 2026, m: 5 },
  { name: "July 2026",  y: 2026, m: 6 },
]

function CoachingCalendar() {
  const isMobile = useIsMobile()
  const [hover, setHover] = useState<string | null>(null)
  const byDate: Record<string, CoachSession> = {}
  COACHING_SESSIONS.forEach(s => { byDate[s.date] = s })

  const coaches = Object.keys(COACH_COLOR) as Coach[]
  const counts = coaches.map(c => ({ coach: c, n: COACHING_SESSIONS.filter(s => s.coach === c).length }))
  const total = COACHING_SESSIONS.length
  const WD = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div style={{ ...CARD, padding: isMobile ? "22px 18px" : "32px 36px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap" as const, gap: 12, marginBottom: 6 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
            <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
              Coaching sessions
            </span>
          </div>
          <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 28 : 38, color: INK, letterSpacing: -1.3, lineHeight: 1.05, margin: 0 }}>
            {total} coaching sessions.
          </h2>
        </div>
      </div>

      {/* Legend + counts */}
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, margin: "16px 0 22px" }}>
        {counts.map(({ coach, n }) => (
          <span key={coach} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontFamily: FONT, fontWeight: 600, fontSize: 10.5, color: INK2,
            background: CHIP, border: `1px solid ${RULE}`, padding: "5px 11px", borderRadius: 99,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COACH_COLOR[coach], flexShrink: 0 }} />
            {coach} <span style={{ fontWeight: 800, color: INK }}>· {n}</span>
          </span>
        ))}
      </div>

      {/* Month grids */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 14 : 18 }}>
        {COACHING_MONTHS.map(mo => {
          const first = new Date(mo.y, mo.m, 1).getDay()
          const days = new Date(mo.y, mo.m + 1, 0).getDate()
          const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
          return (
            <div key={mo.name}>
              <div style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" as const, color: INK3, marginBottom: 8 }}>
                {mo.name}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 3 }}>
                {WD.map((d, i) => (
                  <div key={i} style={{ textAlign: "center" as const, fontFamily: FONT, fontWeight: 700, fontSize: 6.5, color: INK3 }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, position: "relative" as const }}>
                {cells.map((day, i) => {
                  if (!day) return <div key={`e${i}`} style={{ aspectRatio: "1" }} />
                  const key = `${mo.y}-${String(mo.m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  const s = byDate[key]
                  return (
                    <div
                      key={key}
                      onMouseEnter={() => s && setHover(key)}
                      onMouseLeave={() => setHover(null)}
                      style={{
                        aspectRatio: "1", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative" as const,
                        background: s ? COACH_COLOR[s.coach] : "transparent",
                        border: s ? "none" : `1px solid ${RULE}`,
                        cursor: s ? "pointer" : "default",
                      }}
                    >
                      <span style={{ fontFamily: FONT, fontWeight: s ? 800 : 300, fontSize: 8.5, color: s ? "#fff" : INK3, userSelect: "none" as const, lineHeight: 1 }}>{day}</span>
                      {s && !isMobile && hover === key && (
                        <div style={{
                          position: "absolute" as const, bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                          background: INK, borderRadius: 8, padding: "7px 10px", whiteSpace: "nowrap" as const,
                          zIndex: 20, boxShadow: "0 8px 22px rgba(0,0,0,0.25)", pointerEvents: "none" as const,
                        }}>
                          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 10, color: "#fff" }}>{s.coach}</div>
                          <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 8.5, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{mo.name.split(" ")[0]} {day} · {s.time}</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// APP
// (Site access is enforced server-side: Vercel Edge middleware.js does
//  HTTP Basic Auth before any file is served — same as mjmdashboard.org.)
// ════════════════════════════════════════════════════════════════
export default function App() {
  const isMobile = useIsMobile()
  return (
    <div style={{ minHeight: "100vh", background: "#F2F2F2", padding: isMobile ? "20px 16px 60px" : "40px 28px 80px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 14 }}>


        {/* ════════════════════════════════════════ HERO ════════════════════════════════════════ */}
        <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
          <div style={{ height: 4, background: INK, width: "100%" }} />
          <div style={{ padding: isMobile ? "22px 20px 24px" : "36px 40px 40px", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "stretch", gap: isMobile ? 20 : 32 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: isMobile ? "flex-start" : "space-between", gap: isMobile ? 20 : 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const }}>
                <span style={{
                  fontFamily: FONT, fontSize: 9, fontWeight: 800,
                  letterSpacing: 1.5, textTransform: "uppercase" as const,
                  padding: "5px 14px", borderRadius: 99, background: INK,
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}>
                  <span style={{ color: "#FF1493", fontWeight: 900, fontSize: 11 }}>///</span>
                  <span style={{ color: "#fff" }}>Accelerator</span>
                </span>
                {[new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), "Phase 1 · Demo Day"].map(b => (
                  <span key={b} style={{
                    fontFamily: FONT, fontSize: 9, fontWeight: 600,
                    letterSpacing: 0.5, textTransform: "uppercase" as const,
                    padding: "4px 12px", borderRadius: 99, background: CHIP, color: INK2,
                  }}>{b}</span>
                ))}
              </div>

              <div>
                <p style={{
                  fontFamily: FONT, fontWeight: 200, fontSize: 12,
                  color: INK3, letterSpacing: 2.5, textTransform: "uppercase" as const,
                  margin: "0 0 10px",
                }}>MJM Ventures · AI Operating System</p>
                <h1 style={{
                  fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 44 : 68,
                  color: INK, letterSpacing: isMobile ? -1.5 : -3, lineHeight: 0.92, margin: 0,
                }}>Hi AAA Coach</h1>
                <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: isMobile ? 13 : 15, color: INK2, lineHeight: 1.5, margin: "12px 0 0", maxWidth: 520 }}>
                  Phase 1 of the <strong style={{ color: INK }}>MJM 360 Command Center</strong> is wrapping up — today's the demo to the MJM Group. Here's where the build stands and what I'd love your read on next.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
                <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" as const, color: INK3 }}>Project</span>
                <a href="https://mjmdashboard.org/login.html" target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: INK, letterSpacing: -0.3, textDecoration: "underline", textDecorationColor: "#FF1493", textUnderlineOffset: 3 }}>
                  MJM 360 Command Center · mjmdashboard.org
                </a>
              </div>
            </div>

            <div style={{
              width: isMobile ? "100%" : 240, flexShrink: isMobile ? undefined : 0,
              background: INK, borderRadius: 16,
              padding: "24px 24px 24px",
              display: "flex", flexDirection: "column" as const,
            }}>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 4 }}>Current</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: -0.5, lineHeight: 1.1 }}>Demo Day · MJM Group</div>
                <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · Phase 1 wrap-up</div>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "20px 0" }} />

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" as const }}>Phases</span>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 9, color: "rgba(255,255,255,0.6)" }}>Phase 2 · active</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" as const }}>
                  <div style={{ height: "100%", width: "45%", background: "#fff", borderRadius: 99 }} />
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 5, letterSpacing: 0.3 }}>Phase 1 done ✓ · Phase 2 demo today</div>
              </div>

              <div style={{ flex: 1 }} />
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />

              <div>
                <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 6 }}>Up next</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: "#fff", lineHeight: 1.4 }}>
                  Build the MJM Command Center — role snapshots + KPI cards
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ════════════════════════════════════════ TIMELINE ════════════════════════════════════════ */}
        <ProgressTimeline />


        {/* ════════════════════════════════════════ PROJECT BRIEF + QUESTIONS FOR COACH ════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 14, alignItems: "stretch" }}>
          <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px", flex: 1 }}>
            <SectionLabel label="Project in one sentence" />
            <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 13, color: INK2, lineHeight: 1.8, margin: 0 }}>
              The <strong style={{ color: INK }}>MJM 360 Command Center</strong> is an AI Operating System across all five MJM companies (MedBox · Le Roi · KCF · Moccasin Joe · Little Tree) — a CEO command center with live KPI cards, per-company dashboards, and daily AI intelligence so Mike and the team stop being the bottleneck. Built on Andre's self-hosted Supabase, Python + FastAPI, and Claude as the brain, with a Telegram bot called CommandOS.
              <span style={{ fontWeight: 700, color: INK }}> Live at mjmdashboard.org.</span>
            </p>
          </div>
          <div style={{ flex: 1.3, display: "flex", flexDirection: "column" as const }}>
            <EmailThreadCard />
          </div>
        </div>


        {/* ════════════════════════════════════════ NEXT STEP · CONNECT SUPABASE ════════════════════════════════════════ */}
        <CoachRunbookCard />


        {/* ════════════════════════════════════════ THE STACK ════════════════════════════════════════ */}
        <StackSection />


        {/* ════════════════════════════════════════ TASK BOT WORKFLOW ════════════════════════════════════════ */}
        <TaskBotSection />


        {/* DEEP DIVE — removed per request */}


        {/* ════════════════════════════════════════ BUILD CALENDAR ════════════════════════════════════════ */}
        <BuildCalendar />


        {/* ════════════════════════════════════════ FOCUS + PEOPLE ════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>

          {/* This week's focus */}
          <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: isMobile ? "18px 16px 16px" : "28px 28px 22px", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 5, height: 5, borderRadius: 1, background: INK }} />
                <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
                  This week's focus
                </span>
              </div>
              <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: INK, lineHeight: 1.4, letterSpacing: -0.4, margin: "0 0 12px" }}>
                Phase 1 is wrapping up — today I'm demoing the MJM 360 Command Center to the MJM Group.
              </h2>
              <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11.5, color: INK3, lineHeight: 1.7, margin: "0 0 16px" }}>
                The foundation is live: self-hosted Supabase (<code style={{ background: CHIP, padding: "1px 4px", borderRadius: 3, fontSize: 10.5 }}>supabase.mjmspace.com</code>), the <code style={{ background: CHIP, padding: "1px 4px", borderRadius: 3, fontSize: 10.5 }}>masterdash</code> schema, the Claude ↔ Supabase MCP, a daily GitHub Action that generates AI intelligence with Claude, and the CEO Command Center with live KPI cards. After the demo I want your read on the Phase 2 plan — the full MJM Ventures 360 Command Center across all five companies.
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                {["Phase 1 shipped ✓", "Demo day", "CEO Command Center", "Phase 2 next"].map(tag => (
                  <span key={tag} style={{
                    fontFamily: FONT, fontWeight: 500, fontSize: 9.5,
                    color: INK2, background: CHIP,
                    border: `1px solid ${RULE}`,
                    padding: "3px 10px", borderRadius: 99,
                  }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ background: INK, padding: isMobile ? "16px 16px 18px" : "20px 28px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 5, height: 5, borderRadius: 1, background: "rgba(255,255,255,0.25)" }} />
                <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)" }}>
                  Also needed
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {[
                  "Phase 2 scope: build out all five company dashboards (MedBox · Le Roi · KCF · Moccasin Joe · Little Tree) under the CEO Command Center — want your read on sequencing.",
                  "Wire the 8 KPI cards to live data via Supabase Realtime instead of the current seed values, per company.",
                  "Authentication next: Supabase Auth (email/password) + roles + RLS per company, replacing the localStorage gate.",
                  "Keep the daily AI-intelligence loop healthy (GitHub Action + Claude) and extend it beyond Little Tree to the other companies.",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 10, color: "rgba(255,255,255,0.2)", flexShrink: 0, lineHeight: 1.6, letterSpacing: 0.5 }}>0{i + 1}</span>
                    <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>{t}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 0.5 }}>For AAA Coach · Phase 1 wrap-up · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* People */}
          <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px" }}>
            <SectionLabel label="People" />
            <Row label="Tiffanie"     value="Project owner / PM — 4 hrs/day, drives schema with Claude, builds the app and dashboards." />
            <Row label="Mike D."      value="Operator of Little Tree Ventures — end user / decision maker. POC user for the AIOS." />
            <Row label="Andre B."     value="IT lead, 25+ yrs. Owns Andre's server, Supabase install, transactional pipeline, DB user/role mgmt." />
            <Row label="Valera"       value="Technical coach — schema, dev cycle, migrations, sanity checks. Limited availability." />
            <Row label="Nick Voikin"  value="Backup coach in rotation when Valera's calendar is full." />
            <Row label="Timo"         value="Backup coach in rotation. Format: blockers list + progress since last session." />
            <Row label="Leah"         value="Mike's delegation recipient — Friday digest of her week routes back to Mike." />
          </div>
        </div>


        {/* ════════════════════════════════════════ AGREED ARCHITECTURE ════════════════════════════════════════ */}
        <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px" }}>
          <SectionLabel label="Agreed architecture" />
          <Row label="Server"        value="Andre's self-hosted server · Caddy + SSL · 5 subdomains live"   pill={<Pill label="Live"       kind="solid"   />} />
          <Row label="Automations"   value="Python + FastAPI · /opt/automations · Cron + Webhook services" pill={<Pill label="Live"       kind="solid"   />} />
          <Row label="Database"      value="Supabase self-hosted · Postgres 15 · 13 containers · Studio"   pill={<Pill label="Live"       kind="solid"   />} />
          <Row label="Littletree DB" value="Read-only · mirrored into Postgres (littletree schema) · ~789k rows" pill={<Pill label="Live"       kind="solid"   />} />
          <Row label="Firewall"      value="ITGen login · IP allow-list · per-IP, per-day (login each move)" pill={<Pill label="Open"       kind="solid"   />} />
          <Row label="Schema"        value="masterdash · 25 tables · built & live in Postgres"              pill={<Pill label="Live"       kind="solid"   />} />
          <Row label="masterdash DB" value="2nd Supabase DB (was 'Mike's World') · 25 tables · seed data, automations next" pill={<Pill label="Building"   kind="outline" />} />
          <Row label="pgvector"      value="Installed & ready · mentor PDF embeddings (Andre's watch-item cleared)" pill={<Pill label="Live"       kind="solid"   />} />
          <Row label="Supabase MCP"  value="Connected · Claude Code + Desktop · Kong /mcp over SSH tunnel"   pill={<Pill label="Connected"  kind="solid"   />} />
          <Row label="Next.js app"   value="Converting this mockup → production Next.js app"                pill={<Pill label="Now"        kind="outline" />} />
          <Row label="Auth"          value="Supabase Auth · email/password · manual roles · RLS per company" pill={<Pill label="Building"   kind="outline" />} />
          <Row label="Storage"       value="Supabase Storage · PDFs · MP3 voice memos · pgvector embeddings" pill={<Pill label="Building"   kind="outline" />} />
          <Row label="Bot"           value="Telegram · CommandOS · slash commands /idea /win /skill /prep"   pill={<Pill label="Later"      kind="outline" />} />
          <Row label="Build approach" value="Modular 'chocolate-bar' — data-gather → synopsis → Deeper Dive, one topic at a time" pill={<Pill label="Agreed"  kind="solid"   />} />
          <Row label="Migrations"    value="Local Git branch · Supabase CLI · push from dev → live"          pill={<Pill label="Standard"   kind="muted"   />} />
          <Row label="Backups"       value="Daily DB + server backups via data center"                       pill={<Pill label="Confirmed"  kind="solid"   />} />
          <Row label="Google SSO"    value="Dropped — paid feature on cloud, not in self-hosted package"     pill={<Pill label="Ruled out"  kind="muted"   />} />
          <Row label="No-code tools" value="No n8n · No Make.com required · all Python + Claude"             pill={<Pill label="Out"        kind="muted"   />} />

          <div style={{ background: CHIP, borderRadius: 12, padding: "14px 16px", marginTop: 16 }}>
            <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: INK3, lineHeight: 1.7, margin: 0 }}>
              <span style={{ fontWeight: 700, color: INK }}>Andre's rule — </span>
              Self-hosted, not cloud. Data sovereignty over convenience. One service wired before the next begins. (Cloud sandbox is just a faster place to learn the flow — production stays on Andre's box.)
            </p>
          </div>
        </div>


        {/* ════════════════════════════════════════ RECORDINGS + EMAIL THREADS ════════════════════════════════════════ */}
        {/* Hidden from the site for now — data + component kept below. Flip to true to show again. */}
        {SHOW_RECORDINGS && <RecordingsThreadsCard />}


        {/* ════════════════════════════════════════ COACHING SESSIONS ════════════════════════════════════════ */}
        <CoachingCalendar />


        {/* Footer */}
        <p style={{ textAlign: "center" as const, fontFamily: FONT, fontWeight: 200, fontSize: 10, color: "#BBBBBB", letterSpacing: 2, textTransform: "uppercase" as const, paddingTop: 4 }}>
          MJM 360 Command Center · mjmdashboard.org · Phase 1 · Demo Day · Summer 2026
        </p>

      </div>
    </div>
  )
}


// kept for reference, not currently rendered
export { _DeepDiveSection }
