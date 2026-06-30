export default async function handler(req, res) {
  const { z, x, y } = req.query;
  
  if (!z || !x || !y) {
    return res.status(400).json({ error: 'Missing tile coordinates' });
  }

  const tileUrl = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  
  try {
    const response = await fetch(tileUrl, {
      headers: {
        'User-Agent': 'OddOneIn/1.0 (road intelligence platform)',
        'Referer': 'https://www.odd-one.in'
      }
    });
    
    if (!response.ok) {
      return res.status(response.status).end();
    }
    
    const buffer = await response.arrayBuffer();
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.send(Buffer.from(buffer));
  } catch (err) {
    return res.status(500).end();
  }
}
