import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
for (const path of [
  'Assets/Scenes/Main.unity',
  'Assets/Scripts/PrototirExample.cs',
  'Assets/Prototir/prototir.json',
  'Packages/manifest.json',
  'ProjectSettings/ProjectVersion.txt'
]) assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), `Missing ${path}`);

const packages = JSON.parse(read('Packages/manifest.json'));
// The invariant is that the example pins a release, not that it pins one particular release.
// A literal version here only asserted that nobody had shipped an SDK since, and the fix was to
// edit the number, which proves nothing: what actually matters is that two people opening this
// example on different days get the same code.
const sdk = packages.dependencies['com.prototir.sdk'];
assert.match(
  sdk,
  /^https:\/\/github\.com\/prototir\/unity-sdk\.git#v\d+\.\d+\.\d+$/,
  `the example must pin a tagged SDK release, got ${sdk}`
);
const manifest = JSON.parse(read('Assets/Prototir/prototir.json'));
assert.equal(manifest.runtime?.engine, 'unity');
assert.equal(manifest.runtime?.profile, 'standard');
assert.equal(manifest.ai?.mode, 'managed');
assert.match(read('Assets/Scripts/PrototirExample.cs'), /PrototirSdk\.Ready\(\)/);

console.log('Unity example structure checks passed.');
