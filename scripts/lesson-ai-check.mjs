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
page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }));
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto(new URL('lesson-ai.html', base).href);
  await page.getByRole('button', { name: '수업 미리보기' }).click();
  await page.locator('#participants').fill('20');
  await page.getByRole('button', { name: '첫 선택으로' }).click();
  await page.getByRole('button', { name: '집계 생략하고 계속' }).click();
  await page.locator('#lesson-ai-panel').waitFor();
  assert.match(await page.locator('#step').innerText(), /기본 탐구 시작/);
  await page.getByRole('button', { name: '모델 준비' }).click();
  await page.locator('#lesson-ai-query').fill('5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.');
  await page.locator('#lesson-ai-state').filter({ hasText: '준비됨' }).waitFor({ timeout: 120000 });
  await page.getByRole('button', { name: 'AI 후보 요청' }).click();
  await page.locator('#lesson-ai-result h3').waitFor({ timeout: 20000 });
  assert.match(await page.locator('#lesson-ai-result').innerText(), /AI 후보 · 교사 확인 전/);
  assert.equal(await page.locator('#lesson-ai-result').innerText().then(value => value.includes('같은 길이의 전체를 3등분')), false);
  await page.getByRole('button', { name: '교사가 후보 카드 확인' }).click();
  assert.match(await page.locator('#lesson-ai-result').innerText(), /같은 길이의 전체를 3등분/);
  await page.locator('#lesson-ai-query').fill('다른 개념 설명');
  assert.equal(await page.getByRole('button', { name: '교사가 후보 카드 확인' }).count(), 0);
  assert.equal(await page.locator('#lesson-ai-result').innerText().then(value => value.includes('같은 길이의 전체를 3등분')), false);
  await page.locator('#lesson-ai-query').fill('두 리본의 전체 길이가 서로 다르면 비교가 달라질 수 있어요.');
  await page.getByRole('button', { name: 'AI 후보 요청' }).click();
  await page.locator('#lesson-ai-result').filter({ hasText: '판단 보류' }).waitFor({ timeout: 20000 });
  assert.equal(await page.getByRole('button', { name: '교사가 후보 카드 확인' }).count(), 0);
  await page.locator('#lesson-ai-query').fill('example@example.com');
  await page.getByRole('button', { name: 'AI 후보 요청' }).click();
  assert.match(await page.locator('#lesson-ai-result').innerText(), /연락처/);
  await page.locator('#lesson-ai-query').fill('5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.');
  await page.getByRole('button', { name: 'AI 후보 요청' }).click();
  await page.getByRole('button', { name: 'AI 요청 취소' }).click();
  assert.equal(await page.getByRole('button', { name: '교사가 후보 카드 확인' }).count(), 0);
  assert.match(await page.locator('#lesson-ai-state').innerText(), /취소/);
  await page.getByRole('button', { name: '모델 준비' }).click();
  await page.locator('#lesson-ai-state').filter({ hasText: '준비됨' }).waitFor({ timeout: 120000 });
  await page.evaluate(() => {
    const original = Worker.prototype.postMessage;
    Worker.prototype.postMessage = function (message, ...rest) {
      if (message?.type === 'infer') return;
      return original.call(this, message, ...rest);
    };
  });
  await page.clock.install();
  await page.getByRole('button', { name: 'AI 후보 요청' }).click();
  await page.clock.fastForward(10_100);
  assert.match(await page.locator('#lesson-ai-result').innerText(), /10초/);
  assert.equal(await page.getByRole('button', { name: '교사가 후보 카드 확인' }).count(), 0);
  await page.getByRole('button', { name: '기본 탐구 시작' }).click();
  assert.equal(await page.locator('#lesson-ai-panel').count(), 0);
  await page.getByRole('button', { name: '이전 단계' }).click();
  assert.equal(await page.locator('#lesson-ai-query').inputValue(), '');
  await page.goto('about:blank');
  await page.goBack();
  assert.match(await page.locator('#step h2').innerText(), /개념 선택/);
  assert.deepEqual(errors, []);
  assert.ok(requests.every(request => request.method === 'GET' && new URL(request.url).origin === new URL(base).origin && !request.body));
  assert.ok(requests.every(request => !request.url.includes('example%40example.com') && !request.url.includes('5%EA%B0%80')));
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  assert.equal(await page.evaluate(async () => (await caches.keys()).length), 0);
  assert.equal(await page.evaluate(async () => (await indexedDB.databases()).length), 0);
  console.log(JSON.stringify({ lessonAi: 'real local model candidate and hold', teacherAction: 'explicit', privacy: 'same-origin GET and memory-only', errors: errors.length }));
} finally { await browser.close(); }
