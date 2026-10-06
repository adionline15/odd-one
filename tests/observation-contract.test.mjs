import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeObservationInput, OBSERVATION_TYPES, OBSERVATION_SOURCES } from '../lib/observation-contract.mjs';

test('observation contract exposes one normalized type/source vocabulary', () => {
  assert.equal(OBSERVATION_TYPES.length, 7);
  assert.equal(OBSERVATION_SOURCES.length, 7);
  assert.ok(OBSERVATION_TYPES.includes('new_road'));
  assert.ok(OBSERVATION_SOURCES.includes('satellite'));
});

test('normalizes valid observation input', () => {
  const result = normalizeObservationInput({
    lat: '28.6139',
    lon: '77.2090',
    observation_type: ' NEW_ROAD ',
    source: ' SATELLITE ',
    observed_at: '2026-10-05T12:00:00Z',
    confidence: '0.82',
    metadata: { baseline_year: 2024 }
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.value, {
    lat: 28.6139,
    lon: 77.209,
    observation_type: 'new_road',
    source: 'satellite',
    observed_at: '2026-10-05T12:00:00.000Z',
    confidence: 0.82,
    metadata: { baseline_year: 2024 }
  });
});

test('rejects invalid coordinates, vocabulary, and confidence', () => {
  for (const body of [
    { lat: 91, lon: 77, observation_type: 'new_road', confidence: .8, observed_at: '2026-10-05T12:00:00Z' },
    { lat: 28, lon: 181, observation_type: 'new_road', confidence: .8, observed_at: '2026-10-05T12:00:00Z' },
    { lat: 28, lon: 77, observation_type: 'not_real', confidence: .8, observed_at: '2026-10-05T12:00:00Z' },
    { lat: 28, lon: 77, observation_type: 'new_road', source: 'not_real', confidence: .8, observed_at: '2026-10-05T12:00:00Z' },
    { lat: 28, lon: 77, observation_type: 'new_road', confidence: 1.1, observed_at: '2026-10-05T12:00:00Z' }
  ]) {
    assert.equal(normalizeObservationInput(body).ok, false);
  }
});

test('rejects future timestamps and oversized metadata', () => {
  const future = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  assert.match(normalizeObservationInput({
    lat: 28, lon: 77, observation_type: 'new_road', confidence: .8, observed_at: future
  }).error, /future/);

  assert.match(normalizeObservationInput({
    lat: 28, lon: 77, observation_type: 'new_road', confidence: .8,
    observed_at: '2026-10-05T12:00:00Z',
    metadata: { payload: 'x'.repeat(8001) }
  }).error, /too large/);
});
