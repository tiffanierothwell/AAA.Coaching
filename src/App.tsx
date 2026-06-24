import './App.css'
import { useState, useEffect } from 'react'
import { PM_DETAILS } from './data/pmDetails'
import { BUILD_DAYS } from './data/buildDays'

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
const MILESTONES: { label: string; sub: string; status: MS }[] = [
  { label: "Stack chosen",   sub: "Python · FastAPI",     status: "done"  },
  { label: "Server live",    sub: "Andre · Caddy + SSL",  status: "done"  },
  { label: "Supabase up",    sub: "13 containers",        status: "done"  },
  { label: "Littletree DB",  sub: "Read-only · nightly",  status: "done"  },
  { label: "Tech meeting",   sub: "Andre · Mike · Valera",status: "done"  },
  { label: "Schema design",  sub: "TODAY · service by service", status: "now"   },
  { label: "Mike's World",   sub: "2nd Supabase DB",      status: "later" },
  { label: "Auth + roles",   sub: "Email/password",       status: "later" },
  { label: "Telegram bot",   sub: "CommandOS",            status: "later" },
  { label: "Hub + calendar", sub: "Hero + GCal pull",     status: "later" },
  { label: "AI prep docs",   sub: "Meeting briefs",       status: "later" },
  { label: "Demo to Mike",   sub: "End-to-end",           status: "later" },
]

function ProgressTimeline() {
  const isMobile = useIsMobile()
  const total    = MILESTONES.length
  const doneCount = MILESTONES.filter(m => m.status === "done").length
  const nowIdx   = MILESTONES.findIndex(m => m.status === "now")
  const halfStep = 100 / total / 2
  const fillPct  = nowIdx >= 0 ? halfStep + (nowIdx / (total - 1)) * (100 - 2 * halfStep) : 100

  return (
    <div style={{ ...CARD, padding: isMobile ? "20px 16px 22px" : "26px 32px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
          <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
            Project timeline
          </span>
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11, color: INK3 }}>
          <span style={{ fontWeight: 800, color: INK }}>{doneCount}</span> of {total} steps complete
        </span>
      </div>

      <div style={{ position: "relative" as const }}>
        <div style={{
          position: "absolute" as const,
          top: isMobile ? 10 : 27, left: `${halfStep}%`, right: `${halfStep}%`,
          height: 2, background: RULE, borderRadius: 99, zIndex: 0,
        }}/>
        <div style={{
          position: "absolute" as const,
          top: isMobile ? 10 : 27, left: `${halfStep}%`,
          width: `${fillPct - halfStep}%`,
          height: 2, background: INK, borderRadius: 99, zIndex: 1,
        }}/>

        <div style={{ display: "flex", position: "relative" as const, zIndex: 2 }}>
          {MILESTONES.map((m, i) => {
            const done  = m.status === "done"
            const now   = m.status === "now"
            const later = m.status === "later"
            const circleSize = isMobile ? 18 : 26
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
                  border: done ? `2px solid ${INK}` : now ? `2.5px solid ${INK}` : `2px solid #D8D8D8`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: now ? "0 0 0 4px rgba(0,0,0,0.09)" : "none",
                }}>
                  {done && (
                    <svg width={isMobile ? 7 : 11} height={isMobile ? 7 : 11} viewBox="0 0 12 12">
                      <polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {now && <div style={{ width: isMobile ? 6 : 8, height: isMobile ? 6 : 8, borderRadius: "50%", background: INK }}/>}
                  {later && <div style={{ width: isMobile ? 4 : 6, height: isMobile ? 4 : 6, borderRadius: "50%", background: "#D8D8D8" }}/>}
                </div>
                {!isMobile && (
                  <div style={{ marginTop: 9, textAlign: "center" as const, lineHeight: 1.35, padding: "0 2px" }}>
                    <div style={{
                      fontFamily: FONT, fontSize: 9.5,
                      fontWeight: now ? 800 : done ? 600 : 400,
                      color: now ? INK : done ? INK2 : INK3,
                      letterSpacing: now ? 0.2 : 0,
                    }}>{m.label}</div>
                    <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 8.5, color: now ? INK2 : INK3, marginTop: 2, letterSpacing: 0.2 }}>{m.sub}</div>
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

      <div style={{ marginTop: 22 }}>
        <div style={{ height: 3, background: RULE, borderRadius: 99, overflow: "hidden" as const }}>
          <div style={{ height: "100%", width: `${(doneCount / total) * 100}%`, background: INK, borderRadius: 99 }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: INK3, letterSpacing: 0.5 }}>Project start</span>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 9, color: INK3 }}>
            {total - doneCount - 1} steps remaining after today
          </span>
          <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: INK3, letterSpacing: 0.5 }}>Demo to Mike</span>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// PROJECT CALENDAR · JUNE–JULY 2026
// ════════════════════════════════════════════════════════════════
type Meeting = { title: string; time?: string; who: string[] }

