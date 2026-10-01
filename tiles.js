export default async function handler(req, res) {
  const { z, x, y } = req.query || {};

  if (!/^\d+$/.test(String(z)) || !/^\d+$/.test(String(x)) || !/^\d+$/.test(String(y))) {
    return res.status(400).end();
  }

  const zi = Number(z), xi = Number(x), yi = Number(y);
  if (zi < 0 || zi > 19 || xi < 0 || yi < 0) {
    return res.status(400).end();
  }

  const hosts = ['server.arcgisonline.com', 'services.arcgisonline.com'];

  for (const host of hosts) {
    try {
      const tileUrl = `https://${host}/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${zi}/${yi}/${xi}`;
      const response = await fetch(tileUrl, {
        headers: {
          'User-Agent': 'OddOneIn/1.0 (https://www.odd-one.in)',
          'Referer': 'https://www.odd-one.in',
          'Accept': 'image/jpeg,image/png,image/*'
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) continue;

      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Odd-One-Map', 'esri-world-street-map');
      return res.send(Buffer.from(buffer));
    } catch {}
  }

  return res.status(502).end();
}
