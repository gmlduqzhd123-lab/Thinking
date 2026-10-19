import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireUnitEmbedding } from '../src/embedding-integrity.ts';

test('embedding integrity rejects incompatible and invalid model output', () => {
  const valid = new Float32Array(384);
  valid[0] = 1;
  assert.equal(requireUnitEmbedding(valid, 384).length, 384);
  assert.throws(() => requireUnitEmbedding(valid, 383), /dimension/);
  const invalid = valid.slice();
  invalid[1] = NaN;
  assert.throws(() => requireUnitEmbedding(invalid, 384), /non-finite/);
  invalid[1] = Infinity;
  assert.throws(() => requireUnitEmbedding(invalid, 384), /non-finite/);
  assert.throws(() => requireUnitEmbedding(new Float32Array(384), 384), /not normalized/);
  const scaled = valid.slice();
  scaled[0] = 2;
  assert.throws(() => requireUnitEmbedding(scaled, 384), /not normalized/);
});
