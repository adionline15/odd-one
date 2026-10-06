import { normalizeObservationInput } from '../lib/observation-contract.mjs';

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
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET') {
    const q = req.query || {};
    const minLat = Number(q.minLat);
    const minLon = Number(q.minLon);
    const maxLat = Number(q.maxLat);
    const maxLon = Number(q.maxLon);
    const requestedLimit = q.limit == null || q.limit === '' ? 500 : Number(q.limit);
    const limit = Number.isInteger(requestedLimit) ? Math.min(requestedLimit, 500) : 500;
    const cacheSeconds = 15;
    const maxViewportSpan = 60;

    if (
      !validCoordinate(minLat, -90, 90) ||
      !validCoordinate(minLon, -180, 180) ||
      !validCoordinate(maxLat, -90, 90) ||
      !validCoordinate(maxLon, -180, 180) ||
      minLat >= maxLat ||
      minLon >= maxLon ||
      maxLat - minLat > maxViewportSpan ||
      maxLon - minLon > maxViewportSpan ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 500
    ) {
      return json(res, 400, {
        error: 'Invalid map bounds',
        max_span: maxViewportSpan
      });
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
      res.setHeader('Vary', 'Accept-Encoding, Origin');
      res.setHeader('X-Odd-One-API', 'observations-v6');
      res.setHeader('X-Odd-One-Cache', 'viewport-15s');
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
        return json(res, 503, { api_version: 'observations-v6', error: 'Observation service is not configured' });
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

    if (JSON.stringify(req.body || {}).length > 12000) {
      return json(res, 413, { error: 'Observation request too large' });
    }

    const normalized = normalizeObservationInput(req.body && typeof req.body === 'object' ? req.body : {});
    if (!normalized.ok) {
      return json(res, normalized.error.includes('too large') ? 413 : 400, { error: normalized.error });
    }

    const {
      lat,
      lon,
      observation_type: observationType,
      source,
      observed_at: observedAt,
      confidence,
      metadata
    } = normalized.value;
    const observedDate = new Date(observedAt);

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
