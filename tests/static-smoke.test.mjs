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
  assert.match(html, /Verified layer only · no synthetic road statistics/i);
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

test('desktop destination uses address autocomplete',()=>assert.match(read('interaction-v2.js'),/d-to.*autocomplete','street-address'/));

test('mobile origin uses address autocomplete',()=>assert.match(read('interaction-v2.js'),/m-from.*autocomplete','street-address'/));

test('mobile destination uses address autocomplete',()=>assert.match(read('interaction-v2.js'),/m-to.*autocomplete','street-address'/));

test('route buttons are explicit buttons',()=>assert.match(read('interaction-v2.js'),/d-go-btn,#m-go-btn.*type','button'/));

test('navigation tabs expose keyboard shortcuts',()=>assert.match(read('interaction-v2.js'),/data-nav-tab.*aria-keyshortcuts/));

test('map exposes a role description',()=>assert.match(read('interaction-v2.js'),/map.*aria-roledescription','interactive map'/));

test('route provider status has a title',()=>assert.match(read('interaction-v2.js'),/route-status-source.*Route provider status/));

test('observation status is announced',()=>assert.match(read('interaction-v2.js'),/observation-status-strip.*role','status'/));

test('observation count is polite live content',()=>assert.match(read('interaction-v2.js'),/obs-status-count.*aria-live','polite'/));

test('stats content is announced',()=>assert.match(read('interaction-v2.js'),/stats-content.*aria-live','polite'/));

test('route status is announced',()=>assert.match(read('interaction-v2.js'),/route-status-overlay.*aria-live','polite'/));

test('location status is announced',()=>assert.match(read('interaction-v2.js'),/btn-loc.*aria-live','polite'/));

test('sheet toggle is labelled',()=>assert.match(read('interaction-v2.js'),/sheet-toggle.*Open map intelligence panel/));

test('sidebar toggle is labelled',()=>assert.match(read('interaction-v2.js'),/toggle-btn.*Toggle intelligence sidebar/));

test('desktop tabs have tab roles',()=>assert.match(read('interaction-v2.js'),/dt-alerts,#dt-route,#dt-data.*role','tab'/));

test('mobile tabs have tab roles',()=>assert.match(read('interaction-v2.js'),/mt-alerts,#mt-route,#mt-data.*role','tab'/));

test('map shortcuts are documented',()=>assert.match(read('interaction-v2.js'),/map.*aria-keyshortcuts.*Escape/));

test('map shortcut M is documented',()=>assert.match(read('interaction-v2.js'),/btn-map.*aria-keyshortcuts','M'/));

test('satellite shortcut S is documented',()=>assert.match(read('interaction-v2.js'),/btn-sat.*aria-keyshortcuts','S'/));

test('location shortcut L is documented',()=>assert.match(read('interaction-v2.js'),/btn-loc.*aria-keyshortcuts','L'/));

test('reset shortcut is documented',()=>assert.match(read('interaction-v2.js'),/btn-reset-view.*aria-keyshortcuts','0'/));

test('command K focuses search',()=>assert.match(read('interaction-v2.js'),/e\.key==='k'.*s-input/));

test('M activates standard map',()=>assert.match(read('interaction-v2.js'),/e\.key==='m'.*btn-map.*click/));

test('S activates satellite map',()=>assert.match(read('interaction-v2.js'),/e\.key==='s'.*btn-sat.*click/));

test('L activates location control',()=>assert.match(read('interaction-v2.js'),/e\.key==='l'.*btn-loc.*click/));

test('zero activates reset view',()=>assert.match(read('interaction-v2.js'),/e\.key==='0'.*btn-reset-view.*click/));

test('contenteditable protects shortcuts',()=>assert.match(read('interaction-v2.js'),/isContentEditable/));

test('tabs support Home navigation',()=>assert.match(read('interaction-v2.js'),/e\.key==='Home'/));

test('tabs support End navigation',()=>assert.match(read('interaction-v2.js'),/e\.key==='End'/));

test('map focus receives an interaction label',()=>assert.match(read('interaction-v2.js'),/Interactive road intelligence map; use keyboard shortcuts/));

test('map layer state records standard map',()=>assert.match(read('interaction-v2.js'),/dataset\.mapLayer='map'/));

test('map layer state records satellite',()=>assert.match(read('interaction-v2.js'),/dataset\.mapLayer='sat'/));

test('live context uses polite announcements',()=>assert.match(read('interaction-v2.js'),/map-live-context.*aria-live','polite'/));

test('map stores current zoom state',()=>assert.match(read('interaction-v2.js'),/mapEl\.dataset\.zoom=String\(getMap\(\)\.getZoom\(\)\)/));

test('map stores viewport center state',()=>assert.match(read('interaction-v2.js'),/mapEl\.dataset\.center=getMap\(\)\.getCenter\(\)/));

test('map has a useful interaction title',()=>assert.match(read('interaction-v2.js'),/Pan and zoom to explore verified road intelligence/));

test('observations API declares its version constant',()=>assert.match(read('api/observations.js'),/OBSERVATIONS_API_VERSION = 'observations-v6'/));

test('observations API has a bounded public limit',()=>assert.match(read('api/observations.js'),/OBSERVATIONS_MAX_LIMIT = 500/));

test('observations API has a bounded viewport span',()=>assert.match(read('api/observations.js'),/OBSERVATIONS_MAX_VIEWPORT_SPAN = 60/));

test('observations API has an explicit cache policy',()=>assert.match(read('api/observations.js'),/OBSERVATIONS_CACHE_SECONDS = 15/));
