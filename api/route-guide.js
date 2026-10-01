const MAX_TEXT = 80;
const MAX_ALERTS = 3;

function cleanText(value, max = MAX_TEXT) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service is not configured' });
  }

  if (JSON.stringify(req.body || {}).length > 12000) {
    return res.status(413).json({ error: 'Request payload too large' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const origin = cleanText(body.origin);
  const dest = cleanText(body.dest);
  const lang = ['en', 'hi', 'hinglish'].includes(body.lang) ? body.lang : 'en';

  const dist = Number(body.dist);
  const time = Number(body.time);
  const missingPct = body.missingPct == null ? null : Number(body.missingPct);

  if (!origin || !dest) {
    return res.status(400).json({ error: 'Origin and destination are required' });
  }

  if (!Number.isFinite(dist) || dist < 0 || dist > 10000 ||
      !Number.isFinite(time) || time < 0 || time > 100000 ||
      (missingPct !== null && (!Number.isFinite(missingPct) || missingPct < 0 || missingPct > 100))) {
    return res.status(400).json({ error: 'Invalid route metrics' });
  }

  const alerts = Array.isArray(body.alerts)
    ? body.alerts.filter(item => typeof item === 'string').slice(0, MAX_ALERTS).map(item => item.trim().slice(0, 160)).filter(Boolean)
    : [];

  const langInstruction =
    lang === 'hi' ? 'Reply in Hindi.' :
    lang === 'hinglish' ? 'Reply in Hinglish (Hindi+English mix).' :
    'Reply in English.';

  const gapText = missingPct === null ? 'Road-data gap: not available' : `Road-data gap: ${missingPct}%`;
  const alertText = alerts.length ? alerts.join('; ') : 'No major alerts.';

  const prompt = `You are Odd-One.in, India's road intelligence navigator. ${langInstruction}

Route: ${origin} to ${dest} | Distance: ${dist} km | Est time: ${time} min | ${gapText}
Live alerts: ${alertText}

Give a short, friendly navigation tip (80-100 words). Include: best time to travel, one road warning if alerts exist, and one local tip. Never invent road conditions, incidents, or data coverage. Be warm and conversational.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
        signal: AbortSignal.timeout(10000)
      }
    );

    if (!geminiRes.ok) {
      return res.status(502).json({ error: 'AI service unavailable' });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return res.status(502).json({ error: 'AI service returned no guidance' });
    }

    return res.status(200).json({ text: text.slice(0, 1200) });
  } catch {
    return res.status(502).json({ error: 'AI service unavailable' });
  }
}
