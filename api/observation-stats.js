function json(res, status, body) { return res.status(status).json(body); }
function config() {
  return {
    url: (process.env.SUPABASE_URL || '').trim().replace(/\\/+$/, ''),
    key: (process.env.SUPABASE_SECRET_KEY || '').trim()
  };
}
async function request(path, options = {}) {
  const { url, key } = config();
  if (!url || !key) { const e = new Error('Database is not configured'); e.code = 'NOT_CONFIGURED'; throw e; }
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
    if (!response.ok) { const e = new Error('Database request failed'); e.status = response.status; throw e; }
    return data;
  } finally { clearTimeout(timer); }
}
export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','geolocation=(), camera=(), microphone=()');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if (req.method !== 'GET') { res.setHeader('Allow','GET'); return json(res,405,{error:'Method not allowed'}); }
  try {
    const data = await request('rpc/approved_observation_stats', { method:'POST', body:'{}' });
    const stats = Array.isArray(data) ? data[0] : data;
    res.setHeader('Cache-Control','public, max-age=30, s-maxage=30, stale-while-revalidate=60');
    res.setHeader('X-Odd-One-API','observation-stats-v1');
    return json(res,200,{api_version:'observation-stats-v1',scope:'approved',stats:stats || {
      observation_count:0, source_count:0, type_count:0, average_confidence:null, latest_observed_at:null
    }});
  } catch (error) {
    console.error('[observation-stats] request failed',{status:error.status||0,name:error.name||'Error'});
    return json(res,error.code==='NOT_CONFIGURED'?503:502,{api_version:'observation-stats-v1',error:error.code==='NOT_CONFIGURED'?'Observation database is not configured':'Observation statistics unavailable'});
  }
}
