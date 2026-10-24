/**
 * E2E 기능 테스트 · 1~4차 고도화 기능 종합 검증.
 * 진행률 바, 유사도 바, 임계값 시뮬레이터, 멀티 단원(M01/M02),
 * 원형 모형·기준선 토글, 양방향 분모 조절·부등호 배지, 교사 발문 가이드,
 * 가상 연습 샘플 채우기, 단축키(Alt+→), 오개념 이동 분석표·CSV/요약 복사.
 */

import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173/';
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

  // 2. 큰 글씨 모드 토글
  const scaleToggle = page.locator('#scale-toggle');
  await scaleToggle.click();
  const scaleAttr = await page.evaluate(() => document.documentElement.getAttribute('data-scale'));
  log('M0 큰 글씨 모드 전환', scaleAttr === 'large', `data-scale="${scaleAttr}"`);
  await scaleToggle.click();

  // 3. 진행률 바 DOM 존재
  const progressBar = page.locator('#progress');
  const progressExists = await progressBar.count() > 0;
  log('M0 진행률 바 DOM 존재', progressExists);

  if (progressExists) {
    const hidden = await progressBar.isHidden();
    log('M0 진행률 바 초기 hidden', hidden);
  }

  // 4. 유사도 시각화 CSS 존재
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

  // 5. 임계값 시뮬레이터 및 일괄 검증 UI 확인 (4차 #9)
  const simSlider = page.locator('#threshold-sim');
  const batchBtn = page.locator('#batch-eval');
  log('M0 임계값 슬라이더 및 일괄 검증 버튼 존재', (await simSlider.count()) === 1 && (await batchBtn.count()) === 1);
  await simSlider.fill('0.55');
  await simSlider.dispatchEvent('input');
  const simValText = await page.locator('#threshold-sim-val').textContent();
  log('M0 임계값 슬라이더 실시간 반영', simValText === '0.55', `val="${simValText}"`);
  await page.click('#threshold-reset');
  const resetValText = await page.locator('#threshold-sim-val').textContent();
  log('M0 임계값 초기화 작동', resetValText === '0.48', `val="${resetValText}"`);

  // 6. 버튼 최소 터치 크기
  const buttons = await page.locator('button').all();
  let allButtonsMinHeight = true;
  for (const btn of buttons) {
    const box = await btn.boundingBox();
    if (box && box.height < 38) {
      allButtonsMinHeight = false;
      break;
    }
  }
  log('M0 버튼 최소 높이 ≥38px', allButtonsMinHeight, `${buttons.length}개 확인`);

  // 7. CSS 변수 정의됨
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

  // 2. 멀티 단원 선택기 (M01 / M02) 전환 확인 (4차 #1)
  const m02Radio = page.locator('input[name="unit"][value="M02"]');
  await m02Radio.check();
  const stepTextM02 = await page.locator('#step').innerText();
  log('수업 심화 단원 선택 전환 및 M코드 제거 확인', stepTextM02.includes('단위분수 심화 비교 (1/4과 1/7)') && !/M01|M02|M03/.test(stepTextM02));
  await page.locator('input[name="unit"][value="M01"]').check();

  // 3. 다크 모드 전환 후 단계 이동 시 아이콘(☀️) 유지 검증
  const toggle = page.locator('#theme-toggle');
  await toggle.click();
  await page.click('button[data-action="next"]');
  const iconAfterNext = await page.locator('#theme-toggle').textContent();
  log('수업 단계 이동 후 다크 모드 아이콘 유지', iconAfterNext === '☀️', `icon="${iconAfterNext}"`);
  await page.locator('#theme-toggle').click();

  // 4. 미리보기 확인 및 참여 인원 입력
  const previewH2 = await page.locator('#step h2').first().textContent();
  log('수업 미리보기 진행', previewH2?.includes('미리보기') ?? false, `h2="${previewH2}"`);

  await page.locator('#participants').fill('20');
  await page.click('button[data-action="next"]');
  const firstH2 = await page.locator('#step h2').first().textContent();
  log('수업 첫 선택 진행', firstH2?.includes('첫 선택') ?? false);

  // 5. 원형 모형 보기 & 비교 기준선 보기 토글 검증 (4차 #2)
  await page.click('button[data-action="toggle-guide"]');
  const guideCount = await page.locator('svg .guide-line').count();
  log('수업 분수 비교 기준선 표시', guideCount === 2, `guide-line ${guideCount}개`);

  await page.click('button[data-action="toggle-model"]');
  const circleCount = await page.locator('.fraction-circle').count();
  log('수업 원형(피자) 분수 모형 전환', circleCount === 2, `circle ${circleCount}개`);
  await page.click('button[data-action="toggle-model"]');

  // 6. 가상 연습 모드 샘플 집계 채우기 & 빈 칸 0으로 채우기 검증 (4차 #8)
  await page.click('button[data-action="fill-sample"]');
  const sampleA = Number(await page.locator('[data-count="A"]').inputValue());
  const sampleB = Number(await page.locator('[data-count="B"]').inputValue());
  const sampleC = Number(await page.locator('[data-count="C"]').inputValue());
  const sampleD = Number(await page.locator('[data-count="D"]').inputValue());
  log('수업 가상 샘플 집계 자동 채우기 작동', sampleA + sampleB + sampleC + sampleD === 20, `합계=${sampleA + sampleB + sampleC + sampleD}`);

  await page.locator('[data-count="A"]').fill('12');
  await page.locator('[data-count="B"]').fill('');
  await page.locator('[data-count="C"]').fill('');
  await page.locator('[data-count="D"]').fill('');
  const partialNote = await page.locator('#poll-note').textContent();
  log('수업 부분 입력 시 실시간 합계 안내', partialNote?.includes('입력 중: 현재 합계 12/20명') ?? false, `"${partialNote}"`);

  await page.click('button[data-action="fill-zeros"]');
  const valB = await page.locator('[data-count="B"]').inputValue();
  log('수업 빈 칸 0으로 채우기 작동', valB === '0');

  await page.click('button[data-action="record"]');

  // 7. 이유 카드 선택 시 교사 추천 발문 가이드 표시 (4차 #5) 및 단축키 이동 (4차 #6)
  await page.locator('button[data-reason="0"]').click();
  const scaffoldVisible = await page.locator('.scaffold-guide').isVisible();
  log('수업 이유 카드 교사 추천 발문 가이드 표시', scaffoldVisible);

  // Alt+ArrowRight 단축키로 다음 단계(탐구) 이동 검증 (4차 #6)
  await page.keyboard.press('Alt+ArrowRight');
  const inquiryH2 = await page.locator('#step h2').first().textContent();
  log('수업 Alt+→ 단축키 단계 이동 작동', inquiryH2?.includes('탐구 1') ?? false, `h2="${inquiryH2}"`);

  await page.click('button[data-action="reveal-inquiry"]');
  log('수업 탐구 설명 공개 표시', await page.locator('#answer').isVisible());

  await page.click('button[data-action="timer-extend"]');
  log('수업 리렌더 후에도 탐구 설명 공개 유지', await page.locator('#answer').isVisible());

  await page.click('button[data-action="timer-reset"]');
  const resetTimerText = await page.locator('#timer-output').textContent();
  log('수업 타이머 시간 초기화 작동', resetTimerText === '20:00', `"${resetTimerText}"`);

  // 탐구 3단계로 이동하여 양방향 분모 조절 및 부등호 배지 확인 (4차 #3)
  await page.click('button[data-action="inquiry-next"]');
  await page.click('button[data-action="inquiry-next"]');
  const cmpBadgeText = await page.locator('.comparison-badge').textContent();
  log('수업 탐구 3 실시간 크기 비교 부등호 배지 표시', cmpBadgeText?.includes('1/3 > 1/6') ?? false, `"${cmpBadgeText}"`);
  await page.click('button[data-action="base-more"]');
  const updatedBaseLabel = await page.locator('.base-denom-label').textContent();
  log('수업 탐구 3 기준 막대 분모 조절 작동', updatedBaseLabel === '기준 4등분', `"${updatedBaseLabel}"`);

  // 8. 완료된 스텝 인디케이터 클릭 이동 검증
  await page.locator('.step-dot.done[data-step-index="2"]').click();
  const jumpedH2 = await page.locator('#step h2').first().textContent();
  log('수업 완료 스텝 클릭 즉시 이동', jumpedH2?.includes('첫 선택') ?? false, `h2="${jumpedH2}"`);

  // 9. 끝까지 진행하여 3단계 차트 + 오개념 이동 분석표 + CSV/복사 버튼 확인 (4차 #7)
  await page.click('button[data-action="record"]');
  await page.click('button[data-action="next"]');
  await page.click('button[data-action="inquiry-next"]');
  await page.click('button[data-action="inquiry-next"]');
  await page.click('button[data-action="inquiry-next"]');
  await page.click('button[data-action="summary-reveal"]');
  await page.click('button[data-action="next"]');

  // 재선택 집계 입력
  await page.locator('[data-count="A"]').fill('16');
  await page.click('button[data-action="fill-zeros"]');
  await page.click('button[data-action="record"]');

  // 새로운 문제 집계 입력
  await page.locator('[data-count="A"]').fill('18');
  await page.click('button[data-action="fill-zeros"]');
  await page.click('button[data-action="record"]');

  // 요약 생성 및 차트 3개 + 오개념 이동 분석표 확인
  await page.click('button[data-action="memory-generate"]');
  const chartCount = await page.locator('.poll-chart').count();
  const shiftTableCount = await page.locator('.shift-table').count();
  const csvBtnCount = await page.locator('button[data-action="export-csv"]').count();
  const copyBtnCount = await page.locator('button[data-action="copy-summary"]').count();
  log('수업 요약 3단계 차트 및 오개념 이동 분석표·내보내기 렌더링', chartCount === 3 && shiftTableCount === 1 && csvBtnCount === 1 && copyBtnCount === 1);

  log('수업 JS 에러 없음', errors.length === 0, errors.length > 0 ? errors.join('; ') : '');

  await page.close();
}

