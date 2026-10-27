import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import jsQR from 'jsqr';

const browser = await chromium.launch({ ...(process.env.M0_BROWSER_PATH ? { executablePath: process.env.M0_BROWSER_PATH } : {}), headless: true });
try {
  const page = await browser.newPage();
  await page.addInitScript(() => {
    window.copyCalls = 0;
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => {
      window.copyCalls++;
      return new Promise((resolve, reject) => { window.resolveCopy = resolve; window.rejectCopy = reject; });
    }}});
  });
  for (const topic of [1, 2, 3]) for (const scale of ['', '&scale=large']) {
    await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:4173/'}lesson.html?topic=${topic}${scale}`);
    await page.click('[data-action="toggle-qr-modal"]');
    const expected = await page.locator('#qr-share-url').innerText();
    const pixels = await page.locator('.qr-code-svg').evaluate(async svg => {
      const image = new Image();
      image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 360;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, 360, 360);
      return [...ctx.getImageData(0, 0, 360, 360).data];
    });
    assert.equal(jsQR(new Uint8ClampedArray(pixels), 360, 360)?.data, expected);
  }
  await page.click('#copy-share-btn');
  assert.equal(await page.locator('#copy-share-btn').isDisabled(), true);
  assert.doesNotMatch(await page.locator('#qr-modal-box').innerText(), /복사 완료/);
  await page.evaluate(() => window.resolveCopy());
  await page.waitForFunction(() => document.querySelector('#copy-share-btn').textContent.includes('복사 완료'));
  await page.click('#copy-share-btn');
  await page.evaluate(() => window.rejectCopy(Error('denied')));
  await page.waitForFunction(() => document.querySelector('#qr-modal-box').textContent.includes('복사하지 못했습니다'));
  assert.doesNotMatch(await page.locator('#copy-share-btn').innerText(), /완료/);
  // A late result must not affect a closed and reopened QR panel.
  await page.click('#copy-share-btn');
  await page.click('[data-action="toggle-qr-modal"]');
  await page.click('[data-action="toggle-qr-modal"]');
  await page.evaluate(() => window.resolveCopy());
  assert.equal(await page.locator('#copy-share-btn').innerText(), '📋 수업 주소 복사');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }));
  await page.click('#copy-share-btn');
  await page.waitForFunction(() => document.querySelector('#qr-modal-box').textContent.includes('복사하지 못했습니다'));
  console.log('PASS: 6 rendered QR URL round trips; clipboard pending/success/rejection/unavailable; close/reopen stale result.');
} finally { await browser.close(); }
