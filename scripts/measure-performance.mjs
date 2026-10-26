import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { chromium } from 'playwright';

const runs = Number(process.env.PERF_RUNS ?? 30);
if (!Number.isInteger(runs) || runs < 1 || runs > 100) throw new Error('PERF_RUNS must be an integer from 1 to 100');
const url = process.env.TEST_URL ?? 'http://127.0.0.1:4173/';
const origin = new URL(url).origin;
const manifest = JSON.parse(readFileSync(new URL('../model-assets.json', import.meta.url), 'utf8'));
const browserPath = process.env.M0_BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft Edge/Application/msedge.exe',
].find(existsSync);
const browser = await chromium.launch(browserPath ? { executablePath: browserPath, headless: true } : { channel: 'msedge', headless: true });

try {
  const page = await browser.newPage();
  const requests = [];
  const errors = [];
  page.on('request', request => requests.push({ method: request.method(), url: request.url(), body: request.postData() ?? '' }));
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  const prepareStart = performance.now();
  await page.getByRole('button', { name: '모델 준비' }).click();
  await page.getByText('모델 상태: 준비됨').waitFor({ timeout: 120_000 });
  const prepareUiMs = performance.now() - prepareStart;

  // The school target specifies up to 160 characters. Use the same fixed,
  // non-personal concept question in every run so the measurement is repeatable.
  const phrase = '같은 전체를 같은 크기로 나눌 때 분모가 커지면 한 조각은 더 커진다고 생각해요. ';
  const query = phrase.repeat(4).slice(0, 160);
  assert.equal(query.length, 160);
  const durations = [];
  for (let i = 0; i < runs; i++) {
    await page.locator('#query').fill(query);
    const start = performance.now();
    await page.getByRole('button', { name: '추천 실행' }).click();
    await page.getByText('모델 상태: 준비됨').waitFor({ timeout: 15_000 });
    assert.match(await page.locator('#result').innerText(), /AI 의미 비교 후보|이유를 더 확인해야 합니다/);
    assert.match(await page.locator('#result').innerText(), /준비 후 추론/);
    durations.push(performance.now() - start);
  }

  assert.deepEqual(errors, []);
  assert.ok(requests.every(request => request.method === 'GET' && new URL(request.url).origin === origin), 'unexpected network request');
  assert.ok(requests.every(request => !`${request.url} ${request.body}`.includes(query) && !`${request.url} ${request.body}`.includes(encodeURIComponent(query))), 'query leaked to network');
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  await page.getByRole('button', { name: '종료' }).click();
  assert.equal(await page.locator('#query').inputValue(), '');

  const sorted = durations.toSorted((a, b) => a - b);
  const p95 = sorted[Math.ceil(runs * 0.95) - 1];
  console.log(JSON.stringify({
    environment: 'current local machine; not school-device evidence',
    browser: browser.version(),
    modelRevision: manifest.revision,
    sampleCount: runs,
    queryLength: query.length,
    prepareUiMs: Math.round(prepareUiMs),
    readyQueryP95UiMs: Math.round(p95),
    readyQueryMinUiMs: Math.round(sorted[0]),
    readyQueryMaxUiMs: Math.round(sorted.at(-1)),
    schoolPcVerified: false,
  }, null, 2));
} finally {
  await browser.close();
}
