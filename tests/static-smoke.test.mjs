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
  assert.match(html, /No synthetic road statistics/);
});

test('routing clearly distinguishes approximate output', () => {
  const html = read('index.html');
  assert.match(html, /APPROX/);
  assert.match(html, /estimates, not verified road conditions/);
});

test('observation APIs use approved-only paths', () => {
  assert.match(read('api/observations.js'), /status=eq\.approved/);
  assert.match(read('api/observations.js'), /approved_observations_in_view/);
  assert.match(read('api/observation-summary.js'), /approved_observation_summary/);
  assert.match(read('api/observation-summary.js'), /scope: 'approved'/);
});

test('health endpoint does not expose secrets or upstream bodies', () => {
  const api = read('api/health.js');
  assert.match(api, /api_version: 'health-v1'/);
  assert.match(api, /observation_database/);
  assert.doesNotMatch(api, /process\.env\.SUPABASE_SECRET_KEY[^\n]*json/);
  assert.doesNotMatch(api, /response\.text/);
});

test('tracked environment template contains placeholders only', () => {
  const env = read('.env.example');
  assert.match(env, /SUPABASE_SECRET_KEY=/);
  assert.match(env, /GEMINI_API_KEY=/);
  assert.match(env, /OBSERVATIONS_SUBMISSION_ENABLED=false/);
  assert.doesNotMatch(env, /SUPABASE_SECRET_KEY=\S+/);
  assert.doesNotMatch(env, /GEMINI_API_KEY=\S+/);
});
