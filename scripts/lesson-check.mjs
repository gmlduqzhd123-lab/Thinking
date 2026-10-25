import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const browserPath = process.env.M0_BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft Edge/Application/msedge.exe',
].find(existsSync);
const browser = await chromium.launch(browserPath ? { executablePath: browserPath, headless: true } : { channel: 'msedge', headless: true });
const base = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const page = await browser.newPage();
const requests = [];
const errors = [];
page.on('request', request => requests.push({ method: request.method(), url: request.url(), body: request.postData() || '' }));
page.on('pageerror', error => errors.push(error.message));

try {
  await page.goto(new URL('lesson.html', base).href);

  // 1단계: 단원 카드 1클릭 시작 + 처음 생각 고르기 + 이유 말풍선
  assert.doesNotMatch(await page.locator('body').innerText(), /M01|M02|M03/);
  assert.equal(await page.locator('.step-pill').count(), 4);
  assert.match(await page.locator('#step h2').innerText(), /① 처음 생각 고르기/);

  await page.click('button[data-pick-poll="first"][data-pick-choice="B"]');
  assert.match(await page.locator('#poll-note').innerText(), /1\/5이 더 크다/);
  await page.click('button[data-reason="0"]');

  // 선택형 학급 인원 집계 접기 메뉴 검증
  await page.click('.class-poll-details summary');
  await page.click('button[data-action="fill-sample"][data-target-poll="first"]');
  assert.match(await page.locator('.class-poll-status').innerText(), /집계 완료/);

  // 2단계: 직접 실험하기 (내가 고른 생각 연결 + 실험 1 조각 포개기 + 실험 2 슬라이더/버튼)
  await page.click('button[data-action="next"]');
  assert.match(await page.locator('#step h2').innerText(), /② 직접 실험하기/);
  assert.match(await page.locator('.hypothesis-banner').innerText(), /1\/5이 더 크다/);

  await page.click('button[data-action="toggle-overlap"]');
  assert.equal(await page.locator('.overlap-comparison').isVisible(), true);
  assert.match(await page.locator('.overlap-comparison').innerText(), /발견 1/);

  for (let i = 0; i < 7; i++) await page.getByRole('button', { name: '등분 수 늘리기' }).click();
  assert.equal(await page.getByRole('button', { name: '등분 수 늘리기' }).isDisabled(), true);
  assert.match(await page.locator('#explore-denom-output').innerText(), /12등분/);
  assert.equal(await page.locator('.fraction').last().locator('svg').getAttribute('aria-label').then(s => s.includes('1/12')), true);

  // 3단계: 다시 점검하기 (행동 즉시 정답/힌트 피드백, 응용 문제는 B가 정답)
  await page.click('button[data-action="next"]');
  assert.match(await page.locator('#step h2').innerText(), /③ 다시 점검하기/);
  await page.click('button[data-pick-poll="again"][data-pick-choice="A"]');
  assert.match(await page.locator('#step').innerText(), /정답이에요/);

  await page.click('button[data-pick-poll="transfer"][data-pick-choice="B"]');

  // 4단계: 오늘의 발견 (도착 즉시 열리는 성장 카드 + 한 줄 규칙 빈칸 완성)
  await page.click('button[data-action="next"]');
  assert.match(await page.locator('#step h2').innerText(), /④ 오늘의 발견/);
  assert.equal(await page.locator('.solo-report-card').isVisible(), true);
  assert.match(await page.locator('.solo-report-card').innerText(), /최고예요/);

  await page.click('button[data-action="toggle-notebook-blank"]');
  assert.match(await page.locator('.notebook-blank').innerText(), /작아집니다/);

  // 새로고침 및 bfcache(pageshow) 시 메모리 초기화 검증
  await page.reload();
  assert.match(await page.locator('#step h2').innerText(), /① 처음 생각 고르기/);
  await page.click('button[data-pick-poll="first"][data-pick-choice="A"]');
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  assert.equal(await page.locator('#poll-note').count(), 0);

  assert.deepEqual(errors, []);
  assert.ok(requests.every(request => request.method === 'GET' && new URL(request.url).origin === new URL(base).origin && !request.body));
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  assert.equal(await page.evaluate(async () => (await caches.keys()).length), 0);
  assert.equal(await page.evaluate(async () => (await indexedDB.databases()).length), 0);
  console.log(JSON.stringify({ lesson: '4-step streamlined flow', privacy: 'memory-only', browserErrors: errors.length }));
} finally {
  await browser.close();
}
