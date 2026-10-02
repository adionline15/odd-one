import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('frontend preserves verified observation boundaries', () => {
  const html = read('index.html');
  assert.match(html, /\/api\/observations\?/);
  assert.match(html, /observations-v6/);
  assert.match(html, /Only approved observations are surfaced as public intelligence/);
  assert.doesNotMatch(html, /synthetic road statistics/i);
});

test('routing distinguishes approximate output', () => {
  const html = read('index.html');
  assert.match(html, /APPROX/);
  assert.match(html, /estimates, not verified road conditions/);
});

test('observation APIs use approved-only paths', () => {
  assert.match(read('api/observations.js'), /status=eq\.approved/);
  const observationsApi = read('api/observations.js');
  assert.match(observationsApi, /approved_observations_in_view/);
  assert.match(observationsApi, /maxViewportSpan = 60/);
  assert.match(observationsApi, /maxLat - minLat > maxViewportSpan/);
  assert.match(observationsApi, /maxLon - minLon > maxViewportSpan/);
  assert.match(read('api/observation-summary.js'), /approved_observation_summary/);
  assert.match(read('api/observation-summary.js'), /scope: 'approved'/);
});

test('map redesign exposes a coherent command deck and accessibility states', () => {
  const html = read('index.html');
  const css = read('design-v2.css');
  assert.match(html, /id="map-command-deck"/);
  assert.match(html, /id="btn-reset-view"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /L\.control\.scale/);
  assert.match(css, /\.map-layer-switcher/);
  assert.match(css, /\.map-deck-btn\.active/);
  assert.match(css, /\.map-compass/);
});

test('health endpoint is safe for public operational checks', () => {
  const api = read('api/health.js');
  assert.match(api, /api_version: 'health-v1'/);
  assert.match(api, /observation_database/);
  assert.doesNotMatch(api, /response\.text/);
  assert.doesNotMatch(api, /SUPABASE_SECRET_KEY[^\n]*json/);
});

test('environment template contains placeholders only', () => {
  const env = read('.env.example');
  assert.match(env, /SUPABASE_SECRET_KEY=/);
  assert.match(env, /GEMINI_API_KEY=/);
  assert.match(env, /OBSERVATIONS_SUBMISSION_ENABLED=false/);
  assert.doesNotMatch(env, /SUPABASE_SECRET_KEY=\S+/);
  assert.doesNotMatch(env, /GEMINI_API_KEY=\S+/);
});
