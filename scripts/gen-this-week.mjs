// Pre-renders the "This Week" progress log into a standalone, static, public
// page at public/this-week.html — same look as the on-site section, but fully
// rendered in the HTML so a bot can read it with a plain fetch (no JS, no auth).
// Runs automatically before every build (npm "prebuild"). Single source of
// truth for the content is src/data/weeklyLog.js — this renders WEEKLY_LOG[0]
// (the current week). Every section is optional and only renders when present.

import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { WEEKLY_LOG } from '../src/data/weeklyLog.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Design tokens — kept identical to src/App.tsx.
const INK = '#0A0A0A', INK2 = '#4A4A4A', INK3 = '#9A9A9A'
const RULE = '#E8E8E8', CHIP = '#F0F0F0', PINK = '#FF1493'
const SH = '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)'
const FONT = "'Montserrat','Inter',sans-serif"

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const w = WEEKLY_LOG[0]

const attachments = (w.attachments ?? []).map((a, i) => `
    <a href="/${esc(a.href)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:9px;background:${i === 0 ? INK : '#fff'};color:${i === 0 ? '#fff' : INK};border:${i === 0 ? 'none' : `1.5px solid ${INK}`};font-weight:800;font-size:11px;letter-spacing:.5px;text-transform:uppercase;padding:12px 17px;border-radius:10px;text-decoration:none">&#9636; ${esc(a.label)}</a>`).join('')

const highlights = (w.highlights ?? []).map(h => `
    <div style="display:flex;gap:12px;padding:14px 16px;border-radius:12px;background:#fff;border:1.5px solid ${INK}">
      <div style="width:22px;height:22px;border-radius:50%;flex-shrink:0;background:${INK};color:#fff;font-weight:900;font-size:11px;display:flex;align-items:center;justify-content:center;margin-top:1px">★</div>
      <div><span style="font-weight:800;font-size:13.5px;color:${INK}">${esc(h.lead)} </span><span style="font-weight:300;font-size:12.5px;color:${INK2};line-height:1.65">${esc(h.body)}</span></div>
    </div>`).join('')

const bots = (w.bots ?? []).map(b => `
    <div style="display:flex;gap:12px;padding:12px 14px;border-radius:12px;background:${CHIP};border:1px solid ${RULE}">
      <div style="width:30px;height:30px;border-radius:50%;flex-shrink:0;background:${INK};color:#fff;font-weight:800;font-size:10px;display:flex;align-items:center;justify-content:center;letter-spacing:.3px">${esc(b.initials)}</div>
      <div style="flex:1;min-width:0"><div style="font-weight:800;font-size:13px;color:${INK};margin-bottom:3px">${esc(b.name)}</div><div style="font-weight:300;font-size:12px;color:${INK2};line-height:1.6">${esc(b.role)}</div></div>
    </div>`).join('')

const walls = (w.walls ?? []).map(x => `
    <div style="background:rgba(255,20,147,0.05);border:1px solid rgba(255,20,147,0.22);border-radius:12px;padding:12px 14px">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <span style="color:${PINK};font-weight:900;font-size:12px;line-height:1.5;flex-shrink:0">&rsaquo;</span>
        <div><span style="font-weight:800;font-size:12.5px;color:${INK}">${esc(x.lead)} </span><span style="font-weight:300;font-size:12px;color:${INK2};line-height:1.65">${esc(x.body)}</span></div>
      </div>
    </div>`).join('')

// Section blocks — only emitted when the underlying data exists.
const attachmentsBlock = attachments
  ? `\n      <div style="display:flex;flex-wrap:wrap;gap:10px;margin:20px 0 4px">${attachments}\n      </div>`
  : ''

const highlightsBlock = highlights
  ? `\n      <div class="sub-label" style="margin:26px 0 12px">What I built</div>\n      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:${w.builtLead ? '18px' : '0'}">${highlights}\n      </div>`
  : ''

const builtLeadBlock = w.builtLead
  ? `\n      <p style="font-weight:400;font-size:12.5px;color:${INK};line-height:1.6;margin:0 0 14px">${esc(w.builtLead)}</p>`
  : ''

const botsBlock = bots
  ? `\n      <div style="display:flex;flex-direction:column;gap:8px">${bots}\n      </div>`
  : ''

const coordinatorsBlock = w.coordinators
  ? `\n      <p style="font-weight:300;font-size:12px;color:${INK2};line-height:1.65;margin:12px 0 0">${esc(w.coordinators)}</p>`
  : ''

const alongsideBlock = w.alongside
  ? `\n      <p style="font-weight:300;font-size:12px;color:${INK2};line-height:1.65;margin:12px 0 0">${esc(w.alongside)}</p>`
  : ''

const wallsBlock = walls
  ? `\n      <div class="sub-label" style="margin:26px 0 4px">Where I hit walls, and what I changed</div>\n      <p style="font-weight:300;font-size:12px;color:${INK3};line-height:1.6;margin:0 0 14px">Being honest about the hard parts — that's where I learned the most.</p>\n      <div style="display:flex;flex-direction:column;gap:8px">${walls}\n      </div>`
  : ''

const wrapUpBlock = w.wrapUp
  ? `\n      <div style="background:${INK};border-radius:14px;padding:18px 20px;margin-top:22px">\n        <div class="sub-label" style="color:rgba(255,255,255,0.4);margin-bottom:7px">Where we're at</div>\n        <p style="font-weight:300;font-size:13px;color:rgba(255,255,255,0.85);line-height:1.7;margin:0">${esc(w.wrapUp)}</p>\n      </div>`
  : ''

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>This Week · ${esc(w.title)}</title>
<meta name="description" content="${esc(w.title)} — weekly progress log." />
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #F2F2F2; font-family: ${FONT}; padding: 40px 28px 80px; }
  .wrap { max-width: 1100px; margin: 0 auto; }
  .card { background: #fff; border-radius: 20px; box-shadow: ${SH}; overflow: hidden; }
  .inner { padding: 32px 36px 36px; }
  .sub-label { font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: ${INK3}; }
  h2.title { font-weight: 900; font-size: 40px; color: ${INK}; letter-spacing: -1.4px; line-height: 1.03; margin: 0 0 12px; }
  @media (max-width: 640px) {
    body { padding: 20px 16px 60px; }
    .inner { padding: 22px 18px 24px; }
    h2.title { font-size: 28px; }
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div style="height:3px;background:${PINK};width:100%"></div>
    <div class="inner">

      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:4px;height:4px;background:${INK};border-radius:1px"></div>
          <span class="sub-label" style="letter-spacing:2.5px">This week · ${esc(w.dates)}</span>
        </div>
        <span style="font-size:8.5px;font-weight:800;letter-spacing:1px;text-transform:uppercase;background:${PINK};color:#fff;padding:4px 11px;border-radius:99px">Progress log</span>
      </div>

      <h2 class="title">${esc(w.title)}</h2>
      <p style="font-weight:300;font-size:13.5px;color:${INK2};line-height:1.7;margin:0;max-width:720px">${esc(w.intro)}</p>
${attachmentsBlock}${highlightsBlock}${builtLeadBlock}${botsBlock}${coordinatorsBlock}${alongsideBlock}${wallsBlock}${wrapUpBlock}

    </div>
  </div>
</div>
</body>
</html>`

mkdirSync(join(ROOT, 'public'), { recursive: true })
writeFileSync(join(ROOT, 'public', 'this-week.html'), html)
console.log('✅  public/this-week.html generated from src/data/weeklyLog.js')
