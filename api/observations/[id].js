const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(res, status, body) {
  return res.status(status).json(body);
}

function config() {
  return {
    url: (process.env.SUPABASE_URL || '').trim().replace(/\\/+$/, ''),
    key: (process.env.SUPABASE_SECRET_KEY || '').trim()
  };
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
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const id = String(req.query?.id || '').trim();
  if (!UUID.test(id)) return json(res, 400, { error: 'Invalid observation id' });

  try {
    const data = await request('rpc/approved_observation_detail', {
      method: 'POST',
      body: JSON.stringify({ p_id: id })
    });
    const observation = Array.isArray(data) ? data[0] : data;
    if (!observation) return json(res, 404, { error: 'Observation not found' });

    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=30, stale-while-revalidate=60');
    res.setHeader('Vary', 'Accept-Encoding, Origin');
    res.setHeader('X-Odd-One-API', 'observation-detail-v1');
    return json(res, 200, { api_version: 'observation-detail-v1', observation });
  } catch (error) {
    console.error('[observation-detail] request failed', { status: error.status || 0, name: error.name || 'Error' });
    return json(res, error.code === 'NOT_CONFIGURED' ? 503 : 502, {
      api_version: 'observation-detail-v1',
      error: error.code === 'NOT_CONFIGURED' ? 'Observation database is not configured' : 'Observation detail unavailable'
    });
  }
}
