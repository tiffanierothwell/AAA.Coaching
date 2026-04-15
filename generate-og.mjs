/**
 * Generates public/og-image.png (1200×630) from an inline HTML template.
 * Uses puppeteer-core + the local Chrome installation.
 */
import puppeteer from 'puppeteer-core'
import { writeFileSync } from 'fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #F2F2F2;
    font-family: 'Montserrat', sans-serif;
    display: flex; align-items: center; justify-content: center;
  }

  .card {
    background: #fff;
    border-radius: 28px;
    box-shadow: 0 8px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05);
    overflow: hidden;
    width: 1100px;
    height: 530px;
    display: flex;
    flex-direction: column;
  }

  .stripe { height: 6px; background: #0A0A0A; width: 100%; }

  .body {
    display: flex;
    flex: 1;
    padding: 52px 56px 52px 56px;
    gap: 44px;
    align-items: flex-start;
  }

  /* ── LEFT ── */
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .badges {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .badge-dark {
    background: #0A0A0A;
    border-radius: 99px;
    padding: 6px 18px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #fff;
  }
  .badge-dark .slash { color: #FF1493; font-weight: 900; font-size: 14px; }
  .badge-chip {
    background: #F0F0F0;
    border-radius: 99px;
    padding: 5px 16px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #4A4A4A;
  }

  .eyebrow {
    font-size: 14px;
    font-weight: 200;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #9A9A9A;
    margin-bottom: 12px;
  }
  .headline {
    font-size: 88px;
    font-weight: 900;
    color: #0A0A0A;
    letter-spacing: -4px;
    line-height: 0.9;
  }

  .project-label {
    font-size: 12px;
    font-weight: 200;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #9A9A9A;
    margin-bottom: 5px;
  }
  .project-name {
    font-size: 18px;
    font-weight: 700;
    color: #0A0A0A;
    letter-spacing: -0.4px;
  }

  /* ── RIGHT: dark status card ── */
  .status-card {
    width: 280px;
    flex-shrink: 0;
    background: #0A0A0A;
    border-radius: 20px;
    padding: 32px 30px 28px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 4px;
  }
  .status-label {
    font-size: 10px;
    font-weight: 200;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 5px;
  }
  .status-session {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }
  .status-date {
    font-size: 13px;
    font-weight: 300;
    color: rgba(255,255,255,0.65);
    margin-top: 4px;
  }
  .divider { height: 1px; background: rgba(255,255,255,0.08); }

  .ms-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .ms-count {
    font-size: 11px;
    font-weight: 800;
    color: rgba(255,255,255,0.6);
  }
  .progress-track {
    height: 4px;
    background: rgba(255,255,255,0.10);
    border-radius: 99px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    width: 58%;
    background: #fff;
    border-radius: 99px;
  }
  .progress-pct {
    font-size: 10px;
    font-weight: 200;
    color: rgba(255,255,255,0.55);
    margin-top: 6px;
    letter-spacing: 0.3px;
  }

  .next-label {
    font-size: 10px;
    font-weight: 200;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 8px;
  }
  .next-text {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    line-height: 1.45;
  }

  /* URL watermark */
  .url {
    position: absolute;
    bottom: 24px;
    right: 52px;
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 0.5px;
    color: #BBBBBB;
  }
</style>
</head>
<body>
<div style="position:relative; width:1200px; height:630px; display:flex; align-items:center; justify-content:center;">

  <div class="card">
    <div class="stripe"></div>
    <div class="body">

      <!-- LEFT -->
      <div class="left">
        <div class="badges">
          <span class="badge-dark"><span class="slash">///</span> Accelerator</span>
          <span class="badge-chip">April 15, 2026</span>
          <span class="badge-chip">Session 2</span>
        </div>
        <div>
          <p class="eyebrow">Thanks for all of your help</p>
          <h1 class="headline">Hi Valera!</h1>
        </div>
        <div>
          <p class="project-label">Project</p>
          <p class="project-name">Ticket Help Desk — Little Tree &amp; Le Roi</p>
        </div>
      </div>

      <!-- RIGHT: dark status card -->
      <div class="status-card">
        <div>
          <div class="status-label">Current</div>
          <div class="status-session">Session 2</div>
          <div class="status-date">April 15, 2026</div>
        </div>
        <div class="divider"></div>
        <div>
          <div class="ms-row">
            <span class="status-label" style="margin:0">Milestones</span>
            <span class="ms-count">7 / 12</span>
          </div>
          <div class="progress-track"><div class="progress-fill"></div></div>
          <div class="progress-pct">58% complete</div>
        </div>
        <div class="divider"></div>
        <div>
          <div class="next-label">Up next</div>
          <div class="next-text">Supabase CLI + Schema setup</div>
        </div>
      </div>

    </div>
  </div>

  <div class="url">tiffanierothwell.github.io/AAA.Coaching</div>
</div>
</body>
</html>`

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 })
await page.setContent(html, { waitUntil: 'networkidle0' })

// Give fonts a moment to render
await new Promise(r => setTimeout(r, 800))

const screenshot = await page.screenshot({ type: 'png' })
writeFileSync('public/og-image.png', screenshot)

await browser.close()
console.log('✅  public/og-image.png generated (1200×630 @2x)')
