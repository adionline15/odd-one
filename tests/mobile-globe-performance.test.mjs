import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Earth globe uses a lower GPU budget on mobile', () => {
  const runtime = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(runtime, /const mobileGlobe = isMobile\(\)/);
  assert.match(runtime, /antialias: !mobileGlobe/);
  assert.match(runtime, /powerPreference: mobileGlobe \? 'low-power' : 'high-performance'/);
  assert.match(runtime, /\.globeCurvatureResolution\(mobileGlobe \? 1 : 2\)/);
  assert.match(runtime, /\.showAtmosphere\(!mobileGlobe\)/);
});

test('Earth globe pauses auto-rotation when the document is hidden', () => {
  const runtime = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(runtime, /document\.addEventListener\('visibilitychange'/);
  assert.match(runtime, /!document\.hidden && earthOverviewActive && !prefersReducedMotion/);
});

test('Earth globe reports ready and failed lifecycle states for diagnostics', () => {
  const runtime = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(runtime, /dataset\.globeState = 'ready'/);
  assert.match(runtime, /dataset\.globeState = 'failed'/);
  assert.match(runtime, /using the road map fallback/);
});


test('Earth globe startup does not create a duplicate WebGL instance', () => {
  const runtime = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.equal((runtime.match(/\binitEarthGlobe\(\);/g) || []).length, 1);
  assert.doesNotMatch(runtime, /setTimeout\(initEarthGlobe\s*,\s*0\)/);
});


test('Earth globe falls back to the road map if loading stalls', () => {
  const runtime = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(runtime, /If the texture\/CDN never finishes loading/);
  assert.match(runtime, /let earthGlobeLoadTimeout = null/);
  assert.match(runtime, /earthGlobeLoadTimeout = setTimeout\(/);
  assert.match(runtime, /clearTimeout\(earthGlobeLoadTimeout\)/);
  assert.match(runtime, /earthGlobeEl\.dataset\.globeState === 'ready' \|\| !earthGlobe/);
  assert.match(runtime, /earthGlobeEl\.dataset\.globeState = 'failed'/);
  assert.match(runtime, /setEarthOverview\(false\);/);
});
