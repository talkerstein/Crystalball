// Crystal Ball contact form handler.
// Receives JSON from contact.html, emails the submission via Resend.
// Required env vars (set in Vercel): RESEND_API_KEY, CB_TO_EMAIL, CB_FROM_EMAIL

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const {
    name = '',
    email = '',
    phone = '',
    company = '',
    inquiry_type = '',
    project_location = '',
    message = '',
    _gotcha = '',
    _ua = '',
  } = body;

  // Honeypot: bots fill the hidden field. Pretend success, send nothing.
  if (_gotcha) return res.status(200).json({ ok: true });

  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Cloudflare Turnstile verification — reject if the token is missing or invalid.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = body['cf-turnstile-response'];
    if (!token) {
      return res.status(400).json({ error: 'Spam check missing. Please retry.' });
    }
    try {
      const params = new URLSearchParams({ secret: turnstileSecret, response: token });
      const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      if (ip) params.append('remoteip', ip);
      const verifyResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });
      const verify = await verifyResp.json();
      if (!verify.success) {
        console.error('Turnstile failed', verify['error-codes']);
        return res.status(403).json({ error: 'Spam check failed. Please retry.' });
      }
    } catch (err) {
      console.error('Turnstile verify error', err);
      return res.status(502).json({ error: 'Spam check unavailable. Please retry.' });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CB_TO_EMAIL;
  const from = process.env.CB_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return res.status(500).json({ error: 'Form is not configured yet.' });
  }

  const rows = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Company / Firm', company],
    ['Inquiry Type', inquiry_type],
    ['Project Location', project_location],
  ]
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#4D4D4D">${esc(k)}</td><td style="padding:4px 0;color:#111">${esc(v)}</td></tr>`)
    .join('');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">New Crystal Ball inquiry</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">${rows}</table>
      <div style="white-space:pre-wrap;border-top:1px solid #eee;padding-top:12px">${esc(message)}</div>
      <p style="margin-top:20px;font-size:11px;color:#999">Submitted via crystal-ball.ca contact form. UA: ${esc(_ua)}</p>
    </div>`;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: to.split(',').map((s) => s.trim()),
        reply_to: email,
        subject: `New inquiry${inquiry_type ? ` — ${inquiry_type}` : ''} from ${name}`,
        html,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error('Resend error', resp.status, detail);
      return res.status(502).json({ error: 'Email delivery failed.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler error', err);
    return res.status(500).json({ error: 'Unexpected error.' });
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

function esc(v) {
  return String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
