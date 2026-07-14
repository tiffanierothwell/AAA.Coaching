// Single source of truth for the "This Week" progress log + the Archive.
// Imported by App.tsx (the on-site section + archive accordion) AND by
// scripts/gen-this-week.mjs (which pre-renders the standalone, public,
// bot-readable /this-week.html). Plain data only (no JSX).
//
// NEWEST FIRST. WEEKLY_LOG[0] is the CURRENT week (shown as "This week");
// WEEKLY_LOG[1..] are archived weeks (shown in the Archive accordion).
// Rollover happens on Sunday: prepend a fresh entry for the new week and the
// prior current week becomes the top of the archive. See scripts/rollover-week.mjs.

export const WEEKLY_LOG = [
  {
    dates: "Week of July 12, 2026",
    title: "Voice agents, the first email bot, and mobile",
    intro: "A focused week with two priorities for Mike moving in parallel — the Voice Agents Project and the email bots — plus I made the whole dashboard work properly on a phone.",
    attachments: [
      { label: "Voice Agent Project · Summary", sub: "PDF · Executive summary for Mike", href: "voice-agent-project-report.pdf" },
      { label: "Teemu Meeting · Transcript", sub: "PDF", href: "teemu-voice-agents-meeting-transcript.pdf" },
    ],
    highlights: [
      { lead: "Voice Agents Project.", body: "Coming out of the meeting with Teemu, I scoped a personalized AI voice-agent system that calls Mike's existing loyalty customers (roughly 102,000, with purchase history back to 2017) for customer-care and re-engagement — not cold calling. The plan: Retell AI for the voice agent plus Twilio for telephony, a Python layer that analyzes each call and writes the outcome back to the CRM, about $0.15 per active call minute (~$450 for a 1,000-customer pilot), a custom CRM on AIOS + Supabase as the long-term home, and a proper Canadian/Quebec compliance review plus a security audit before anything launches. Full executive summary and the meeting transcript are attached above." },
      { lead: "Filter Phil — the first email bot, live.", body: "I set up @Filter_Phil_bot under the AIOS project. He watches my Gmail around the clock and only pings me on Telegram when an email genuinely needs me — a real person, money, a deadline, a contract. Spam, promotions and social noise never get through. A small Google Apps Script checks new mail every 5 minutes and Claude makes the judgment call; when it's unsure, he stays silent. He's on the org chart now, and more email automation continues from here." },
      { lead: "Made the dashboard mobile friendly.", body: "I went through the whole dashboard at phone width and tightened it up — the biggest fix was the coaching-sessions calendar, which now stacks one month per row with big, tappable day circles instead of four cramped columns. Confirmed there's no sideways scrolling anywhere and every section reads cleanly on a phone." },
    ],
    wrapUp: "Two tracks moving for Mike — voice agents (Teemu to send a proposal and a demo) and the email bots (Filter Phil live, more to come) — and the dashboard itself now looks right on a phone.",
  },
  {
    dates: "Week of July 6, 2026",
    title: "Building the AI Operating Layer",
    intro: "This was a big week, maybe the biggest one yet. I went from having a dashboard to having an actual system that runs the companies, with a team of AI “employees” doing the repetitive work in the background. I'm genuinely proud of what I shipped.",
    highlights: [
      { lead: "The entire “Mike's AIOS” demo.", body: "I built the full multi-page demo that pitches the MJM 360 Command Center — One Dashboard, Daily Brief & Meeting Prep, Reports, Categories of Improvement, the Project & Task board, Social Media, Other Possibilities, Next Steps, and The Architecture — plus the AI-Employee capabilities library and the cinematic “The Org, Amplified” walkthrough. This is what went in front of the MJM Group on demo day." },
      { lead: "The data-extraction build-out.", body: "I built the pipeline that pulls the live Little Tree Gas numbers into the dashboard: a secure /api proxy that paginates and aggregates server-side (the database caps rows and disables aggregates), so the CEO Pulse dashboard shows real, current data — today's sales, month-to-date, trends, margins, loyalty, fuel — without the service key ever touching the browser. After the MySQL-to-Supabase parity audit came back clean (8M+ rows, zero missing), I unpinned it from the fallback and made it fully live." },
    ],
    builtLead: "I also stood up a full bot team, each one with a real job:",
    bots: [
      { name: "Progress Pete", initials: "PP", role: "Pulls the entire week together every Friday and delivers a clean one-page report to Mike: the wins, Leah's day-by-day log, every project's tasks with my own progress notes, and how many hours Mike and I each spent in meetings. He posts it to the team with a share link and archives it on the dashboard. At 1 PM he asks me for my project update; by 5 PM the report is done." },
      { name: "Catch-all Cal", initials: "CC", role: "Reads the group and files real task requests to the right person's board automatically — and if someone forgets a due date, he sets the next business day so nothing lands dateless." },
      { name: "Checklist Chuck", initials: "CH", role: "Runs the daily rhythm: the morning brief and the end-of-day wrap." },
      { name: "Shift Sheila", initials: "SS", role: "Checks in with Leah each afternoon and logs her day, which feeds straight into Pete's Friday report." },
      { name: "Cory the Coordinator", initials: "CO", role: "Little Tree Capital's own coordinator. He manages the tasks on the LTC dashboard, keeps the board current and honest, and rolls each week into a clean report, so Mike always has a clear read on where Capital stands without asking. He also updates the meeting agenda and makes sure Tiffanie gets all of her ideas onto the dashboard." },
    ],
    coordinators: "I also mapped out coordinators for the other companies — Cory for Capital, Marty for Pay, Diesel Dan for Fuel — so the same model scales across the portfolio.",
    alongside: "Alongside the bots, I built my own command page (calendar, dashboards, an animated org chart showing every company and every bot, a resources library, and walkthrough videos), wrote a “Bot Factory” playbook so any new bot follows the same proven process, and set up the database and reporting behind all of it.",
    walls: [
      { lead: "The scheduling almost bit me.", body: "I first had Pete run on the built-in scheduler, and I caught that it runs late and skips. The lesson was clear: never trust that as the real trigger. I moved everything to a reliable external timer — the same way the other bots run — and made the report idempotent so it can never send twice." },
      { lead: "Cal wasn't catching Mike's requests.", body: "Mike asked Leah to order something in the group and it never became a task. Two problems: the bot only reacted to keyword phrases, and privacy settings meant it couldn't even see normal messages. So I rebuilt it to read the room, with an AI gate that decides whether a message is actually a task before filing it, and I turned the privacy setting off so it can see the conversation." },
      { lead: "Revoking a token quietly broke a bot.", body: "When I rotated a token, it wiped the bot's connection without warning. I learned I have to re-register that connection every time — and I did." },
      { lead: "The demo asked for a password on mobile when it shouldn't have.", body: "It worked on desktop but not on my phone. The cause was that mobile browsers behave differently, so a couple of files were getting blocked. I fixed the specific files and hardened the whole gate so only real page visits ever ask for a login, never background assets." },
      { lead: "My calendar isn't connected yet.", body: "It needs an admin setting turned on at the account level. Rather than wait, I built a working mockup of my week so the page still feels complete — and it'll swap to live the moment that setting is enabled." },
      { lead: "I pushed the design harder when the first versions felt flat.", body: "I wasn't happy with a couple of passes and reworked them until they actually looked like something I'm proud to show." },
    ],
    wrapUp: "The foundation is real and running. The bots handle the daily and weekly load, the reporting reaches Mike on a predictable rhythm, and everything is documented so it can scale to the next company without starting over. This week turned a nice-looking dashboard into an operating system.",
  },
]
