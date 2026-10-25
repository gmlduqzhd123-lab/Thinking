/**
 * 모바일 환경 호환성 테스트 (4단계 핵심 흐름 기준).
 * 5개 주요 모바일·태블릿 뷰포트에서 레이아웃, 터치 타겟(≥44px), 가로 스크롤 부재,
 * 분수 모형(막대·원형·오버레이·수직선·주스컵), 등분 슬라이더, 성장 카드를 검증합니다.
 */
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SCREENSHOTS_DIR = process.env.SCREENSHOTS_DIR || 'test-screenshots';
if (!existsSync(SCREENSHOTS_DIR)) mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const PORT = Number(process.env.MOBILE_TEST_PORT || 4175);
const TEST_URL = process.env.TEST_URL || `http://127.0.0.1:${PORT}`;
const isWin = process.platform === 'win32';

const viewports = [
  { name: 'iPhone-SE',  width: 375,  height: 667,  isMobile: true,  hasTouch: true },
  { name: 'iPhone-14',  width: 390,  height: 844,  isMobile: true,  hasTouch: true },
  { name: 'Galaxy-S21', width: 360,  height: 800,  isMobile: true,  hasTouch: true },
  { name: 'iPad-Mini',  width: 768,  height: 1024, isMobile: true,  hasTouch: true },
  { name: 'iPad-Pro',   width: 1024, height: 1366, isMobile: false, hasTouch: true },
];

