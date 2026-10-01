const CITY_PATTERN = /^[a-zA-Z0-9 .,'-]{2,80}$/;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Vary', 'Accept-Encoding');

  const city = typeof req.query?.city === 'string' ? req.query.city.trim() : '';
  if (city.length > 80) return res.status(400).json({ error: 'Invalid city parameter' });
  if (!city || !CITY_PATTERN.test(city)) {
    return res.status(400).json({ error: 'Invalid city parameter' });
  }

  try {
    const query = encodeURIComponent(`${city} road blocked traffic construction when:7d`);
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OddOneIn/1.0 (https://www.odd-one.in)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Upstream news service unavailable' });
    }

    const xml = await response.text();
    if (!xml.includes('<item>')) {
      return res.status(200).json({ source: 'Google News RSS', window: '7d', count: 0, alerts: [] });
    }

    const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    const alerts = itemBlocks.slice(0, 5).map(block => {
      const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
      let title = titleMatch ? titleMatch[1] : '';
      title = title.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1');
      title = title
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      return title.split(' - ')[0].trim().substring(0, 120);
    }).filter(Boolean);

    return res.status(200).json({ source: 'Google News RSS', window: '7d', count: alerts.length, alerts });
  } catch {
    return res.status(502).json({ error: 'Unable to fetch road alerts' });
  }
}
