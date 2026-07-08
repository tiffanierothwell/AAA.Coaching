// Vercel Edge Middleware — perimeter password gate, enforced server-side.
// Runs before any file is served. The password lives in the SITE_PASSWORD env
// var on Vercel; nothing sensitive is committed. Unlike a client-side gate,
// the page's files are never sent until the correct password is supplied.
//
// Flow: unauthenticated requests get a styled login page. Submitting the right
// password sets an httpOnly cookie; every later request is checked against it.

export const config = {
  matcher: '/((?!_vercel|_next).*)',
};

const COOKIE = 'aaa_auth';

function loginPage(error) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>AAA Coaching AIOS</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #F2F2F2; font-family: 'Montserrat', system-ui, sans-serif; padding: 24px; }
  .card { background: #fff; border-radius: 20px; box-shadow: 0 30px 80px rgba(0,0,0,0.10);
    padding: 40px 34px; width: 100%; max-width: 480px; text-align: center; }
  .bar { height: 4px; width: 40px; border-radius: 99px; background: #111; margin: 0 auto 22px; }
  .eyebrow { font-size: 9px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: #999; margin-bottom: 6px; }
  h1 { font-weight: 900; font-size: 26px; color: #111; letter-spacing: -1px; margin: 0 0 8px; line-height: 1.05; }
  .sub { font-weight: 300; font-size: 12.5px; color: #999; line-height: 1.55; margin: 0 0 24px; white-space: nowrap; }
  form { display: flex; flex-direction: column; gap: 10px; }
  input { font-family: inherit; font-size: 14px; font-weight: 500; padding: 12px 14px; border-radius: 10px;
    border: 1.5px solid ${error ? '#FF1493' : '#E4E4E4'}; outline: none; color: #111; background: #fff; width: 100%; }
  input:focus { border-color: #111; }
  .err { font-weight: 600; font-size: 11px; color: #FF1493; text-align: left; margin: 0; }
  button { font-family: inherit; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;
    background: #111; color: #fff; border: none; border-radius: 10px; padding: 13px 14px; cursor: pointer; margin-top: 2px; }
  @media (max-width: 460px) { .sub { white-space: normal; } h1 { font-size: 22px; } }
</style>
</head>
<body>
  <div class="card">
    <div class="bar"></div>
    <div class="eyebrow">Tiffanie's Project Management Dashboard</div>
    <h1>AAA Coaching AIOS</h1>
    <p class="sub">This page is private. Enter the password to continue.</p>
    <form method="POST" autocomplete="off">
      <input type="password" name="password" placeholder="Password" autofocus />
      ${error ? '<p class="err">Incorrect password. Try again.</p>' : ''}
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;
}

function htmlResponse(body, status) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export default async function middleware(request) {
  const pass = process.env.SITE_PASSWORD;
  if (!pass) {
    return new Response(
      'Site password is not configured. Set the SITE_PASSWORD env var on Vercel.',
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const wanted = `${COOKIE}=${encodeURIComponent(pass)}`;
  const cookie = request.headers.get('cookie') || '';
  const authed = cookie.split(';').some(c => c.trim() === wanted);

  // Already signed in — serve the site.
  if (authed) return;

  // Login submission.
  if (request.method === 'POST') {
    let entered = '';
    try {
      const form = await request.formData();
      entered = (form.get('password') || '').toString();
    } catch { /* ignore */ }
    if (entered === pass) {
      const headers = new Headers();
      headers.set(
        'Set-Cookie',
        `${COOKIE}=${encodeURIComponent(pass)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
      );
      headers.set('Location', url.pathname);
      headers.set('Cache-Control', 'no-store');
      return new Response(null, { status: 303, headers });
    }
    return htmlResponse(loginPage(true), 401);
  }

  // Everything else — show the login page.
  return htmlResponse(loginPage(false), 401);
}
