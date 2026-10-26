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
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404 (Not Found)')) errors.push(m.text()); });

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
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404 (Not Found)')) errors.push(m.text()); });

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

  // #1. 캐릭터 스토리 딜레마, TTS 읽어주기(#5), 효과음 토글(#5) 및 선생님 발문 톡 확인
  const storyCard = await page.locator('.story-dilemma-card').textContent();
  log('재미 개선 #1: 캐릭터 고민(스토리 딜레마) 도입', storyCard?.includes('민수') ?? false);
  await page.click('button[data-action="speak-story"]');
  const ttsStatus = await page.locator('#tts-status').textContent();
  log('추가 개발 #5: 이야기 음성 읽어주기(TTS) 및 효과음 토글 작동', (ttsStatus?.includes('음성으로 읽어주었어요') ?? false) && (await page.locator('#sound-toggle').count()) === 1);
  const talkBanner = await page.locator('.teacher-talk-banner').textContent();
  log('재미 개선 #7: 교실 수업용 선생님 질문 톡 제공', talkBanner?.includes('선생님 질문 톡') ?? false);

  // #2. 1단계 정답 스포일러 방지(자르기 전 간식 상상 모형) 및 힌트 토글
  const firstSvgLabel = await page.locator('figure.fraction svg').first().getAttribute('aria-label');
  log('재미 개선 #2: 1단계 정답 스포일러 없는 자르기 전 간식 상상 모형', firstSvgLabel?.includes('아직 자르지 않은') ?? false);
  await page.click('button[data-action="toggle-spoiler"]');
  const revealedSvgLabel = await page.locator('figure.fraction svg').first().getAttribute('aria-label');
  log('재미 개선 #2: 자른 눈금 힌트 미리 보기 토글 작동', revealedSvgLabel?.includes('1/3') ?? false);
  await page.click('button[data-action="toggle-pattern"]');
  const hasPatternClass = await page.locator('figure.fraction.pattern-active').count();
  log('고도화 #8: 색각 안전 빗금 패턴(UDL) 토글 작동', hasPatternClass === 2);
  await page.click('button[data-action="toggle-pattern"]');
  await page.click('button[data-action="toggle-spoiler"]');

  // 고도화 #7: 30초 짝 토론 벨 & 발표 모둠 뽑기 작동
  await page.click('button[data-action="talk-bell"]');
  const bellText = await page.locator('#talk-bell-btn').textContent();
  await page.click('button[data-action="pick-group"]');
  const groupText = await page.locator('#picked-group-badge').textContent();
  log('고도화 #7: 30초 짝 토론 벨 및 발표 모둠 뽑기 작동', (bellText?.includes('30초') ?? false) && (groupText?.includes('1모둠') ?? false));
  await page.click('button[data-action="talk-bell"]');

  await page.click('button[data-action="toggle-model"]');
  log('둥근 피자(원형) 모형 전환 작동', (await page.locator('.fraction-circle').count()) === 2);
  await page.click('button[data-action="toggle-model"]');

  // #4. 기본 방식을 1클릭 보기 선택으로 통일 + 숫자키(2) 단축키 + 확신 온도계(#5) + #7 스마트보드 +1 거수 투표
  await page.keyboard.press('2');
  const pollNote = await page.locator('#poll-note').textContent();
  log('개선 #4 & 고도화 #8: 1클릭/숫자키(1~4) 보기 선택 및 즉시 확인 메시지', pollNote?.includes('1/5이 더 크다') ?? false);
  await page.click('button[data-conf-poll="first"][data-conf-level="low"]');
  const confPressed = await page.locator('button[data-conf-poll="first"][data-conf-level="low"]').getAttribute('aria-pressed');
  log('고도화 #5: 1단계 내 생각 확신 온도계 선택 작동', confPressed === 'true');

  await page.click('.class-poll-details summary');
  await page.click('button[data-vote-poll="first"][data-vote-choice="A"][data-vote-delta="1"]');
  const voteInputA = await page.locator('input[data-count="A"][data-count-poll="first"]').inputValue();
  log('재미 개선 #7: 스마트보드 +1 원터치 거수 투표 카운터 작동', voteInputA === '1', `A="${voteInputA}"`);
  const pollBarsCount = await page.locator('.live-poll-chart[data-chart-poll="first"] .poll-bar-row').count();
  const firstBarWidth = await page.locator('.live-poll-chart[data-chart-poll="first"] .poll-bar-fill').first().getAttribute('width');
  log('추가 개발 #8: 교사용 거수 투표 실시간 가로 막대그래프 시각화', pollBarsCount === 4 && Number(firstBarWidth) > 0, `${pollBarsCount}개 막대 (A 폭=${firstBarWidth}%)`);
  await page.click('button[data-action="toggle-poll-blind"]');
  const blindStatus = await page.locator('.class-poll-status').textContent();
  log('재미 개선 #7: 투표 결과 잠시 가리기 작동', blindStatus?.includes('가려 두었습니다') ?? false);
  await page.click('button[data-action="toggle-poll-blind"]');

  await page.click('button[data-reason="0"]');

  // #6. 2단계 이동 시 내가 고른 처음 생각과 이유 말풍선이 상단 배너로 연결됨 + 맞춤형 실험 처방(#1) + 실험 카테고리 탭 전환
  await page.click('button[data-action="next"]');
  const hypothesisText = await page.locator('.hypothesis-banner').textContent();
  const adaptiveMissionText = await page.locator('#adaptive-mission-card').textContent();
  log('개선 #6 & 고도화 #1: 처음 생각·이유 연결 및 오개념 맞춤형 실험 미션 처방', (hypothesisText?.includes('1/5이 더 크다') ?? false) && (adaptiveMissionText?.includes('맞춤 실험 미션') ?? false));

  await page.click('button[data-explore-tab="core"]');
  const coreExpCount = await page.locator('.experiment-box').count();
  await page.click('button[data-explore-tab="all"]');
  const allExpCount = await page.locator('.experiment-box').count();
  log('디자인 통합 개편: 2단계 실험 묶음 탭 필터(핵심 비교 2개 ↔ 전체 7개) 작동', coreExpCount === 2 && allExpCount === 7, `core=${coreExpCount}, all=${allExpCount}`);

  // #5 & #6. 조각 포개어 차이 보기 + 양쪽 분모 자유 비교(#2) + 조각 모아 전체 1 채우기(#1) + 실생활 분수(#6)
  await page.click('button[data-action="toggle-overlap"]');
  const overlapText = await page.locator('.overlap-comparison').textContent();
  log('재미 개선 #5: 실험 1 조각 포개어 길이 차이 강조 및 발견 1 표시', (overlapText?.includes('발견 1') && overlapText?.includes('더 길어요')) ?? false);

  await page.click('button[data-action="base-more"]');
  const baseOut = await page.locator('#explore-base-output').textContent();
  log('추가 개발 #2: 실험 2 위쪽 기준 분수 분모 자유 조절 작동', baseOut?.includes('1/4') ?? false, `"${baseOut}"`);
  await page.click('button[data-action="base-less"]');

  await page.click('button[data-quick-denom="8"]');
  const quickOutput = await page.locator('#explore-denom-output').textContent();
  log('재미 개선 #5: 빠른 인원(8명) 원터치 비교 버튼 작동', quickOutput?.includes('8등분') ?? false);

  const slider = page.locator('#explore-slider');
  await slider.focus();
  await slider.fill('12');
  await slider.dispatchEvent('input');
  const sliderStillFocused = await page.evaluate(() => document.activeElement?.id === 'explore-slider');
  const expText = await page.locator('#step').textContent();
  log('개선 #7·#8: 실험 2 등분 슬라이더 조작 즉시 원리(발견 2) 표시 및 포커스 유지', (expText?.includes('발견 2') ?? false) && sliderStillFocused);

  await page.click('button[data-action="fill-piece-full"]');
  const fillWholeText = await page.locator('#fill-whole-status').textContent();
  log('추가 개발 #1: 실험 3 단위분수 조각을 모아 전체 1 채우기 완성 작동', fillWholeText?.includes('전체 1 완성') ?? false);

  await page.click('button[data-action="toggle-fair-cut"]');
  const fairCutText = await page.locator('#fair-cut-status').textContent();
  log('고도화 #4: 실험 4 불공평 분할 vs 공평한 등분할 조건 실험 작동', fairCutText?.includes('등분할 성공') ?? false);

  await page.click('button[data-action="flag-all"]');
  const flagLineText = await page.locator('#flag-line-status').textContent();
  await page.click('button[data-action="flag-reset"]');
  const resetFlagCaption = await page.locator('.flag-line-figure figcaption').textContent();
  log('고도화 #6: 실험 5 0~1 수직선 위에 여러 단위분수 깃발 꽂기 및 초기화 작동', (flagLineText?.includes('한눈에 발견') ?? false) && (resetFlagCaption?.includes('2개') ?? false));

  await page.click('button[data-action="toggle-trap"]');
  const trapText = await page.locator('.trap-experiment-content').textContent();
  log('재미 개선 #6: 원래 전체 크기가 다를 때 깜짝 함정 실험 작동', trapText?.includes('깜짝 발견') ?? false);

  await page.click('button[data-action="toggle-reallife"]');
  const realLifeText = await page.locator('.reallife-content').textContent();
  log('추가 개발 #6: 생활 속 시계판(30분 vs 15분) & 12칸 초콜릿 단위분수 실험 작동', realLifeText?.includes('30분') ?? false);

  // #4. 3단계 다시 점검하기: 응용 문제(B가 정답), 중복 ID 부재, 무한 미니게임(#4) 및 분수 기차 줄 세우기(#3)
  await page.click('button[data-action="next"]');
  const duplicateIds = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id).filter(Boolean);
    return ids.filter((id, i) => ids.indexOf(id) !== i);
  });
  log('3단계 DOM 중복 ID 없음', duplicateIds.length === 0, duplicateIds.length > 0 ? duplicateIds.join(', ') : '');
  await page.click('button[data-pick-poll="again"][data-pick-choice="A"]');
  await page.click('button[data-conf-poll="again"][data-conf-level="high"]');
  const checkText = await page.locator('#step').textContent();
  log('개선 #8: 3단계 재선택 클릭 즉시 정답 피드백 표시', checkText?.includes('정답이에요') ?? false);

  await page.click('.class-poll-details[data-poll-details="again"] summary');
  await page.click('button[data-action="fill-sample"][data-target-poll="again"]');
  const baChartVisible = await page.locator('#poll-before-after-chart').isVisible();
  log('고도화 #9: 교사용 실험 전(1단계) vs 실험 후(3단계) 학급 생각 변화 비교 차트 표시', baChartVisible);

  // 응용 문제에서 수직선·주스컵 모형 전환 및 선택 확인 (B: 1/4 조각이 더 크다가 정답)
  await page.click('button[data-action="toggle-numberline"]');
  log('응용 문제 수직선 모형 전환 작동', (await page.locator('.fraction-numberline').count()) === 2);
  await page.click('button[data-action="toggle-cup"]');
  log('응용 문제 주스 컵 모형 전환 작동', (await page.locator('.fraction-cup').count()) === 2);
  await page.click('button[data-pick-poll="transfer"][data-pick-choice="B"]');

  // 3연속 번개 미니게임 클리어 & 연속 정답 콤보 & 새 랜덤 문제 뽑기 확인
  await page.click('button[data-duel-round="0"][data-duel-pick="right"]');
  await page.click('button[data-duel-round="0"][data-duel-pick="right"]'); // 중복 클릭 시 콤보 중복 증가 방지 검증
  await page.click('button[data-duel-round="1"][data-duel-pick="left"]');
  await page.click('button[data-duel-round="2"][data-duel-pick="right"]');
  const duelBanner = await page.locator('.duel-score-banner').textContent();
  log('재미 개선 #4 & 추가 개발 #4: 번개 미니게임 퍼펙트 클리어 및 3연속 콤보 작동', (duelBanner?.includes('3 / 3') && duelBanner?.includes('3연속')) ?? false, `"${duelBanner}"`);
  await page.click('button[data-action="duel-shuffle"]');
  const firstShuffleRound = await page.locator('.duel-round-row').first().textContent();
  await page.click('button[data-action="duel-shuffle"]');
  const secondShuffleRound = await page.locator('.duel-round-row').first().textContent();
  const shuffledBanner = await page.locator('.duel-score-banner').textContent();
  log('추가 개발 #4: 새로운 랜덤 대결 3문제 뽑기 작동', (shuffledBanner?.includes('0 / 3') ?? false) && firstShuffleRound !== secondShuffleRound);

  // 4) 분수 기차 줄 세우기 퍼즐 확인 (1/2 > 1/6 > 1/9)
  await page.click('button[data-train-denom="2"]');
  await page.click('button[data-train-denom="6"]');
  await page.click('button[data-train-denom="9"]');
  const trainStatus = await page.locator('#train-status').textContent();
  log('추가 개발 #3: 분수 기차 줄 세우기 퍼즐(1/2 > 1/6 > 1/9) 완성 작동', trainStatus?.includes('칙칙폭폭 출발') ?? false);

  // 5) 고도화 #3: 숨은 분모 추리 퀴즈 (1/3 > 1/□ > 1/7)
  await page.click('button[data-mystery-denom="5"]');
  const mysteryStatus = await page.locator('#mystery-status').textContent();
  log('고도화 #3: 역방향 추론 숨은 분모 추리 퀴즈(1/3 > 1/5 > 1/7) 작동', mysteryStatus?.includes('추리 성공') ?? false);

  // #8 & #9. 4단계 오늘의 발견: 성장 카드 + 메타인지 리포트(#5) + 진분수 브릿지(#2) + 단어 카드 규칙 퀴즈 + 친구 설명 편지(#7) + 인증서(#9) + 스탬프 투어
  await page.click('button[data-action="next"]');
  const reportVisible = await page.locator('.solo-report-card').isVisible();
  const journeySteps = await page.locator('.journey-step').count();
  const metacogText = await page.locator('#metacog-summary').textContent();
  log('개선 #10 & 고도화 #5: 4단계 내 생각의 성장 카드 및 확신 온도 메타인지 리포트 표시', reportVisible && journeySteps === 3 && (metacogText?.includes('완전히 확신해요') ?? false));

  await page.click('button[data-bridge-pick="right"]');
  const bridgeStatus = await page.locator('#bridge-status').textContent();
  log('고도화 #2: 4단계 다음 개념 연결(진분수 2/5 vs 3/5 비교 브릿지 미션) 작동', bridgeStatus?.includes('정답이에요') ?? false);

  await page.click('button[data-rule-choice="smaller"]');
  await page.click('button[data-rule-choice="smaller"]'); // 재클릭 시에도 정답 빈칸 해제되지 않음 검증
  const blankText = await page.locator('.notebook-blank').textContent();
  log('재미 개선 #8: 단어 카드 콕콕 선택으로 규칙 빈칸 완성 작동', blankText?.includes('작아집니다') ?? false);

  await page.click('button[data-letter-choice="correct"]');
  const letterReply = await page.locator('#letter-reply').textContent();
  log('추가 개발 #7: 고민하던 친구(민수)에게 보내는 설명 편지 및 답장 작동', letterReply?.includes('민수의 답장') ?? false);

  const certVisible = await page.locator('.print-certificate-box').isVisible();
  log('추가 개발 #9: 한 장짜리 단위분수 탐구 박사 인증서 서명란 표시', certVisible);

  const stampTitle = await page.locator('.stamp-tour-board h3').textContent();
  log('재미 개선 #9: 3대 주제 스탬프 투어 보드 획득 확인', stampTitle?.includes('1 / 3') ?? false, `"${stampTitle}"`);
  await page.click('button[data-action="next-unit"]');
  const nextUnitH2 = await page.locator('#step h2').textContent();
  log('재미 개선 #9: 다음 이야기 도전하기 버튼으로 즉시 다음 주제(1/4 vs 1/7) 시작', nextUnitH2?.includes('1/4과 1/7') ?? false);

  log('수업 JS 에러 없음', errors.length === 0, errors.length > 0 ? errors.join('; ') : '');

  await page.close();
}

