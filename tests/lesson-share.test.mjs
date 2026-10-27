import test from 'node:test';
import assert from 'node:assert/strict';
import jsQR from 'jsqr';
import { createLessonQrSvg, copyLessonUrl } from '../src/lesson-share.ts';

function decodeSvg(svg) {
  const size = Number(svg.match(/viewBox="0 0 (\d+)/)[1]);
  const scale = 6;
  const width = size * scale;
  const data = new Uint8ClampedArray(width * width * 4).fill(255);
  for (const [, x, y] of svg.matchAll(/M(\d+) (\d+)h1v1h-1z/g)) {
    for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
      const offset = ((Number(y) * scale + dy) * width + Number(x) * scale + dx) * 4;
      data[offset] = data[offset + 1] = data[offset + 2] = 0;
    }
  }
  return jsQR(data, width, width)?.data;
}

test('rendered QR modules independently decode to each exact lesson URL', () => {
  const urls = [1, 2, 3].flatMap(topic => ['', '&scale=large'].map(scale => `https://gmlduqzhd123-lab.github.io/Thinking/lesson.html?topic=${topic}${scale}`));
  urls.push('https://example.org/수업?topic=1', 'https://example.org/' + 'long-path/'.repeat(25) + '?topic=3');
  for (const url of urls) assert.equal(decodeSvg(createLessonQrSvg(url)), url);
});

test('clipboard success is returned only after writeText resolves', async () => {
  let resolve;
  let done = false;
  const pending = copyLessonUrl('https://example.org/', { writeText: text => {
    assert.equal(text, 'https://example.org/');
    return new Promise(r => { resolve = r; });
  }}).then(result => { done = true; return result; });
  await Promise.resolve();
  assert.equal(done, false);
  resolve();
  assert.equal(await pending, true);
});

test('clipboard unavailable, synchronous throw and rejection report failure', async () => {
  assert.equal(await copyLessonUrl('url', undefined), false);
  assert.equal(await copyLessonUrl('url', { writeText() { throw Error('denied'); }}), false);
  assert.equal(await copyLessonUrl('url', { writeText: () => Promise.reject(Error('denied')) }), false);
});
