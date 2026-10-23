/**
 * E2E 기능 테스트 · 1차 개선 추가 기능 검증.
 * 진행률 바, 유사도 바, 스텝 인디케이터, 차트, JSON 내보내기,
 * 타이머 경고, 뒤로가기, beforeunload, 다크 모드 토글.
 *
 * 사용법: npx vite build && npx vite preview --port 4175 &
 *         node scripts/e2e-features.mjs
 *
 * 모델 파일 없이 UI 기능만 검증합니다.
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:4175/Thinking/';
const results = [];

function log(name, pass, detail = '') {
  const icon = pass ? '✅' : '❌';
  results.push({ name, pass, detail });
  console.log(`${icon} ${name}${detail ? ` — ${detail}` : ''}`);
}

async function testM0Features(browser) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });

  // 1. 다크 모드 토글
  const toggle = page.locator('#theme-toggle');
  const toggleVisible = await toggle.isVisible();
  log('M0 다크 모드 토글 표시', toggleVisible);

  if (toggleVisible) {
    await toggle.click();
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    log('M0 다크 모드 전환', theme === 'dark', `data-theme="${theme}"`);
    await toggle.click();
    const themeLight = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    log('M0 라이트 모드 복원', themeLight === 'light', `data-theme="${themeLight}"`);
  }

  // 2. 진행률 바 DOM 존재
  const progressBar = page.locator('#progress');
  const progressExists = await progressBar.count() > 0;
  log('M0 진행률 바 DOM 존재', progressExists);

  if (progressExists) {
    const hidden = await progressBar.isHidden();
    log('M0 진행률 바 초기 hidden', hidden);
  }

  // 3. 유사도 시각화 CSS 존재 (결과 없을 때 확인)
  const hasSimilarityStyles = await page.evaluate(() => {
    const sheets = [...document.styleSheets];
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText?.includes('.similarity-track')) return true;
        }
      } catch { /* cross-origin */ }
    }
    return false;
  });
  log('M0 유사도 CSS 클래스 존재', hasSimilarityStyles);

  // 4. 버튼 최소 터치 크기
  const buttons = await page.locator('button').all();
  let allButtonsMinHeight = true;
  for (const btn of buttons) {
    const box = await btn.boundingBox();
    if (box && box.height < 40) {
      allButtonsMinHeight = false;
      break;
    }
  }
  log('M0 버튼 최소 높이 ≥40px', allButtonsMinHeight, `${buttons.length}개 확인`);

  // 5. CSS 변수 다크 모드 적용
  const cssVars = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      bg: style.getPropertyValue('--color-bg').trim(),
      text: style.getPropertyValue('--color-text').trim(),
    };
  });
  log('M0 CSS 변수 정의됨', cssVars.bg !== '' && cssVars.text !== '', `bg="${cssVars.bg}"`);

  log('M0 JS 에러 없음', errors.length === 0, errors.length > 0 ? errors.join('; ') : '');

  await page.close();
}

async function testLessonFeatures(browser) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}lesson.html`, { waitUntil: 'domcontentloaded' });

  // 1. 스텝 인디케이터 10개
  const stepDots = page.locator('.step-dot');
  const dotCount = await stepDots.count();
  log('수업 스텝 인디케이터 10개', dotCount === 10, `${dotCount}개`);

  // 2. 첫 번째 dot이 current
  if (dotCount > 0) {
    const firstDotClass = await stepDots.first().getAttribute('class');
    log('수업 첫 단계 current', firstDotClass?.includes('current') ?? false);
  }

  // 3. 다크 모드 토글
  const toggle = page.locator('#theme-toggle');
  const toggleVisible = await toggle.isVisible();
  log('수업 다크 모드 토글 표시', toggleVisible);

  // 4. 단계 진행: concept → preview
  await page.click('button[data-action="next"]');
  const previewH2 = page.locator('h2');
  const h2Text = await previewH2.first().textContent();
  log('수업 미리보기 진행', h2Text?.includes('미리보기') ?? false, `h2="${h2Text}"`);

  // 5. 참여 인원 입력 후 진행
  const pInput = page.locator('#participants');
  if (await pInput.count() > 0) {
    await pInput.fill('25');
    await page.click('button[data-action="next"]');
    const firstH2 = await page.locator('#step h2').first().textContent();
    log('수업 첫 선택 진행', firstH2?.includes('첫 선택') ?? false);

    // 6. 투표 입력 필드 존재
    const countInputs = page.locator('[data-count]');
    const inputCount = await countInputs.count();
    log('수업 투표 입력 필드 4개', inputCount === 4, `${inputCount}개`);

    // 7. skip → reason 단계
    await page.click('button[data-action="skip"]');
    const reasonH2 = await page.locator('#step h2').first().textContent();
    log('수업 이유 카드 단계', reasonH2?.includes('이유') ?? false);

    // 8. 이유 카드 버튼
    const reasonBtns = page.locator('button[data-reason]');
    const reasonCount = await reasonBtns.count();
    log('수업 이유 카드 3개', reasonCount === 3, `${reasonCount}개`);

    // 9. 뒤로가기
    const backBtn = page.locator('button[data-action="back"]');
    if (await backBtn.count() > 0) {
      await backBtn.click();
      const backH2 = await page.locator('#step h2').first().textContent();
      log('수업 뒤로가기 작동', backH2?.includes('첫 선택') ?? false);
    }

    // 10. 스텝 인디케이터 done 상태 업데이트
    const doneDots = page.locator('.step-dot.done');
    const doneCount = await doneDots.count();
    log('수업 완료된 단계 표시', doneCount > 0, `${doneCount}개 완료`);
  }

  // 11. 타이머 표시
  const timerSection = page.locator('.timer');
  const timerVisible = await timerSection.count() > 0;
  log('수업 타이머 섹션 존재', timerVisible);

  if (timerVisible) {
    const timerOutput = page.locator('#timer-output');
    const timerText = await timerOutput.textContent();
    log('수업 타이머 시간 표시', /\d+:\d{2}/.test(timerText ?? ''), `"${timerText}"`);
  }

  // 12. CSS 변수 정의 확인
  const lessonVars = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      bg: style.getPropertyValue('--lesson-bg').trim(),
      text: style.getPropertyValue('--lesson-text').trim(),
    };
  });
  log('수업 CSS 변수 정의됨', lessonVars.bg !== '' && lessonVars.text !== '');

  log('수업 JS 에러 없음', errors.length === 0, errors.length > 0 ? errors.join('; ') : '');

  await page.close();
}

// ─── 실행 ──────────────────────────────────────────────────────
const browser = await chromium.launch();
try {
  await testM0Features(browser);
  await testLessonFeatures(browser);
} finally {
  await browser.close();
}

const passed = results.filter(r => r.pass).length;
const failed = results.filter(r => !r.pass).length;
console.log(`\n총 ${results.length}건: ✅ ${passed} / ❌ ${failed}`);
if (failed > 0) {
  console.log('\n실패 항목:');
  results.filter(r => !r.pass).forEach(r => console.log(`  - ${r.name}: ${r.detail}`));
}
process.exit(failed > 0 ? 1 : 0);
