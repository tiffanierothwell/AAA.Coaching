import './App.css'
import { useState, useEffect } from 'react'

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



// ── Step ──────────────────────────────────────────────────────
type StepStatus = "now" | "next" | "later"
function Step({ n, title, who, detail, status }: {
  n: number; title: string; who: string; detail: string; status: StepStatus
}) {
  const isNow   = status === "now"
  const isLater = status === "later"
  const bubble: React.CSSProperties = isNow
    ? { background: INK, color: "#fff", border: `2px solid ${INK}` }
    : isLater
    ? { background: "#fff", color: INK3, border: `2px solid ${RULE}` }
    : { background: "#fff", color: INK,  border: `2px solid ${INK}` }

  return (
    <div style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: `1px solid ${RULE}` }}>
      {/* Number bubble */}
      <div style={{
        width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
        fontFamily: FONT, fontWeight: 900, fontSize: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: 2, ...bubble,
      }}>{n}</div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" as const }}>
          <span style={{
            fontFamily: FONT, fontWeight: 700, fontSize: 14,
            color: isLater ? INK3 : INK, letterSpacing: -0.3,
          }}>{title}</span>
          <Pill label={who} kind={isNow ? "solid" : isLater ? "muted" : "outline"} />
        </div>
        <p style={{ fontFamily: FONT, margin: 0, fontSize: 12, fontWeight: 300, color: INK3, lineHeight: 1.7, letterSpacing: 0.1 }}>{detail}</p>
      </div>
    </div>
  )
}

// ── Progress Timeline ─────────────────────────────────────────
type MS = "done" | "now" | "later"
const MILESTONES: { label: string; sub: string; status: MS }[] = [
  { label: "Consultation",  sub: "Andre · needs",       status: "done"  },
  { label: "Build App",     sub: "Claude Code · PHP",   status: "done"  },
  { label: "GitHub",        sub: "Repo + deployed",     status: "done"  },
  { label: "Demo",          sub: "Shown to Andre",      status: "done"  },
  { label: "Approval",      sub: "Andre confirms",      status: "done"  },
  { label: "Session 1",     sub: "Valera · intro",      status: "done"  },
  { label: "Tech Q&A",      sub: "Andre + Valera",      status: "done"  },
  { label: "Supabase CLI",  sub: "TODAY · Session 5",   status: "now"   },
  { label: "Connect DB",    sub: "PHP + Supabase",      status: "later" },
  { label: "Login Auth",    sub: "MySQL · Cashiers",    status: "later" },
  { label: "Email Alerts",  sub: "PHP Mailer",          status: "later" },
  { label: "Launch",        sub: "Andre's server",      status: "later" },
]

function ProgressTimeline() {
  const isMobile = useIsMobile()
  const total    = MILESTONES.length
  const doneCount = MILESTONES.filter(m => m.status === "done").length
  const nowIdx   = MILESTONES.findIndex(m => m.status === "now")
  // line fills up to centre of current step
  const halfStep = 100 / total / 2
  const fillPct  = nowIdx >= 0 ? halfStep + (nowIdx / (total - 1)) * (100 - 2 * halfStep) : 100

  return (
    <div style={{ ...CARD, padding: isMobile ? "20px 16px 22px" : "26px 32px 28px" }}>

      {/* Header row */}
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

      {/* Track + steps */}
      <div style={{ position: "relative" as const }}>

        {/* Grey track */}
        <div style={{
          position: "absolute" as const,
          top: isMobile ? 10 : 27, left: `${halfStep}%`, right: `${halfStep}%`,
          height: 2, background: RULE, borderRadius: 99, zIndex: 0,
        }}/>
        {/* Black fill */}
        <div style={{
          position: "absolute" as const,
          top: isMobile ? 10 : 27, left: `${halfStep}%`,
          width: `${fillPct - halfStep}%`,
          height: 2, background: INK, borderRadius: 99, zIndex: 1,
        }}/>

        {/* Step nodes */}
        <div style={{ display: "flex", position: "relative" as const, zIndex: 2 }}>
          {MILESTONES.map((m, i) => {
            const done  = m.status === "done"
            const now   = m.status === "now"
            const later = m.status === "later"
            const circleSize = isMobile ? 18 : 26
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 0 }}>

                {/* "TODAY" pin above current — desktop only */}
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

                {/* Circle */}
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

                {/* Labels — desktop only */}
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

                {/* Mobile: "TODAY" dot indicator below circle */}
                {isMobile && now && (
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: INK, marginTop: 4 }}/>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom progress bar */}
      <div style={{ marginTop: 22 }}>
        <div style={{ height: 3, background: RULE, borderRadius: 99, overflow: "hidden" as const }}>
          <div style={{ height: "100%", width: `${(doneCount / total) * 100}%`, background: INK, borderRadius: 99 }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: INK3, letterSpacing: 0.5 }}>Project start</span>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 9, color: INK3 }}>
            {total - doneCount - 1} steps remaining after today
          </span>
          <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: INK3, letterSpacing: 0.5 }}>Launch</span>
        </div>
      </div>

    </div>
  )
}