const JUNE_MEETINGS: Record<number, Meeting> = {
  23: { title: "Kickoff · AAA Coach intro + onboarding", time: "10:00 AM", who: ["Tiffanie Rothwell", "AAA Coach"] },
  24: { title: "Build Day · Schema design with Claude", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
  25: { title: "Build Day · Schema design", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
  26: { title: "Coaching · Nick Voikin", time: "11:00 AM", who: ["Tiffanie Rothwell", "Nick Voikin"] },
  29: { title: "Build Day · Supabase Auth + RLS", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
  30: { title: "Build Day · Telegram bot scaffolding", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
}

const JULY_MEETINGS: Record<number, Meeting> = {
   1: { title: "Coaching · AAA Coach", time: "10:00 AM", who: ["Tiffanie Rothwell", "AAA Coach"] },
   2: { title: "Build Day · LTV Hub hero + calendar", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
   3: { title: "Build Day · Cross-venture JWT", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
   6: { title: "Build Day · Meeting Prep + AI brief", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
   7: { title: "Coaching · Timo", time: "10:00 AM", who: ["Tiffanie Rothwell", "Timo"] },
   8: { title: "Build Day · Resources + pgvector", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
   9: { title: "Build Day · Cmd+K semantic search", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
  10: { title: "Build Day · Ask Your Mentor + Skills", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
  13: { title: "Build Day · Skill rec engine", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
  14: { title: "Coaching · AAA Coach", time: "10:00 AM", who: ["Tiffanie Rothwell", "AAA Coach"] },
  15: { title: "Build Day · Weekly Snapshots PM row", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
  16: { title: "Build Day · Leah row + win input", time: "9:00 AM–4:00 PM", who: ["Tiffanie Rothwell"] },
  17: { title: "Demo to Mike · Sign-off", time: "11:00 AM", who: ["Tiffanie Rothwell", "Mike David"] },
}

// June 1, 2026 = Monday; July 1, 2026 = Wednesday.
type MonthSpec = { name: string; monthIdx: number; year: number; startDay: number; days: number; meetings: Record<number, Meeting> }
const PROJECT_MONTHS: MonthSpec[] = [
  { name: "June 2026", monthIdx: 5, year: 2026, startDay: 1, days: 30, meetings: JUNE_MEETINGS },
  { name: "July 2026", monthIdx: 6, year: 2026, startDay: 3, days: 31, meetings: JULY_MEETINGS },
]

function MayCalendar() {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 14, width: "100%", height: "100%" }}>
      {PROJECT_MONTHS.map(m => <MonthGrid key={m.name} spec={m} />)}
    </div>
  )
}

function MonthGrid({ spec }: { spec: MonthSpec }) {
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState<number | null>(null)
  const now = new Date()
  const isCurrentMonth = now.getFullYear() === spec.year && now.getMonth() === spec.monthIdx
  const isPastMonth    = new Date(spec.year, spec.monthIdx + 1, 0) < now
  const todayDate = isCurrentMonth ? now.getDate() : (isPastMonth ? spec.days + 1 : 0)

  const cells: (number | null)[] = [
    ...Array(spec.startDay).fill(null),
    ...Array.from({ length: spec.days }, (_, i) => i + 1),
  ]
  const meetingCount = Object.keys(spec.meetings).length

  return (
    <div style={{ ...CARD, padding: "18px 16px", display: "flex", flexDirection: "column" as const, width: "100%" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
          <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
          <span style={{ fontFamily: FONT, fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: INK3 }}>{spec.name}</span>
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: INK }}>
          {meetingCount} sessions
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 3 }}>
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} style={{
            textAlign: "center" as const,
            fontFamily: FONT, fontWeight: 700, fontSize: 7.5,
            color: INK3, paddingBottom: 4,
          }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, position: "relative" as const }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} style={{ height: 28, borderRadius: 6 }} />

          const hasMeeting = !!spec.meetings[day]
          const isToday    = day === todayDate
          const isPast     = day < todayDate
          const isFuture   = day > todayDate

          return (
            <div
              key={day}
              style={{
                height: 28, borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative" as const,
                cursor: hasMeeting ? "pointer" : "default",
                background: hasMeeting ? INK : "transparent",
                border: hasMeeting ? "none" : isToday ? `2px solid ${INK}` : `1px solid ${RULE}`,
                opacity: isFuture && !hasMeeting ? 0.35 : 1,
                transition: "transform 0.12s, box-shadow 0.12s",
                transform: hovered === day ? "scale(1.25)" : "scale(1)",
                boxShadow: hovered === day ? "0 4px 16px rgba(0,0,0,0.22)" : "none",
                zIndex: hovered === day ? 10 : 1,
              }}
              onMouseEnter={() => hasMeeting && setHovered(day)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{
                fontFamily: FONT,
                fontWeight: hasMeeting ? 800 : isToday ? 700 : isPast ? 400 : 300,
                fontSize: 9,
                color: hasMeeting ? "#fff" : isToday ? INK : isPast ? INK2 : INK3,
                userSelect: "none" as const,
                lineHeight: 1,
              }}>{day}</span>

              {!isMobile && hovered === day && spec.meetings[day] && (
                <div style={{
                  position: "absolute" as const,
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: INK,
                  borderRadius: 10,
                  padding: "10px 14px",
                  whiteSpace: "nowrap" as const,
                  zIndex: 999,
                  boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
                  minWidth: 200,
                  pointerEvents: "none" as const,
                }}>
                  <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 8.5, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 5 }}>
                    {spec.name.split(" ")[0]} {day}, {spec.year}{spec.meetings[day].time ? ` · ${spec.meetings[day].time}` : ""}
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11, color: "#fff", marginBottom: 7, lineHeight: 1.3 }}>
                    {spec.meetings[day].title}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
                    {spec.meetings[day].who.map(name => (
                      <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
                        <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 10, color: "rgba(255,255,255,0.75)" }}>{name}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    position: "absolute" as const,
                    top: "100%", left: "50%", transform: "translateX(-50%)",
                    width: 0, height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: `6px solid ${INK}`,
                  }}/>
                </div>
              )}
            </div>
          )
        })}
      </div>
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
  "System updated",
  "Python 3.14 + /opt/automations",
  "PHP 8.5 + FPM + Composer",
  "Docker + Supabase (13 containers)",
  "Cron timer + Webhook service",
  "Caddy + SSL · 5/5 certs issued",
  "All subdomains live",
]

