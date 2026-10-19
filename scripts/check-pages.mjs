const base = process.env.PAGES_URL ?? 'https://gmlduqzhd123-lab.github.io/Thinking/';
const origin = new URL(base);
if (!origin.pathname.endsWith('/')) {
  throw new Error('PAGES_URL must end with /');
}

const checks = [
  { path: '', expected: 200, marker: '<a href="./lesson.html">M01 수업 화면 미리보기 열기</a>' },
  { path: 'lesson.html', expected: 200, marker: '<title>M01 단위분수 비교 · 개발용 수업</title>' },
  { path: 'HOLDOUT_DRAFT.tsv', expected: 404 },
  { path: 'models/m01/onnx/model_quantized.onnx', expected: 404 },
  { path: 'wasm/ort-wasm-simd-threaded.jsep.wasm', expected: 404 },
];

let failed = false;
for (const check of checks) {
  const url = new URL(check.path, origin);
  try {
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    const body = check.marker && response.ok ? await response.text() : '';
    const passed = response.status === check.expected && (!check.marker || body.includes(check.marker));
    console.log(`${passed ? 'PASS' : 'FAIL'} ${url.pathname}: HTTP ${response.status}, expected ${check.expected}${check.marker ? ', status-page marker required' : ''}`);
    failed ||= !passed;
  } catch (error) {
    console.error(`FAIL ${url.pathname}: ${error.message}`);
    failed = true;
  }
}

if (failed) process.exitCode = 1;
