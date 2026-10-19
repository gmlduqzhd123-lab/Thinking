import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { verifyAssets } from '../scripts/asset-integrity.mjs';

test('asset verification rejects missing and corrupted files', () => {
  const folder = mkdtempSync(join(tmpdir(), 'forks-m0-integrity-'));
  const root = pathToFileURL(`${folder}/`);
  const bytes = Buffer.from('verified model fixture');
  const manifest = { files: { 'model.bin': [bytes.length, createHash('sha256').update(bytes).digest('hex')] } };
  try {
    assert.throws(() => verifyAssets(root, manifest), /Missing asset/);
    writeFileSync(join(folder, 'model.bin'), bytes);
    assert.deepEqual(verifyAssets(root, manifest), { count: 1, total: bytes.length });
    writeFileSync(join(folder, 'model.bin'), Buffer.from('corrupt model fixture!'));
    assert.throws(() => verifyAssets(root, manifest), /Size mismatch|Hash mismatch/);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
