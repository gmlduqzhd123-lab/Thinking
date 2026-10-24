import test from 'node:test';
import assert from 'node:assert/strict';
import { registerUnit, getUnit, listUnits, clearRegistry } from '../src/unit-registry.ts';
import m01 from '../src/units/m01.ts';
import m02 from '../src/units/m02.ts';
import { cards, examples } from '../src/cards.ts';
import { holdRules, thresholds } from '../src/judge.ts';

test('unit registry registers, retrieves, and lists units', () => {
  clearRegistry();
  assert.equal(listUnits().length, 0);

  registerUnit(m01);
  registerUnit(m02);
  assert.equal(listUnits().length, 2);
  assert.equal(getUnit('M01').title, m01.title);
  assert.equal(getUnit('M02').title, m02.title);
  assert.deepEqual(getUnit('M02').denominators.first, [4, 7]);

  assert.throws(() => registerUnit(m01), /already registered/);
  assert.throws(() => getUnit('M99'), /not found/);

  clearRegistry();
  assert.equal(listUnits().length, 0);
});

test('m01 unit definition stays in sync with cards.ts and judge.ts', () => {
  assert.deepEqual(m01.cards, cards);
  assert.deepEqual(m01.examples, examples);
  assert.deepEqual(m01.thresholds, thresholds);
  assert.equal(m01.holdPatterns.length, holdRules.length);
  for (let i = 0; i < holdRules.length; i++) {
    assert.equal(m01.holdPatterns[i].pattern, holdRules[i].test.source);
    assert.equal(m01.holdPatterns[i].reason, holdRules[i].reason);
  }
});
