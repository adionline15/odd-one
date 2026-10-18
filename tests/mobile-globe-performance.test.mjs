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
