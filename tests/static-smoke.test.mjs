import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('frontend keeps the verified observation boundary', () => {
  const html = read('index.html');

  assert.match(html, /\/api\/observations\?/);
  assert.match(html, /observations-v6/);
  assert.match(html, /Only approved observations are surfaced as public intelligence/);
  assert.match(html, /No synthetic road statistics/);
});

test('frontend distinguishes approximate routing from provider routing', () => {
  const html = read('index.html');

  assert.match(html, /APPROX/);
  assert.match(html, /estimates, not verified road conditions/);
  assert.match(html, /Do not manufacture road-coverage numbers/);
});

test('observation API keeps public reads approved-only', () => {
  const api = read('api/observations.js');

  assert.match(api, /status=eq\.approved/);
  assert.match(api, /approved_observations_in_view/);
  assert.match(api, /Observation service unavailable/);
});

test('observation summary uses the approved-only RPC', () => {
  const api = read('api/observation-summary.js');

  assert.match(api, /approved_observation_summary/);
  assert.match(api, /scope: 'approved'/);
  assert.match(api, /observation-summary-v1/);
});

test('production health endpoint does not expose secrets', () => {
  const api = read('api/health.js');

  assert.match(api, /api_version: 'health-v1'/);
  assert.match(api, /observation_database/);
  assert.doesNotMatch(api, /console\.log\(.*SUPABASE/);
  assert.doesNotMatch(api, /process\.env\.SUPABASE_SECRET_KEY[^\n]*json/);
});

test('secret environment values are kept out of tracked example values', () => {
  const env = read('.env.example');

  assert.match(env, /SUPABASE_SECRET_KEY=/);
  assert.match(env, /GEMINI_API_KEY=/);
  assert.match(env, /OBSERVATIONS_SUBMISSION_ENABLED=false/);
  assert.doesNotMatch(env, /SUPABASE_SECRET_KEY=\S+/);
  assert.doesNotMatch(env, /GEMINI_API_KEY=\S+/);
});