async function testLessonAiPanelFeatures(browser) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(`${BASE}lesson-ai.html`, { waitUntil: 'domcontentloaded' });
  await page.click('button[data-action="next"]');
  await page.locator('#participants').fill('20');
  await page.click('button[data-action="next"]');
  await page.click('button[data-action="skip"]');

  await page.locator('#lesson-ai-panel').waitFor();
  const countText = await page.locator('#lesson-ai-count').textContent();
  log('M2 AI 패널 글자 수 카운터 표시', countText === '0/160자', `"${countText}"`);

  await page.locator('#lesson-ai-query').fill('분모가 크면 조각도 크다고 생각해요');
  const updatedCount = await page.locator('#lesson-ai-count').textContent();
  log('M2 AI 패널 글자 수 실시간 갱신', updatedCount === '19/160자', `"${updatedCount}"`);

  const progressExists = await page.locator('#lesson-ai-progress').count() > 0;
  log('M2 AI 패널 진행률 바 DOM 존재', progressExists);

  log('M2 JS 에러 없음', errors.length === 0, errors.length > 0 ? errors.join('; ') : '');

  await page.close();
}

// ─── 실행 ──────────────────────────────────────────────────────
const browserPath = process.env.M0_BROWSER_PATH || [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft Edge/Application/msedge.exe',
].find(existsSync);
const browser = await chromium.launch(browserPath ? { executablePath: browserPath, headless: true } : { channel: 'msedge', headless: true });
try {
  await testM0Features(browser);
  await testLessonFeatures(browser);
  await testLessonAiPanelFeatures(browser);
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
