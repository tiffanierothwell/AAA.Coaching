import './App.css'

// ── Design tokens ─────────────────────────────────────────────
const PINK   = "#FF1493"
const BLUE   = "#3B82F6"
const GREEN  = "#10B981"
const AMBER  = "#F59E0B"
const RED    = "#EF4444"
const PURPLE = "#A855F7"

// ── Glass surface styles ──────────────────────────────────────
const glass = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 20,
}

const glassInner = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
}

// ── Pill ─────────────────────────────────────────────────────
function Pill({ label, type }: { label: string; type: "done" | "pending" | "blocked" | "yours" | "neutral" }) {
  const map = {
    done:    { color: GREEN,  bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.3)"  },
    pending: { color: AMBER,  bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.3)"  },
    blocked: { color: RED,    bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.3)"   },
    yours:   { color: PINK,   bg: "rgba(255,20,147,0.15)",  border: "rgba(255,20,147,0.3)"  },
    neutral: { color: "#aaa", bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.15)" },
  }[type]
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: 1.2,
      textTransform: "uppercase" as const,
      padding: "3px 9px", borderRadius: 20,
      background: map.bg, color: map.color,
      border: `1px solid ${map.border}`,
      whiteSpace: "nowrap" as const,
    }}>
      {label}
    </span>
  )
}

// ── Row ───────────────────────────────────────────────────────
function Row({ label, value, pill }: { label: string; value: string; pill?: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "9px 0",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      gap: 12,
    }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", minWidth: 110 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)", flex: 1 }}>{value}</span>
      {pill}
    </div>
  )
}

// ── Glass card ────────────────────────────────────────────────
function Card({ title, accent, children, glow }: {
  title: string; accent: string; children: React.ReactNode; glow?: boolean
}) {
  return (
    <div style={{
      ...glass,
      marginBottom: 16,
      position: "relative" as const,
      overflow: "hidden",
      boxShadow: glow
        ? `0 0 40px rgba(255,20,147,0.12), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
        : `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
    }}>
      {/* top edge highlight */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

      {/* header */}
      <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 3, height: 14, background: accent, borderRadius: 2, boxShadow: `0 0 8px ${accent}` }} />
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.8, textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)" }}>
          {title}
        </span>
      </div>

      <div style={{ padding: "0 20px 16px" }}>{children}</div>
    </div>
  )
}

