// Vercel Edge Middleware — perimeter password gate (HTTP Basic Auth).
// Same pattern as mjmdashboard.org: runs before any file is served, and the
// credential lives in an env var on Vercel — nothing sensitive is committed.
//
// Login: any username + SITE_PASSWORD. (Username is ignored so there's only
// one thing to remember.)

export const config = {
  matcher: '/((?!_vercel|_next).*)',
};

function parseBasic(header) {
  if (!header || !header.startsWith('Basic ')) return null;
  let decoded = '';
  try { decoded = atob(header.slice(6).trim()); } catch { return null; }
  const idx = decoded.indexOf(':');
  if (idx < 0) return null;
  return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
}

export default function middleware(request) {
  const sitePass = process.env.SITE_PASSWORD;

  if (!sitePass) {
    return new Response(
      'Site password is not configured. Set the SITE_PASSWORD env var on Vercel.',
      { status: 503 },
    );
  }

  const creds = parseBasic(request.headers.get('authorization') || '');
  if (creds && creds.pass === sitePass) {
    return; // pass through
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="AAA Coaching", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}
