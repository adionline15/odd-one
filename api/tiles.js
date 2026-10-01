const TILE_HOSTS = ['server.arcgisonline.com', 'services.arcgisonline.com'];

function isValidTile(value, max) {
  if (!/^\d+$/.test(String(value))) return false;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= max;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const { z, x, y } = req.query || {};
  if (!isValidTile(z, 19) || !isValidTile(x, 1_000_000) || !isValidTile(y, 1_000_000)) {
    return res.status(400).end();
  }

  const zi = Number(z);
  const xi = Number(x);
  const yi = Number(y);

  for (const host of TILE_HOSTS) {
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
      res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Odd-One-Map', 'esri-world-street-map');
      return res.send(Buffer.from(buffer));
    } catch {}
  }

  return res.status(502).end();
}
