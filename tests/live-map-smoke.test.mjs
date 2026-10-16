import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Live Map page is a separate static entry point with pinned MapLibre', () => {
  const html = read('live-map.html');
  const js = read('live-map.js');
  const css = read('live-map.css');
  assert.ok(html.includes('<title>Odd-One Live'));
  assert.ok(html.includes('href="live-map.css"'));
  assert.ok(html.includes('src="live-map.js"'));
  assert.ok(html.includes('maplibre-gl@6.14.0'));
  assert.ok(js.includes('MAPLIBRE_VERSION = "6.14.0"'));
  assert.ok(css.length > 1000, 'standalone map stylesheet should be present');
});

test('Live Map clearly labels synthetic data and keeps GPS opt-in and local', () => {
  const html = read('live-map.html');
  const js = read('live-map.js');
  assert.ok(html.includes('Simulated movement'));
  assert.ok(html.includes('synthetic examples, not actual vehicles'));
  assert.ok(html.includes('not sent to a server or shared with other users'));
  assert.ok(js.includes('navigator.geolocation.watchPosition'));
  assert.ok(js.includes('navigator.geolocation.clearWatch'));
  assert.ok(js.includes('Enable my GPS'));
  assert.ok(!/fetch\([^)]*(?:gps|location|coordinates)/i.test(js));
});

test('Homepage links to Live Map without replacing the existing map contract', () => {
  const html = read('index.html');
  assert.ok(html.includes('href="/live-map.html"'));
  assert.ok(html.includes('id="map"'));
  assert.ok(html.includes('aria-label="Primary navigation"'));
  assert.ok(html.includes('id="s-input"'));
  assert.ok(html.includes('PLAN ROUTE'));
  assert.ok(fs.statSync(path.join(root, 'index.html')).size <= 22000, 'index.html must stay within the CI byte budget');
});
