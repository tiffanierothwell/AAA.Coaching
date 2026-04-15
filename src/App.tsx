import './App.css'

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
  const s: Record<PillKind, React.CSSProperties> = {
    solid:   { background: INK,   color: "#fff", border: `1px solid ${INK}` },
    outline: { background: "transparent", color: INK2, border: "1px solid rgba(0,0,0,0.25)" },
    muted:   { background: CHIP, color: INK3,  border: `1px solid ${RULE}` },
  }
  return (
    <span style={{
      fontFamily: FONT, fontSize: 8, fontWeight: 800, letterSpacing: 1.5,
      textTransform: "uppercase" as const,
      padding: "3px 9px", borderRadius: 99,
      whiteSpace: "nowrap" as const, ...s[kind],
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
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "9px 0", borderBottom: `1px solid ${RULE}`,
    }}>
      <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 300, color: INK3, minWidth: 112, flexShrink: 0, letterSpacing: 0.2 }}>{label}</span>
      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: INK2, flex: 1, lineHeight: 1.4 }}>{value}</span>
      {pill}
    </div>
  )
}

// ── Waving figure ─────────────────────────────────────────────
function WavingFigure({ size = 150 }: { size?: number }) {
  const sw = 2.8
  return (
    <svg viewBox="0 0 130 205" width={size} height={size * 1.37} style={{ display: "block" }}>
      {/* Head */}
      <circle cx="65" cy="46" r="25" fill="#E8E8E8" stroke={INK} strokeWidth={sw}/>
      {/* Glasses */}
      <rect x="45" y="38" width="17" height="12" rx="6" fill="none" stroke={INK} strokeWidth="2"/>
      <rect x="65" y="38" width="17" height="12" rx="6" fill="none" stroke={INK} strokeWidth="2"/>
      <line x1="62" y1="44" x2="65" y2="44" stroke={INK} strokeWidth="2"/>
      {/* Eyes */}
      <circle cx="53.5" cy="44" r="3" fill={INK}/>
      <circle cx="73.5" cy="44" r="3" fill={INK}/>
      {/* Smile */}
      <path d="M 54 54 Q 65 63 76 54" fill="none" stroke={INK} strokeWidth={sw} strokeLinecap="round"/>
      {/* Neck */}
      <line x1="65" y1="71" x2="65" y2="84" stroke={INK} strokeWidth={sw}/>
      {/* Body */}
      <path d="M 37 84 Q 65 79 93 84 L 95 140 Q 65 144 35 140 Z" fill="#E8E8E8" stroke={INK} strokeWidth={sw} strokeLinejoin="round"/>
      {/* Left arm down */}
      <path d="M 38 92 Q 22 114 20 134" fill="none" stroke={INK} strokeWidth={sw} strokeLinecap="round"/>
      <circle cx="19" cy="138" r="7" fill="#E8E8E8" stroke={INK} strokeWidth="2"/>
      {/* Right arm waving */}
      <path d="M 92 92 Q 110 68 114 44" fill="none" stroke={INK} strokeWidth={sw} strokeLinecap="round"/>
      <circle cx="115" cy="38" r="10" fill="#E8E8E8" stroke={INK} strokeWidth="2"/>
      {/* Fingers */}
      <line x1="115" y1="28" x2="112" y2="21" stroke={INK} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="119" y1="28" x2="119" y2="20" stroke={INK} strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="123" y1="30" x2="126" y2="23" stroke={INK} strokeWidth="1.6" strokeLinecap="round"/>
      {/* Legs */}
      <line x1="51" y1="140" x2="44" y2="182" stroke={INK} strokeWidth={sw} strokeLinecap="round"/>
      <line x1="79" y1="140" x2="86" y2="182" stroke={INK} strokeWidth={sw} strokeLinecap="round"/>
      {/* Feet */}
      <path d="M 44 182 Q 32 185 30 182 Q 32 177 44 178" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"/>
      <path d="M 86 182 Q 98 185 100 182 Q 98 177 86 178" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"/>
    </svg>
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
  { label: "Supabase CLI",  sub: "TODAY · Session 2",   status: "now"   },
  { label: "Connect DB",    sub: "PHP + Supabase",      status: "later" },
  { label: "Login Auth",    sub: "MySQL · Cashiers",    status: "later" },
  { label: "Email Alerts",  sub: "PHP Mailer",          status: "later" },
  { label: "Launch",        sub: "Andre's server",      status: "later" },
]

function ProgressTimeline() {
  const total    = MILESTONES.length
  const doneCount = MILESTONES.filter(m => m.status === "done").length
  const nowIdx   = MILESTONES.findIndex(m => m.status === "now")
  // line fills up to centre of current step
  const halfStep = 100 / total / 2
  const fillPct  = nowIdx >= 0 ? halfStep + (nowIdx / (total - 1)) * (100 - 2 * halfStep) : 100

  return (
    <div style={{ ...CARD, padding: "26px 32px 28px" }}>

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
          top: 27, left: `${halfStep}%`, right: `${halfStep}%`,
          height: 2, background: RULE, borderRadius: 99, zIndex: 0,
        }}/>
        {/* Black fill */}
        <div style={{
          position: "absolute" as const,
          top: 27, left: `${halfStep}%`,
          width: `${fillPct - halfStep}%`,
          height: 2, background: INK, borderRadius: 99, zIndex: 1,
        }}/>

        {/* Step nodes */}
        <div style={{ display: "flex", position: "relative" as const, zIndex: 2 }}>
          {MILESTONES.map((m, i) => {
            const done  = m.status === "done"
            const now   = m.status === "now"
            const later = m.status === "later"
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 0 }}>

                {/* "TODAY" pin above current */}
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

                {/* Circle */}
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: done ? INK : "#fff",
                  border: done ? `2px solid ${INK}` : now ? `2.5px solid ${INK}` : `2px solid #D8D8D8`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: now ? "0 0 0 5px rgba(0,0,0,0.07)" : "none",
                }}>
                  {done && (
                    <svg width="11" height="11" viewBox="0 0 12 12">
                      <polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {now && <div style={{ width: 8, height: 8, borderRadius: "50%", background: INK }}/>}
                  {later && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D8D8D8" }}/>}
                </div>

                {/* Labels */}
                <div style={{ marginTop: 9, textAlign: "center" as const, lineHeight: 1.35, padding: "0 2px" }}>
                  <div style={{
                    fontFamily: FONT, fontSize: 9.5,
                    fontWeight: now ? 800 : done ? 600 : 400,
                    color: now ? INK : done ? INK2 : INK3,
                    letterSpacing: now ? 0.2 : 0,
                  }}>{m.label}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 8.5, color: now ? INK3 : "#C0C0C0", marginTop: 2, letterSpacing: 0.2 }}>{m.sub}</div>
                </div>
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
          <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "#C0C0C0", letterSpacing: 0.5 }}>Project start</span>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 9, color: INK3 }}>
            {total - doneCount - 1} steps remaining after today
          </span>
          <span style={{ fontFamily: FONT, fontWeight: 200, fontSize: 9, color: "#C0C0C0", letterSpacing: 0.5 }}>Launch</span>
        </div>
      </div>

    </div>
  )
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#F2F2F2", padding: "40px 28px 80px", fontFamily: FONT }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 14 }}>


        {/* ════════════════════════════════════════
            HERO CARD — greeting + figure + stats
        ════════════════════════════════════════ */}
        <div style={{ ...CARD }}>

          {/* Top: greeting + figure */}
          <div style={{ display: "flex", alignItems: "stretch", minHeight: 240 }}>

            {/* Greeting */}
            <div style={{ flex: 1, padding: "36px 40px", display: "flex", flexDirection: "column" as const, justifyContent: "space-between" }}>
              {/* Meta badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" }}>
                {/* AAA Accelerator logo badge */}
                <span style={{
                  fontFamily: FONT, fontSize: 9, fontWeight: 800,
                  letterSpacing: 1.5, textTransform: "uppercase" as const,
                  padding: "5px 14px", borderRadius: 99,
                  background: INK,
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}>
                  <span style={{ color: "#FF1493", letterSpacing: 0, fontWeight: 900, fontSize: 11 }}>///</span>
                  <span style={{ color: "#ffffff" }}>Accelerator</span>
                </span>
                {["April 15, 2026", "Session 2"].map((badge) => (
                  <span key={badge} style={{
                    fontFamily: FONT, fontSize: 9, fontWeight: 300,
                    letterSpacing: 0.5, textTransform: "uppercase" as const,
                    padding: "4px 12px", borderRadius: 99,
                    background: CHIP, color: INK3,
                  }}>{badge}</span>
                ))}
              </div>

              {/* Name */}
              <div>
                <p style={{ fontFamily: FONT, fontWeight: 200, fontSize: 16, color: INK3, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" as const }}>
                  It's good to see you again
                </p>
                <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, color: INK, letterSpacing: -2.5, lineHeight: 0.95, margin: 0 }}>
                  Hi<br/>Valera!
                </h1>
              </div>

              {/* Sub */}
              <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: INK3, lineHeight: 1.7, maxWidth: 340, margin: 0 }}>
                Here's the complete picture for today's coaching session — <strong style={{ fontWeight: 600, color: INK2 }}>Little Tree POS Help Desk</strong>, MJM Ventures.
              </p>
            </div>

            {/* Figure panel */}
            <div style={{
              width: 220, flexShrink: 0,
              background: CHIP,
              borderLeft: `1px solid ${RULE}`,
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              padding: "0 20px",
              backgroundImage: "radial-gradient(circle, #DADADA 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}>
              <WavingFigure size={160} />
            </div>
          </div>

          {/* Bottom: stat strip */}
          <div style={{ borderTop: `1px solid ${RULE}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
            {([
              { n: "5",  label: "Screens built"  },
              { n: "0",  label: "DB connected"   },
              { n: "1",  label: "Today's goal"   },
              { n: "3",  label: "Store locations" },
            ] as { n: string; label: string }[]).map(({ n, label }, i) => (
              <div key={label} style={{
                padding: "20px 0", textAlign: "center" as const,
                borderLeft: i > 0 ? `1px solid ${RULE}` : "none",
              }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: INK, letterSpacing: -2, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: FONT, fontWeight: 200, fontSize: 10, color: INK3, letterSpacing: 1.2, textTransform: "uppercase" as const, marginTop: 5 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>


        {/* ════════════════════════════════════════
            PROGRESS TIMELINE
        ════════════════════════════════════════ */}
        <ProgressTimeline />


        {/* ════════════════════════════════════════
            2-COL CONTENT GRID
        ════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          {/* ── LEFT COL ── */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>

            {/* Project brief */}
            <div style={{ ...CARD, padding: "28px 28px" }}>
              <SectionLabel label="Project in one sentence" />
              <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 13, color: INK2, lineHeight: 1.8, margin: 0 }}>
                Internal IT ticketing system for 3 gas station / convenience stores. Staff submit tickets when the POS breaks → Manager triages → Owner receives daily reports.
                <span style={{ fontWeight: 700, color: INK }}> Fully internal. No customer-facing layer.</span>
              </p>
            </div>

            {/* What exists today */}
            <div style={{ ...CARD, padding: "28px 28px", flex: 1 }}>
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
            <div style={{ ...CARD, padding: "28px 28px" }}>
              <SectionLabel label="People" />
              <Row label="Tiffanie"  value="Project owner — builds with Claude Code, not a developer" />
              <Row label="Andre B."  value="IT lead, 10+ yrs. Owns server + MySQL DB. Supabase ✗" />
              <Row label="Mike D."   value="Business owner — approves tickets, wants daily reports" />
              <Row label="Valera"    value="You — coaching Tiffanie through the technical build" />
            </div>
          </div>

          {/* ── RIGHT COL ── */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>

            {/* Agreed architecture */}
            <div style={{ ...CARD, padding: "28px 28px" }}>
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

            {/* Credentials */}
            <div style={{ ...CARD, padding: "28px 28px" }}>
              <SectionLabel label="Credentials status" />
              <Row label="Supabase"    value="Connection details received from Andre"  pill={<Pill label="In hand" kind="solid"   />} />
              <Row label="MySQL"       value="Read-only user + Cashiers table query"   pill={<Pill label="In hand" kind="solid"   />} />
              <Row label="PHP Mailer"  value="Andre to provide in next exchange"       pill={<Pill label="Pending" kind="outline" />} />
              <div style={{ background: CHIP, borderRadius: 12, padding: "14px 16px", marginTop: 16 }}>
                <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: INK3, lineHeight: 1.7, margin: 0 }}>
                  <span style={{ fontWeight: 700, color: INK }}>Note — </span>
                  All credentials stored privately. Tiffanie has them directly from Andre via email.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* ════════════════════════════════════════
            FOCUS BANNER — dark, full-width
        ════════════════════════════════════════ */}
        <div style={{ ...CARD, background: INK, boxShadow: "none" }}>
          <div style={{ display: "flex", alignItems: "stretch" }}>

            {/* Label stripe */}
            <div style={{
              width: 52, flexShrink: 0,
              background: "rgba(255,255,255,0.05)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: FONT, fontWeight: 800, fontSize: 8, letterSpacing: 2.5,
                textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)",
                transform: "rotate(-90deg)", whiteSpace: "nowrap" as const,
              }}>For Valera</span>
            </div>

            {/* Left: focus */}
            <div style={{ flex: 1, padding: "32px 36px", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <div style={{ width: 4, height: 4, background: "#fff", borderRadius: 1 }} />
                <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)" }}>This session's focus</span>
              </div>
              <h2 style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: "#fff", lineHeight: 1.4, letterSpacing: -0.5, margin: "0 0 12px" }}>
                Walk Tiffanie through Supabase CLI — install, authorize, and let Claude Code create the schema directly from terminal.
              </h2>
              <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
                Tiffanie has a new iMac. Supabase CLI is not installed. Once it's authorized, Claude Code can run the full schema migration without manual SQL.
              </p>
            </div>

            {/* Right: also needed */}
            <div style={{ width: 300, flexShrink: 0, padding: "32px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <div style={{ width: 4, height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 1 }} />
                <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" as const, color: "rgba(255,255,255,0.25)" }}>Also needed</span>
              </div>
              {[
                "Review the schema Claude generates: tickets, stores, attachments, ticket_updates",
                "Guide the MySQL login instruction Tiffanie gives Claude Code",
                "Validate her written plan — Andre asked her to send it to both of you",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 14, color: "rgba(255,255,255,0.2)", lineHeight: 1, flexShrink: 0, marginTop: 1 }}>0{i + 1}</span>
                  <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{t}</p>
                </div>
              ))}
            </div>

          </div>
        </div>


        {/* ════════════════════════════════════════
            BUILD SEQUENCE — full width
        ════════════════════════════════════════ */}
        <div style={{ ...CARD, padding: "32px 36px" }}>
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
          MJM Ventures · Little Tree POS Help Desk · AAA Accelerator · April 2026
        </p>

      </div>
    </div>
  )
}
