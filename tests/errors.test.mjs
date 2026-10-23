import test from 'node:test';
import assert from 'node:assert/strict';
import { errorMessages, checkWasmSupport, getUserMessage } from '../src/errors.ts';

test('errorMessages covers all expected error codes', () => {
  const codes = [
    'WORKER_INIT',
    'MODEL_DOWNLOAD',
    'WASM_UNSUPPORTED',
    'INFERENCE_TIMEOUT',
    'CONTRACT_MISMATCH',
    'NETWORK',
    'UNKNOWN',
  ];
  for (const code of codes) {
    assert.equal(typeof errorMessages[code], 'string');
    assert.ok(errorMessages[code].length > 0);
    assert.equal(getUserMessage(code), errorMessages[code]);
  }
});

test('checkWasmSupport returns true in Node.js 24 environment', () => {
  assert.equal(checkWasmSupport(), true);
});