// ── April 2026 meeting data ───────────────────────────────────
// Add meetings here: day number → { title, who[] }
const APRIL_MEETINGS: Record<number, { title: string; who: string[] }> = {
   3: { title: "AAA On-boarding",              who: ["Tiffanie Rothwell", "Mara"] },
   7: { title: "Coaching with Valera",         who: ["Mike David", "Tiffanie Rothwell", "Valera Tumash"] },
   9: { title: "Coaching with Valera",         who: ["Mike David", "Tiffanie Rothwell", "Valera Tumash"] },
  14: { title: "Coaching with Valera",         who: ["Mike David", "Tiffanie Rothwell", "Valera Tumash"] },
  15: { title: "Coaching with Valera",         who: ["Andre B.", "Tiffanie Rothwell", "Valera Tumash"] },
  16: { title: "Coaching with Valera",         who: ["Tiffanie Rothwell", "Valera Tumash"] },
}

// April 1, 2026 = Wednesday (index 3, Sun=0)
const APRIL_START_DAY = 3
const APRIL_DAYS      = 30
const TODAY_DATE      = 15


function AprilCalendar() {
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState<number | null>(null)

  const cells: (number | null)[] = [
    ...Array(APRIL_START_DAY).fill(null),
    ...Array.from({ length: APRIL_DAYS }, (_, i) => i + 1),
  ]
  const meetingCount = Object.keys(APRIL_MEETINGS).length

  return (
    <div style={{ ...CARD, padding: "18px 16px", display: "flex", flexDirection: "column" as const, width: "100%", height: "100%" }}>

      {/* Compact header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
          <div style={{ width: 4, height: 4, background: INK, borderRadius: 1 }} />
          <span style={{ fontFamily: FONT, fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: INK3 }}>April 2026</span>
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: INK }}>
          {meetingCount} sessions
        </span>
      </div>

      {/* Day-of-week initials */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 3 }}>
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} style={{
            textAlign: "center" as const,
            fontFamily: FONT, fontWeight: 700, fontSize: 7.5,
            color: INK3, paddingBottom: 4,
          }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, position: "relative" as const }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} style={{ height: 28, borderRadius: 6 }} />

          const hasMeeting = !!APRIL_MEETINGS[day]
          const isToday    = day === TODAY_DATE
          const isPast     = day < TODAY_DATE
          const isFuture   = day > TODAY_DATE

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

              {/* Tooltip — desktop only (no hover state on touch) */}
              {!isMobile && hovered === day && APRIL_MEETINGS[day] && (
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
                  minWidth: 180,
                  pointerEvents: "none" as const,
                }}>
                  <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 8.5, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 5 }}>
                    April {day}, 2026
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11, color: "#fff", marginBottom: 7, lineHeight: 1.3 }}>
                    {APRIL_MEETINGS[day].title}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
                    {APRIL_MEETINGS[day].who.map(name => (
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

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile()
  return (
    <div style={{ minHeight: "100vh", background: "#F2F2F2", padding: isMobile ? "20px 16px 60px" : "40px 28px 80px", fontFamily: FONT }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 14 }}>


        {/* ════════════════════════════════════════
            HERO CARD
        ════════════════════════════════════════ */}
        <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>

          {/* Black top accent stripe */}
          <div style={{ height: 4, background: INK, width: "100%" }} />

          <div style={{ padding: isMobile ? "22px 20px 24px" : "36px 40px 40px", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "stretch", gap: isMobile ? 20 : 32 }}>

            {/* ── LEFT: main greeting ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: isMobile ? "flex-start" : "space-between", gap: isMobile ? 20 : 0 }}>

              {/* Badge row */}
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
                {["April 15, 2026", "Session 5"].map(b => (
                  <span key={b} style={{
                    fontFamily: FONT, fontSize: 9, fontWeight: 600,
                    letterSpacing: 0.5, textTransform: "uppercase" as const,
                    padding: "4px 12px", borderRadius: 99, background: CHIP, color: INK2,
                  }}>{b}</span>
                ))}
              </div>

              {/* Greeting block */}
              <div>
                <p style={{
                  fontFamily: FONT, fontWeight: 200, fontSize: 12,
                  color: INK3, letterSpacing: 2.5, textTransform: "uppercase" as const,
                  margin: "0 0 10px",
                }}>Thanks for all of your help</p>
                <h1 style={{
                  fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 44 : 68,
                  color: INK, letterSpacing: isMobile ? -1.5 : -3, lineHeight: 0.92, margin: 0,
                }}>Hi Valera!</h1>
              </div>

              {/* Project name */}
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
                <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 10, letterSpacing: 2, textTransform: "uppercase" as const, color: INK3 }}>Project</span>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: INK, letterSpacing: -0.3 }}>
                  Ticket Help Desk — Little Tree &amp; Le Roi
                </span>
              </div>
            </div>

            {/* ── RIGHT: dark status card ── */}
            <div style={{
              width: isMobile ? "100%" : 240, flexShrink: isMobile ? undefined : 0,
              background: INK, borderRadius: 16,
              padding: "24px 24px 24px",
              display: "flex", flexDirection: "column" as const,
            }}>

              {/* Session label */}
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 4 }}>Current</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: -0.5, lineHeight: 1.1 }}>Session 5</div>
                <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>April 15, 2026</div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "20px 0" }} />

              {/* Progress */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" as const }}>Milestones</span>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 9, color: "rgba(255,255,255,0.6)" }}>7 / 12</span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" as const }}>
                  <div style={{ height: "100%", width: "58%", background: "#fff", borderRadius: 99 }} />
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 5, letterSpacing: 0.3 }}>58% complete</div>
              </div>

              {/* Spacer — pushes Up Next to bottom */}
              <div style={{ flex: 1 }} />

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />

              {/* Next up */}
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 6 }}>Up next</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: "#fff", lineHeight: 1.4 }}>Supabase CLI + Schema setup</div>
              </div>

            </div>
          </div>
        </div>


        {/* ════════════════════════════════════════
            PROGRESS TIMELINE
        ════════════════════════════════════════ */}
        <ProgressTimeline />


        {/* ════════════════════════════════════════
            2-COL CONTENT GRID
        ════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>

          {/* ── LEFT COL ── */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>

            {/* Project brief + mini calendar side by side */}
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 14, alignItems: "stretch" }}>
              <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px", flex: 1 }}>
                <SectionLabel label="Project in one sentence" />
                <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 13, color: INK2, lineHeight: 1.8, margin: 0 }}>
                  Internal IT ticketing system for 3 gas station / convenience stores. Staff submit tickets when the POS breaks → Manager triages → Owner receives daily reports.
                  <span style={{ fontWeight: 700, color: INK }}> Fully internal. No customer-facing layer.</span>
                </p>
              </div>
              <div style={{ flexShrink: 0, width: isMobile ? "auto" : 190, display: "flex" }}>
                <AprilCalendar />
              </div>
            </div>

            {/* What exists today */}
            <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px", flex: 1 }}>
              <SectionLabel label="What exists today" />
              <Row label="Language"       value="PHP + HTML / CSS"                     pill={<Pill label="Don't change" kind="muted"   />} />
              <Row label="All screens"    value="Submit, Board, Detail, Analytics"     pill={<Pill label="Built"        kind="solid"   />} />
              <Row label="Submit wizard"  value="4-step form + photo upload UI"        pill={<Pill label="Built"        kind="solid"   />} />
              <Row label="Manager board"  value="Urgent → Open → Closed → Archive"    pill={<Pill label="Built"        kind="solid"   />} />
              <Row label="Status flow"    value="New → In Process → Approval → Done"  pill={<Pill label="Built"        kind="solid"   />} />
              <Row label="Analytics"      value="Ticket counts, SLA %, filters"        pill={<Pill label="Built"        kind="solid"   />} />
              <Row label="Database"       value="Mock data only — not connected"       pill={<Pill label="Missing"      kind="outline" />} />
              <Row label="File storage"   value="UI exists, nowhere to save photos"    pill={<Pill label="Missing"      kind="outline" />} />
              <Row label="Auth / login"   value="No real login built yet"              pill={<Pill label="Missing"      kind="outline" />} />
              <Row label="Email triggers" value="Not wired up yet"                     pill={<Pill label="Missing"      kind="outline" />} />
            </div>

            {/* People */}
            <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px" }}>
              <SectionLabel label="People" />
              <Row label="Tiffanie"  value="Project owner — builds with Claude Code, not a developer" />
              <Row label="Andre B."  value="IT lead, 10+ yrs. Owns server + MySQL DB. Supabase ✗" />
              <Row label="Mike D."   value="Business owner — financial decision maker" />
              <Row label="Valera"    value="You — coaching Tiffanie through the technical build" />
            </div>
          </div>

          {/* ── RIGHT COL ── */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>

            {/* ── THIS WEEK'S FOCUS — right col row 1 ── */}
            <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
              {/* Top: white */}
              <div style={{ padding: isMobile ? "18px 16px 16px" : "28px 28px 22px", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 5, height: 5, borderRadius: 1, background: INK }} />
                  <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: INK3 }}>
                    This week's focus
                  </span>
                </div>
                <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: INK, lineHeight: 1.4, letterSpacing: -0.4, margin: "0 0 12px" }}>
                  Walk Tiffanie through Supabase CLI — install, authorize, and let Claude Code create the schema directly from terminal.
                </h2>
                <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11.5, color: INK3, lineHeight: 1.7, margin: "0 0 16px" }}>
                  Tiffanie has a new iMac. Supabase CLI is not installed. Once it's authorized, Claude Code can run the full schema migration without manual SQL.
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                  {["Supabase CLI", "Schema migration", "Session 5"].map(tag => (
                    <span key={tag} style={{
                      fontFamily: FONT, fontWeight: 500, fontSize: 9.5,
                      color: INK2, background: CHIP,
                      border: `1px solid ${RULE}`,
                      padding: "3px 10px", borderRadius: 99,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
              {/* Bottom: dark */}
              <div style={{ background: INK, padding: isMobile ? "16px 16px 18px" : "20px 28px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 5, height: 5, borderRadius: 1, background: "rgba(255,255,255,0.25)" }} />
                  <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)" }}>
                    Also needed
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {[
                    "Review the schema Claude generates: tickets, stores, attachments, ticket_updates",
                    "Guide the MySQL login instruction Tiffanie gives Claude Code",
                    "Validate her written plan — Andre asked her to send it to both of you",
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 10, color: "rgba(255,255,255,0.2)", flexShrink: 0, lineHeight: 1.6, letterSpacing: 0.5 }}>0{i + 1}</span>
                      <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 11.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>{t}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 0.5 }}>For Valera · April 15, 2026</span>
                </div>
              </div>
            </div>

            {/* Fireflies meetings */}
            <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px" }}>
              <SectionLabel label="Fireflies meeting recordings" />
              {([
                {
                  title: "Andre + Valera — Tech Q&A",
                  sub:   "Systems & tech stack discussion",
                  date:  "Apr 2026",
                  href:  "https://app.fireflies.ai/view/Google-Meet-Andre-Valera-Technical-questions-on-systems-tech-stack::01KP64FZBKSRF5YTWEGYT509F7",
                },
              ] as { title: string; sub: string; date: string; href: string }[]).map(({ title, sub, date }) => (
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

            {/* Agreed architecture — moved lower */}
            <div style={{ ...CARD, padding: isMobile ? "18px 16px" : "28px 28px" }}>
              <SectionLabel label="Agreed architecture" />
              <Row label="App hosting"  value="Andre's server (littletree.itgeneration.ca)" pill={<Pill label="Confirmed" kind="solid"   />} />
              <Row label="Database"     value="Supabase — Postgres"                         pill={<Pill label="Confirmed" kind="solid"   />} />
              <Row label="File storage" value="Supabase Storage — photo attachments"        pill={<Pill label="Confirmed" kind="solid"   />} />
              <Row label="Auth"         value="MySQL read-only → Cashiers table"            pill={<Pill label="Confirmed" kind="solid"   />} />
              <Row label="Email"        value="PHP Mailer — already on Andre's server"      pill={<Pill label="Confirmed" kind="solid"   />} />
              <Row label="Automations"  value="Built in PHP — no Make.com or n8n needed"   pill={<Pill label="Confirmed" kind="solid"   />} />
              <Row label="Vercel"       value="Not an option — PHP not supported"           pill={<Pill label="Ruled out" kind="muted"   />} />
              <div style={{ background: CHIP, borderRadius: 12, padding: "14px 16px", marginTop: 16 }}>
                <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: INK3, lineHeight: 1.7, margin: 0 }}>
                  <span style={{ fontWeight: 700, color: INK }}>Andre's rule — </span>
                  Baby steps. Supabase first. Login after. Emails after that. One step done before the next begins.
                </p>
              </div>
            </div>

          </div>
        </div>


        {/* ════════════════════════════════════════
            BUILD SEQUENCE — full width
        ════════════════════════════════════════ */}
        <div style={{ ...CARD, padding: isMobile ? "22px 18px" : "32px 36px" }}>
          <SectionLabel label="Build sequence — baby steps, in order" />
          <Step n={1} status="now"  title="Supabase CLI + Schema"    who="Valera leads today"
            detail="Install Supabase CLI on Tiffanie's Mac. Authorize to her account. Claude Code generates the full schema and pushes the tables directly via CLI. Valera guides the entire setup." />
          <Step n={2} status="next" title="Wire app to Supabase"      who="Tiffanie + Claude Code"
            detail="Claude Code rewrites the PHP data layer to read/write from Supabase Postgres. Photos go to Supabase Storage. Mock data fully replaced with live database calls." />
          <Step n={3} status="later" title="Login → MySQL auth"        who="Tiffanie + Claude Code"
            detail="PHP login queries Andre's MySQL Cashiers table (read-only). CashierType sets the user role. Store dropdown removed — login sets the store automatically via StoreNo." />
          <Step n={4} status="later" title="PHP Mailer email triggers" who="Tiffanie + Andre + Claude Code"
            detail="New ticket → email Andre. Status change → email submitter. 48 hr untouched → escalation. Andre provides PHP Mailer host and SMTP credentials." />
          <Step n={5} status="later" title="Deploy to Andre's server"  who="Tiffanie + Andre"
            detail="PHP files upload to littletree.itgeneration.ca. All data and photos stay in Supabase. End-to-end test: submit ticket → board updates → email fires." />
        </div>


        {/* Footer */}
        <p style={{ textAlign: "center" as const, fontFamily: FONT, fontWeight: 200, fontSize: 10, color: "#BBBBBB", letterSpacing: 2, textTransform: "uppercase" as const, paddingTop: 4 }}>
          Ticket Help Desk Project · Little Tree & Le Roi · AAA Accelerator · April 2026
        </p>

      </div>
    </div>
  )
}
