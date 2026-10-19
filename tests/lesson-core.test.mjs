import test from 'node:test';
import assert from 'node:assert/strict';
import { FIRST_ITEM, TRANSFER_ITEM, fractionSegments, parseParticipants, percentagePointChange, validateCounts } from '../src/lesson-core.ts';

test('participant and complete count validation keep unknown separate from no response', () => {
  for (const invalid of ['', '0', '-1', '1.5', '61', '01', ' 20']) assert.equal(parseParticipants(invalid), null);
  assert.equal(parseParticipants('1'), 1); assert.equal(parseParticipants('60'), 60);
  const valid = validateCounts({ A: '10', B: '5', C: '2', D: '1' }, 20);
  assert.equal(valid?.counts.D, 1);
  assert.equal(valid?.noResponse, 2);
  for (const value of ['', '-1', '1.5', '1e2']) assert.equal(validateCounts({ A: value, B: '0', C: '0', D: '0' }, 20), null);
  assert.equal(validateCounts({ A: '21', B: '0', C: '0', D: '0' }, 20), null);
});

test('first and reselect share an item; transfer differs; 10/20 to 15/20 is 25 percentage points', () => {
  assert.equal(FIRST_ITEM.id, 'M01-UF-01'); assert.equal(FIRST_ITEM.version, 1);
  assert.notEqual(FIRST_ITEM.id, TRANSFER_ITEM.id);
  assert.equal(percentagePointChange(10, 15, 20), 25);
});

test('all supported unit fraction bars partition one exact whole', () => {
  for (let denominator = 2; denominator <= 12; denominator++) {
    const segments = fractionSegments(denominator);
    assert.equal(segments.length, denominator);
    assert.equal(segments[0].start, 0);
    assert.equal(segments.at(-1).end, 1);
    for (let i = 1; i < segments.length; i++) assert.equal(segments[i].start, segments[i - 1].end);
  }
  assert.throws(() => fractionSegments(1), RangeError);
  assert.throws(() => fractionSegments(13), RangeError);
});
