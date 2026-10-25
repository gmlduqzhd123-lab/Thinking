import { CHOICES, emptyCounts, fractionSegments, parseParticipants, percentagePointChange, validateCounts, type Choice, type RawCounts } from './lesson-core';
import { MAX_PARTICIPANTS, DENOMINATOR_MIN, DENOMINATOR_MAX } from './constants';
import { registerUnit, getUnit, listUnits } from './unit-registry';
import m01 from './units/m01';
import m02 from './units/m02';
import m03 from './units/m03';
import './lesson.css';

// ─── 단원 레지스트리 초기 등록 ───────────────────────────────────
if (listUnits().length === 0) {
  registerUnit(m01);
  registerUnit(m02);
  registerUnit(m03);
}

// ─── 타입 (4단계 핵심 흐름: 생각 고르기 → 직접 실험하기 → 다시 점검하기 → 오늘의 발견) ───
type Poll = 'first' | 'again' | 'transfer';
type Phase = 'think' | 'explore' | 'check' | 'result';
type VisualModel = 'bar' | 'circle' | 'numberline' | 'cup';
type DuelPick = 'left' | 'right';
type RuleChoice = 'bigger' | 'smaller' | 'same' | '';

// ─── 상수 ────────────────────────────────────────────────────────
const order: Phase[] = ['think', 'explore', 'check', 'result'];
const phaseLabels: Record<Phase, string> = {
  think: '1. 생각 고르기',
  explore: '2. 직접 실험하기',
  check: '3. 다시 점검하기',
  result: '4. 오늘의 발견',
};

const storyDilemmas: Record<string, { badge: string; lead: string }> = {
  M01: {
    badge: '🍫 민수의 초코바 고민',
    lead: '초코바를 아주 좋아하는 민수는 <strong>"3보다 5가 더 큰 숫자니까 나는 1/5 조각을 먹을래!"</strong>라고 골랐어요. 과연 민수는 1/3 조각보다 더 큰 초코바를 먹게 될까요?',
  },
  M02: {
    badge: '🍕 서연이의 피자 고민',
    lead: '피자 파티에서 서연이는 <strong>"4보다 7이 더 큰 숫자니까 1/7 피자 조각이 더 크겠지?"</strong>라고 생각했어요. 과연 1/4 조각과 1/7 조각 중 어느 쪽이 더 클까요?',
  },
  M03: {
    badge: '🎀 준호의 색테이프 고민',
    lead: '만들기 시간에 준호는 <strong>"숫자 6이 2보다 훨씬 크니까 1/6 색테이프가 더 길 거야!"</strong>라고 말했어요. 과연 1/2 조각과 1/6 조각 중 어느 쪽이 더 길까요?',
  },
};

const teacherTalkPrompts: Record<Phase, string> = {
  think: '🙋 선생님 질문 톡: "짝에게 내가 고른 답과 이유를 30초 동안 설명해 볼까요? 숫자(분모)가 커지면 조각은 어떻게 될까요?"',
  explore: '🙋 선생님 질문 톡: "나누는 사람 수(분모)가 3명에서 12명으로 늘어날수록 내가 먹는 한 조각이 왜 작아지는지 짝에게 말해 보세요!"',
  check: '🙋 선생님 질문 톡: "처음 생각과 지금 생각이 같나요, 바뀌었나요? 무엇을 보고 확신하게 되었는지 이야기해 볼까요?"',
  result: '🙋 선생님 질문 톡: "오늘 발견한 단위분수의 비밀을 한 문장으로 다 함께 읽어 보고, 다른 간식 이야기에도 도전해 봐요!"',
};

const duelRounds = [
  { id: 0, leftDenom: 7, rightDenom: 2, answer: 'right' as DuelPick },
  { id: 1, leftDenom: 3, rightDenom: 9, answer: 'left' as DuelPick },
  { id: 2, leftDenom: 11, rightDenom: 4, answer: 'right' as DuelPick },
] as const;

const QUICK_DENOMS = [2, 3, 5, 8, 12] as const;

const reasonCards = [
  '분모가 클수록 조각이 크다고 생각함',
  '더 많이 나눌수록 조각이 작아진다고 생각함',
  '전체가 같은지 확인이 필요함',
] as const;

const reasonStudentBubbles = [
  '💬 "분모 숫자가 더 크니까 한 조각도 더 클 것 같아요!"',
  '💬 "같은 전체를 더 많이 나누면 한 조각은 더 작아질 것 같아요!"',
  '💬 "두 간식의 원래 전체 크기가 똑같은지 먼저 확인해야 해요!"',
] as const;

// ─── DOM ─────────────────────────────────────────────────────────
const app = document.querySelector<HTMLElement>('#lesson-app')!;
const aiEnabled = app.dataset.aiEnabled === 'true';

// ─── 상태 ────────────────────────────────────────────────────────
let aiPanel: { sync(active: boolean): void; dispose(): void } | undefined;
let selectedUnitId = 'M01';
let visualModel: VisualModel = 'bar';
let phase: Phase = 'think';
let spoilerPreview = false;
let myChoices: Record<Poll, Choice | null> = { first: null, again: null, transfer: null };
let reasonSelected = '';
let aiLinkedCardTitle = '';
let showOverlap = false;
let showTrapExperiment = false;
let exploreDenominator = 5;
let exploreMoved = false;
let duelPicks: Record<number, DuelPick | null> = { 0: null, 1: null, 2: null };
let ruleChoice: RuleChoice = '';
let notebookBlankRevealed = false;
let clearedUnits = new Set<string>();
let classPollOpen = false;
let pollBlind = false;
let participantsRaw = '20';
let pollData: Record<Poll, RawCounts | null> = { first: null, again: null, transfer: null };
let error = '';

// ─── 헬퍼 ────────────────────────────────────────────────────────
function currentUnit() {
  return getUnit(selectedUnitId);
}