const INTEGRATIONS = [
  "Fireflies", "QuickBooks", "Calendly", "Zoom", "Telegram", "Google Workspace",
  "Gmail", "Stripe", "Square / POS", "Kolbe", "GitHub", "Twilio",
  "OpenAI / Claude", "Whisper",
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
            Foundation · 01 · Server is live
          </span>
        </div>
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 38 : 56, color: INK, letterSpacing: -2, lineHeight: 1, margin: "0 0 18px" }}>
          The <span style={{ color: INK3 }}>Stack.</span>
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 18 }}>
          {["Python", "FastAPI", "Supabase", "Andre's Server"].map(t => (
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
          Every automation in this document is a Python script. FastAPI serves the webhook endpoints. Supabase
          (self-hosted via Docker on Andre's server) is the database of record. Third-party services post webhooks
          to FastAPI endpoints or are polled by cron jobs — all results land in Supabase tables that the dashboard
          reads in real time. Built and maintained in Claude Code + Cursor. No n8n.
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
// BUILD CALENDAR · 5 WEEKS
// ════════════════════════════════════════════════════════════════
type DayKind = "foundation" | "med" | "high" | "low" | "test"
type Day = { day: string; kind: DayKind; title: string; desc: string; tags: string[]; key?: string }
type Week = { num: number; theme: string; days: Day[] }

const DAY_ACCENT: Record<DayKind, string> = {
  foundation: "#FF1493",
  med:        SEV_MED,
  high:       SEV_HIGH,
  low:        SEV_LOW,
  test:       INK,
}

const TOOLKIT = [
  "Claude Code", "AIOS", "Cursor", "Terminal", "Supabase Studio",
  "Telegram", "Wispr Flow", "GitHub", "Claude API", "OpenAI / Whisper", "GCal · Fireflies",
]

const WEEKS: Week[] = [
  {
    num: 1, theme: "Foundation, Auth & Core Pages",
    days: [
      { day: "MON", kind: "foundation", title: "Supabase init + iterative schema kickoff", desc: "Run /prime · spin up Supabase project on Andre's server · enable RLS · schema is built iteratively service-by-service (no upfront full-schema dump — add tables as each automation is wired). Confirm Littletree MySQL nightly read-only refresh path.", tags: ["Claude Code", "Supabase Studio", "Terminal"] },
      { day: "TUE", kind: "foundation", title: "Supabase Auth (email/password) + RLS + mike.html wrapper", desc: "Wire Supabase Auth with email/password · manual user provisioning · RLS policies per company · replace localStorage gate · render hero · embed /ltv/index.html iframe · test login → /mike.html.", tags: ["Claude Code", "Supabase", "Cursor"] },
      { day: "WED", kind: "foundation", title: "Telegram bot scaffolding + integrations sync", desc: "Create bot via BotFather · wire FastAPI webhook on Andre's server · 'hello Mike' round-trip · add API keys (GCal · Fireflies · Calendly) · build sync collectors · land first overnight pull.", tags: ["Claude Code", "Telegram", "Terminal"] },
      { day: "THU", kind: "med", title: "Little Tree Ventures Hub hero + weekly calendar pull + 4 venture iframes", desc: "Build hero card · Python cron to pull Mike's GCal weekly view · render in-page calendar · scaffold 4 venture iframe wrappers + folder cards + external dashboard links.", tags: ["Claude Code", "Supabase", "GCal API"] },
      { day: "FRI", kind: "high", title: "HIGH #137 Cross-venture JWT + HIGH #138 activity ticker", desc: "JWT signer service · publish public key · coordinate verifier with each venture dashboard · venture_activity table · hover-debounce JS · 200ms tooltip with last 5 events.", tags: ["Claude Code", "JWT lib", "Supabase"] },
    ],
  },
  {
    num: 2, theme: "Meeting Prep, Resources & Mentors",
    days: [
      { day: "MON", kind: "high", title: "Meeting Prep page + HIGH #130 pre-meeting brief", desc: "Build Meeting Prep section · Supabase query for next 7 days · click → modal · hourly cron · context-gather agent · Claude composer · CommandOS deliver · brief_sent flag.", tags: ["Claude Code", "Claude API", "Telegram"] },
      { day: "TUE", kind: "high", title: "HIGH #141 AI prep doc generator + Meeting Prep MED batch", desc: "Multi-table read · structured Claude prompt · meeting_prep table · modal renderer · 8 medium automations: long-form meeting modal · attendee history · linked tasks · transcript link · etc.", tags: ["Claude Code", "Claude API", "Supabase"] },
      { day: "WED", kind: "med", title: "Resources page + 5 mentor tabs + PDF embeddings + pgvector", desc: "Tabbed resources page (Tony, Jay, Strategic Coach, A360, AI Bali) · upload component · enable pgvector · chunker script · OpenAI embeddings · backfill all mentor PDFs.", tags: ["Claude Code", "OpenAI API", "pgvector"] },
      { day: "THU", kind: "high", title: "HIGH #155 Cmd+K semantic search palette", desc: "Cmd+K UI · embed-query → pgvector top-10 → Claude rerank · deep-link to PDF page · result preview pane.", tags: ["Claude Code", "OpenAI API", "pgvector"] },
      { day: "FRI", kind: "high", title: "HIGH #160 Ask Your Mentor (Telegram) + Skills page", desc: "Telegram inbound · mentor router · pgvector retrieve · voice-emulation prompt · reply · build skill grid · Supabase storage upload · download counter · install instructions.", tags: ["Claude Code", "Claude API", "Telegram"] },
    ],
  },
  {
    num: 3, theme: "Skills, Snapshots, Polish & Demo",
    days: [
      { day: "MON", kind: "high", title: "HIGH #168 Skill recommendation engine + Resources/Skills MED batch", desc: "Activity aggregator · embed Mike's last 14 days · pgvector match skills · Claude rerank top-5 · 12 medium automations across resources + skills (downloads, tracking, related-skill links).", tags: ["Claude Code", "Claude API", "pgvector"] },
      { day: "TUE", kind: "high", title: "Weekly Snapshots PM row + HIGH #173 PM weekly synthesis", desc: "3-col layout: Watch · Building · Next · Mike's Ideas · Blockers · wire to Supabase · Monday cron · pull last week's activity · Claude narrative writer · save to tiffanie_snapshots.", tags: ["Claude Code", "Claude API", "Cursor"] },
      { day: "WED", kind: "med", title: "Weekly Snapshots Leah row + win input", desc: "5 day cards · win capture form · Claude categorize · Friday digest cron · Telegram delivery hook.", tags: ["Claude Code", "Cursor", "Claude API"] },
      { day: "THU", kind: "low", title: "Remaining MED + LOW automations sweep", desc: "Sweep through the long tail · per-page beacons · click logs · navigation polish · theme persistence · audit logs.", tags: ["Claude Code", "Cursor"] },
      { day: "FRI", kind: "test", title: "End-to-end test + demo to Mike + sign-off", desc: "Real-data dry run · fix tickets · screen-share walk-through · capture feedback for v2.", tags: ["Claude Code", "Telegram", "Mike's calendar"] },
    ],
  },
  {
    num: 4, theme: "Buffer, v2 Tickets & Mike's Onboarding",
    days: [
      { day: "MON", kind: "med", title: "v2 ticket triage + critical fixes", desc: "Walk through Mike's demo feedback · classify P0/P1/P2 · ship the P0 fixes immediately · re-deploy · re-test on Mike's profile.", tags: ["Claude Code", "Supabase", "Cursor"] },
      { day: "TUE", kind: "med", title: "Mike onboarding · live walkthrough", desc: "Screen-share with Mike · walk every section · capture confusion points · take voice notes via Whisper · file follow-up tasks.", tags: ["Claude Code", "Whisper", "Telegram"] },
      { day: "WED", kind: "med", title: "Telegram CommandOS polish + slash commands", desc: "Add /idea, /win, /skill, /prep slash commands · wire each to its Supabase write path · test from Mike's phone · document in skills page.", tags: ["Claude Code", "Telegram", "Supabase"] },
      { day: "THU", kind: "low", title: "Audit logs + per-user activity feed", desc: "activity_log read view · filter by user · last 14 days · export CSV · used as the input to weekly synthesis.", tags: ["Claude Code", "Supabase"] },
      { day: "FRI", kind: "test", title: "Coaching session · Valera + retro", desc: "Walk Valera through what shipped Week 1–4 · review architecture decisions · capture gaps · plan Week 5 leftovers.", tags: ["Claude Code", "Fireflies", "Valera"] },
    ],
  },
  {
    num: 5, theme: "Leah Onboarding, Hardening & Hand-off",
    days: [
      { day: "MON", kind: "med", title: "Leah row · onboarding + 5-day grid live", desc: "Add Leah's user · email/password · roles · wire her Telegram · deliver first daily card · confirm Friday digest path to Mike.", tags: ["Claude Code", "Supabase", "Telegram"] },
      { day: "TUE", kind: "med", title: "Backups + restore drill", desc: "Verify daily DB backup · run a test restore into the sandbox DB · document the runbook · share with Andre.", tags: ["Claude Code", "Supabase", "Andre"] },
      { day: "WED", kind: "low", title: "Performance + monitoring sweep", desc: "Add per-route timing · Supabase slow query log · cron heartbeat · Telegram alert when a job misses its window.", tags: ["Claude Code", "Supabase", "Telegram"] },
      { day: "THU", kind: "med", title: "Documentation + handoff package", desc: "README · architecture diagram · runbook for Andre · skill modules for the 5 most-used flows · video walk-through.", tags: ["Claude Code", "Loom", "Cursor"] },
      { day: "FRI", kind: "test", title: "Final sign-off · Mike + Andre + Valera", desc: "Live demo · production-data dry run · sign-off form · feedback recorded · v2 backlog handed to Tiffanie.", tags: ["Claude Code", "Mike", "Valera"] },
    ],
  },
]

function DayCard({ d, dayKey, onOpen }: { d: Day; dayKey: string; onOpen: (k: string) => void }) {
  const isMobile = useIsMobile()
  const hasDetail = !!BUILD_DAYS[dayKey]
  return (
    <div
      onClick={() => hasDetail && onOpen(dayKey)}
      style={{
        ...CARD, padding: isMobile ? "16px 16px 18px" : "18px 18px 20px",
        display: "flex", flexDirection: "column" as const, gap: 10,
        borderLeft: `4px solid ${DAY_ACCENT[d.kind]}`,
        minHeight: 0,
        cursor: hasDetail ? "pointer" : "default",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => { if (hasDetail) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)" } }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = SH }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 10, letterSpacing: 1.6, color: INK3 }}>{d.day}</span>
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 9, color: INK3 }}>9–4</span>
      </div>
      <h4 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13, color: INK, lineHeight: 1.35, letterSpacing: -0.2, margin: 0 }}>
        {d.title}
      </h4>
      <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11, color: INK3, lineHeight: 1.6, margin: 0 }}>
        {d.desc}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, marginTop: "auto" }}>
        {d.tags.map(t => <TagChip key={t} label={t} />)}
      </div>
      {hasDetail && (
        <div style={{ fontFamily: FONT, fontSize: 8.5, fontWeight: 700, letterSpacing: 0.5, color: INK3, marginTop: 2 }}>
          Click for full plan →
        </div>
      )}
    </div>
  )
}

