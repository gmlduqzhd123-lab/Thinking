import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INFERENCE_TIMEOUT_MS,
  MAX_QUERY_LENGTH,
  MIN_PARTICIPANTS,
  MAX_PARTICIPANTS,
  DENOMINATOR_MIN,
  DENOMINATOR_MAX,
  TIMER_INTERVAL_MS,
  TIMER_EXTEND_SECONDS,
  DEFAULT_MINUTES,
  MINUTES_OPTIONS,
} from '../src/constants.ts';

test('constants have expected types and ranges', () => {
  assert.equal(typeof INFERENCE_TIMEOUT_MS, 'number');
  assert.ok(INFERENCE_TIMEOUT_MS > 0);

  assert.equal(typeof MAX_QUERY_LENGTH, 'number');
  assert.ok(MAX_QUERY_LENGTH > 0);

  assert.ok(MIN_PARTICIPANTS >= 1);
  assert.ok(MAX_PARTICIPANTS > MIN_PARTICIPANTS);

  assert.ok(DENOMINATOR_MIN >= 2);
  assert.ok(DENOMINATOR_MAX > DENOMINATOR_MIN);

  assert.ok(TIMER_INTERVAL_MS > 0);
  assert.ok(TIMER_EXTEND_SECONDS > 0);

  assert.ok(DEFAULT_MINUTES > 0);
  assert.ok(MINUTES_OPTIONS.length >= 2);
  assert.ok(MINUTES_OPTIONS.includes(DEFAULT_MINUTES));
});

test('constants are consistent with lesson-core expectations', () => {
  // These values must match the regex in parseParticipants
  assert.equal(MIN_PARTICIPANTS, 1);
  assert.equal(MAX_PARTICIPANTS, 60);

  // Denominator range used in fractionSegments
  assert.equal(DENOMINATOR_MIN, 2);
  assert.equal(DENOMINATOR_MAX, 12);
});
