import test from 'node:test';
import assert from 'node:assert/strict';
import { judge } from '../src/judge.ts';

test('low similarity and close candidates hold', () => {
  assert.equal(judge([{ id: 'A', similarity: .2 }]).hold, true);
  assert.equal(judge([{ id: 'A', similarity: .7 }, { id: 'B', similarity: .68 }]).hold, true);
  assert.equal(judge([{ id: 'A', similarity: .7 }, { id: 'B', similarity: .5 }]).hold, false);
});

test('different whole and correct explanation do not force a misconception', () => {
  const scores = [{ id: 'A', similarity: .9 }, { id: 'B', similarity: .5 }];
  assert.equal(judge(scores, '두 전체 길이가 서로 다르면 비교가 달라져요.').hold, true);
  assert.equal(judge(scores, '같은 전체를 더 많이 나누면 한 조각은 작아져요.').hold, true);
});

test('customThresholds override minSimilarity and minMargin', () => {
  const scores = [{ id: 'A', similarity: 0.52 }, { id: 'B', similarity: 0.46 }];
  assert.equal(judge(scores, '5가 크니까 1/5이 커요').hold, false);
  assert.equal(judge(scores, '5가 크니까 1/5이 커요', { minSimilarity: 0.60 }).hold, true);
  assert.equal(judge(scores, '5가 크니까 1/5이 커요', { minMargin: 0.10 }).hold, true);
});