// ── Day modal content ─────────────────────────────────────────
function DayModalContent({ k }: { k: string }) {
  const d = BUILD_DAYS[k]
  if (!d) return null
  return (
    <div>
      {/* Dark header */}
      <div style={{ background: INK, padding: "30px 36px 28px", color: "#fff" }}>
        <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
          {d.eyebrow}
        </div>
        <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: "#fff", letterSpacing: -1, lineHeight: 1.15, margin: "0 0 14px", paddingRight: 36 }}>
          {decodeEntities(d.title)}
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
          {d.chips.map((c, i) => {
            const lvl = c.c === "lvl-low" ? SEV_LOW : c.c === "lvl-med" ? SEV_MED : c.c === "lvl-high" ? SEV_HIGH : null
            return (
              <span key={i} style={{
                fontFamily: FONT, fontWeight: 800, fontSize: 9.5, letterSpacing: 1,
                padding: "3px 10px", borderRadius: 99,
                border: lvl ? `1.5px solid ${lvl}` : "1px solid rgba(255,255,255,0.2)",
                color: lvl ?? "rgba(255,255,255,0.85)",
                background: lvl ? "transparent" : "rgba(255,255,255,0.08)",
                display: "inline-flex", alignItems: "center", gap: 5,
              }}>
                {lvl && <span style={{ width: 6, height: 6, borderRadius: "50%", background: lvl }}/>}
                {c.l}
              </span>
            )
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 36px 32px" }}>
        {/* Workflow pipeline */}
        <div style={{ background: INK, borderRadius: 14, padding: "18px 20px", marginBottom: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap" as const, gap: 6 }}>
            <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "#fff" }}>◆ DAY WORKFLOW</span>
            <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 600, letterSpacing: 1.2, color: "rgba(255,255,255,0.45)" }}>INPUTS · PROCESS · DELIVER</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "stretch" }}>
            {d.workflow.map((step, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, flex: "1 1 0", minWidth: 140 }}>
                <span style={{
                  display: "inline-flex", flexDirection: "column" as const,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, padding: "10px 12px",
                  flex: 1,
                }}>
                  <span style={{
                    fontFamily: FONT, fontSize: 8, fontWeight: 800,
                    letterSpacing: 1.5, textTransform: "uppercase" as const,
                    color: step.kind === "trigger" ? "#fff"
                         : step.kind === "service" ? "#22D3EE"
                         : step.kind === "storage" ? SEV_LIVE
                         : step.kind === "ui"      ? "#FFB347"
                         : "#FF1493",
                    marginBottom: 4,
                  }}>{step.kind}</span>
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                    {decodeEntities(step.name)}
                  </span>
                </span>
                {i < d.workflow.length - 1 && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 700 }}>▸</span>}
              </span>
            ))}
          </div>
        </div>

        <ModalSection label="What this day delivers">
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: d.what }} />
        </ModalSection>

        <ModalSection label="How it gets done · with time estimates">
          <ol style={{ margin: 0, paddingLeft: 22 }}>
            {d.how.map((h, i) => <li key={i} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: h }} />)}
          </ol>
        </ModalSection>

        <ModalSection label="Modules & services">
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
            {d.modules.map(m => <CodeChip key={m}>{decodeEntities(m)}</CodeChip>)}
          </div>
        </ModalSection>

        <ModalSection label="Tables / storage">
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
            {d.tables.map(t => <CodeChip key={t}>{decodeEntities(t)}</CodeChip>)}
          </div>
        </ModalSection>

        <ModalSection label="Acceptance criteria">
          <ul style={{ margin: 0, paddingLeft: 22 }}>
            {d.accept.map((a, i) => <li key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: a }} />)}
          </ul>
        </ModalSection>

        <ModalSection label="Notes">
          <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: d.notes }} />
        </ModalSection>

        <ModalSection label="Detailed explanation">
          <div className="long-explain" dangerouslySetInnerHTML={{ __html: d.longExplain }} />
        </ModalSection>
      </div>
    </div>
  )
}

