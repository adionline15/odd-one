export default async function handler(req, res) {
  const { z, x, y } = req.query;

  if (!z || !x || !y) {
    return res.status(400).end();
  }

  // Try multiple OSM servers for reliability
  const servers = ['a', 'b', 'c'];
  const s = servers[Math.floor(Math.random() * servers.length)];
  const tileUrl = `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;

  try {
    const response = await fetch(tileUrl, {
      headers: {
        'User-Agent': 'OddOneIn/1.0 (www.odd-one.in road intelligence)',
        'Referer': 'https://www.odd-one.in',
        'Accept': 'image/png,image/*'
      }
    });

    if (!response.ok) {
      return res.status(response.status).end();
    }

    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    return res.send(Buffer.from(buffer));
  } catch (err) {
    return res.status(500).end();
  }
}
