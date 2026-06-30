export default async function handler(req, res) {
  const { z, x, y } = req.query;
  if (!z || !x || !y) return res.status(400).end();
  const s = ['a','b','c'][Math.floor(Math.random()*3)];
  const url = `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'OddOneIn/1.0 (www.odd-one.in)',
        'Referer': 'https://www.odd-one.in'
      }
    });
    if (!r.ok) return res.status(r.status).end();
    const buf = await r.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(Buffer.from(buf));
  } catch(e) {
    return res.status(500).end();
  }
}