function BuildCalendar() {
  const isMobile = useIsMobile()
  const [openKey, setOpenKey] = useState<string | null>(null)
  return (
    <div style={{ ...CARD, padding: isMobile ? "22px 18px" : "32px 36px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 18, marginBottom: 22, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
            <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
              Build Calendar · 4 hours per day · Mon–Fri
            </span>
          </div>
          <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 28 : 38, color: INK, letterSpacing: -1.3, lineHeight: 1.05, margin: "0 0 8px" }}>
            From zero to Mike's AIOS in 5 weeks.
          </h2>
          <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12.5, color: INK2, lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
            Driven by Claude Code (you in the chair, AIOS executing) — not by hand-coding. Each block is a focused 4-hour work session.
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3, marginBottom: 8 }}>
            Toolkit
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, maxWidth: 320 }}>
            {TOOLKIT.map(t => (
              <span key={t} style={{
                fontFamily: FONT, fontWeight: 700, fontSize: 9.5,
                padding: "3px 10px", borderRadius: 99,
                background: INK, color: "#fff",
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: RULE, marginBottom: 22 }} />

      {/* Weeks */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 26 }}>
        {WEEKS.map(w => (
          <div key={w.num}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" as const }}>
              <span style={{
                fontFamily: FONT, fontSize: 9, fontWeight: 800, letterSpacing: 2,
                padding: "4px 10px", borderRadius: 4,
                background: INK, color: "#fff", textTransform: "uppercase" as const,
              }}>Week {w.num}</span>
              <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, color: INK3 }}>
                {w.theme}
              </span>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)",
              gap: 10,
            }}>
              {w.days.map(d => {
                const k = `w${w.num}-${d.day.toLowerCase()}`
                return <DayCard key={d.day} d={d} dayKey={k} onOpen={setOpenKey} />
              })}
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!openKey} onClose={() => setOpenKey(null)}>
        {openKey && <DayModalContent k={openKey} />}
      </Modal>
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

