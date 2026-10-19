import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { examples } from '../src/cards.ts';
const browserPath = process.env.M0_BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
const browser = await chromium.launch(browserPath ? { executablePath: browserPath, headless: true } : { channel: 'msedge', headless: true });
const page = await browser.newPage();
if (process.env.TEST_FORCE_MISSING_MODEL === '1') {
  await page.route('**/models/m01/onnx/model_quantized.onnx', route => route.fulfill({ status: 404, body: '' }));
}
const requests = [];
const requestPayloads = [];
const errors = [];
const consoleText = [];
page.on('request', r => { requests.push(r.url()); requestPayloads.push(`${r.method()} ${r.postData() || ''} ${JSON.stringify(r.headers())}`); });
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => consoleText.push(m.text()));
await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/');
await page.getByRole('button', { name: '모델 준비' }).click();
await page.locator('#state').filter({ hasText: /준비됨|실패/ }).waitFor({ timeout: 120000 });
assert.equal(await page.locator('#state').textContent(), '모델 상태: 준비됨');
console.log(JSON.stringify({ state: await page.locator('#state').textContent(), timing: await page.locator('#timing').textContent(), requests: requests.map(u => new URL(u).pathname), errors }, null, 2));
{
  for (const e of examples) {
    await page.locator('#query').fill(e.text);
    await page.getByRole('button', { name: '추천 실행' }).click();
    await page.getByText('모델 상태: 준비됨').waitFor({ timeout: 20000 });
    const output = await page.locator('#result').innerText();
    if (e.expected === 'hold') assert.match(output, /이유를 더 확인해야 합니다/);
    else if (e.id === 'E1') assert.match(output, /같은 전체 나누기/);
    if (e.id === 'E1') {
      await page.locator('#query').fill('분모가 무엇인지 모르겠어요.');
      assert.equal(await page.locator('#result').getAttribute('data-hold'), null);
      assert.match(await page.locator('#result').innerText(), /이전 추천은 무효/);
    }
    console.log(JSON.stringify({ id: e.id, expected: e.expected, result: output }));
  }
  await page.locator('#query').fill('1/5가 1/3보다 크다고 생각해요.');
  await page.getByRole('button', { name: '추천 실행' }).click();
  await page.getByRole('button', { name: '추천 실행' }).click();
  await page.getByText('모델 상태: 준비됨').waitFor({ timeout: 20000 });
  await page.locator('#query').fill('teacher@example.com');
  const requestCount = requests.length;
  await page.getByRole('button', { name: '추천 실행' }).click();
  assert.match(await page.locator('#result').innerText(), /연락처/);
  assert.equal(requests.length, requestCount);
  await page.evaluate(() => { window.__m0XssProbe = false; });
  await page.locator('#query').fill('<img src=x onerror="window.__m0XssProbe=true"> 분모가 크면 한 조각도 커져요.');
  await page.getByRole('button', { name: '추천 실행' }).click();
  await page.getByText('모델 상태: 준비됨').waitFor({ timeout: 20000 });
  assert.equal(await page.evaluate(() => window.__m0XssProbe), false);
  await page.locator('#query').fill('분모가 커지면 한 조각도 커진다고 생각해요.');
  await page.getByRole('button', { name: '추천 실행' }).click();
  await page.locator('#query').fill('분모가 무엇인지 모르겠어요.');
  assert.equal(await page.locator('#state').textContent(), '모델 상태: 취소');
  await page.getByRole('button', { name: '초기화' }).click();
  assert.equal(await page.locator('#query').inputValue(), '');
  const leak = '분모가 커지면 한 조각도 커진다고 생각해요.';
  assert.equal(requests.some(u => u.includes(encodeURIComponent(leak)) || u.includes(leak)), false);
  assert.equal(requestPayloads.some(p => p.includes(leak)), false);
  assert.equal(requestPayloads.every(p => p.startsWith('GET ')), true);
  assert.equal(consoleText.some(t => t.includes(leak)), false);
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  assert.equal(await page.evaluate(async () => (await caches.keys()).length), 0);
  assert.equal(await page.evaluate(async () => (await indexedDB.databases()).length), 0);
  assert.equal(page.url().includes(encodeURIComponent(leak)), false);
  assert.equal(errors.length, 0);
  assert.equal(requests.every(u => new URL(u).origin === new URL(page.url()).origin), true);
  await page.getByRole('button', { name: '종료' }).click();
  assert.equal(await page.locator('#query').inputValue(), '');
  await page.locator('#query').fill('이전 화면에 남으면 안 되는 개발용 문장');
  await page.goto('about:blank');
  await page.goBack();
  assert.equal(await page.locator('#query').inputValue(), '');
}
const bad = await browser.newPage();
const badRequests = [];
bad.on('request', r => badRequests.push(r.url()));
await bad.route('**/models/m01/onnx/model_quantized.onnx', route => route.fulfill({ status: 404, body: '' }));
await bad.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/');
await bad.getByRole('button', { name: '모델 준비' }).click();
await bad.getByText('모델 상태: 실패').waitFor({ timeout: 30000 });
assert.equal(badRequests.every(u => new URL(u).origin === new URL(bad.url()).origin), true);
console.log(JSON.stringify({ missingModel: await bad.locator('#state').textContent() }));
await bad.close();
const corrupt = await browser.newPage();
const corruptRequests = [];
corrupt.on('request', r => corruptRequests.push(r.url()));
await corrupt.route('**/models/m01/onnx/model_quantized.onnx', route => route.fulfill({ status: 200, contentType: 'application/octet-stream', body: 'invalid onnx' }));
await corrupt.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/');
await corrupt.getByRole('button', { name: '모델 준비' }).click();
await corrupt.getByText('모델 상태: 실패').waitFor({ timeout: 30000 });
assert.equal(corruptRequests.every(u => new URL(u).origin === new URL(corrupt.url()).origin), true);
console.log(JSON.stringify({ corruptModel: await corrupt.locator('#state').textContent() }));
await corrupt.close();
const timeoutPage = await browser.newPage();
await timeoutPage.addInitScript(() => {
  const originalSetter = Object.getOwnPropertyDescriptor(Worker.prototype, 'onmessage')?.set;
  Object.defineProperty(Worker.prototype, 'onmessage', {
    set(handler) {
      originalSetter?.call(this, event => {
        if (event.data?.type !== 'result') handler(event);
      });
    },
  });
});
await timeoutPage.clock.install();
await timeoutPage.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/');
await timeoutPage.getByRole('button', { name: '모델 준비' }).click();
await timeoutPage.getByText('모델 상태: 준비됨').waitFor({ timeout: 120000 });
await timeoutPage.locator('#query').fill('분모가 커지면 한 조각도 커진다고 생각해요.');
await timeoutPage.getByRole('button', { name: '추천 실행' }).click();
await timeoutPage.clock.fastForward(10_050);
assert.equal(await timeoutPage.locator('#state').textContent(), '모델 상태: 실패');
assert.match(await timeoutPage.locator('#result').innerText(), /기본 탐구/);
await timeoutPage.getByRole('button', { name: '기본 카드 보기' }).click();
assert.match(await timeoutPage.locator('#result').innerText(), /같은 전체 나누기/);
console.log(JSON.stringify({ inferenceTimeout: await timeoutPage.locator('#state').textContent() }));
await timeoutPage.close();
const cancelled = await browser.newPage();
await cancelled.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/');
await cancelled.getByRole('button', { name: '모델 준비' }).click();
await cancelled.getByRole('button', { name: '취소' }).click();
assert.equal(await cancelled.locator('#state').textContent(), '모델 상태: 취소');
await cancelled.waitForTimeout(1000);
assert.equal(await cancelled.locator('#state').textContent(), '모델 상태: 취소');
await cancelled.close();
await browser.close();
