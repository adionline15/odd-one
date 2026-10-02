// Odd-One production health endpoint
// Reports safe server-side dependency status without exposing credentials.

function json(res, status, body) {
  return res.status(status).json(body);
}

function getConfig() {
  return {
    url: String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, ''),
    key: String(process.env.SUPABASE_SECRET_KEY || '').trim()
  };
}

async function checkSupabase() {
  const { url, key } = getConfig();
  if (!url || !key) return { status: 'not_configured' };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      url + '/rest/v1/observations?select=id&status=eq.approved&limit=1',
      { headers: { apikey: key, Accept: 'application/json' }, signal: controller.signal }
    );

    return response.ok
      ? { status: 'ok' }
      : { status: 'unavailable', upstream_status: response.status };
  } catch (error) {
    return { status: error?.name === 'AbortError' ? 'timeout' : 'network_error' };
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const supabase = await checkSupabase();
  const healthy = supabase.status === 'ok';

  return json(res, healthy ? 200 : 503, {
    api_version: 'health-v1',
    status: healthy ? 'ok' : 'degraded',
    services: { observation_database: supabase.status },
    checks: { secrets_present: supabase.status !== 'not_configured' }
  });
}
