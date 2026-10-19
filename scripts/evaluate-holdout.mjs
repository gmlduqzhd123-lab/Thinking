import { readFileSync, existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { parseHoldout, summarizeHoldout, holdoutHash } from './holdout-core.mjs';
import { baseline, examples } from '../src/cards.ts';

const smoke = process.argv.includes('--smoke');
const file = process.argv.find(arg => !arg.startsWith('--') && arg !== process.argv[0] && arg !== process.argv[1]);
if (!smoke && !file) throw new Error('Usage: npm run test:holdout -- path/to/teacher-reviewed.tsv');
const source = smoke ? '' : readFileSync(file, 'utf8');
const rows = smoke ? examples.slice(0, 2).map(e => ({ id: e.id, query: e.text })) : parseHoldout(source);
const browserPath = process.env.M0_BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
const browser = await chromium.launch(browserPath ? { executablePath: browserPath, headless: true } : { channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  const requests = [];
  const logs = [];
  page.on('request', r => requests.push({ method: r.method(), url: r.url(), payload: `${r.postData() || ''} ${JSON.stringify(r.headers())}` }));
  page.on('console', m => logs.push(m.text()));
  const url = process.env.TEST_URL || 'http://127.0.0.1:4173/';
  await page.goto(url);
  await page.getByRole('button', { name: '모델 준비' }).click();
  await page.locator('#state').filter({ hasText: /준비됨|실패/ }).waitFor({ timeout: 120000 });
  if (await page.locator('#state').textContent() !== '모델 상태: 준비됨') throw new Error('Local model preparation failed');
  const outcomes = [];
  const latencies = [];
  for (const row of rows) {
    await page.locator('#query').fill(row.query);
    const started = performance.now();
    await page.getByRole('button', { name: '추천 실행' }).click();
    await page.locator('#state').filter({ hasText: /준비됨|실패/ }).waitFor({ timeout: 15000 });
    if (await page.locator('#state').textContent() !== '모델 상태: 준비됨') throw new Error('Local inference failed');
    latencies.push(performance.now() - started);
    const hold = await page.locator('#result').getAttribute('data-hold');
    if (hold !== 'true' && hold !== 'false') throw new Error('Missing structured inference result');
    const candidateIds = await page.locator('#result [data-card-id]').evaluateAll(items => items.map(item => item.getAttribute('data-card-id')));
    outcomes.push({ hold: hold === 'true', topId: candidateIds[0] || null, candidateIds, keywordId: baseline(row.query) });
  }
  const origin = new URL(url).origin;
  if (requests.some(request => request.method !== 'GET' || new URL(request.url).origin !== origin)) throw new Error('Unexpected network request');
  if (rows.some(row => requests.some(request => `${request.url} ${request.payload}`.includes(row.query) || `${request.url} ${request.payload}`.includes(encodeURIComponent(row.query))) || logs.some(log => log.includes(row.query)))) throw new Error('Query appeared in a request or console');
  if (await page.evaluate(() => localStorage.length + sessionStorage.length) !== 0) throw new Error('Browser storage is not empty');
  await page.getByRole('button', { name: '종료' }).click();
  if (await page.locator('#query').inputValue()) throw new Error('Query remained after end');
  if (smoke) {
    console.log(JSON.stringify({ mode: 'technical-smoke-only', actualBrowserInference: true, cases: outcomes.length, qualityEvaluated: false }));
  } else {
    const ordered = latencies.toSorted((a, b) => a - b);
    const summary = summarizeHoldout(rows, outcomes);
    console.log(JSON.stringify({ mode: 'self-attested-review-input', humanReviewIndependentlyVerified: false, datasetSha256: holdoutHash(source), cases: rows.length, ...summary, p95ReadyQueryMs: Math.round(ordered[Math.ceil(ordered.length * .95) - 1]), top3Caution: 'Three cards total; top3 coverage is not evidence of added value' }, null, 2));
  }
} finally {
  await browser.close();
}
