const TYPES = new Set([
  'missing_road',
  'new_road',
  'road_closure',
  'construction',
  'surface_condition',
  'access_restriction',
  'map_mismatch'
]);

const SOURCES = new Set([
  'user',
  'dashcam',
  'satellite',
  'osm',
  'government',
  'news',
  'ai'
]);

function json(res, status, body) {
  return res.status(status).json(body);
}

function getConfig() {
  return {
    url: (process.env.SUPABASE_URL || '').trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, ''),
    key: (process.env.SUPABASE_SECRET_KEY || '').trim().replace(/^['"]|['"]$/g, '')
  };
}

async function supabaseRequest(path, options = {}) {
  const { url, key } = getConfig();
  if (!url || !key) {
    const error = new Error('Observation database is not configured');
    error.code = 'NOT_CONFIGURED';
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let response;
  try {
    response = await fetch(`${url}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: key,
       
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error('Database request failed');
    error.status = response.status;
    error.upstreamBody = text.slice(0, 500);
    throw error;
  }

  return data;
}

function validCoordinate(value, min, max) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const q = req.query || {};
    const minLat = Number(q.minLat);
    const minLon = Number(q.minLon);
    const maxLat = Number(q.maxLat);
    const maxLon = Number(q.maxLon);
    const requestedLimit = Number(q.limit || 500);
    const limit = Number.isInteger(requestedLimit) ? Math.min(requestedLimit, 500) : 500;
    const cacheSeconds = 15;
    const maxViewportSpan = 20;

    if (
      !validCoordinate(minLat, -90, 90) ||
      !validCoordinate(minLon, -180, 180) ||
      !validCoordinate(maxLat, -90, 90) ||
      !validCoordinate(maxLon, -180, 180) ||
      minLat >= maxLat ||
      minLon >= maxLon ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 500
    ) {
      return json(res, 400, { error: 'Invalid map bounds' });
    }

    let stage = 'connectivity';
    try {
      // First verify the PostgREST connection with a minimal, non-spatial query.
      await supabaseRequest('observations?select=id&status=eq.approved&limit=1', {
        method: 'GET'
      });

      stage = 'rpc';
      const data = await supabaseRequest('rpc/approved_observations_in_view', {
        method: 'POST',
        body: JSON.stringify({
          p_min_lat: minLat,
          p_min_lon: minLon,
          p_max_lat: maxLat,
          p_max_lon: maxLon,
          p_limit: limit
        })
      });
      const observations = Array.isArray(data) ? data : [];
      res.setHeader('Cache-Control', `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=30`);
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('X-Odd-One-API', 'observations-v6');
      res.setHeader('X-Odd-One-Observation-Count', String(observations.length));
      res.setHeader('X-Odd-One-Observation-Limit', String(limit));
      return json(res, 200, {
        api_version: 'observations-v6',
        count: observations.length,
        limit,
        truncated: observations.length >= limit,
        observations
      });
    } catch (error) {
      if (error.code === 'NOT_CONFIGURED') {
        console.error('[observations] Supabase is not configured');
        return json(res, 503, { api_version: 'observations-v5', error: 'Observation service is not configured' });
      }
      console.error('[observations] Supabase GET failed', {
        name: error.name || 'Error',
        message: error.message || 'unknown error',
        status: error.status || 0,
        stage,
        body: error.upstreamBody || 'no upstream response body'
      });
      return json(res, 502, {
        api_version: 'observations-v6',
        error: 'Observation service unavailable',
        stage,
        reason: error.name === 'TimeoutError' || error.name === 'AbortError'
          ? 'timeout'
          : error.status
            ? `upstream_${error.status}`
            : 'network'
      });
    }
  }

  if (req.method === 'POST') {
    if (process.env.OBSERVATIONS_SUBMISSION_ENABLED !== 'true') {
      return json(res, 503, { error: 'Observation submission is not enabled' });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const lat = Number(body.lat);
    const lon = Number(body.lon);
    const observationType = typeof body.observation_type === 'string' ? body.observation_type : '';
    const source = typeof body.source === 'string' ? body.source : 'user';
    const observedAt = typeof body.observed_at === 'string' ? body.observed_at : '';
    const confidence = Number(body.confidence);
    const metadata = body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
      ? body.metadata
      : {};

    if (
      !validCoordinate(lat, -90, 90) ||
      !validCoordinate(lon, -180, 180) ||
      !TYPES.has(observationType) ||
      !SOURCES.has(source) ||
      !Number.isFinite(confidence) ||
      confidence < 0 ||
      confidence > 1
    ) {
      return json(res, 400, { error: 'Invalid observation payload' });
    }

    const observedDate = new Date(observedAt);
    if (!observedAt || Number.isNaN(observedDate.getTime())) {
      return json(res, 400, { error: 'Invalid observed_at timestamp' });
    }

    const metadataText = JSON.stringify(metadata);
    if (metadataText.length > 8000) {
      return json(res, 400, { error: 'Observation metadata is too large' });
    }

    try {
      const data = await supabaseRequest('rpc/submit_observation', {
        method: 'POST',
        body: JSON.stringify({
          p_lat: lat,
          p_lon: lon,
          p_observation_type: observationType,
          p_source: source,
          p_observed_at: observedDate.toISOString(),
          p_confidence: confidence,
          p_metadata: metadata
        })
      });

      return json(res, 201, { observation: Array.isArray(data) ? data[0] : data });
    } catch (error) {
      if (error.code === 'NOT_CONFIGURED') {
        console.error('[observations] Supabase is not configured');
        return json(res, 503, { error: 'Observation database is not configured' });
      }
      console.error('[observations] Supabase POST failed', {
        status: error.status || 0,
        body: error.upstreamBody || 'no upstream response body'
      });
      return json(res, 502, { error: 'Could not save observation' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return json(res, 405, { error: 'Method not allowed' });
}