// ── Step ─────────────────────────────────────────────────────
function Step({ n, title, who, detail, status }: {
  n: number; title: string; who: string; detail: string
  status: "done" | "pending" | "blocked" | "yours"
}) {
  const accent = { done: GREEN, pending: AMBER, blocked: RED, yours: PINK }[status]
  return (
    <div style={{
      display: "flex", gap: 14, padding: "14px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
        background: `rgba(${hexToRgb(accent)},0.15)`,
        border: `1px solid rgba(${hexToRgb(accent)},0.3)`,
        color: accent, fontWeight: 800, fontSize: 13,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 12px rgba(${hexToRgb(accent)},0.2)`,
        marginTop: 2,
      }}>{n}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" as const }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.9)" }}>{title}</span>
          <Pill label={who} type={status} />
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{detail}</p>
      </div>
    </div>
  )
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

// ── Main ─────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0A0A18 0%, #0D0820 40%, #080C1A 100%)",
      fontFamily: "'Inter', 'SF Pro Display', 'Segoe UI', sans-serif",
      padding: "40px 24px 60px",
      position: "relative" as const,
      overflow: "hidden",
    }}>

      {/* Background glow orbs */}
      <div style={{ position: "fixed", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,20,147,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -200, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" as const }}>

        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)" }}>
              AAA Accelerator · Coaching Brief · April 15, 2026
            </span>
          </div>

          <div style={{
            ...glass,
            padding: "24px 28px",
            boxShadow: `0 0 60px rgba(255,20,147,0.08), 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)`,
            position: "relative" as const,
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${PINK}44, transparent)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: -0.5 }}>
                  Little Tree — POS Help Desk
                </h1>
                <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: 13 }}>
                  Tiffanie Rothwell &nbsp;·&nbsp; Client of Mike David (MJM Ventures)
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "flex-start", paddingTop: 4 }}>
                <Pill label="✓ App Built" type="done" />
                <Pill label="⚠ Backend Missing" type="blocked" />
                <Pill label="★ Next: Supabase CLI" type="yours" />
              </div>
            </div>
          </div>
        </div>

        {/* TWO COLUMN */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* LEFT */}
          <div>
            <Card title="Project in one sentence" accent={BLUE}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "4px 0 0" }}>
                Internal IT ticketing for 3 gas station / convenience store locations. Staff submit → Manager triages → Owner gets reports.{" "}
                <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>No customer-facing component.</span>
              </p>
            </Card>

            <Card title="What exists today" accent={GREEN}>
              <Row label="Language"        value="PHP + HTML/CSS"                       pill={<Pill label="Don't change" type="neutral" />} />
              <Row label="All screens"     value="Submit, Board, Detail, Analytics"     pill={<Pill label="Done" type="done" />} />
              <Row label="Submit wizard"   value="4-step form + photo upload UI"        pill={<Pill label="Done" type="done" />} />
              <Row label="Manager board"   value="Urgent → Open → Closed → Archive"    pill={<Pill label="Done" type="done" />} />
              <Row label="Status flow"     value="New → In Process → Approval → Done"  pill={<Pill label="Done" type="done" />} />
              <Row label="Database"        value="Mock data only — not connected"       pill={<Pill label="Missing" type="blocked" />} />
              <Row label="File storage"    value="UI exists, no place to save photos"   pill={<Pill label="Missing" type="blocked" />} />
              <Row label="Auth / login"    value="No real login yet"                    pill={<Pill label="Missing" type="blocked" />} />
              <Row label="Emails"          value="Not wired up yet"                     pill={<Pill label="Missing" type="blocked" />} />
            </Card>

            <Card title="People" accent={PURPLE}>
              <Row label="Tiffanie"  value="Project owner — builds with Claude Code, not a developer" />
              <Row label="Andre B."  value="IT lead, 10+ yrs with Mike. Owns the server + MySQL DB. MySQL = yes, Supabase support = no." />
              <Row label="Mike D."   value="Business owner — approves tickets, wants daily reports" />
              <Row label="Valera"    value="You — coaching Tiffanie through the technical build" />
            </Card>
          </div>

          {/* RIGHT */}
          <div>
            <Card title="Agreed architecture" accent={PURPLE}>
              <Row label="App hosting"   value="Andre's data center"              pill={<Pill label="Confirmed" type="done" />} />
              <Row label="Database"      value="Supabase (Postgres)"              pill={<Pill label="Confirmed" type="done" />} />
              <Row label="File storage"  value="Supabase Storage"                pill={<Pill label="Confirmed" type="done" />} />
              <Row label="Auth"          value="MySQL read-only → Cashiers table" pill={<Pill label="Confirmed" type="done" />} />
              <Row label="Email"         value="PHP Mailer — already on server"   pill={<Pill label="Confirmed" type="done" />} />
              <Row label="Automations"   value="Built into PHP — no Make / n8n"  pill={<Pill label="Confirmed" type="done" />} />
              <Row label="Vercel"        value="Not an option — PHP not supported" pill={<Pill label="Ruled out" type="blocked" />} />
              <div style={{ ...glassInner, padding: "10px 14px", marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  <span style={{ color: AMBER, fontWeight: 700 }}>Andre's rule:</span>{" "}
                  Baby steps. Supabase first. Login after. Emails after that. Do not do everything at once.
                </p>
              </div>
            </Card>

            <Card title="Credentials status" accent={AMBER}>
              <Row label="Supabase"    value="Connection details received from Andre" pill={<Pill label="In hand" type="done" />} />
              <Row label="MySQL"       value="Read-only user + Cashiers table query"  pill={<Pill label="In hand" type="done" />} />
              <Row label="PHP Mailer"  value="Andre to provide in next exchange"      pill={<Pill label="Pending" type="pending" />} />
              <div style={{ ...glassInner, padding: "10px 14px", marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  <span style={{ color: AMBER, fontWeight: 700 }}>Note:</span>{" "}
                  Credentials stored privately — not published here. Tiffanie has them in email from Andre.
                </p>
              </div>
            </Card>

            <Card title="What Tiffanie needs from you" accent={PINK} glow>
              <div style={{ ...glassInner, padding: "14px 16px", marginTop: 8, border: `1px solid rgba(255,20,147,0.2)`, boxShadow: `inset 0 0 20px rgba(255,20,147,0.05)` }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: PINK, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 8 }}>🎯 This session's focus</div>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.65, fontWeight: 600 }}>
                  Walk Tiffanie through installing Supabase CLI on her new iMac and authorizing it — so Claude Code can create the schema and tables directly.
                </p>
              </div>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {[
                  "Review the schema Claude Code generates (tickets, stores, attachments, ticket_updates)",
                  "Guide the MySQL login page instruction for Claude Code",
                  "Validate her written step-by-step plan — Andre asked her to write it out and send to you both",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
                    <span style={{ color: PINK, flexShrink: 0 }}>→</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* BUILD SEQUENCE — FULL WIDTH */}
        <Card title="Build sequence — baby steps, in order" accent={AMBER}>
          <Step n={1} title="Supabase CLI + Schema"      who="Valera leads"               status="yours"
            detail="Install Supabase CLI on Tiffanie's Mac. Authorize to Supabase account. Claude Code generates full schema and creates tables via CLI." />
          <Step n={2} title="Redesign app for Supabase"  who="Tiffanie + Claude Code"     status="pending"
            detail="Claude Code rewrites the PHP data layer to read/write from Supabase. Photo uploads go to Supabase Storage. Mock data replaced with real DB calls." />
          <Step n={3} title="Login page → MySQL auth"    who="Tiffanie + Claude Code"     status="pending"
            detail="PHP login queries Andre's MySQL Cashiers table (read-only). CashierType sets role. Store dropdown removed — login sets store from StoreNo." />
          <Step n={4} title="PHP Mailer email triggers"  who="Tiffanie + Andre + Claude"  status="pending"
            detail="New ticket → email Andre. Status change → email submitter. 48hr untouched → escalation. Andre provides PHP Mailer credentials." />
          <Step n={5} title="Deploy to Andre's server"   who="Tiffanie + Andre"           status="pending"
            detail="PHP app files go to littletree.itgeneration.ca. Data and photos stay in Supabase. Test full flow end-to-end." />
        </Card>

        <div style={{ textAlign: "center" as const, fontSize: 10, color: "rgba(255,255,255,0.15)", paddingTop: 8, letterSpacing: 1 }}>
          MJM VENTURES · LITTLE TREE POS HELP DESK · AAA ACCELERATOR · APRIL 2026
        </div>

      </div>
    </div>
  )
}
