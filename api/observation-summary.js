const MAX_SPAN = 60;

function json(res, status, body) {
  return res.status(status).json(body);
}

function config() {
  return {
    url: (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, ''),
    key: (process.env.SUPABASE_SECRET_KEY || '').trim()
  };
}

function coordinate(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

async function request(path, options = {}) {
  const { url, key } = config();
  if (!url || !key) {
    const error = new Error('Database is not configured');
    error.code = 'NOT_CONFIGURED';
    throw error;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url + '/rest/v1/' + path, {
      ...options,
      headers: { apikey: key, 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal
    });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch {}
    if (!response.ok) {
      const error = new Error('Database request failed');
      error.status = response.status;
      throw error;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const q = req.query || {};
  const minLat = Number(q.minLat);
  const minLon = Number(q.minLon);
  const maxLat = Number(q.maxLat);
  const maxLon = Number(q.maxLon);

  if (!coordinate(minLat, -90, 90) || !coordinate(maxLat, -90, 90) ||
      !coordinate(minLon, -180, 180) || !coordinate(maxLon, -180, 180) ||
      minLat >= maxLat || minLon >= maxLon ||
      maxLat - minLat > MAX_SPAN || maxLon - minLon > MAX_SPAN) {
    return json(res, 400, { error: 'Invalid summary bounds', max_span: MAX_SPAN });
  }

  try {
    const data = await request('rpc/approved_observation_summary', {
      method: 'POST',
      body: JSON.stringify({ p_min_lat: minLat, p_min_lon: minLon, p_max_lat: maxLat, p_max_lon: maxLon })
    });
    const rows = Array.isArray(data) ? data : [];
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=30, stale-while-revalidate=60');
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('X-Odd-One-API', 'observation-summary-v1');
    return json(res, 200, {
      api_version: 'observation-summary-v1',
      count: rows.length,
      summary: rows
    });
  } catch (error) {
    console.error('[observation-summary] request failed', { status: error.status || 0, name: error.name || 'Error' });
    return json(res, error.code === 'NOT_CONFIGURED' ? 503 : 502, {
      api_version: 'observation-summary-v1',
      error: error.code === 'NOT_CONFIGURED' ? 'Observation database is not configured' : 'Observation summary unavailable'
    });
  }
}
