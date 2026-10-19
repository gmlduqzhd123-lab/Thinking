import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseHoldout, summarizeHoldout } from '../scripts/holdout-core.mjs';

const header = 'id\tcohort\tquery\tallowedCards\thighRisk\treviewStatus\treviewNote';
const reviewedFixture = `${header}\nR01\trelated\t같은 전체에서 비교합니다.\tA|B\tyes\tapproved\t\nH01\thold\t조건이 없습니다.\t\tyes\tapproved\t`;

test('developer draft has 40 related and 20 hold cases but cannot be scored as reviewed', () => {
  const draft = readFileSync(new URL('../docs/HOLDOUT_DRAFT.tsv', import.meta.url), 'utf8');
  const rows = parseHoldout(draft, { requireReview: false });
  assert.equal(rows.length, 60);
  assert.equal(rows.filter(row => row.cohort === 'related').length, 40);
  assert.equal(rows.filter(row => row.cohort === 'hold').length, 20);
  assert.throws(() => parseHoldout(draft), /Teacher review is incomplete/);
  assert.throws(() => parseHoldout(draft.replaceAll('pending', 'approved')), /Developer draft wording is not teacher-authored/);
});

test('reviewed fixture enforces decisions and computes denominators', () => {
  const rows = parseHoldout(reviewedFixture, { exactSize: false });
  const summary = summarizeHoldout(rows, [
    { hold: false, topId: 'A', candidateIds: ['A', 'B', 'C'], keywordId: 'B' },
    { hold: true, topId: 'C', candidateIds: ['C', 'A', 'B'], keywordId: 'hold' },
  ]);
  assert.equal(summary.aiFirstRate, 1);
  assert.equal(summary.keywordFirstRate, 1);
  assert.equal(summary.aiSuppressionRate, 1);
  assert.equal(summary.highRiskSafe, 2);
  assert.throws(() => parseHoldout(reviewedFixture.replace('A|B', 'D'), { exactSize: false }), /allowed cards/);
  assert.throws(() => parseHoldout(reviewedFixture.replace('같은 전체에서 비교합니다.', '5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.'), { exactSize: false }), /overlaps development/);
});
