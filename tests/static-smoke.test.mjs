import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('frontend preserves verified observation boundaries', () => {
  const html = read('index.html');
  const runtime = read('app.js');
  // Runtime contracts belong to app.js after the inline script extraction.
  assert.match(runtime, /\/api\/observations\?/);
  assert.match(runtime, /observations-v6/);
  // Publicly served observation records are restricted by the API contract.
  assert.match(read('api/observations.js'), /approved_observations_in_view/);
  assert.match(read('api/observation-summary.js'), /scope: 'approved'/);
});

test('routing distinguishes approximate output', () => {
  const html = read('index.html');
  const runtime = read('app.js');
  assert.match(runtime, /APPROX/);
  assert.match(runtime, /estimates, not verified road conditions/);
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
  const runtime = read('app.js');
  const css = read('design-v2.css');
  assert.match(html, /id="map-command-deck"/);
  assert.match(html, /id="btn-reset-view"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(runtime, /L\.control\.scale/);
  assert.match(css, /\.map-layer-switcher/);
  assert.match(css, /\.map-deck-btn\.active/);
  assert.match(css, /\.map-compass/);
});

test('map intelligence aborts superseded viewport requests', () => {
  const html = read('index.html');
  const runtime = read('app.js');
  assert.match(runtime, /let observationSummaryAbortController = null/);
  assert.match(runtime, /observationSummaryAbortController\?\.abort\(\)/);
  assert.match(runtime, /signal: observationSummaryAbortController\.signal/);
  assert.match(runtime, /let roadChangeAbortController = null/);
  assert.match(runtime, /roadChangeAbortController\?\.abort\(\)/);
  assert.match(runtime, /signal: roadChangeAbortController\.signal/);
});

test('observation viewport loads skip duplicate requests', () => {
  const html = read('index.html');
  const runtime = read('app.js');
  assert.match(runtime, /let lastLoadedObservationViewportKey = ''/);
  assert.match(runtime, /if \(observationViewportKey === lastLoadedObservationViewportKey\) return;/);
  assert.match(runtime, /lastLoadedObservationViewportKey = observationViewportKey/);
});

test('map intelligence ignores stale road-change responses', () => {
  const html = read('index.html');
  const runtime = read('app.js');
  assert.match(runtime, /let roadChangeRequestId = 0/);
  assert.match(runtime, /const requestId = \+\+roadChangeRequestId/);
  assert.match(runtime, /if \(requestId !== roadChangeRequestId\) return;/);
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
  const runtime = read('app.js');
  assert.match(html, /id="map-live-context"/);
  assert.match(html, /id="map-zoom-value"/);
  assert.match(runtime, /function updateMapContext\(\)/);
  assert.match(runtime, /map\.on\('zoomend', updateMapContext/);
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

test('Earth-to-location transitions cancel stale camera handoffs', () => {
  const runtime = read('app.js');
  assert.match(runtime, /let earthTransitionId = 0/);
  assert.match(runtime, /const transitionId = \+\+earthTransitionId/);
  assert.match(runtime, /if \(transitionId !== earthTransitionId\) return/);
  assert.match(runtime, /earthTransitionId \+= 1;\s*setEarthOverview\(false\)/);
});

test('reset returns to Earth and invalidates pending location transitions', () => {
  const runtime = read('app.js');
  const reset = runtime.slice(runtime.indexOf('function resetMapView'), runtime.indexOf('// Initial tile layer setup'));
  assert.match(reset, /clearTimeout\(earthTransitionTimer\)/);
  assert.match(reset, /earthTransitionId \+= 1/);
  assert.match(reset, /setEarthOverview\(true\)/);
  assert.match(reset, /pointOfView\(\{ lat: 22, lng: 78, altitude: 2\.15 \}/);
});

test('location search hands off from Earth before detailed Leaflet zoom', () => {
  const runtime = read('app.js');
  const handoff = runtime.slice(runtime.indexOf('function showEarthThenZoom'), runtime.indexOf('function updateGlobeOverview'));
  assert.ok(handoff.indexOf('setEarthOverview(false)') < handoff.indexOf('map.flyTo(coords, zoom'));
  assert.match(handoff, /map\.setView\(coords, Math\.min\(5, zoom\), \{ animate: false \}\)/);
  assert.match(runtime, /showEarthThenZoom\(c, 13, city\)/);
  assert.match(runtime, /showEarthThenZoom\(c, 14, name\)/);
});

test('location marker styling survives Earth-to-map handoff', () => {
  const runtime = read('app.js');
  assert.match(runtime, /function showEarthThenZoom\(coords, zoom, name, markerColor = '#ef4444'\)/);
  assert.match(runtime, /placeMarker\(coords, name, markerColor\)/);
  assert.match(runtime, /showEarthThenZoom\(c, 15, 'My location', '#3b82f6'\)/);
  assert.match(runtime, /const markerRgb = markerColor === '#3b82f6'/);
});

test('Earth globe clicks can navigate to a selected coordinate', () => {
  const runtime = read('app.js');
  assert.match(runtime, /earthGlobe\.onGlobeClick\(\(\{ lat, lng \}\) =>/);
  assert.match(runtime, /showEarthThenZoom\(\[lat, lng\], 13, 'Selected location'\)/);
  assert.match(runtime, /if \(!Number\.isFinite\(lat\) \|\| !Number\.isFinite\(lng\)\) return/);
});

test('external geocoder results are escaped and coordinates validated', () => {
  const runtime = read('app.js');
  assert.match(runtime, /const safeName = escapeHTML\(r\.display_name\.split\(','\)\[0\]\)/);
  assert.match(runtime, /const lat = Number\(r\.lat\)/);
  assert.match(runtime, /const lon = Number\(r\.lon\)/);
  assert.match(runtime, /if \(!Number\.isFinite\(lat\) \|\| !Number\.isFinite\(lon\)\) return ''/);
});

test('location navigation falls back cleanly when WebGL Earth is unavailable', () => {
  const runtime = read('app.js');
  const handoff = runtime.slice(runtime.indexOf('function showEarthThenZoom'), runtime.indexOf('function updateGlobeOverview'));
  assert.match(handoff, /if \(!earthGlobe\)/);
  assert.match(handoff, /setEarthOverview\(false\)/);
  assert.match(handoff, /map\.flyTo\(coords, zoom, \{ duration: 1\.2, easeLinearity: 0\.2 \}\)/);
  assert.match(handoff, /placeMarker\(coords, name, markerColor\)/);
});

test('WebGL initialization errors do not leave a blocking Earth overlay', () => {
  const runtime = read('app.js');
  const init = runtime.slice(runtime.indexOf('function initEarthGlobe'), runtime.indexOf('function showEarthThenZoom'));
  assert.match(init, /try \{/);
  assert.match(init, /catch \(error\)/);
  assert.match(init, /earthGlobe = null/);
  assert.match(init, /earthGlobeEl\.classList\.remove\('is-loading'\)/);
  assert.match(init, /setEarthOverview\(false\)/);
});
