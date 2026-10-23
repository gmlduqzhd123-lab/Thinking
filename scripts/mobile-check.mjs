/**
 * 모바일 환경 호환성 테스트.
 * 여러 뷰포트에서 레이아웃, 터치 타겟, 가로 스크롤, 텍스트 가독성을 검증합니다.
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync } from 'node:fs';

const SCREENSHOTS_DIR = 'test-screenshots';
if (!existsSync(SCREENSHOTS_DIR)) mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const TEST_URL = process.env.TEST_URL || 'http://127.0.0.1:5173';

const viewports = [
  { name: 'iPhone-SE',  width: 375,  height: 667,  isMobile: true,  hasTouch: true },
  { name: 'iPhone-14',  width: 390,  height: 844,  isMobile: true,  hasTouch: true },
  { name: 'Galaxy-S21', width: 360,  height: 800,  isMobile: true,  hasTouch: true },
  { name: 'iPad-Mini',  width: 768,  height: 1024, isMobile: true,  hasTouch: true },
  { name: 'iPad-Pro',   width: 1024, height: 1366, isMobile: false, hasTouch: true },
];

const browserPath = process.env.M0_BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);

const browser = await chromium.launch(
  browserPath
    ? { executablePath: browserPath, headless: true }
    : { channel: 'msedge', headless: true }
);

const results = [];

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

  // 스크린샷
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-m0.png`, fullPage: true });

  // 1. 가로 스크롤 없음 확인
  const m0HScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`  가로 스크롤: ${m0HScroll ? '❌ 있음' : '✅ 없음'}`);

  // 2. 버튼 터치 타겟 크기 (최소 44px)
  const m0Buttons = await page.$$eval('button', buttons =>
    buttons.map(b => {
      const rect = b.getBoundingClientRect();
      return { text: b.textContent?.trim().slice(0, 20), w: rect.width, h: rect.height };
    })
  );
  const m0SmallButtons = m0Buttons.filter(b => b.h < 44 || b.w < 44);
  console.log(`  버튼 수: ${m0Buttons.length}, 터치 타겟 미달(44px): ${m0SmallButtons.length}`);
  if (m0SmallButtons.length > 0) {
    m0SmallButtons.forEach(b => console.log(`    ⚠️ "${b.text}" → ${b.w.toFixed(0)}×${b.h.toFixed(0)}px`));
  }

  // 3. 텍스트 잘림 확인 (overflow hidden 영역 감지)
  const m0Overflow = await page.evaluate(() => {
    const issues = [];
    document.querySelectorAll('*').forEach(el => {
      const style = getComputedStyle(el);
      if (style.overflow === 'hidden' && el.scrollWidth > el.clientWidth + 2) {
        issues.push({ tag: el.tagName, text: el.textContent?.slice(0, 30) });
      }
    });
    return issues;
  });
  console.log(`  텍스트 잘림: ${m0Overflow.length === 0 ? '✅ 없음' : `❌ ${m0Overflow.length}건`}`);

  // 4. 주요 요소 표시 확인
  const m0Visible = await page.evaluate(() => {
    const checks = ['#app', 'header', 'textarea', 'button', 'footer'];
    return checks.map(sel => ({
      sel,
      visible: document.querySelector(sel) !== null && document.querySelector(sel).offsetParent !== null,
    }));
  });
  m0Visible.forEach(v => console.log(`  ${v.sel}: ${v.visible ? '✅' : '❌'}`));

  // 5. 폰트 크기 가독성 (최소 12px)
  const m0FontSizes = await page.$$eval('p, span, label, li, h1, h2', els =>
    els.map(el => parseFloat(getComputedStyle(el).fontSize)).filter(s => s > 0)
  );
  const m0MinFont = Math.min(...m0FontSizes);
  console.log(`  최소 폰트: ${m0MinFont.toFixed(1)}px ${m0MinFont >= 12 ? '✅' : '⚠️ 작음'}`);

  // ── M1 수업 페이지 (lesson.html) ────────────────────────────
  console.log('  M1 수업 페이지 테스트...');
  await page.goto(`${TEST_URL}/lesson.html`);
  await page.waitForLoadState('domcontentloaded');
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-lesson-concept.png`, fullPage: true });

  // 가로 스크롤
  const lessonHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`  가로 스크롤: ${lessonHScroll ? '❌ 있음' : '✅ 없음'}`);

  // 스텝 인디케이터 표시 확인
  const stepDots = await page.$$('.step-dot');
  console.log(`  스텝 인디케이터: ${stepDots.length}개 ${stepDots.length === 10 ? '✅' : '⚠️'}`);

  // 스텝 인디케이터 크기 확인
  if (stepDots.length > 0) {
    const dotSizes = await page.$$eval('.step-dot', dots =>
      dots.map(d => {
        const rect = d.getBoundingClientRect();
        return { w: rect.width, h: rect.height };
      })
    );
    const allDotsVisible = dotSizes.every(d => d.w >= 18 && d.h >= 18);
    console.log(`  스텝 닷 크기: ${allDotsVisible ? '✅ 적정' : '⚠️ 일부 너무 작음'}`);
  }

  // 수업 진행 테스트 (concept → preview)
  await page.click('button[data-action="next"]');
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-lesson-preview.png`, fullPage: true });

  // preview에서 참여 인원 입력 + first 진행
  await page.fill('#participants', '25');
  await page.click('button[data-action="next"]');
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-lesson-first.png`, fullPage: true });

  // 분수 막대 표시 확인
  const fractionSvgs = await page.$$('figure.fraction svg');
  console.log(`  분수 막대 SVG: ${fractionSvgs.length}개 ${fractionSvgs.length >= 2 ? '✅' : '⚠️'}`);

  // 분수 막대가 뷰포트 안에 있는지
  const svgFits = await page.evaluate(() => {
    const svgs = document.querySelectorAll('figure.fraction svg');
    return Array.from(svgs).every(svg => {
      const rect = svg.getBoundingClientRect();
      return rect.right <= window.innerWidth + 5;
    });
  });
  console.log(`  SVG 뷰포트 내: ${svgFits ? '✅' : '❌ 넘침'}`);

  // 터치 타겟 (수업 페이지)
  const lessonButtons = await page.$$eval('button', buttons =>
    buttons.map(b => {
      const rect = b.getBoundingClientRect();
      return { text: b.textContent?.trim().slice(0, 20), w: rect.width, h: rect.height };
    })
  );
  const lessonSmallButtons = lessonButtons.filter(b => b.h < 44);
  console.log(`  수업 버튼: ${lessonButtons.length}개, 높이 44px 미달: ${lessonSmallButtons.length}`);

  // 에러 확인
  console.log(`  JS 에러: ${errors.length === 0 ? '✅ 없음' : `❌ ${errors.join(', ')}`}`);

  results.push({
    viewport: vp.name,
    m0HScroll,
    lessonHScroll,
    m0SmallButtons: m0SmallButtons.length,
    lessonSmallButtons: lessonSmallButtons.length,
    m0MinFont,
    stepDots: stepDots.length,
    fractionSvgs: fractionSvgs.length,
    svgFits,
    jsErrors: errors.length,
  });

  await context.close();
}

await browser.close();

// ── 종합 결과 ───────────────────────────────────────────────────
console.log('\n\n========== 종합 결과 ==========\n');
console.log('뷰포트          | M0 가로 | 수업 가로 | M0 버튼↓ | 수업 버튼↓ | 최소폰트 | 스텝 | SVG  | 에러');
console.log('----------------|---------|-----------|---------|-----------|---------|------|------|-----');
for (const r of results) {
  console.log(
    `${r.viewport.padEnd(16)}| ${r.m0HScroll ? '❌' : '✅'}      | ${r.lessonHScroll ? '❌' : '✅'}        ` +
    `| ${String(r.m0SmallButtons).padEnd(8)}| ${String(r.lessonSmallButtons).padEnd(10)}` +
    `| ${r.m0MinFont.toFixed(0).padEnd(8)}| ${String(r.stepDots).padEnd(5)}| ${r.svgFits ? '✅' : '❌'}   | ${r.jsErrors}`
  );
}

const hasIssues = results.some(r =>
  r.m0HScroll || r.lessonHScroll || r.jsErrors > 0 || !r.svgFits
);

console.log(`\n${hasIssues ? '⚠️ 일부 문제가 발견되었습니다.' : '✅ 모든 뷰포트에서 정상입니다.'}`);
console.log(`스크린샷: ${SCREENSHOTS_DIR}/`);

if (hasIssues) process.exit(1);