function EmailThreadCard() {
  const isMobile = useIsMobile()
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const openMsg = openIdx !== null ? EMAIL_THREAD[openIdx] : null

  return (
    <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
      <div style={{ height: 3, background: "#FF1493", width: "100%" }} />
      <div style={{ padding: isMobile ? "20px 16px 22px" : "28px 32px 30px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 10, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
            <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
              Questions for Coach · email thread with Andre
            </span>
          </div>
          <a
            href={`${import.meta.env.BASE_URL}email-thread-andre.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: FONT, fontSize: 9, fontWeight: 700,
              background: INK, color: "#fff",
              padding: "5px 12px", borderRadius: 99, letterSpacing: 1,
              textTransform: "uppercase" as const, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6L9 1z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 1v5h5" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            View full PDF
          </a>
        </div>
        <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11, color: INK3, margin: "8px 0 16px", lineHeight: 1.5 }}>
          Restarting today with the AAA Coach. Tap any item below to open the full email or resource.
        </p>

        {/* Compact bullet list — click to expand */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {EMAIL_THREAD.map((m, i) => {
            const isAndre = m.fromShort === "Andre"
            return (
              <button
                key={i}
                onClick={() => setOpenIdx(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 12px", borderRadius: 10, textAlign: "left" as const, cursor: "pointer",
                  background: m.askCoach ? "rgba(255,20,147,0.05)" : CHIP,
                  border: `1px solid ${m.askCoach ? "rgba(255,20,147,0.25)" : RULE}`,
                  fontFamily: FONT,
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
                {m.askCoach && (
                  <span style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, background: "#FF1493", color: "#fff", padding: "2px 6px", borderRadius: 99, flexShrink: 0 }}>Ask coach</span>
                )}
                <span style={{ fontSize: 13, color: INK3, flexShrink: 0, fontWeight: 300 }}>›</span>
              </button>
            )
          })}

          {/* Resources — compact bullets, open in new tab */}
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
      <Modal open={openIdx !== null} onClose={() => setOpenIdx(null)}>
        {openMsg && (
          <div>
            <div style={{ background: INK, padding: isMobile ? "22px 20px" : "26px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: openMsg.fromShort === "Andre" ? "#fff" : "#FF1493",
                  color: openMsg.fromShort === "Andre" ? INK : "#fff",
                  fontFamily: FONT, fontWeight: 900, fontSize: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 0.3,
                }}>{openMsg.fromShort === "Andre" ? "AB" : "TR"}</div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13, color: "#fff" }}>
                    {openMsg.fromShort === "Andre" ? "André Boudreault" : "Tiffanie Rothwell"}
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
                    → {openMsg.to} · {openMsg.date}
                  </div>
                </div>
              </div>
              {openMsg.subject && (
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.35 }}>{openMsg.subject}</div>
              )}
              {openMsg.highlight && (
                <span style={{ display: "inline-block", marginTop: 8, fontFamily: FONT, fontSize: 8.5, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" as const, background: "#FF1493", color: "#fff", padding: "3px 9px", borderRadius: 99 }}>{openMsg.highlight}</span>
              )}
            </div>
            <div style={{ padding: isMobile ? "20px 20px 26px" : "26px 32px 32px", fontFamily: FONT, fontWeight: 400, fontSize: isMobile ? 12 : 13, color: INK2, lineHeight: 1.7 }}>
              {openMsg.body}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// APP
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
                {[new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), `Build Day · Week 1 · ${new Date().toLocaleDateString("en-US", { weekday: "short" })}`].map(b => (
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
                }}>From zero to Mike's AIOS in 5 weeks</p>
                <h1 style={{
                  fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 44 : 68,
                  color: INK, letterSpacing: isMobile ? -1.5 : -3, lineHeight: 0.92, margin: 0,
                }}>Hi AAA Coach</h1>
              </div>

              <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
                <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" as const, color: INK3 }}>Project</span>
                <a href="https://www.ltvdashboard.org/hub.html" target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: INK, letterSpacing: -0.3, textDecoration: "underline", textDecorationColor: "#FF1493", textUnderlineOffset: 3 }}>
                  LTV Hub — Mike's AIOS · ltvdashboard.org/hub.html
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
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: -0.5, lineHeight: 1.1 }}>Build Day 1</div>
                <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · 9–4</div>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "20px 0" }} />

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" as const }}>Milestones</span>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 9, color: "rgba(255,255,255,0.6)" }}>5 / 12</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" as const }}>
                  <div style={{ height: "100%", width: "42%", background: "#fff", borderRadius: 99 }} />
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 5, letterSpacing: 0.3 }}>42% complete · Week 1 of 5</div>
              </div>

              <div style={{ flex: 1 }} />
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />

              <div>
                <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 6 }}>Up next</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: "#fff", lineHeight: 1.4 }}>
                  Schema design with Claude — service by service
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ════════════════════════════════════════ TIMELINE ════════════════════════════════════════ */}
        <ProgressTimeline />


        {/* ════════════════════════════════════════ QUESTIONS FOR COACH — EMAIL THREAD WITH ANDRE ════════════════════════════════════════ */}
        <EmailThreadCard />



        {/* ════════════════════════════════════════ PROJECT BRIEF + MAY CALENDAR ════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 14, alignItems: "stretch" }}>
          <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px", flex: 1 }}>
            <SectionLabel label="Project in one sentence" />
            <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 13, color: INK2, lineHeight: 1.8, margin: 0 }}>
              An AI Operating System that wraps Mike David's daily work across Little Tree Ventures (LT Capital · LT Fuel · Jayi · AAA) so he stops being the bottleneck — calendar, meetings, mentor library, weekly snapshots, and a Telegram bot called CommandOS — built on Andre's self-hosted Supabase, Python + FastAPI, and Claude as the brain.
              <span style={{ fontWeight: 700, color: INK }}> Built across /mike.html (auth wrapper) + /ltv/index.html (inner hub).</span>
            </p>
          </div>
          <div style={{ flexShrink: 0, width: isMobile ? "auto" : 220, display: "flex" }}>
            <MayCalendar />
          </div>
        </div>


        {/* ════════════════════════════════════════ THE STACK ════════════════════════════════════════ */}
        <StackSection />


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
                Design the supporting schema service-by-service with Claude — additive, not upfront. Confirm Littletree MySQL nightly read-only path. Stand up the second Supabase DB ("Mike's World") + sandbox.
              </h2>
              <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11.5, color: INK3, lineHeight: 1.7, margin: "0 0 16px" }}>
                Andre's server, Supabase (13 containers), and the Littletree mirror are all live. The supporting schema doesn't exist yet — Week 1 is design + scoping. Drop Google SSO; use Supabase Auth (email/password) with manual role provisioning. Re-prompt the AI plan to reflect the corrected stack.
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                {["Schema design", "Mike's World DB", "Sandbox replica", "Drop SSO"].map(tag => (
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
                  "Andre: stand up second Supabase DB (Mike's World) + sandbox replica with on-demand 'replicate now' from Tiffanie's super-user login.",
                  "Validate the Week-1 estimate after schema is defined — Valera flagged my plan as overestimated.",
                  "Line up coaching rotation: Valera + Nick Voikin + Timo (and Garrett when onboarded). Bring blockers list each session.",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 10, color: "rgba(255,255,255,0.2)", flexShrink: 0, lineHeight: 1.6, letterSpacing: 0.5 }}>0{i + 1}</span>
                    <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>{t}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 0.5 }}>For AAA Coach · Week 1 · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
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


        {/* ════════════════════════════════════════ AGREED ARCHITECTURE + FIREFLIES ════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>

          {/* Agreed architecture */}
          <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px" }}>
            <SectionLabel label="Agreed architecture" />
            <Row label="Server"        value="Andre's self-hosted server · Caddy + SSL · 5 subdomains live"   pill={<Pill label="Live"      kind="solid"   />} />
            <Row label="Automations"   value="Python + FastAPI · /opt/automations · Cron + Webhook services" pill={<Pill label="Live"      kind="solid"   />} />
            <Row label="Database"      value="Supabase self-hosted · Postgres 15 · 13 containers · Studio"   pill={<Pill label="Live"      kind="solid"   />} />
            <Row label="Littletree DB" value="MySQL transactional · read-only · nightly midnight refresh"    pill={<Pill label="Live"      kind="solid"   />} />
            <Row label="Mike's World"  value="2nd Supabase DB · iterative schema · service-by-service"        pill={<Pill label="Building"  kind="outline" />} />
            <Row label="Sandbox DB"    value="On-demand replica · super-user 'replicate now'"                 pill={<Pill label="Andre"     kind="outline" />} />
            <Row label="Auth"          value="Supabase Auth · email/password · manual roles · RLS per company" pill={<Pill label="Building"  kind="outline" />} />
            <Row label="Storage"       value="Supabase Storage · PDFs · MP3 voice memos · pgvector embeddings" pill={<Pill label="Building"  kind="outline" />} />
            <Row label="Bot"           value="Telegram · CommandOS · slash commands /idea /win /skill /prep"   pill={<Pill label="Wk 1"      kind="outline" />} />
            <Row label="Migrations"    value="Local Git branch · Supabase CLI · push from dev → live"          pill={<Pill label="Standard"  kind="muted"   />} />
            <Row label="Backups"       value="Daily DB + server backups via data center"                       pill={<Pill label="Confirmed" kind="solid"   />} />
            <Row label="Google SSO"    value="Dropped — paid feature on cloud, not in self-hosted package"     pill={<Pill label="Ruled out" kind="muted"   />} />
            <Row label="No-code tools" value="No n8n · No Make.com required · all Python + Claude"             pill={<Pill label="Out"       kind="muted"   />} />

            <div style={{ background: CHIP, borderRadius: 12, padding: "14px 16px", marginTop: 16 }}>
              <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: INK3, lineHeight: 1.7, margin: 0 }}>
                <span style={{ fontWeight: 700, color: INK }}>Andre's rule — </span>
                Self-hosted, not cloud. Data sovereignty over convenience. One service wired before the next begins.
              </p>
            </div>
          </div>

          {/* Fireflies */}
          <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px" }}>
            <SectionLabel label="Fireflies meeting recordings" />
            {([
              {
                title: "Andre + Tiffanie — Project Continuation",
                sub:   "Restart plan · schema, credentials, next steps",
                date:  "Jun 9, 2026",
                url:   "https://app.fireflies.ai/view/Andre-Tiffanie-Project-Continuation::01KTKT6G7AF12R9FSCBMFCV71T",
                pdf:   "fireflies-andre-tiffanie-jun9.pdf",
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
            ] as { title: string; sub: string; date: string; url?: string; pdf?: string }[]).map(({ title, sub, date, url, pdf }) => (
              <div key={title} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "13px 14px", borderRadius: 12,
                background: CHIP,
                border: `1px solid ${RULE}`, marginBottom: 10,
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
            <div style={{ border: `1.5px dashed ${RULE}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: CHIP, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <line x1="8" y1="3" x2="8" y2="13" stroke="#C0C0C0" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="3" y1="8" x2="13" y2="8" stroke="#C0C0C0" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11, color: INK3 }}>Add next meeting link here</span>
            </div>
          </div>
        </div>


        {/* Footer */}
        <p style={{ textAlign: "center" as const, fontFamily: FONT, fontWeight: 200, fontSize: 10, color: "#BBBBBB", letterSpacing: 2, textTransform: "uppercase" as const, paddingTop: 4 }}>
          LTV Hub — Mike's AIOS · /mike.html + /ltv/index.html · AAA Accelerator · Summer 2026
        </p>

      </div>
    </div>
  )
}


// kept for reference, not currently rendered
export { _DeepDiveSection }