function isDarkTheme(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function isLargeScale(): boolean {
  return document.documentElement.getAttribute('data-scale') === 'large';
}

function resetSession(keepUnit = false, keepStamps = false) {
  aiPanel?.dispose();
  if (!keepUnit) selectedUnitId = 'M01';
  if (!keepStamps) clearedUnits.clear();
  visualModel = 'bar';
  phase = 'think';
  spoilerPreview = false;
  myChoices = { first: null, again: null, transfer: null };
  reasonSelected = '';
  aiLinkedCardTitle = '';
  showOverlap = false;
  showTrapExperiment = false;
  exploreDenominator = currentUnit().denominators.first[1];
  exploreMoved = false;
  duelPicks = { 0: null, 1: null, 2: null };
  ruleChoice = '';
  notebookBlankRevealed = false;
  classPollOpen = false;
  pollBlind = false;
  participantsRaw = '20';
  pollData = { first: null, again: null, transfer: null };
  error = '';
  render();
}

function snackName(): string {
  if (selectedUnitId === 'M01') return '초코바';
  if (selectedUnitId === 'M02') return '피자';
  return '색테이프';
}

function snackColors(): { fill: string; bg: string; stroke: string } {
  if (selectedUnitId === 'M01') {
    return { fill: '#e08e2b', bg: 'var(--lesson-bar-bg, #fbf5ef)', stroke: 'var(--lesson-bar-stroke, #5c3317)' };
  }
  if (selectedUnitId === 'M02') {
    return { fill: '#ffca62', bg: 'var(--lesson-bar-bg, #fffaf0)', stroke: 'var(--lesson-bar-stroke, #b45309)' };
  }
  return { fill: '#ff8da1', bg: 'var(--lesson-bar-bg, #fff5f7)', stroke: 'var(--lesson-bar-stroke, #153a69)' };
}

// ─── 분수 시각 모형 컴포넌트 (#2 정답 스포일러 방지, #3 실제 간식 테마) ───

function circleFraction(denominator: number, undividedPreview = false): string {
  const cx = 80;
  const cy = 80;
  const r = 60;
  const { fill, bg, stroke } = snackColors();

  if (undividedPreview) {
    return `<figure class="fraction fraction-circle">
      <svg viewBox="0 0 160 160" role="img"
        aria-label="아직 자르지 않은 전체 크기가 같은 간식 모형 (${denominator}명이 똑같이 나눌 예정)">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" fill-opacity="0.28" stroke="${stroke}" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="${cx}" cy="${cy}" r="${r - 8}" fill="none" stroke="${stroke}" stroke-width="1.2" stroke-opacity="0.4"/>
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">똑같은 전체 1</text>
        <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="13" font-weight="700" fill="#d9381e">? (${denominator}등분 중 1조각)</text>
      </svg>
      <figcaption>상상하기: 똑같은 ${snackName()}를 <strong>${denominator}명</strong>이 나눈 한 조각 (<strong>1/${denominator}</strong>)</figcaption>
    </figure>`;
  }

  const angleStep = (2 * Math.PI) / denominator;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + angleStep;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = angleStep > Math.PI ? 1 : 0;
  const sectorPath = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

  const midAngle = startAngle + angleStep / 2;
  const pepX = (cx + r * 0.52 * Math.cos(midAngle)).toFixed(2);
  const pepY = (cy + r * 0.52 * Math.sin(midAngle)).toFixed(2);

  const dividers = Array.from({ length: denominator }, (_, i) => {
    const a = startAngle + i * angleStep;
    const lx = cx + r * Math.cos(a);
    const ly = cy + r * Math.sin(a);
    return `<line x1="${cx}" y1="${cy}" x2="${lx.toFixed(2)}" y2="${ly.toFixed(2)}" stroke="${stroke}" stroke-width="1.8"/>`;
  }).join('');

  return `<figure class="fraction fraction-circle">
    <svg viewBox="0 0 160 160" role="img"
      aria-label="같은 크기의 전체를 ${denominator}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${denominator}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}" stroke="${stroke}" stroke-width="3"/>
      <path d="${sectorPath}" fill="${fill}"/>
      <circle cx="${pepX}" cy="${pepY}" r="4.5" fill="#d9381e" fill-opacity="0.85"/>
      ${dividers}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="3"/>
    </svg>
    <figcaption>같은 ${snackName()}의 <strong>1/${denominator}</strong> (${denominator}조각 중 한 조각)</figcaption>
  </figure>`;
}

function numberLineFraction(denominator: number): string {
  const startX = 36;
  const endX = 564;
  const width = endX - startX;
  const stepX = width / denominator;
  const firstX = startX + stepX;

  const ticks = Array.from({ length: denominator + 1 }, (_, i) => {
    const x = (startX + i * stepX).toFixed(2);
    const isEnd = i === 0 || i === denominator;
    return `<line x1="${x}" y1="${isEnd ? 22 : 28}" x2="${x}" y2="${isEnd ? 54 : 48}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="${isEnd ? 3 : 2}"/>`;
  }).join('');

  return `<figure class="fraction fraction-numberline">
    <svg viewBox="0 0 600 78" role="img"
      aria-label="0에서 1까지를 ${denominator}등분하고 첫 눈금을 표시한 수직선 모형, 1/${denominator}">
      <rect x="${startX}" y="31" width="${stepX.toFixed(2)}" height="14" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      <line x1="${startX}" y1="38" x2="${endX}" y2="38" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      ${ticks}
      <circle cx="${firstX.toFixed(2)}" cy="38" r="6" fill="#d9381e"/>
      <text x="${startX}" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">0</text>
      <text x="${firstX.toFixed(2)}" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="#d9381e">1/${denominator}</text>
      <text x="${endX}" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1</text>
    </svg>
    <figcaption>0~1 수직선의 <strong>1/${denominator}</strong> 눈금</figcaption>
  </figure>`;
}

function cupFraction(denominator: number): string {
  const cupX = 40;
  const cupY = 16;
  const cupW = 80;
  const cupH = 120;
  const fillH = cupH / denominator;
  const fillY = cupY + cupH - fillH;

  const ticks = Array.from({ length: denominator - 1 }, (_, i) => {
    const y = (cupY + ((i + 1) * cupH) / denominator).toFixed(2);
    return `<line x1="${cupX + 8}" y1="${y}" x2="${cupX + cupW - 8}" y2="${y}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  }).join('');

  return `<figure class="fraction fraction-cup">
    <svg viewBox="0 0 160 156" role="img"
      aria-label="같은 크기의 컵을 ${denominator}등분하고 한 눈금만큼 채운 들이 모형, 1/${denominator}">
      <rect x="${cupX}" y="${cupY}" width="${cupW}" height="${cupH}" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="${cupX + 2}" y="${fillY.toFixed(2)}" width="${cupW - 4}" height="${fillH.toFixed(2)}" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${ticks}
      <rect x="${cupX}" y="${cupY}" width="${cupW}" height="${cupH}" rx="6" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
    </svg>
    <figcaption>같은 컵의 <strong>1/${denominator}컵</strong></figcaption>
  </figure>`;
}

function bar(denominator: number, undividedPreview = false): string {
  if (visualModel === 'circle') return circleFraction(denominator, undividedPreview);
  if (visualModel === 'numberline') return numberLineFraction(denominator);
  if (visualModel === 'cup') return cupFraction(denominator);

  const { fill, bg, stroke } = snackColors();

  if (undividedPreview) {
    return `<figure class="fraction">
      <svg viewBox="0 0 600 70" role="img"
        aria-label="아직 자르지 않은 전체 길이가 같은 ${snackName()} 모형 (${denominator}명이 똑같이 나눌 예정)">
        <rect x="0" y="10" width="600" height="48" rx="8" fill="${fill}" fill-opacity="0.22" stroke="${stroke}" stroke-width="3" stroke-dasharray="8 5"/>
        <line x1="14" y1="34" x2="586" y2="34" stroke="${stroke}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="4 4"/>
        <text x="300" y="39" text-anchor="middle" font-size="16" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">아직 자르기 전 똑같은 ${snackName()} 전체 1 → ✂️ ${denominator}조각으로 나누면 한 조각(1/${denominator})은?</text>
      </svg>
      <figcaption>상상하기: 같은 ${snackName()}를 <strong>${denominator}명</strong>이 똑같이 나눈 한 조각 (<strong>1/${denominator}</strong>)</figcaption>
    </figure>`;
  }

  const segments = fractionSegments(denominator);
  const segmentWidth = 600 / denominator;
  const dividers = segments.slice(1).map(s =>
    `<line x1="${600 * s.start}" y1="10" x2="${600 * s.start}" y2="58" stroke="${stroke}" stroke-width="2"/>`
  ).join('');

  // 간식 테마별 디테일 (초코바 블록 / 피자 토핑 / 리본 스티치)
  const themeDecoration = selectedUnitId === 'M01'
    ? `<rect x="6" y="16" width="${Math.max(8, segmentWidth - 12).toFixed(2)}" height="36" rx="3" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="1.5"/>`
    : selectedUnitId === 'M02'
      ? `<circle cx="${Math.min(580, segmentWidth * 0.5).toFixed(2)}" cy="34" r="6" fill="#d9381e" fill-opacity="0.8"/>`
      : `<line x1="6" y1="34" x2="${Math.max(10, segmentWidth - 6).toFixed(2)}" y2="34" stroke="#fff" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="5 3"/>`;

  return `<figure class="fraction">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${denominator}등분하고 첫 한 조각을 칠한 분수 막대, 1/${denominator}">
      <rect x="0" y="10" width="600" height="48" rx="6" fill="${bg}" stroke="${stroke}" stroke-width="3"/>
      <rect x="0" y="10" width="${segmentWidth}" height="48" rx="4" fill="${fill}"/>
      ${themeDecoration}
      ${dividers}
    </svg>
    <figcaption>같은 ${snackName()}의 <strong>1/${denominator}</strong> (${denominator}조각 중 한 조각)</figcaption>
  </figure>`;
}

function renderSimpleVisualPair(dA: number, dB: number, allowExtraModels = false, undividedPreview = false): string {
  const extraBtns = allowExtraModels
    ? `<button type="button" data-action="toggle-numberline" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'numberline'}">📐 수직선으로 보기</button>
       <button type="button" data-action="toggle-cup" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'cup'}">🥤 주스 컵으로 보기</button>`
    : '';
  return `<div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'circle'}">${visualModel === 'circle' ? '📏 막대 모양으로 보기' : '🍕 둥근 피자 모양으로 보기'}</button>
      ${extraBtns}
    </div>
    <div class="bar-pair">${bar(dA, undividedPreview)}${bar(dB, undividedPreview)}</div>`;
}

// ─── 선택지 및 피드백 렌더링 (#4 항상 A만 정답인 구조 개선 포함) ────

function isTransferReversed(poll: Poll): boolean {
  return poll === 'transfer';
}

function correctChoiceForPoll(poll: Poll): Choice {
  return isTransferReversed(poll) ? 'B' : 'A';
}

function choiceLabel(choice: Choice | null, dA: number, dB: number, poll: Poll = 'first'): string {
  if (!choice) return '아직 선택하지 않음';
  const [leftD, rightD] = isTransferReversed(poll) ? [dB, dA] : [dA, dB];
  const labels: Record<Choice, string> = {
    A: `1/${leftD}이 더 크다`,
    B: `1/${rightD}이 더 크다`,
    C: '두 조각의 크기가 같다',
    D: '아직 잘 모르겠다',
  };
  return labels[choice];
}

function renderChoiceButtons(poll: Poll, dA: number, dB: number): string {
  const selected = myChoices[poll];
  const [leftD, rightD] = isTransferReversed(poll) ? [dB, dA] : [dA, dB];
  const labels = [
    `A. 1/${leftD} 조각이 더 크다`,
    `B. 1/${rightD} 조각이 더 크다`,
    'C. 두 조각의 크기가 같다',
    'D. 아직 잘 모르겠다',
  ];
  return `<div class="solo-choice-grid" role="group" aria-label="생각 선택 보기">
    ${CHOICES.map((ch, i) =>
      `<button type="button" data-pick-poll="${poll}" data-pick-choice="${ch}" class="solo-choice-btn ${selected === ch ? 'solo-choice-selected' : ''}" aria-pressed="${selected === ch}">${labels[i]}</button>`
    ).join('')}
  </div>`;
}

function renderInstantFeedback(poll: Poll, dA: number, dB: number): string {
  const selected = myChoices[poll];
  if (!selected) return '';
  if (poll === 'first') {
    return `<p id="poll-note" class="solo-feedback-box" role="status">✅ 내 처음 생각으로 <strong>"${choiceLabel(selected, dA, dB, poll)}"</strong>을(를) 골랐어요! 이제 2단계에서 직접 잘라 확인해 볼까요?</p>`;
  }
  const correctCh = correctChoiceForPoll(poll);
  if (selected === correctCh) {
    return `<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 더 적게 나눈 <strong>1/${dA}</strong> 한 조각이 <strong>1/${dB}</strong> 한 조각보다 더 큽니다.</p>`;
  }
  if (selected === 'C') {
    return `<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 나눈 조각 수가 ${dA}등분과 ${dB}등분으로 서로 다르기 때문에 한 조각의 크기도 달라요. 덜 나눈 <strong>1/${dA}</strong>이 더 큽니다.</p>`;
  }
  if (selected === 'D') {
    return `<p class="answer feedback-hint" role="status">🌱 <strong>괜찮아요!</strong> 같은 전체를 덜 나눈 조각일수록 한 조각의 크기가 더 커요. 따라서 <strong>1/${dA}</strong> 조각이 <strong>1/${dB}</strong> 조각보다 더 큽니다.</p>`;
  }
  return `<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 분모 숫자 ${dB}이 ${dA}보다 크지만, 같은 전체를 더 여러 조각으로 나누면 한 조각의 크기는 오히려 작아져요! 따라서 <strong>1/${dA}</strong>(${correctCh}번)이 더 큽니다.</p>`;
}

function formatClassPollStatus(poll: Poll): string {
  if (pollBlind) {
    return '🙈 현재 학생들의 거수 투표 결과를 가려 두었습니다. [👀 결과 공개하기]를 누르면 나타납니다.';
  }
  const counts = pollData[poll] ?? emptyCounts();
  const n = parseParticipants(participantsRaw);
  const checked = n ? validateCounts(counts, n) : null;
  const correctCh = correctChoiceForPoll(poll);
  return checked
    ? `집계 완료: 정답(${correctCh}) ${checked.counts[correctCh]}/${n}명 · 미응답 ${checked.noResponse}명`
    : '학급 인원 집계를 기록하려면 숫자를 입력하거나 ＋1 버튼을 누르세요.';
}

/** #7 교사용 선택형 학급 인원 집계 (+1/-1 스마트보드 터치 카운터 & 결과 가리기 포함). */
function renderOptionalClassPoll(poll: Poll, dA: number, dB: number): string {
  const counts = pollData[poll] ?? emptyCounts();
  const [leftD, rightD] = isTransferReversed(poll) ? [dB, dA] : [dA, dB];
  const labels = [`A (1/${leftD})`, `B (1/${rightD})`, 'C (같다)', 'D (모름)'];

  return `<details class="class-poll-details" data-poll-details="${poll}" ${classPollOpen ? 'open' : ''}>
    <summary>👩‍🏫 교실 수업용 거수 투표·인원수 기록하기 (필요할 때만 열기)</summary>
    <div class="class-poll-body">
      <div class="poll-top-row">
        <label>참여 인원(1~${MAX_PARTICIPANTS}명) <input id="participants" data-participants-input="${poll}" type="text" inputmode="numeric" value="${participantsRaw}" autocomplete="off"></label>
        <button type="button" data-action="toggle-poll-blind" class="secondary-btn" aria-pressed="${pollBlind}">${pollBlind ? '👀 결과 공개하기' : '🙈 결과 잠시 가리기'}</button>
      </div>
      <div class="class-poll-inputs">
        ${CHOICES.map((ch, i) =>
          `<div class="poll-counter-card">
            <label>${labels[i]} <input data-count="${ch}" data-count-poll="${poll}" type="text" inputmode="numeric" value="${pollBlind ? '•' : counts[ch]}" aria-label="${ch} 선택 인원" autocomplete="off" ${pollBlind ? 'readonly' : ''}></label>
            <div class="poll-touch-btns">
              <button type="button" data-vote-poll="${poll}" data-vote-choice="${ch}" data-vote-delta="-1" class="secondary-btn vote-step-btn" aria-label="${ch} 인원 1명 줄이기">−1</button>
              <button type="button" data-vote-poll="${poll}" data-vote-choice="${ch}" data-vote-delta="1" class="secondary-btn vote-step-btn" aria-label="${ch} 인원 1명 추가">＋1</button>
            </div>
          </div>`
        ).join('')}
      </div>
      <div class="poll-helpers">
        <button type="button" data-action="fill-zeros" data-target-poll="${poll}" class="secondary-btn">빈 칸 0으로 채우기</button>
        <button type="button" data-action="fill-sample" data-target-poll="${poll}" class="secondary-btn">예시 인원 채우기</button>
      </div>
      <p class="class-poll-status" data-status-poll="${poll}" role="status">${formatClassPollStatus(poll)}</p>
    </div>
  </details>`;
}

// ─── 4단계 화면별 본문 ───────────────────────────────────────────

/** 1단계: 스토리 딜레마(#1) + 정답 스포일러 없는 상상 모형(#2) + 1클릭 선택 & 말풍선(#3, #4). */
function renderThinkPhase(): string {
  const unit = currentUnit();
  const [firstA, firstB] = unit.denominators.first;
  const story = storyDilemmas[selectedUnitId] ?? storyDilemmas.M01;

  const unitCards = listUnits().map(u => {
    const active = u.id === selectedUnitId;
    const isCleared = clearedUnits.has(u.id);
    return `<button type="button" data-unit-id="${u.id}" class="unit-card-btn ${active ? 'unit-card-active' : ''}" aria-pressed="${active}">
      <span class="unit-stamp-tag">${isCleared ? '⭐ 클리어 완료!' : active ? '🔍 지금 탐구 중' : '👆 눌러서 시작'}</span>
      <strong>${u.title}</strong>
      <span>${u.description}</span>
    </button>`;
  }).join('');

  return `
    <div class="unit-card-bar" role="group" aria-label="탐구할 분수 이야기 고르기">
      ${unitCards}
    </div>

    <div class="step-card">
      <h2 tabindex="-1">① 처음 생각 고르기 · 1/${firstA}과 1/${firstB} 비교</h2>

      <div class="story-dilemma-card" role="region" aria-label="${story.badge}">
        <span class="story-badge">${story.badge}</span>
        <p class="question-lead">${story.lead}</p>
      </div>

      <p class="teacher-talk-banner">${teacherTalkPrompts.think}</p>

      ${renderSimpleVisualPair(firstA, firstB, false, !spoilerPreview)}
      <div class="spoiler-hint-row">
        <button type="button" data-action="toggle-spoiler" class="secondary-btn" aria-pressed="${spoilerPreview}">
          ${spoilerPreview ? '🙈 자르기 전 모양으로 다시 가리기' : '👀 자른 눈금 힌트 살짝 미리 보기'}
        </button>
      </div>

      ${renderChoiceButtons('first', firstA, firstB)}
      ${renderInstantFeedback('first', firstA, firstB)}

      <div class="reason-section">
        <h3>💭 왜 그렇게 생각했나요? (내 생각과 가장 비슷한 말풍선 고르기)</h3>
        <div class="actions reason-bubble-list">
          ${reasonCards.map((label, i) =>
            `<button type="button" data-reason="${i}" class="reason-bubble-btn" aria-label="${label}" aria-pressed="${reasonSelected === String(i)}">
              <span class="student-bubble">${reasonStudentBubbles[i]}</span>
            </button>`
          ).join('')}
        </div>
        ${aiLinkedCardTitle ? `<p class="ai-linked-badge">🤖 로컬 AI 추천 탐구 연결됨: <strong>${aiLinkedCardTitle}</strong></p>` : ''}
      </div>

      ${renderOptionalClassPoll('first', firstA, firstB)}

      <div class="actions next-step-bar">
        <button type="button" data-action="next" class="primary-next-btn">② 직접 실험하러 가기 →</button>
      </div>
    </div>`;
}

function renderExploreDynamicComparison(firstA: number): { barsHtml: string; badgeHtml: string; discoveryHtml: string } {
  const cmpSymbol = firstA < exploreDenominator ? '>' : firstA > exploreDenominator ? '<' : '=';
  const cmpDesc = firstA < exploreDenominator
    ? `${firstA}등분 한 조각이 ${exploreDenominator}등분 한 조각보다 더 큽니다`
    : firstA > exploreDenominator
      ? `${exploreDenominator}등분 한 조각이 ${firstA}등분 한 조각보다 더 큽니다`
      : '두 조각의 크기가 같습니다';

  return {
    barsHtml: `${bar(firstA)}${bar(exploreDenominator)}`,
    badgeHtml: `크기 비교: <strong>1/${firstA} ${cmpSymbol} 1/${exploreDenominator}</strong> (${cmpDesc})`,
    discoveryHtml: exploreMoved
      ? `<p class="answer">💡 <strong>발견 2</strong>: 같은 크기의 전체를 더 많은 조각으로 나눌수록(분모가 커질수록) 한 조각의 크기는 점점 작아집니다!</p>`
      : '',
  };
}

function updateExploreSliderDOM() {
  const [firstA] = currentUnit().denominators.first;
  const { barsHtml, badgeHtml, discoveryHtml } = renderExploreDynamicComparison(firstA);

  const barsEl = app.querySelector<HTMLElement>('#explore-exp2-bars');
  if (barsEl) barsEl.innerHTML = barsHtml;

  const outputEl = app.querySelector<HTMLElement>('#explore-denom-output');
  if (outputEl) outputEl.textContent = `${exploreDenominator}등분 (1/${exploreDenominator})`;

  const sliderEl = app.querySelector<HTMLInputElement>('#explore-slider');
  if (sliderEl && sliderEl.value !== String(exploreDenominator)) {
    sliderEl.value = String(exploreDenominator);
  }

  const lessBtn = app.querySelector<HTMLButtonElement>('button[data-action="less"]');
  if (lessBtn) lessBtn.disabled = exploreDenominator <= DENOMINATOR_MIN;

  const moreBtn = app.querySelector<HTMLButtonElement>('button[data-action="more"]');
  if (moreBtn) moreBtn.disabled = exploreDenominator >= DENOMINATOR_MAX;

  app.querySelectorAll<HTMLButtonElement>('button[data-quick-denom]').forEach(btn => {
    const active = Number(btn.dataset.quickDenom) === exploreDenominator;
    btn.setAttribute('aria-pressed', String(active));
    btn.classList.toggle('quick-denom-active', active);
  });

  const badgeEl = app.querySelector<HTMLElement>('#explore-cmp-badge');
  if (badgeEl) badgeEl.innerHTML = badgeHtml;

  const discEl = app.querySelector<HTMLElement>('#explore-discovery-2');
  if (discEl) discEl.innerHTML = discoveryHtml;
}

/** 2단계: 포개어 차이 보기(#5) + 빠른 인원 버튼 & 슬라이더(#5) + 전체 크기가 다를 때 깜짝 실험(#6). */
function renderExplorePhase(): string {
  const [firstA, firstB] = currentUnit().denominators.first;
  const myFirstText = choiceLabel(myChoices.first, firstA, firstB, 'first');
  const myReasonText = reasonSelected !== '' ? reasonStudentBubbles[Number(reasonSelected)] : '내 처음 생각을 직접 실험으로 확인해 볼까요?';

  const wA = 600 / firstA;
  const wB = 600 / firstB;
  const diffW = Math.max(0, wA - wB);
  const { barsHtml, badgeHtml, discoveryHtml } = renderExploreDynamicComparison(firstA);

  const quickDenomBtns = QUICK_DENOMS.map(d => {
    const active = exploreDenominator === d;
    return `<button type="button" data-quick-denom="${d}" class="secondary-btn quick-denom-btn ${active ? 'quick-denom-active' : ''}" aria-pressed="${active}">👧 ${d}명이 나눌 때 (1/${d})</button>`;
  }).join('');

  return `
    <div class="step-card">
      <h2 tabindex="-1">② 직접 실험하기 · 눈으로 확인하는 재미있는 실험</h2>

      <div class="hypothesis-banner" role="region" aria-label="나의 처음 생각">
        <p>💭 <strong>나의 처음 생각</strong>: <strong>${myFirstText}</strong></p>
        <p class="hypothesis-sub">${myReasonText}</p>
      </div>

      <p class="teacher-talk-banner">${teacherTalkPrompts.explore}</p>

      <section class="experiment-box" aria-label="실험 1 조각 포개어 비교하기">
        <h3>실험 1 · 가위로 잘라 두 조각을 포개어 대어 보기</h3>
        <p>1/${firstA} 조각과 1/${firstB} 조각의 왼쪽 끝을 똑같이 맞추어 포개어 볼까요?</p>
        <button type="button" data-action="toggle-overlap" class="overlap-trigger-btn" aria-pressed="${showOverlap}">
          ${showOverlap ? '✂️ 포개어 비교한 결과 닫기' : '✂️ 1/' + firstA + ' 조각과 1/' + firstB + ' 조각 포개어 비교하기'}
        </button>

        ${showOverlap ? `
          <div class="overlap-comparison" role="region" aria-label="조각 포개어 겹쳐 비교하기">
            <svg viewBox="0 0 600 92" role="img" aria-label="1/${firstA} 조각과 1/${firstB} 조각을 겹쳐 길이 차이를 비교한 그림">
              <rect x="0" y="8" width="600" height="74" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="4 4"/>
              <rect x="0" y="14" width="${wA.toFixed(2)}" height="26" rx="4" fill="var(--lesson-bar-fill, #ffca62)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <text x="${Math.min(535, wA + 8).toFixed(2)}" y="32" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${firstA} 한 조각</text>
              <rect x="0" y="46" width="${wB.toFixed(2)}" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <rect x="${wB.toFixed(2)}" y="46" width="${diffW.toFixed(2)}" height="26" rx="4" fill="#fde2e2" stroke="#d9381e" stroke-width="2" stroke-dasharray="4 2"/>
              <text x="${Math.min(430, wA + 8).toFixed(2)}" y="64" font-size="13" font-weight="800" fill="#d9381e">← 이만큼 1/${firstA}이 더 길어요!</text>
              <line x1="${wB.toFixed(2)}" y1="10" x2="${wB.toFixed(2)}" y2="78" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="4 3"/>
            </svg>
            <p class="answer">💡 <strong>발견 1</strong>: 왼쪽 끝을 맞추어 포개어 보니, 덜 나눈 <strong>1/${firstA}</strong> 조각이 <strong>1/${firstB}</strong> 조각보다 빨간 점선 칸만큼 확실히 더 깁니다!</p>
          </div>
        ` : ''}
      </section>

      <section class="experiment-box" aria-label="실험 2 나누는 조각 수 바꿔 보기">
        <h3>실험 2 · 나누어 먹는 사람 수(분모)를 2명~12명 사이에서 바꿔 보기</h3>
        <p>빠른 인원 버튼을 누르거나 슬라이더를 움직여 더 많이 나눌 때 한 조각이 어떻게 변하는지 관찰해 보세요.</p>

        <div class="quick-denom-bar" role="group" aria-label="나누는 사람 수 빠른 선택">
          ${quickDenomBtns}
        </div>

        <div id="explore-exp2-bars" class="bar-pair">${barsHtml}</div>

        <div class="slider-experiment-controls">
          <button type="button" data-action="less" ${exploreDenominator <= DENOMINATOR_MIN ? 'disabled' : ''} aria-label="등분 수 줄이기">−</button>
          <input id="explore-slider" type="range" min="${DENOMINATOR_MIN}" max="${DENOMINATOR_MAX}" value="${exploreDenominator}" aria-label="나누는 조각 수 슬라이더">
          <output id="explore-denom-output" aria-live="polite">${exploreDenominator}등분 (1/${exploreDenominator})</output>
          <button type="button" data-action="more" ${exploreDenominator >= DENOMINATOR_MAX ? 'disabled' : ''} aria-label="등분 수 늘리기">＋</button>
        </div>

        <p id="explore-cmp-badge" class="comparison-badge" aria-live="polite">${badgeHtml}</p>
        <div id="explore-discovery-2" aria-live="polite">${discoveryHtml}</div>
      </section>

      <section class="experiment-box trap-box" aria-label="깜짝 실험 원래 전체 크기가 다를 때">
        <h3>😮 깜짝 실험 · 만약 원래 ${snackName()} 전체 크기가 서로 다르면 어떨까요?</h3>
        <button type="button" data-action="toggle-trap" class="secondary-btn" aria-pressed="${showTrapExperiment}">
          ${showTrapExperiment ? '😮 깜짝 함정 실험 닫기' : '😮 깜짝 실험 열어 보기: 미니 간식의 1/2 vs 특대형 간식의 1/4'}
        </button>
        ${showTrapExperiment ? `
          <div class="trap-experiment-content" role="region" aria-label="전체 크기가 서로 다른 두 간식 비교">
            <svg viewBox="0 0 600 84" role="img" aria-label="작은 미니 간식의 1/2 조각(길이 100)과 특대형 간식의 1/4 조각(길이 140) 비교">
              <rect x="0" y="10" width="200" height="26" rx="4" fill="#fff" stroke="#153a69" stroke-width="2"/>
              <rect x="0" y="10" width="100" height="26" rx="4" fill="#ffca62" stroke="#153a69" stroke-width="2"/>
              <text x="212" y="28" font-size="13" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">작은 미니 ${snackName()}의 1/2 한 조각</text>
              <rect x="0" y="46" width="560" height="26" rx="4" fill="#fff" stroke="#153a69" stroke-width="2"/>
              <rect x="0" y="46" width="140" height="26" rx="4" fill="#7cc6fe" stroke="#153a69" stroke-width="2"/>
              <text x="150" y="64" font-size="13" font-weight="700" fill="#d9381e">특대형 점보 ${snackName()}의 1/4 한 조각 (더 큼!)</text>
            </svg>
            <p class="answer">💡 <strong>깜짝 발견!</strong> 원래 전체 크기가 다르면 <strong>1/4</strong>이 <strong>1/2</strong>보다 더 클 수도 있어요! 그래서 단위분수의 크기를 비교할 때는 반드시 <strong>"원래 전체의 크기가 똑같다"</strong>는 약속이 먼저 있어야 합니다.</p>
          </div>
        ` : ''}
      </section>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">③ 내 생각 다시 점검하기 →</button>
      </div>
    </div>`;
}

/** 3단계: 처음 문제 재확인 + 함정 없는 응용 문제(B가 정답) + 3연속 분수 대결 미니게임(#4, #8). */
function renderCheckPhase(): string {
  const [firstA, firstB] = currentUnit().denominators.first;
  const [transferA, transferB] = currentUnit().denominators.transfer;

  const duelScore = duelRounds.filter(r => duelPicks[r.id] === r.answer).length;
  const duelRowsHtml = duelRounds.map(r => {
    const picked = duelPicks[r.id];
    const isCorrect = picked === r.answer;
    return `<div class="duel-round-row">
      <span class="duel-round-badge">라운드 ${r.id + 1}</span>
      <div class="duel-btn-pair" role="group" aria-label="라운드 ${r.id + 1} 더 큰 분수 고르기">
        <button type="button" data-duel-round="${r.id}" data-duel-pick="left" class="secondary-btn duel-card-btn ${picked === 'left' ? 'solo-choice-selected' : ''}" aria-pressed="${picked === 'left'}">1/${r.leftDenom} 조각</button>
        <span class="duel-vs">VS</span>
        <button type="button" data-duel-round="${r.id}" data-duel-pick="right" class="secondary-btn duel-card-btn ${picked === 'right' ? 'solo-choice-selected' : ''}" aria-pressed="${picked === 'right'}">1/${r.rightDenom} 조각</button>
      </div>
      <span class="duel-result-tag" role="status">${picked === null ? '👆 더 큰 쪽을 터치!' : isCorrect ? '🎉 정답!' : `💡 1/${Math.min(r.leftDenom, r.rightDenom)}이 더 커요!`}</span>
    </div>`;
  }).join('');

  return `
    <div class="step-card">
      <h2 tabindex="-1">③ 다시 점검하기 · 실험 후 내 생각 확인과 분수 대결</h2>

      <p class="teacher-talk-banner">${teacherTalkPrompts.check}</p>

      <section class="check-subcard" aria-label="같은 문제 다시 선택하기">
        <h3>1) 처음 문제 다시 고르기: 같은 ${snackName()}에서 1/${firstA}과 1/${firstB} 중 어느 쪽이 더 클까요?</h3>
        <p class="first-memory-tag">💭 1단계에서 고른 내 처음 생각: <strong>${choiceLabel(myChoices.first, firstA, firstB, 'first')}</strong></p>
        ${renderChoiceButtons('again', firstA, firstB)}
        ${renderInstantFeedback('again', firstA, firstB)}
        ${renderOptionalClassPoll('again', firstA, firstB)}
      </section>

      <section class="check-subcard" aria-label="한 걸음 더 새로운 응용 문제">
        <h3>2) 한 걸음 더! 새로운 문제: 같은 전체에서 <strong>1/${transferB}</strong>과 <strong>1/${transferA}</strong> 중 어느 쪽이 더 클까요?</h3>
        <p class="transfer-caution-note">🔍 보기 순서를 잘 보고 더 큰 조각을 골라 보세요!</p>
        ${renderSimpleVisualPair(transferB, transferA, true)}
        ${renderChoiceButtons('transfer', transferA, transferB)}
        ${renderInstantFeedback('transfer', transferA, transferB)}
        ${renderOptionalClassPoll('transfer', transferA, transferB)}
      </section>

      <section class="check-subcard duel-game-box" aria-label="번개 미니게임 더 큰 단위분수 찾기">
        <h3>3) ⚡ 번개 미니게임 · 어느 조각이 더 클까요? (더 큰 분수 카드를 콕 찍어 보세요!)</h3>
        <div class="duel-rounds-list">
          ${duelRowsHtml}
        </div>
        <p class="duel-score-banner" role="status">🎯 미니게임 현재 점수: <strong>${duelScore} / ${duelRounds.length}</strong> 정답 ${duelScore === duelRounds.length ? '🏆 퍼펙트 클리어!' : ''}</p>
      </section>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">④ 오늘의 발견 결과 보기 →</button>
      </div>
    </div>`;
}

/** 4단계: 성장 카드 + 단어 카드 콕콕 규칙 퀴즈(#8) + 3개 주제 스탬프 투어(#9). */
function renderResultPhase(): string {
  clearedUnits.add(selectedUnitId);
  const unit = currentUnit();
  const [fA, fB] = unit.denominators.first;
  const [tA, tB] = unit.denominators.transfer;
  const blankText = notebookBlankRevealed ? '작아집니다!' : ruleChoice === 'bigger' ? '커집니다(?)' : ruleChoice === 'same' ? '같습니다(?)' : '______';

  const againCorrect = myChoices.again === correctChoiceForPoll('again');
  const transferCorrect = myChoices.transfer === correctChoiceForPoll('transfer');
  const growthMessage = againCorrect && transferCorrect
    ? '🏆 최고예요! 직접 실험을 통해 단위분수의 크기 비교 원리를 완벽하게 내 것으로 만들었어요!'
    : againCorrect || transferCorrect
      ? '🌟 참 잘했어요! 실험을 통해 같은 전체를 더 많이 나눌수록 한 조각이 작아진다는 점을 발견했어요!'
      : '🌱 끝까지 스스로 실험하고 생각하며 단위분수의 비밀을 탐구했어요!';

  const n = parseParticipants(participantsRaw);
  const firstPoll = n && pollData.first ? validateCounts(pollData.first, n) : null;
  const againPoll = n && pollData.again ? validateCounts(pollData.again, n) : null;
  const classSummaryHtml = firstPoll && againPoll && n
    ? `<p class="comparison">👩‍🏫 <strong>학급 전체 집계 변화</strong>: 정답(1/${fA}) 선택 인원이 <strong>${firstPoll.counts.A}/${n}명</strong>에서 <strong>${againPoll.counts.A}/${n}명</strong>으로 바뀌었습니다 (${percentagePointChange(firstPoll.counts.A, againPoll.counts.A, n) >= 0 ? '+' : ''}${percentagePointChange(firstPoll.counts.A, againPoll.counts.A, n).toFixed(1)}%p).</p>`
    : '';

  const ruleFeedbackHtml = notebookBlankRevealed
    ? '<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 똑같이 더 많이 나눌수록 한 조각의 크기는 <strong>점점 작아집니다!</strong></p>'
    : ruleChoice === 'bigger' || ruleChoice === 'same'
      ? '<p class="answer feedback-hint" role="status">💡 <strong>다시 골라 볼까요?</strong> 2단계 실험에서 나누는 사람 수를 12명으로 늘렸을 때 한 조각의 크기가 어떻게 변했는지 떠올려 보세요!</p>'
      : '';

  const allUnits = listUnits();
  const nextUncleared = allUnits.find(u => !clearedUnits.has(u.id)) ?? allUnits[(allUnits.findIndex(u => u.id === selectedUnitId) + 1) % allUnits.length];
  const stampsHtml = allUnits.map(u => {
    const done = clearedUnits.has(u.id);
    return `<div class="stamp-item ${done ? 'stamp-done' : ''}">
      <span class="stamp-icon">${done ? '🎖️ 클리어!' : '🔒 미도전'}</span>
      <strong>${u.title}</strong>
    </div>`;
  }).join('');

  return `
    <div class="step-card">
      <h2 tabindex="-1">④ 오늘의 발견 · 내 생각의 성장 카드와 마스터 스탬프</h2>

      <p class="teacher-talk-banner">${teacherTalkPrompts.result}</p>

      <div class="solo-report-card" role="region" aria-label="내 생각의 성장 카드">
        <p class="praise-badge">${growthMessage}</p>
        <div class="growth-journey-grid">
          <div class="journey-step">
            <span class="journey-label">① 처음 내 생각 (1/${fA} vs 1/${fB})</span>
            <strong>${choiceLabel(myChoices.first, fA, fB, 'first')}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${againCorrect ? 'journey-correct' : ''}">
            <span class="journey-label">② 실험 후 내 생각 (1/${fA} vs 1/${fB})</span>
            <strong>${choiceLabel(myChoices.again, fA, fB, 'again')} ${againCorrect ? '⭐' : ''}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${transferCorrect ? 'journey-correct' : ''}">
            <span class="journey-label">③ 응용 문제 (1/${tB} vs 1/${tA})</span>
            <strong>${choiceLabel(myChoices.transfer, tA, tB, 'transfer')} ${transferCorrect ? '⭐' : ''}</strong>
          </div>
        </div>
        ${classSummaryHtml}
      </div>

      <div class="notebook-summary-card" role="region" aria-label="오늘 내가 발견한 규칙">
        <h3>🧩 단어 카드를 골라 오늘의 단위분수 규칙을 완성해 보세요!</h3>
        <div class="notebook-line">
          <p>"크기가 같은 전체를 똑같이 더 많이 나눌수록(분모가 커질수록), 한 조각의 크기는 <strong class="notebook-blank">[ ${blankText} ]</strong>"</p>
        </div>
        <div class="rule-word-cards" role="group" aria-label="빈칸에 들어갈 알맞은 말 고르기">
          <button type="button" data-rule-choice="bigger" class="secondary-btn rule-card-btn" aria-pressed="${ruleChoice === 'bigger'}">📈 점점 커집니다</button>
          <button type="button" data-rule-choice="smaller" data-action="toggle-notebook-blank" class="secondary-btn rule-card-btn ${notebookBlankRevealed ? 'solo-choice-selected' : ''}" aria-pressed="${notebookBlankRevealed}">📉 작아집니다!</button>
          <button type="button" data-rule-choice="same" class="secondary-btn rule-card-btn" aria-pressed="${ruleChoice === 'same'}">🟰 항상 똑같습니다</button>
        </div>
        ${ruleFeedbackHtml}
      </div>

      <div class="stamp-tour-board" role="region" aria-label="분수 탐구 3대 주제 스탬프 투어">
        <h3>🎖️ 분수 탐구 스탬프 투어 (${clearedUnits.size} / ${allUnits.length} 이야기 클리어!)</h3>
        <div class="stamp-grid">
          ${stampsHtml}
        </div>
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="print-summary" class="secondary-btn">🖨️ 결과 인쇄하기</button>
        <button type="button" data-action="next-unit" data-next-unit-id="${nextUncleared.id}" class="primary-next-btn">🚀 다음 이야기(${nextUncleared.title.split('·')[0].trim()}) 도전하기 →</button>
        <button type="button" data-action="restart" class="secondary-btn">🔄 처음부터 다시 하기</button>
      </div>
    </div>`;
}

function body(): string {
  switch (phase) {
    case 'think': return renderThinkPhase();
    case 'explore': return renderExplorePhase();
    case 'check': return renderCheckPhase();
    case 'result': return renderResultPhase();
  }
}

// ─── 상단 헤더 및 4단계 진행 바 ──────────────────────────────────

function renderPageHeader(): string {
  const dark = isDarkTheme();
  const large = isLargeScale();
  return `<header>
    <p class="eyebrow">${aiEnabled ? '로컬 AI 보조 수업' : '초등 수학 분수 탐구'} · 단위분수 크기 비교</p>
    <h1>생각의 갈림길 AI</h1>
    <p>직접 나누고 겹쳐 보며 분수의 크기를 스스로 깨닫는 4단계 탐구</p>
    <div class="header-controls">
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${large}" type="button">${large ? '🔍 기본' : '🔍 큰글씨'}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${dark}" type="button">${dark ? '☀️' : '🌙'}</button>
    </div>
  </header>`;
}

function renderProgressNav(): string {
  const currentIndex = order.indexOf(phase);
  return `<nav aria-label="탐구 4단계 진행">
    <div class="step-indicator" role="list">
      ${order.map((p, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const cls = isDone ? 'step-pill done' : isCurrent ? 'step-pill current' : 'step-pill';
        return `<button type="button" class="${cls}" data-step-index="${i}" aria-current="${isCurrent ? 'step' : 'false'}">${phaseLabels[p]}</button>`;
      }).join('')}
    </div>
  </nav>`;
}

function render(focus = false) {
  if (phase !== 'check' && (visualModel === 'numberline' || visualModel === 'cup')) {
    visualModel = 'bar';
  }
  const currentLabel = phaseLabels[phase];
  app.innerHTML = [
    renderPageHeader(),
    renderProgressNav(),
    `<section id="step" role="region" aria-label="${currentLabel}">${body()}<p id="error" role="alert">${error}</p></section>`,
    `<div id="step-announce" class="sr-only" aria-live="assertive" role="status"></div>`,
    '<footer>이 화면의 활동 내용은 현재 브라우저 메모리에만 머물며 외부로 전송·저장되지 않습니다.</footer>',
  ].join('');

  aiPanel?.sync(phase === 'think');
  if (focus) {
    app.querySelector<HTMLElement>('#step h2')?.focus();
    const announce = app.querySelector('#step-announce');
    if (announce) announce.textContent = `${phaseLabels[phase]} 단계로 이동했습니다.`;
  }
}

function updateClassPollStatusesDOM() {
  app.querySelectorAll<HTMLElement>('.class-poll-status[data-status-poll]').forEach(el => {
    const p = el.dataset.statusPoll as Poll;
    el.textContent = formatClassPollStatus(p);
  });
  app.querySelectorAll<HTMLInputElement>('input[data-participants-input]').forEach(el => {
    if (el !== document.activeElement && el.value !== participantsRaw) {
      el.value = participantsRaw;
    }
  });
}

// ─── 이벤트 핸들러 ───────────────────────────────────────────────

app.addEventListener('toggle', event => {
  const details = event.target as HTMLElement;
  if (details instanceof HTMLDetailsElement && details.classList.contains('class-poll-details')) {
    classPollOpen = details.open;
  }
}, true);

app.addEventListener('input', event => {
  const target = event.target as HTMLInputElement;

  if (target.id === 'explore-slider') {
    exploreDenominator = Number(target.value);
    exploreMoved = true;
    updateExploreSliderDOM();
    return;
  }

  if (target.id === 'participants' || target.dataset.participantsInput) {
    participantsRaw = target.value;
    classPollOpen = true;
    updateClassPollStatusesDOM();
    return;
  }

  if (target.dataset.count && target.dataset.countPoll) {
    if (pollBlind) return;
    const p = target.dataset.countPoll as Poll;
    const ch = target.dataset.count as Choice;
    pollData[p] ??= emptyCounts();
    pollData[p]![ch] = target.value;
    classPollOpen = true;
    updateClassPollStatusesDOM();
  }
});

// 단축키 지원 (Alt+←, Alt+→)
window.addEventListener('keydown', event => {
  if (!event.altKey) return;
  const activeTag = (document.activeElement as HTMLElement | null)?.tagName;
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

  const idx = order.indexOf(phase);
  if (event.key === 'ArrowRight' && idx < order.length - 1) {
    event.preventDefault();
    phase = order[idx + 1];
    render(true);
  } else if (event.key === 'ArrowLeft' && idx > 0) {
    event.preventDefault();
    phase = order[idx - 1];
    render(true);
  }
});

app.addEventListener('click', event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!button) return;

  // 다크 모드 & 큰 글씨 모드
  if (button.id === 'theme-toggle') {
    const nextTheme = isDarkTheme() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    button.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
    button.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    return;
  }

  if (button.id === 'scale-toggle') {
    const nextScale = isLargeScale() ? 'normal' : 'large';
    document.documentElement.setAttribute('data-scale', nextScale);
    button.textContent = nextScale === 'large' ? '🔍 기본' : '🔍 큰글씨';
    button.setAttribute('aria-pressed', String(nextScale === 'large'));
    return;
  }

  // 상단 4단계 탭 직접 클릭 이동
  if (button.dataset.stepIndex !== undefined) {
    const idx = Number(button.dataset.stepIndex);
    if (Number.isInteger(idx) && idx >= 0 && idx < order.length) {
      phase = order[idx];
      error = '';
      render(true);
    }
    return;
  }

  // 1단계 단원 카드 1클릭 전환 (스탬프는 유지)
  if (button.dataset.unitId) {
    selectedUnitId = button.dataset.unitId;
    resetSession(true, true);
    return;
  }

  // 2단계 빠른 등분 인원 버튼 클릭
  if (button.dataset.quickDenom !== undefined) {
    exploreDenominator = Number(button.dataset.quickDenom);
    exploreMoved = true;
    updateExploreSliderDOM();
    return;
  }

  // 3단계 번개 미니게임 카드 선택
  if (button.dataset.duelRound !== undefined && button.dataset.duelPick) {
    const r = Number(button.dataset.duelRound);
    duelPicks[r] = button.dataset.duelPick as DuelPick;
    render();
    return;
  }

  // 4단계 단어 카드 규칙 퀴즈 선택
  if (button.dataset.ruleChoice) {
    const picked = button.dataset.ruleChoice as RuleChoice;
    ruleChoice = picked;
    notebookBlankRevealed = picked === 'smaller' ? !notebookBlankRevealed : false;
    render();
    return;
  }

  // 교사용 스마트보드 +1 / -1 거수 투표 카운터
  if (button.dataset.votePoll && button.dataset.voteChoice && button.dataset.voteDelta) {
    const p = button.dataset.votePoll as Poll;
    const ch = button.dataset.voteChoice as Choice;
    const delta = Number(button.dataset.voteDelta);
    pollData[p] ??= { A: '0', B: '0', C: '0', D: '0' };
    for (const c of CHOICES) {
      if (pollData[p]![c].trim() === '') pollData[p]![c] = '0';
    }
    const currentVal = parseInt(pollData[p]![ch], 10) || 0;
    pollData[p]![ch] = String(Math.max(0, Math.min(MAX_PARTICIPANTS, currentVal + delta)));
    classPollOpen = true;
    render();
    return;
  }

  // 4지선다 보기 1클릭 선택
  if (button.dataset.pickPoll && button.dataset.pickChoice) {
    const poll = button.dataset.pickPoll as Poll;
    const ch = button.dataset.pickChoice as Choice;
    myChoices[poll] = ch;
    error = '';
    render();
    return;
  }

  // 생각 이유 말풍선 선택
  if (button.dataset.reason !== undefined) {
    reasonSelected = button.dataset.reason;
    aiLinkedCardTitle = '';
    render();
    return;
  }

  const action = button.dataset.action;

  if (action === 'toggle-model') {
    visualModel = visualModel === 'circle' ? 'bar' : 'circle';
    render();
  } else if (action === 'toggle-spoiler') {
    spoilerPreview = !spoilerPreview;
    render();
  } else if (action === 'toggle-numberline') {
    visualModel = visualModel === 'numberline' ? 'bar' : 'numberline';
    render();
  } else if (action === 'toggle-cup') {
    visualModel = visualModel === 'cup' ? 'bar' : 'cup';
    render();
  } else if (action === 'toggle-overlap') {
    showOverlap = !showOverlap;
    render();
  } else if (action === 'toggle-trap') {
    showTrapExperiment = !showTrapExperiment;
    render();
  } else if (action === 'toggle-poll-blind') {
    pollBlind = !pollBlind;
    classPollOpen = true;
    render();
  } else if (action === 'less' || action === 'more') {
    exploreDenominator = Math.max(
      DENOMINATOR_MIN,
      Math.min(DENOMINATOR_MAX, exploreDenominator + (action === 'more' ? 1 : -1)),
    );
    exploreMoved = true;
    updateExploreSliderDOM();
  } else if (action === 'toggle-notebook-blank') {
    notebookBlankRevealed = !notebookBlankRevealed;
    render();
  } else if (action === 'fill-zeros') {
    const p = (button.dataset.targetPoll || 'first') as Poll;
    pollData[p] ??= emptyCounts();
    for (const ch of CHOICES) {
      if (pollData[p]![ch].trim() === '') pollData[p]![ch] = '0';
    }
    classPollOpen = true;
    render();
  } else if (action === 'fill-sample') {
    const p = (button.dataset.targetPoll || 'first') as Poll;
    const n = parseParticipants(participantsRaw) ?? 20;
    const correctCh = correctChoiceForPoll(p);
    const wrongCh: Choice = correctCh === 'A' ? 'B' : 'A';
    const major = p === 'first' ? Math.round(n * 0.4) : Math.round(n * 0.8);
    const minor = p === 'first' ? Math.round(n * 0.45) : Math.round(n * 0.1);
    const c = Math.round(n * 0.05);
    const d = Math.max(0, n - major - minor - c);
    const nextCounts: RawCounts = { A: '0', B: '0', C: String(c), D: String(d) };
    nextCounts[correctCh] = String(major);
    nextCounts[wrongCh] = String(minor);
    pollData[p] = nextCounts;
    classPollOpen = true;
    render();
  } else if (action === 'next') {
    const idx = order.indexOf(phase);
    if (idx < order.length - 1) {
      phase = order[idx + 1];
      error = '';
      render(true);
    }
  } else if (action === 'back') {
    const idx = order.indexOf(phase);
    if (idx > 0) {
      phase = order[idx - 1];
      error = '';
      render(true);
    }
  } else if (action === 'next-unit') {
    selectedUnitId = button.dataset.nextUnitId || 'M02';
    resetSession(true, true);
    window.scrollTo?.({ top: 0 });
  } else if (action === 'print-summary') {
    window.print();
  } else if (action === 'restart') {
    resetSession();
    window.scrollTo?.({ top: 0 });
  }
});

// ─── 세션 보호 ───────────────────────────────────────────────────
window.addEventListener('pagehide', () => resetSession());
window.addEventListener('pageshow', event => { if (event.persisted) resetSession(); });

// ─── 초기 렌더 ───────────────────────────────────────────────────
exploreDenominator = currentUnit().denominators.first[1];
render();

if (aiEnabled) {
  void import('./lesson-ai-panel').then(({ createLessonAiPanel }) => {
    aiPanel = createLessonAiPanel(app, (cardId, cardTitle) => {
      const mapped = cardId === 'A' ? '0' : cardId === 'B' ? '1' : '2';
      reasonSelected = mapped;
      aiLinkedCardTitle = cardTitle;
      render();
    });
    aiPanel.sync(phase === 'think');
  });
}
