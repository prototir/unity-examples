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
assert.equal(
  packages.dependencies['com.prototir.sdk'],
  'https://github.com/prototir/unity-sdk.git#v0.1.0'
);
const manifest = JSON.parse(read('Assets/Prototir/prototir.json'));
assert.equal(manifest.runtime?.engine, 'unity');
assert.equal(manifest.runtime?.profile, 'standard');
assert.equal(manifest.ai?.mode, 'managed');
assert.match(read('Assets/Scripts/PrototirExample.cs'), /PrototirSdk\.Ready\(\)/);

console.log('Unity example structure checks passed.');