async function isReachable(url) {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

async function ensureServer(url) {
  if (await isReachable(url)) return null;
  const proc = spawn(process.execPath, [join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  const start = Date.now();
  while (Date.now() - start < 15000) {
    if (await isReachable(url)) return proc;
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error(`프리뷰 서버(${url}) 기동 시간 초과`);
}

function stopServer(proc) {
  if (!proc || proc.killed) return;
  try {
    if (isWin && proc.pid) {
      execFileSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      proc.kill('SIGTERM');
    }
  } catch {
    // 이미 종료됨
  }
}

const serverProc = await ensureServer(TEST_URL);

const browserPath = process.env.M0_BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft Edge/Application/msedge.exe',
].find(existsSync);

const browser = await chromium.launch(
  browserPath
    ? { executablePath: browserPath, headless: true }
    : { channel: 'msedge', headless: true }
);

const results = [];

try {
  for (const vp of viewports) {
    console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
      userAgent: vp.isMobile
        ? 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
        : undefined,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    // ── M0 페이지 (index.html) ──────────────────────────────────
    console.log('  M0 페이지 테스트...');
    await page.goto(`${TEST_URL}/`);
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-m0.png`, fullPage: true });

    const m0HScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    console.log(`  가로 스크롤: ${m0HScroll ? '❌ 있음' : '✅ 없음'}`);

    const m0Buttons = await page.$$eval('button', buttons =>
      buttons.map(b => {
        const rect = b.getBoundingClientRect();
        return { text: b.textContent?.trim().slice(0, 20), w: rect.width, h: rect.height };
      })
    );
    const m0SmallButtons = m0Buttons.filter(b => b.h < 44 || b.w < 44);
    console.log(`  버튼 수: ${m0Buttons.length}, 터치 타겟 미달(44px): ${m0SmallButtons.length}`);

    const m0FontSizes = await page.$$eval('p, span, label, li, h1, h2', els =>
      els.map(el => parseFloat(getComputedStyle(el).fontSize)).filter(s => s > 0)
    );
    const m0MinFont = Math.min(...m0FontSizes);
    console.log(`  최소 폰트: ${m0MinFont.toFixed(1)}px ${m0MinFont >= 12 ? '✅' : '⚠️ 작음'}`);

    // ── 4단계 수업 페이지 (lesson.html) ─────────────────────────
    console.log('  4단계 수업 페이지 테스트...');
    await page.goto(`${TEST_URL}/lesson.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-lesson-concept.png`, fullPage: true });

    let lessonHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

    // 4단계 스텝 알약 탭 확인
    const stepPills = await page.$$('.step-pill');
    console.log(`  스텝 인디케이터: ${stepPills.length}개 ${stepPills.length === 4 ? '✅' : '⚠️'}`);

    // 1단계: 피자 모형 전환 및 1클릭 보기 선택 + 말풍선 이유 선택
    await page.click('button[data-action="toggle-model"]');
    const circleFits = await page.evaluate(() => {
      const svgs = document.querySelectorAll('figure.fraction svg');
      return Array.from(svgs).every(svg => svg.getBoundingClientRect().right <= window.innerWidth + 5);
    });
    lessonHScroll ||= await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await page.click('button[data-action="toggle-model"]');

    const fractionSvgs = await page.$$('figure.fraction svg');
    const barFits = await page.evaluate(() => {
      const svgs = document.querySelectorAll('figure.fraction svg');
      return Array.from(svgs).every(svg => svg.getBoundingClientRect().right <= window.innerWidth + 5);
    });
    const svgFits = circleFits && barFits;
    console.log(`  SVG 뷰포트 내 (막대·원형): ${svgFits ? '✅' : '❌ 넘침'}`);

    // 터치 타겟 (1단계 버튼)
    const lessonButtons = await page.$$eval('button', buttons =>
      buttons.map(b => {
        const rect = b.getBoundingClientRect();
        return { text: b.textContent?.trim().slice(0, 20), w: rect.width, h: rect.height };
      })
    );
    const lessonSmallButtons = lessonButtons.filter(b => b.h < 44);
    console.log(`  수업 버튼: ${lessonButtons.length}개, 높이 44px 미달: ${lessonSmallButtons.length}`);

    await page.click('button[data-pick-poll="first"][data-pick-choice="B"]');
    await page.click('button[data-reason="0"]');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-lesson-first.png`, fullPage: true });

    // 2단계: 직접 실험하기 (조각 포개기 + 등분 슬라이더)
    await page.click('button[data-action="next"]');
    await page.click('button[data-action="toggle-overlap"]');
    await page.locator('#explore-slider').fill('8');
    await page.locator('#explore-slider').dispatchEvent('input');
    lessonHScroll ||= await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-lesson-inquiry3.png`, fullPage: true });

    // 3단계: 다시 점검하기 (재선택 + 응용 문제 + 미니게임)
    await page.click('button[data-action="next"]');
    await page.click('button[data-pick-poll="again"][data-pick-choice="A"]');
    await page.click('button[data-pick-poll="transfer"][data-pick-choice="B"]');
    await page.click('button[data-duel-round="0"][data-duel-pick="right"]');
    lessonHScroll ||= await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-lesson-preview.png`, fullPage: true });

    // 4단계: 오늘의 발견 (내 생각의 성장 카드 + 빈칸 완성)
    await page.click('button[data-action="next"]');
    await page.click('button[data-action="toggle-notebook-blank"]');
    lessonHScroll ||= await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-lesson-memory.png`, fullPage: true });

    console.log(`  전 단계 가로 스크롤: ${lessonHScroll ? '❌ 있음' : '✅ 없음'}`);
    console.log(`  JS 에러: ${errors.length === 0 ? '✅ 없음' : `❌ ${errors.join(', ')}`}`);

    results.push({
      viewport: vp.name,
      m0HScroll,
      lessonHScroll,
      m0SmallButtons: m0SmallButtons.length,
      lessonSmallButtons: lessonSmallButtons.length,
      m0MinFont,
      stepPills: stepPills.length,
      fractionSvgs: fractionSvgs.length,
      svgFits,
      jsErrors: errors.length,
    });

    await context.close();
  }
} finally {
  await browser.close();
  stopServer(serverProc);
}

// ── 종합 결과 ───────────────────────────────────────────────────
console.log('\n\n========== 종합 결과 ==========\n');
console.log('뷰포트          | M0 가로 | 수업 가로 | M0 버튼↓ | 수업 버튼↓ | 최소폰트 | 스텝 | SVG  | 에러');
console.log('----------------|---------|-----------|---------|-----------|---------|------|------|-----');
for (const r of results) {
  console.log(
    `${r.viewport.padEnd(16)}| ${r.m0HScroll ? '❌' : '✅'}      | ${r.lessonHScroll ? '❌' : '✅'}        ` +
    `| ${String(r.m0SmallButtons).padEnd(8)}| ${String(r.lessonSmallButtons).padEnd(10)}` +
    `| ${r.m0MinFont.toFixed(0).padEnd(8)}| ${String(r.stepPills).padEnd(5)}| ${r.svgFits ? '✅' : '❌'}   | ${r.jsErrors}`
  );
}

const hasIssues = results.some(r =>
  r.m0HScroll || r.lessonHScroll || r.m0SmallButtons > 0 || r.lessonSmallButtons > 0 || r.jsErrors > 0 || !r.svgFits || r.stepPills !== 4
);

console.log(`\n${hasIssues ? '⚠️ 일부 문제가 발견되었습니다.' : '✅ 모든 뷰포트에서 정상입니다.'}`);
console.log(`스크린샷: ${SCREENSHOTS_DIR}/`);

if (hasIssues) process.exit(1);
