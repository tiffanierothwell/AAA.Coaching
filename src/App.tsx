import './App.css'

const O = "#E87830";
const G = "#2E7D32";
const B = "#0077B6";
const R = "#C62828";
const SLATE = "#374151";

export default function App() {
  return (
    <div style={{ background: "#F7F7F7", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: "40px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 4, height: 24, background: O, borderRadius: 2 }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const, color: O }}>AAA Coaching · Valera Tumash · April 15, 2026</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", margin: "0 0 10px" }}>
            Venditio POS Help Desk — Where We Are
          </h1>
          <p style={{ color: "#666", margin: 0, fontSize: 14, lineHeight: 1.7, maxWidth: 680 }}>
            A simple briefing for Valera. This reflects everything decided in the April 15 meeting with Andre Boudreault, Valera Tumash, and Tiffanie Rothwell.
          </p>
        </div>

        {/* WHAT IS THIS APP */}
        <Block color={B} title="What is this app?">
          <p style={body}>
            An internal IT help desk ticket system for three store locations owned by Mike David: <strong>Little Tree Gas</strong>, <strong>Le Roi Convenience</strong>, and <strong>Medicine Box</strong>.
          </p>
          <p style={body}>
            Store staff submit a ticket when something breaks with the POS system. The manager sees all tickets in a queue, updates statuses, and resolves issues. Owners get daily reports.
          </p>
        </Block>

        {/* WHERE WE ARE TODAY */}
        <Block color={G} title="Where we are today">
          <Row icon="✅" text="The full app is built in PHP — all screens, all flows, working with mock data" />
          <Row icon="✅" text="4-step ticket submit wizard with photo upload UI" />
          <Row icon="✅" text="Manager board: Urgent Queue → Open → Closed → Archive" />
          <Row icon="✅" text="Ticket detail with status bar: New → In Process → Needs Approval → Completed" />
          <Row icon="✅" text="Operations dashboard with analytics and filters" />
          <div style={{ marginTop: 14, background: "#FFF8F0", border: `1px solid ${O}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ fontWeight: 700, color: O, fontSize: 13 }}>What's missing: </span>
            <span style={{ fontSize: 13, color: "#555" }}>A real database, real file storage, real logins, and real email notifications. Right now everything runs on mock data only.</span>
          </div>
        </Block>

        {/* WHAT WAS DECIDED */}
        <Block color={SLATE} title="What was decided in today's meeting">
          <Decision
            icon="🏗️"
            title="Hosting → Andre's data center"
            detail="The PHP app files will live on Andre's existing server. Vercel is NOT an option — Vercel only supports JavaScript apps, not PHP."
          />
          <Decision
            icon="🗄️"
            title="Database + File Storage → Supabase"
            detail="All ticket records and photo attachments go to Supabase. Not on Andre's server — storing photos there would eat up too much space and cost money."
          />
          <Decision
            icon="🔐"
            title="Login / Authentication → Andre's MySQL (read-only)"
            detail="The login page will check against Andre's existing MySQL database. He already has a table of all store staff with their store assignments and roles. Read-only access only — nothing gets written to MySQL."
          />
          <Decision
            icon="📧"
            title="Email notifications → PHP Mailer"
            detail="PHP Mailer is already installed on Andre's server. He will provide the connection details. No Make.com or external automation platform needed."
          />
          <Decision
            icon="🤖"
            title="No Make.com automations needed"
            detail="Valera confirmed: these are simple linear triggers — form submits, send email, update status. Claude Code builds all of this directly into the PHP app. Simple is the goal."
          />
          <Decision
            icon="👣"
            title="Baby steps — one thing at a time"
            detail="Andre's explicit instruction: finish one step completely before starting the next. Do not try to do everything at once — it will crash and burn."
          />
        </Block>

        {/* NEXT STEPS */}
        <Block color={O} title="Next steps — in this exact order">
          <Step n={1} color={B} title="Supabase CLI Setup" who="Valera leads this with Tiffanie">
            Install the Supabase CLI on Tiffanie's Mac. Authorize it to her Supabase account so Claude Code can create tables and manage the database directly from the terminal. Andre has already sent the Supabase connection details by email.
          </Step>
          <Step n={2} color={O} title="Redesign app for Supabase" who="Tiffanie + Claude Code">
            Tell Claude Code to redesign the app to use Supabase for all data storage — tickets, stores, attachments, status updates. Generate the full database schema and set up file storage for photo uploads.
          </Step>
          <Step n={3} color={SLATE} title="Login page with MySQL" who="Tiffanie + Claude Code">
            Build the login page to authenticate against Andre's MySQL database using the read-only user he provided. The store-selection dropdown on the submit form goes away — login determines the store automatically.
          </Step>
          <Step n={4} color={G} title="Wire up PHP Mailer emails" who="Tiffanie + Claude Code + Andre">
            Add email notifications: new ticket → email Andre, status change → email submitter, 48hr untouched → escalation. Andre provides the PHP Mailer credentials.
          </Step>
          <Step n={5} color={R} title="Deploy to Andre's server" who="Tiffanie + Andre">
            Upload all PHP app files to Andre's data center. App talks to Supabase for data, MySQL for login. Test the full flow live: submit ticket → manager sees it → email fires.
          </Step>
        </Block>

        {/* VALERA'S ROLE */}
        <Block color={G} title="What Tiffanie needs from Valera">
          <Row icon="1️⃣" text="Help install and authorize the Supabase CLI on the new iMac — this unlocks everything" />
          <Row icon="2️⃣" text="Review the database schema Claude Code generates to make sure it covers everything" />
          <Row icon="3️⃣" text="Guide the instruction Tiffanie gives Claude Code for the MySQL login page" />
          <Row icon="4️⃣" text="Validate Tiffanie's written project plan before she starts — Andre asked her to write it out and send to both of you" />
        </Block>

        {/* TECH STACK */}
        <Block color={SLATE} title="Confirmed tech stack">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "App language", value: "PHP", note: "Do not change this", ok: true },
              { label: "App hosting", value: "Andre's server", note: "littletree.itgeneration.ca", ok: true },
              { label: "Database", value: "Supabase", note: "Postgres — tickets & records", ok: true },
              { label: "File storage", value: "Supabase Storage", note: "Photo attachments", ok: true },
              { label: "Authentication", value: "MySQL (read-only)", note: "Andre's Cashiers table", ok: true },
              { label: "Email", value: "PHP Mailer", note: "Already on Andre's server", ok: true },
              { label: "Automations", value: "Built into PHP", note: "No Make.com needed", ok: true },
              { label: "Vercel", value: "❌ Not used", note: "PHP not supported", ok: false },
              { label: "Make.com", value: "❌ Not used", note: "Not needed", ok: false },
            ].map((item) => (
              <div key={item.label} style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", border: "1px solid #eee" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: item.ok ? "#111" : R, marginBottom: 2 }}>{item.value}</div>
                <div style={{ fontSize: 12, color: "#999" }}>{item.note}</div>
              </div>
            ))}
          </div>
        </Block>

        {/* FOOTER */}
        <div style={{ textAlign: "center" as const, marginTop: 40, fontSize: 11, color: "#ccc" }}>
          MJM Ventures · Venditio POS Help Desk · AAA Coaching · April 2026
        </div>

      </div>
    </div>
  );
}

// ── Reusable Components ──────────────────────────────────────

const body: React.CSSProperties = { fontSize: 14, color: "#444", lineHeight: 1.7, margin: "0 0 8px" };

function Block({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111", margin: 0 }}>{title}</h2>
      </div>
      <div style={{ height: 2, background: `linear-gradient(to right, ${color}, transparent)`, marginBottom: 14, borderRadius: 1 }} />
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#fff", borderRadius: 10, padding: "11px 14px", border: "1px solid #eee" }}>
      <span style={{ fontSize: 16, lineHeight: 1.4 }}>{icon}</span>
      <span style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function Decision({ icon, title, detail }: { icon: string; title: string; detail: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "13px 16px", border: "1px solid #eee" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{title}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.6 }}>{detail}</p>
    </div>
  );
}

function Step({ n, color, title, who, children }: { n: number; color: string; title: string; who: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #eee" }}>
      <div style={{ background: color, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 800, fontSize: 13, borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{title}</span>
        </div>
        <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>{who}</span>
      </div>
      <p style={{ margin: 0, padding: "12px 16px", fontSize: 13, color: "#444", lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}
