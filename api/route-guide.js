export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured: missing GEMINI_API_KEY' });
  }

  const { origin, dest, dist, time, alerts, missingPct, lang } = req.body || {};

  if (!origin || !dest) {
    return res.status(400).json({ error: 'Missing origin or dest' });
  }

  const langInstruction =
    lang === 'hi' ? 'Reply in Hindi.' :
    lang === 'hinglish' ? 'Reply in Hinglish (Hindi+English mix).' :
    'Reply in English.';

  const alertText = (alerts && alerts.length) ? alerts.slice(0, 2).join('; ') : 'No major alerts.';

  const prompt = `You are Odd-One.in, India's road intelligence navigator. ${langInstruction}

Route: ${origin} to ${dest} | Distance: ${dist}km | Est time: ${time} min | Missing roads: ${missingPct}%
Live alerts: ${alertText}

Give a short, friendly navigation tip (80-100 words). Include: best time to travel, one road warning if alerts exist, and one local tip. Be warm and conversational.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      return res.status(502).json({ error: 'Gemini API error', detail: errBody });
    }

    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(502).json({ error: 'No text in Gemini response' });
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