async function testLessonAiPanelFeatures(browser) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404 (Not Found)')) errors.push(m.text()); });

  // 1단계(think)에서 바로 로컬 AI 패널이 활성화됨
  await page.goto(`${BASE}lesson-ai.html`, { waitUntil: 'domcontentloaded' });
  await page.locator('#lesson-ai-panel').waitFor();

  const countText = await page.locator('#lesson-ai-count').textContent();
  log('AI 보조 수업 패널 글자 수 카운터 표시', countText === '0/160자', `"${countText}"`);

  await page.click('button[data-ai-chip="0"]');
  const chipValue = await page.locator('#lesson-ai-query').inputValue();
  log('재미 개선 #10: AI 보조 수업 패널 자주 나오는 학생 생각 1클릭 칩 입력 작동', chipValue.includes('1/5 한 조각이 더 길다고'), `"${chipValue}"`);

  await page.locator('#lesson-ai-query').fill('분모가 크면 조각도 크다고 생각해요');
  const updatedCount = await page.locator('#lesson-ai-count').textContent();
  const kwHighlightText = await page.locator('#ai-keyword-highlights').textContent();
  log('AI 보조 수업 패널 글자 수 실시간 갱신 및 개념 단서(고도화 #10) 하이라이트', updatedCount === '19/160자' && (kwHighlightText?.includes('분모') ?? false), `"${updatedCount}"`);

  const progressExists = await page.locator('#lesson-ai-progress').count() > 0;
  log('AI 보조 수업 패널 진행률 바 DOM 존재', progressExists);

  await page.click('.ai-coaching-preview summary');
  await page.click('button[data-pick-poll="first"][data-pick-choice="A"]');
  const coachingStillOpen = await page.locator('.ai-coaching-preview'). evaluate(el => el.hasAttribute('open'));
  const coachingCount = await page.locator('.ai-coaching-card').count();
  const counterExampleCount = await page.locator('.coaching-counter').count();
  log('추가 개발 #10 & 고도화 #10: 교사용 3단계 발문 코칭 및 맞춤 반례 힌트 제공·열림 상태 유지', coachingCount === 3 && counterExampleCount === 3 && coachingStillOpen, `${coachingCount}개 카드 시나리오`);

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
