/**
 * E2E 기능 테스트 · 4단계 단순화 및 핵심 탐구 경험 종합 검증.
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

  // 5. 임계값 시뮬레이터 및 일괄 검증 UI 확인
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

  // #1. 4단계 핵심 흐름 압축 확인
  const stepPills = page.locator('.step-pill');
  const pillCount = await stepPills.count();
  log('개선 #1: 10단계를 4단계 핵심 흐름으로 압축', pillCount === 4, `${pillCount}단계`);

  // #3. 첫 화면 단원 카드 1클릭 전환 및 즉시 1번 문제 시작 확인
  const unitCards = page.locator('.unit-card-btn');
  log('개선 #3: 첫 화면 3개 단원 카드 1클릭 전환 제공', (await unitCards.count()) === 3);
  await page.click('button[data-unit-id="M02"]');
  const h2M02 = await page.locator('#step h2').textContent();
  log('개선 #3: 단원 카드 클릭 즉시 해당 분수 문제(1/4 vs 1/7) 시작', h2M02?.includes('1/4과 1/7') ?? false, `"${h2M02}"`);
  await page.click('button[data-unit-id="M01"]');

  // #5 & #9. 불필요한 상단 노란 경고 박스 및 타이머 박스 제거 확인
  const timerCount = await page.locator('.timer').count();
  const noticeCount = await page.locator('aside.notice').count();
  log('개선 #5·#9: 상단 경고 박스 및 타이머 제거로 깔끔한 첫 화면', timerCount === 0 && noticeCount === 0);

  // #2. 1단계에서는 핵심 모양 전환 버튼 1개만 노출 (시각적 과부하 제거)
  const step1ToolbarBtns = await page.locator('.visual-toolbar button').count();
  log('개선 #2: 1단계 시각화 버튼 1개로 단순화', step1ToolbarBtns === 1, `${step1ToolbarBtns}개`);

  await page.click('button[data-action="toggle-model"]');
  log('둥근 피자(원형) 모형 전환 작동', (await page.locator('.fraction-circle').count()) === 2);
  await page.click('button[data-action="toggle-model"]');

  // #4. 기본 방식을 1클릭 보기 선택으로 통일 (교사용 인원 집계는 접기 메뉴로 분리)
  await page.click('button[data-pick-poll="first"][data-pick-choice="B"]');
  const pollNote = await page.locator('#poll-note').textContent();
  log('개선 #4: 1클릭 보기 선택 및 즉시 확인 메시지', pollNote?.includes('1/5이 더 크다') ?? false);

  await page.click('button[data-reason="0"]');

  // #6. 2단계 이동 시 내가 고른 처음 생각과 이유 말풍선이 상단 배너로 연결됨
  await page.click('button[data-action="next"]');
  const hypothesisText = await page.locator('.hypothesis-banner').textContent();
  log('개선 #6: 내가 고른 처음 생각·이유가 실험 화면 상단에 연결됨', hypothesisText?.includes('1/5이 더 크다') ?? false);

  // #7 & #8. 2가지 직관적 실험(조각 포개어 보기 + 등분 슬라이더) 및 설명 공개 버튼 없이 즉시 원리 표시
  await page.click('button[data-action="toggle-overlap"]');
  const overlapText = await page.locator('.overlap-comparison').textContent();
  log('개선 #7·#8: 실험 1 조각 포개어 비교 클릭 즉시 원리(발견 1) 표시', overlapText?.includes('발견 1') ?? false);

  const slider = page.locator('#explore-slider');
  await slider.fill('8');
  await slider.dispatchEvent('input');
  const expText = await page.locator('#step').textContent();
  log('개선 #7·#8: 실험 2 등분 슬라이더 조작 즉시 원리(발견 2) 표시', expText?.includes('발견 2') ?? false);

  // #8. 3단계 다시 점검하기: 보기 클릭 즉시 정답/힌트 피드백 표시
  await page.click('button[data-action="next"]');
  await page.click('button[data-pick-poll="again"][data-pick-choice="A"]');
  const checkText = await page.locator('#step').textContent();
  log('개선 #8: 3단계 재선택 클릭 즉시 정답 피드백 표시', checkText?.includes('정답이에요') ?? false);

  // 응용 문제에서 수직선·주스컵 모형 전환 및 선택 확인
  await page.click('button[data-action="toggle-numberline"]');
  log('응용 문제 수직선 모형 전환 작동', (await page.locator('.fraction-numberline').count()) === 2);
  await page.click('button[data-action="toggle-cup"]');
  log('응용 문제 주스 컵 모형 전환 작동', (await page.locator('.fraction-cup').count()) === 2);
  await page.click('button[data-pick-poll="transfer"][data-pick-choice="A"]');

  // #10. 4단계 오늘의 발견: 도착 즉시 열리는 '내 생각의 성장 카드' 및 한 줄 규칙 완성
  await page.click('button[data-action="next"]');
  const reportVisible = await page.locator('.solo-report-card').isVisible();
  const journeySteps = await page.locator('.journey-step').count();
  log('개선 #10: 4단계 도착 즉시 내 생각의 성장 카드(3단계 여정) 표시', reportVisible && journeySteps === 3);

  await page.click('button[data-action="toggle-notebook-blank"]');
  const blankText = await page.locator('.notebook-blank').textContent();
  log('개선 #10: 오늘 내가 발견한 규칙 빈칸 채우기 작동', blankText?.includes('작아집니다') ?? false);

  log('수업 JS 에러 없음', errors.length === 0, errors.length > 0 ? errors.join('; ') : '');

  await page.close();
}

async function testLessonAiPanelFeatures(browser) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // 1단계(think)에서 바로 로컬 AI 패널이 활성화됨
  await page.goto(`${BASE}lesson-ai.html`, { waitUntil: 'domcontentloaded' });
  await page.locator('#lesson-ai-panel').waitFor();

  const countText = await page.locator('#lesson-ai-count').textContent();
  log('AI 보조 수업 패널 글자 수 카운터 표시', countText === '0/160자', `"${countText}"`);

  await page.locator('#lesson-ai-query').fill('분모가 크면 조각도 크다고 생각해요');
  const updatedCount = await page.locator('#lesson-ai-count').textContent();
  log('AI 보조 수업 패널 글자 수 실시간 갱신', updatedCount === '19/160자', `"${updatedCount}"`);

  const progressExists = await page.locator('#lesson-ai-progress').count() > 0;
  log('AI 보조 수업 패널 진행률 바 DOM 존재', progressExists);

  log('AI 보조 수업 JS 에러 없음', errors.length === 0, errors.length > 0 ? errors.join('; ') : '');

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
