export const OBSERVATION_TYPES = Object.freeze([
  'missing_road',
  'new_road',
  'road_closure',
  'construction',
  'surface_condition',
  'access_restriction',
  'map_mismatch'
]);

export const OBSERVATION_SOURCES = Object.freeze([
  'user',
  'dashcam',
  'satellite',
  'osm',
  'government',
  'news',
  'ai'
]);

const TYPE_SET = new Set(OBSERVATION_TYPES);
const SOURCE_SET = new Set(OBSERVATION_SOURCES);

export function validCoordinate(value, min, max) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

export function normalizeObservationInput(body = {}) {
  const lat = Number(body.lat);
  const lon = Number(body.lon);
  const observationType = typeof body.observation_type === 'string'
    ? body.observation_type.trim().toLowerCase()
    : '';
  const source = typeof body.source === 'string'
    ? body.source.trim().toLowerCase()
    : 'user';
  const observedAt = typeof body.observed_at === 'string'
    ? body.observed_at.slice(0, 64)
    : '';
  const confidence = Number(body.confidence);
  const metadata = body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
    ? body.metadata
    : {};

  const observedDate = new Date(observedAt);

  if (
    !validCoordinate(lat, -90, 90) ||
    !validCoordinate(lon, -180, 180) ||
    !TYPE_SET.has(observationType) ||
    !SOURCE_SET.has(source) ||
    !Number.isFinite(confidence) ||
    confidence < 0 ||
    confidence > 1
  ) {
    return { ok: false, error: 'Invalid observation payload' };
  }

  if (!observedAt || Number.isNaN(observedDate.getTime())) {
    return { ok: false, error: 'Invalid observed_at timestamp' };
  }

  if (observedDate.getTime() > Date.now() + 300000) {
    return { ok: false, error: 'observed_at cannot be in the future' };
  }

  const metadataText = JSON.stringify(metadata);
  if (metadataText.length > 8000) {
    return { ok: false, error: 'Observation metadata is too large' };
  }

  return {
    ok: true,
    value: {
      lat,
      lon,
      observation_type: observationType,
      source,
      observed_at: observedDate.toISOString(),
      confidence,
      metadata
    }
  };
}
