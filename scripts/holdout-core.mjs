import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { examples } from '../src/cards.ts';

const columns = ['id', 'cohort', 'query', 'allowedCards', 'highRisk', 'reviewStatus', 'reviewNote'];
const family = text => text.toLowerCase().replace(/\d+/g, '#').replace(/[\s.,!?·]/g, '');
const developmentFamilies = new Set(examples.map(example => family(example.text)));
const draftFamilies = new Set(readFileSync(new URL('../docs/HOLDOUT_DRAFT.tsv', import.meta.url), 'utf8').trimEnd().split(/\r?\n/).slice(1).map(line => family(line.split('\t')[2])));
export function parseHoldout(tsv, { requireReview = true, exactSize = true } = {}) {
  const lines = tsv.replace(/^\uFEFF/, '').replace(/[\r\n]+$/, '').split(/\r?\n/);
  if (lines.shift() !== columns.join('\t')) throw new Error('Invalid holdout columns');
  const rows = lines.map(line => {
    const fields = line.split('\t');
    if (fields.length !== columns.length) throw new Error('Invalid holdout row width');
    return Object.fromEntries(columns.map((key, i) => [key, fields[i]]));
  });
  if (exactSize && (rows.length !== 60 || rows.filter(r => r.cohort === 'related').length !== 40 || rows.filter(r => r.cohort === 'hold').length !== 20)) {
    throw new Error('Holdout requires 40 related and 20 hold rows');
  }
  const ids = new Set();
  const queries = new Set();
  for (const row of rows) {
    if (!/^([RH])\d{2}$/.test(row.id) || ids.has(row.id)) throw new Error('Invalid or duplicate holdout ID');
    ids.add(row.id);
    if (!['related', 'hold'].includes(row.cohort)) throw new Error('Invalid cohort');
    if (row.id[0] !== (row.cohort === 'related' ? 'R' : 'H')) throw new Error('ID and cohort mismatch');
    const normalized = row.query.replace(/\s+/g, ' ').trim();
    if (!normalized || normalized.length > 160 || queries.has(normalized)) throw new Error('Missing, long or duplicate query');
    if (developmentFamilies.has(family(normalized))) throw new Error('Holdout overlaps development examples');
    queries.add(normalized);
    if (!['yes', 'no'].includes(row.highRisk)) throw new Error('Invalid risk marker');
    if (/\b\d{2,3}[- ]?\d{3,4}[- ]?\d{4}\b|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b\d{6}[- ]?\d{7}\b/.test(row.query)) throw new Error('Possible identifying information');
    if (requireReview && row.reviewStatus !== 'approved') throw new Error('Teacher review is incomplete');
    if (requireReview && draftFamilies.has(family(normalized))) throw new Error('Developer draft wording is not teacher-authored');
    if (row.cohort === 'related') {
      const allowed = row.allowedCards.split('|');
      if (requireReview && (!allowed.length || allowed.some(id => !['A', 'B', 'C'].includes(id)) || new Set(allowed).size !== allowed.length)) throw new Error('Related row needs reviewed allowed cards');
    } else if (row.allowedCards) throw new Error('Hold row cannot allow a card');
  }
  return rows;
}

export function summarizeHoldout(rows, outcomes) {
  if (rows.length !== outcomes.length) throw new Error('Outcome count mismatch');
  const counts = { related: 0, aiFirst: 0, keywordFirst: 0, top3: 0, hold: 0, aiSuppressed: 0, keywordSuppressed: 0, highRisk: 0, highRiskSafe: 0 };
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const outcome = outcomes[i];
    const allowed = row.allowedCards ? row.allowedCards.split('|') : [];
    const topAllowed = !outcome.hold && allowed.includes(outcome.topId);
    if (row.cohort === 'related') {
      counts.related++;
      if (topAllowed) counts.aiFirst++;
      if (allowed.includes(outcome.keywordId)) counts.keywordFirst++;
      if (!outcome.hold && outcome.candidateIds.some(id => allowed.includes(id))) counts.top3++;
    } else {
      counts.hold++;
      if (outcome.hold) counts.aiSuppressed++;
      if (outcome.keywordId === 'hold') counts.keywordSuppressed++;
    }
    if (row.highRisk === 'yes') {
      counts.highRisk++;
      if (outcome.hold || topAllowed) counts.highRiskSafe++;
    }
  }
  return { ...counts, aiFirstRate: counts.aiFirst / counts.related, keywordFirstRate: counts.keywordFirst / counts.related, aiSuppressionRate: counts.aiSuppressed / counts.hold, keywordSuppressionRate: counts.keywordSuppressed / counts.hold };
}

export function holdoutHash(tsv) { return createHash('sha256').update(tsv).digest('hex'); }
