import test from 'node:test';
import assert from 'node:assert/strict';
import { registerUnit, getUnit, listUnits, clearRegistry } from '../src/unit-registry.ts';
import m01 from '../src/units/m01.ts';

test('unit registry registers, retrieves, and lists units', () => {
  clearRegistry();
  assert.equal(listUnits().length, 0);

  registerUnit(m01);
  assert.equal(listUnits().length, 1);
  assert.equal(getUnit('M01').title, m01.title);

  assert.throws(() => registerUnit(m01), /already registered/);
  assert.throws(() => getUnit('M99'), /not found/);

  clearRegistry();
  assert.equal(listUnits().length, 0);
});
