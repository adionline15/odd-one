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

test('map intelligence aborts superseded viewport requests', () => {
  const html = read('index.html');
  assert.match(html, /let observationSummaryAbortController = null/);
  assert.match(html, /observationSummaryAbortController\?\.abort\(\)/);
  assert.match(html, /signal: observationSummaryAbortController\.signal/);
  assert.match(html, /let roadChangeAbortController = null/);
  assert.match(html, /roadChangeAbortController\?\.abort\(\)/);
  assert.match(html, /signal: roadChangeAbortController\.signal/);
});

test('observation viewport loads skip duplicate requests', () => {
  const html = read('index.html');
  assert.match(html, /let lastLoadedObservationViewportKey = ''/);
  assert.match(html, /if \(observationViewportKey === lastLoadedObservationViewportKey\) return;/);
  assert.match(html, /lastLoadedObservationViewportKey = observationViewportKey/);
});

test('map intelligence ignores stale road-change responses', () => {
  const html = read('index.html');
  assert.match(html, /let roadChangeRequestId = 0/);
  assert.match(html, /const requestId = \+\+roadChangeRequestId/);
  assert.match(html, /if \(requestId !== roadChangeRequestId\) return;/);
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

test('map exposes live viewport context', () => {
  const html = read('index.html');
  assert.match(html, /id="map-live-context"/);
  assert.match(html, /id="map-zoom-value"/);
  assert.match(html, /function updateMapContext\(\)/);
  assert.match(html, /map\.on\('zoomend', updateMapContext/);
});

test('map has an accessible region role',()=>assert.match(read('interaction-v2.js'),/getElementById\('map'\)\?\.setAttribute\('role','region'\)/));

test('map is keyboard focusable',()=>assert.match(read('interaction-v2.js'),/getElementById\('map'\)\?\.setAttribute\('tabindex','0'\)/));

test('map command deck has an accessible label',()=>assert.match(read('interaction-v2.js'),/map-command-deck.*aria-label/));

test('standard map control has a title',()=>assert.match(read('interaction-v2.js'),/btn-map.*Standard road map/));

test('satellite control has a title',()=>assert.match(read('interaction-v2.js'),/btn-sat.*Satellite imagery/));

test('reset control has a title',()=>assert.match(read('interaction-v2.js'),/btn-reset-view.*Reset to India overview/));

test('location control has a title',()=>assert.match(read('interaction-v2.js'),/btn-loc.*Center on my location/));

test('compass exposes an image role',()=>assert.match(read('interaction-v2.js'),/map-orientation.*role','img'/));

test('compass describes north orientation',()=>assert.match(read('interaction-v2.js'),/Map orientation: north is up/));

test('map scale exposes context',()=>assert.match(read('interaction-v2.js'),/map-scale-wrap.*Map scale and viewport context/));

test('live map context is a status',()=>assert.match(read('interaction-v2.js'),/map-live-context.*role','status'/));

test('zoom value has an accessible label',()=>assert.match(read('interaction-v2.js'),/map-zoom-value.*Current map zoom/));

test('search autocomplete is controlled',()=>assert.match(read('interaction-v2.js'),/s-input.*autocomplete','off'/));

test('desktop origin uses address autocomplete',()=>assert.match(read('interaction-v2.js'),/d-from.*autocomplete','street-address'/));
