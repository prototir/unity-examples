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
// Pin an immutable SDK revision so two people opening this project get the same code. A tagged
// release or a full commit hash works; Unity does not accept an abbreviated hash.
const sdk = packages.dependencies['com.prototir.sdk'];
assert.match(
  sdk,
  /^https:\/\/github\.com\/prototir\/unity-sdk\.git#(?:v\d+\.\d+\.\d+|[0-9a-f]{40})$/,
  `the example must pin an immutable SDK revision, got ${sdk}`
);
const lockedSdk = JSON.parse(read('Packages/packages-lock.json')).dependencies['com.prototir.sdk'];
assert.equal(lockedSdk.version, sdk, 'the lockfile must resolve the SDK revision in the manifest');
assert.equal(lockedSdk.source, 'git');
if (/#[0-9a-f]{40}$/.test(sdk))
  assert.equal(lockedSdk.hash, sdk.slice(-40), 'the lockfile must use that exact SDK commit');
const manifest = JSON.parse(read('Assets/Prototir/prototir.json'));
assert.equal(manifest.runtime?.engine, 'unity');
assert.equal(manifest.runtime?.profile, 'standard');
assert.equal(manifest.ai?.mode, 'managed');
assert.match(read('Assets/Scripts/PrototirExample.cs'), /PrototirSdk\.Ready\(\)/);

console.log('Unity example structure checks passed.');
