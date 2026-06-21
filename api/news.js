export default async function handler(req, res) {
  // Allow requests from the browser (same-origin, but explicit for safety)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // cache 5 min

  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'Missing city parameter' });
  }

  try {
    const query = encodeURIComponent(`${city} road blocked traffic construction`);
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;

    const response = await fetch(url, {
      headers: {
        // Identify as a normal browser to reduce chance of being blocked
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch news', status: response.status });
    }

    const xml = await response.text();

    // Basic check that we actually got RSS XML, not a block page
    if (!xml.includes('<item>')) {
      return res.status(200).json({ alerts: [] });
    }

    // Extract titles from <item><title>...</title></item> using regex
    // (avoids needing an XML parser library in the serverless function)
    const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    const alerts = itemBlocks.slice(0, 5).map(block => {
      const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
      let title = titleMatch ? titleMatch[1] : '';
      // Decode common HTML/XML entities and strip CDATA wrapper if present
      title = title.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1');
      title = title
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      return title.split(' - ')[0].substring(0, 85);
    }).filter(Boolean);

    return res.status(200).json({ alerts });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
