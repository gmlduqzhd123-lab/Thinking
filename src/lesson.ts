import { CHOICES, emptyCounts, parseParticipants, percentagePointChange, validateCounts, type Choice, type RawCounts } from './lesson-core';
import { MAX_PARTICIPANTS, DENOMINATOR_MIN, DENOMINATOR_MAX } from './constants';
import { registerUnit, getUnit, listUnits } from './unit-registry';
import m01 from './units/m01';
import m02 from './units/m02';
import m03 from './units/m03';
import './lesson.css';
import { createLessonQrSvg, copyLessonUrl } from './lesson-share';
import { miniFracSvg, barFractionSvg, renderFlagNumberLineSvg, type VisualModel } from './lesson-svg';

// ─── 단원 레지스트리 초기 등록 ───────────────────────────────────
if (listUnits().length === 0) {
  registerUnit(m01);
  registerUnit(m02);
  registerUnit(m03);
}

// ─── 타입 (4단계 핵심 흐름: 생각 고르기 → 직접 실험하기 → 다시 점검하기 → 오늘의 발견) ───
type Poll = 'first' | 'again' | 'transfer';
type Phase = 'think' | 'explore' | 'check' | 'result';
type DuelPick = 'left' | 'right';
type RuleChoice = 'bigger' | 'smaller' | 'same' | '';
type LetterChoice = 'correct' | 'wrong' | '';
type ConfidenceLevel = 'low' | 'mid' | 'high' | '';
type DuelRound = { id: number; leftDenom: number; rightDenom: number; answer: DuelPick };

// ─── 상수 ────────────────────────────────────────────────────────
const order: Phase[] = ['think', 'explore', 'check', 'result'];
const phaseLabels: Record<Phase, string> = {
  think: '1. 생각 고르기',
  explore: '2. 직접 실험하기',
  check: '3. 다시 점검하기',
  result: '4. 오늘의 발견',
};

const storyDilemmas: Record<string, { badge: string; lead: string; friend: string }> = {
  M01: {
    badge: '🍫 민수의 고민',
    lead: '<strong>"3보다 5가 더 크니까 1/5 조각이 1/3보다 더 크지 않을까?"</strong>',
    friend: '민수',
  },
  M02: {
    badge: '🍕 서연이의 고민',
    lead: '<strong>"4보다 7이 더 크니까 1/7 조각이 1/4보다 더 크지 않을까?"</strong>',
    friend: '서연이',
  },
  M03: {
    badge: '🎀 준호의 고민',
    lead: '<strong>"2보다 6이 더 크니까 1/6 색테이프가 1/2보다 더 길지 않을까?"</strong>',
    friend: '준호',
  },
};

const teacherTalkPrompts: Record<Phase, string> = {
  think: '🙋 선생님 질문 톡: "짝에게 내가 고른 답과 이유를 30초 동안 설명해 볼까요?"',
  explore: '🙋 선생님 질문 톡: "나누는 수가 커질수록 한 조각이 왜 작아지는지 짝에게 말해 보세요!"',
  check: '🙋 선생님 질문 톡: "처음 생각과 지금 생각이 어떻게 달라졌는지 이야기해 볼까요?"',
  result: '🙋 선생님 질문 톡: "오늘 발견한 단위분수의 규칙을 한 문장으로 함께 읽어 봐요!"',
};

const talkFrames: Record<Phase, string> = {
  think: '저는 1/○이 더 크다고 생각해요. 왜냐하면 ___ 때문이에요.',
  explore: '실험해 보니 나누는 수가 클수록 한 조각이 ___졌어요.',
  check: '분모가 작을수록 한 조각의 크기가 더 ___요.',
  result: '같은 전체를 더 많이 나눌수록 한 조각은 ___집니다.',
};

const RANDOM_PAIR_POOL: readonly [number, number][] = [
  [2, 5],
  [3, 7],
  [4, 9],
  [2, 8],
  [3, 10],
  [5, 12],
];

const DEFAULT_DUEL_ROUNDS: DuelRound[] = [
  { id: 0, leftDenom: 7, rightDenom: 2, answer: 'right' },
  { id: 1, leftDenom: 3, rightDenom: 9, answer: 'left' },
  { id: 2, leftDenom: 11, rightDenom: 4, answer: 'right' },
];
const EXTRA_BATTLE_ROUND: DuelRound = { id: 3, leftDenom: 5, rightDenom: 10, answer: 'left' };

const QUICK_DENOMS = [2, 3, 5, 8, 12] as const;
const TRAIN_POOLS: readonly (readonly [number, number, number])[] = [
  [6, 2, 9],
  [8, 3, 11],
  [5, 2, 10],
];
const MYSTERY_SETS: readonly { low: number; high: number; candidates: readonly number[] }[] = [
  { low: 3, high: 7, candidates: [2, 4, 5, 6, 8] },
  { low: 2, high: 6, candidates: [2, 3, 4, 5, 7] },
  { low: 4, high: 9, candidates: [3, 5, 6, 8, 10] },
];
const TALK_DURATIONS = [30, 15, 60] as const;
const FLAG_DENOMS = [2, 3, 4, 6, 12] as const;

const reasonCards = [
  '분모가 클수록 조각이 크다고 생각함',
  '더 많이 나눌수록 조각이 작아진다고 생각함',
  '전체가 같은지 확인이 필요함',
] as const;

const reasonStudentBubbles = [
  '💬 "분모 숫자가 클수록 조각도 커요"',
  '💬 "많이 나눌수록 한 조각은 작아져요"',
  '💬 "원래 전체 크기가 같은지 봐야 해요"',
] as const;

// ─── DOM ─────────────────────────────────────────────────────────
const app = document.querySelector<HTMLElement>('#lesson-app')!;
const aiEnabled = app.dataset.aiEnabled === 'true';

// ─── 상태 ────────────────────────────────────────────────────────
let aiPanel: { sync(active: boolean, denomA?: number, denomB?: number, itemName?: string): void; dispose(): void } | undefined;
let sharedAudioCtx: AudioContext | undefined;
let selectedUnitId = 'M01';
let customPair: [number, number] | null = null;
let randomPairIdx = 0;
let visualModel: VisualModel = 'bar';
let phase: Phase = 'think';
let soundEnabled = true;
let ttsSpoken = false;
let spoilerPreview = false;
let patternMode = false;
let myChoices: Record<Poll, Choice | null> = { first: null, again: null, transfer: null };
let confidence: Record<'first' | 'again', ConfidenceLevel> = { first: '', again: '' };
let reasonSelected = '';
let aiLinkedCardTitle = '';
let showOverlap = false;
let showTrapExperiment = false;
let showRealLife = false;
let exploreTab: 'all' | 'core' | 'concept' | 'life' = 'all';
let fairCutAligned = false;
let pinnedFlags: number[] = [2, 4];
let exploreBaseDenominator = 3;
let exploreDenominator = 5;
let exploreMoved = false;
let filledPieces = 1;
let duelRounds: DuelRound[] = DEFAULT_DUEL_ROUNDS.map(r => ({ ...r }));
let duelPicks: Record<number, DuelPick | null> = { 0: null, 1: null, 2: null, 3: null };
let duelStreak = 0;
let duelShuffleCount = 0;
let duelBattleMode = false;
let battleScores: [number, number] = [0, 0];
let puzzleSetIdx = 0;
let trainOrder: number[] = [];
let mysteryDenomPick: number | null = null;
let ruleChoice: RuleChoice = '';
let notebookBlankRevealed = false;
let friendLetterChoice: LetterChoice = '';
let bridgeChoice: DuelPick | '' = '';
let clearedUnits = new Set<string>();
let classPollOpen: Record<Poll, boolean> = { first: false, again: false, transfer: false };
let pollBlind = false;
let participantsRaw = '20';
let pollData: Record<Poll, RawCounts | null> = { first: null, again: null, transfer: null };
let talkDurationIdx = 0;
let talkSecondsLeft = 0;
let talkFinished = false;
let talkInterval: ReturnType<typeof setInterval> | undefined;
let pickedGroup: number | null = null;
let qrModalOpen = false;
let copyStatus: 'idle' | 'copying' | 'copied' | 'failed' = 'idle';
let copyRequest = 0;
let error = '';

// ─── 헬퍼 ────────────────────────────────────────────────────────
function currentUnit() {
  return getUnit(selectedUnitId);
}

function activeDenominators(): { readonly first: readonly [number, number]; readonly transfer: readonly [number, number] } {
  if (customPair) {
    const [a, b] = customPair;
    return { first: [a, b], transfer: [Math.min(11, a + 1), Math.min(12, b + 2)] };
  }
  return currentUnit().denominators;
}

function isDarkTheme(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function isLargeScale(): boolean {
  return document.documentElement.getAttribute('data-scale') === 'large';
}

function stopSpeech() {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // 음성 합성 미지원 환경 무시
  }
}

function playSound(kind: 'click' | 'correct' | 'fanfare') {
  if (!soundEnabled) return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new Ctx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      void sharedAudioCtx.resume().catch(() => {});
    }
    const osc = sharedAudioCtx.createOscillator();
    const gain = sharedAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(sharedAudioCtx.destination);
    const now = sharedAudioCtx.currentTime;
    osc.frequency.setValueAtTime(kind === 'fanfare' ? 659.25 : kind === 'correct' ? 523.25 : 440, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
    osc.start(now);
    osc.stop(now + 0.11);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  } catch {
    // 오디오 컨텍스트 미지원 환경 무시
  }
}

function currentTrainPool(): readonly [number, number, number] {
  return TRAIN_POOLS[puzzleSetIdx % TRAIN_POOLS.length];
}

function currentMysterySet() {
  return MYSTERY_SETS[puzzleSetIdx % MYSTERY_SETS.length];
}

function talkDuration(): number {
  return TALK_DURATIONS[talkDurationIdx % TALK_DURATIONS.length];
}

function storyLeadForCurrent(firstA: number, firstB: number): string {
  if (!customPair) {
    return storyDilemmas[selectedUnitId]?.lead ?? storyDilemmas.M01.lead;
  }
  return `<strong>"${firstA}보다 ${firstB}이(가) 더 크니까 1/${firstB} 조각이 1/${firstA}보다 더 크지 않을까?"</strong>`;
}

function stopTalkCountdown() {
  if (talkInterval) {
    clearInterval(talkInterval);
    talkInterval = undefined;
  }
  talkSecondsLeft = 0;
  talkFinished = false;
}

function resetSession(keepUnit = false, keepStamps = false, keepCustomPair = false) {
  aiPanel?.dispose();
  stopSpeech();
  stopTalkCountdown();
  if (!keepUnit) selectedUnitId = 'M01';
  if (!keepCustomPair) customPair = null;
  if (!keepStamps) clearedUnits.clear();
  visualModel = 'bar';
  phase = 'think';
  ttsSpoken = false;
  spoilerPreview = false;
  patternMode = false;
  myChoices = { first: null, again: null, transfer: null };
  confidence = { first: '', again: '' };
  reasonSelected = '';
  aiLinkedCardTitle = '';
  showOverlap = false;
  showTrapExperiment = false;
  showRealLife = false;
  exploreTab = 'all';
  fairCutAligned = false;
  pinnedFlags = [2, 4];
  const [fA, fB] = activeDenominators().first;
  exploreBaseDenominator = fA;
  exploreDenominator = fB;
  exploreMoved = false;
  filledPieces = 1;
  duelRounds = DEFAULT_DUEL_ROUNDS.map(r => ({ ...r }));
  duelPicks = { 0: null, 1: null, 2: null, 3: null };
  duelStreak = 0;
  duelShuffleCount = 0;
  duelBattleMode = false;
  battleScores = [0, 0];
  puzzleSetIdx = 0;
  trainOrder = [];
  mysteryDenomPick = null;
  ruleChoice = '';
  notebookBlankRevealed = false;
  friendLetterChoice = '';
  bridgeChoice = '';
  pickedGroup = null;
  qrModalOpen = false;
  copyStatus = 'idle';
  copyRequest++;
  classPollOpen = { first: false, again: false, transfer: false };
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

function bar(denominator: number, undividedPreview = false): string {
  return barFractionSvg(denominator, undividedPreview, {
    unitId: selectedUnitId,
    snackName: snackName(),
    colors: snackColors(),
    patternMode,
    visualModel,
  });
}

function renderSimpleVisualPair(dA: number, dB: number, allowExtraModels = false, undividedPreview = false): string {
  const extraBtns = allowExtraModels
    ? `<button type="button" data-action="toggle-numberline" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'numberline'}">📐 수직선</button>
       <button type="button" data-action="toggle-cup" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'cup'}">🥤 주스 컵</button>`
    : '';
  return `<div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'circle'}">${visualModel === 'circle' ? '📏 막대 모양' : '🍕 원형 모양'}</button>
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
  const icons = [miniFracSvg(leftD), miniFracSvg(rightD), '', ''];
  const labels = [
    `A. 1/${leftD}이 더 크다`,
    `B. 1/${rightD}이 더 크다`,
    'C. 크기가 같다',
    'D. 잘 모르겠다',
  ];
  return `<div class="solo-choice-grid" role="group" aria-label="생각 선택 보기">
    ${CHOICES.map((ch, i) =>
      `<button type="button" data-pick-poll="${poll}" data-pick-choice="${ch}" class="solo-choice-btn ${selected === ch ? 'solo-choice-selected' : ''}" aria-pressed="${selected === ch}">${icons[i]}${labels[i]}</button>`
    ).join('')}
  </div>`;
}

function renderInstantFeedback(poll: Poll, dA: number, dB: number): string {
  const selected = myChoices[poll];
  if (!selected) return '';
  if (poll === 'first') {
    return `<p id="poll-note" class="solo-feedback-box" role="status">✅ 내 처음 생각: <strong>"${choiceLabel(selected, dA, dB, poll)}"</strong> · 2단계에서 직접 확인해 볼까요?</p>`;
  }
  const correctCh = correctChoiceForPoll(poll);
  if (selected === correctCh) {
    return `<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 덜 나눈 <strong>1/${dA}</strong>이 <strong>1/${dB}</strong>보다 더 큽니다.</p>`;
  }
  if (selected === 'C') {
    return `<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> ${dA}등분과 ${dB}등분은 조각 크기가 달라요. 덜 나눈 <strong>1/${dA}</strong>이 더 큽니다.</p>`;
  }
  if (selected === 'D') {
    return `<p class="answer feedback-hint" role="status">🌱 <strong>괜찮아요!</strong> 덜 나눌수록 한 조각이 커져서 <strong>1/${dA}</strong>이 더 큽니다.</p>`;
  }
  return `<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 더 많이 나눌수록 한 조각은 작아져요! <strong>1/${dA}</strong>(${correctCh}번)이 더 큽니다.</p>`;
}

function formatClassPollStatus(poll: Poll): string {
  if (pollBlind) {
    return '🙈 현재 학생들의 거수 투표 결과를 가려 두었습니다. [👀 결과 공개하기]를 누르면 나타납니다.';
  }
  const counts = pollData[poll] ?? emptyCounts();
  const n = parseParticipants(participantsRaw);
  if (!n) {
    return `⚠️ 참여 인원은 1~${MAX_PARTICIPANTS} 사이의 자연수로 입력해 주세요.`;
  }
  const checked = validateCounts(counts, n);
  const correctCh = correctChoiceForPoll(poll);
  if (checked) {
    return `집계 완료: 정답(${correctCh}) ${checked.counts[correctCh]}/${n}명 · 미응답 ${checked.noResponse}명`;
  }
  const allDigits = CHOICES.every(c => /^(?:0|[1-9]\d*)$/.test(counts[c]));
  if (allDigits) {
    const sum = CHOICES.reduce((acc, c) => acc + Number(counts[c]), 0);
    if (sum > n) {
      return `⚠️ 보기 인원 합계(${sum}명)가 참여 인원(${n}명)보다 많습니다. 인원수를 확인해 주세요.`;
    }
  }
  return '학급 인원 집계를 기록하려면 숫자를 입력하거나 ＋1 버튼을 누르세요.';
}

function renderLivePollChart(poll: Poll, dA: number, dB: number): string {
  if (pollBlind) {
    return `<div class="live-poll-chart" data-chart-poll="${poll}"><p class="chart-blind-msg">🙈 결과 공개 시 보기별 막대그래프가 표시됩니다.</p></div>`;
  }
  const counts = pollData[poll] ?? emptyCounts();
  const [leftD, rightD] = isTransferReversed(poll) ? [dB, dA] : [dA, dB];
  const labels: Record<Choice, string> = {
    A: `A (1/${leftD})`,
    B: `B (1/${rightD})`,
    C: 'C (같다)',
    D: 'D (모름)',
  };
  const vals = CHOICES.map(ch => Math.max(0, parseInt(counts[ch], 10) || 0));
  const sum = vals.reduce((a, b) => a + b, 0);
  const denom = Math.max(1, parseParticipants(participantsRaw) ?? 20, sum);
  const correctCh = correctChoiceForPoll(poll);

  return `<div class="live-poll-chart" data-chart-poll="${poll}" role="region" aria-label="학급 투표 실시간 막대그래프">
    ${CHOICES.map((ch, idx) => {
      const v = vals[idx];
      const pct = Math.min(100, Math.round((v / denom) * 100));
      return `<div class="poll-bar-row">
        <span class="poll-bar-label">${labels[ch]}</span>
        <div class="poll-bar-track"><svg class="poll-bar-svg" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><rect class="poll-bar-fill ${ch === correctCh ? 'poll-bar-correct' : ''}" x="0" y="0" width="${pct}" height="14" rx="7"/></svg></div>
        <span class="poll-bar-val">${v}명 (${pct}%)</span>
      </div>`;
    }).join('')}
  </div>`;
}

function renderConfidencePicker(poll: 'first' | 'again'): string {
  const current = confidence[poll];
  const levels: { key: ConfidenceLevel; label: string }[] = [
    { key: 'low', label: '🌱 헷갈려요' },
    { key: 'mid', label: '🙂 비슷해요' },
    { key: 'high', label: '🔥 확신해요!' },
  ];
  return `<div class="confidence-picker" role="group" aria-label="내 생각 확신 온도계">
    <span class="confidence-label">🌡️ 확신 온도:</span>
    <div class="confidence-btns">
      ${levels.map(l => `<button type="button" data-conf-poll="${poll}" data-conf-level="${l.key}" class="secondary-btn conf-btn ${current === l.key ? 'solo-choice-selected' : ''}" aria-pressed="${current === l.key}">${l.label}</button>`).join('')}
    </div>
  </div>`;
}

function currentShareUrl(): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  const params = new URLSearchParams();
  const topicNum = selectedUnitId === 'M02' ? '2' : selectedUnitId === 'M03' ? '3' : '1';
  params.set('topic', topicNum);
  if (customPair) params.set('pair', `${customPair[0]}-${customPair[1]}`);
  if (isLargeScale()) params.set('scale', 'large');
  return `${base}?${params.toString()}`;
}

function renderQrModalBox(): string {
  if (!qrModalOpen) return '';
  const url = currentShareUrl();
  let qrSvg: string;
  try {
    qrSvg = createLessonQrSvg(url);
  } catch {
    qrSvg = '<p role="status">QR을 만들지 못했습니다. 아래 수업 주소를 직접 복사해 주세요.</p>';
  }
  const copyLabel = copyStatus === 'copying' ? '복사 중…' : copyStatus === 'copied' ? '✅ 주소 복사 완료!' : '📋 수업 주소 복사';
  return `<div id="qr-modal-box" class="qr-modal-box" role="region" aria-label="학생 접속 QR 및 공유 링크">
    ${qrSvg}
    <div class="qr-modal-info">
      <strong>📱 현재 수업 단원 바로가기 링크</strong>
      <code id="qr-share-url">${url}</code>
      <div class="qr-modal-actions">
        <button type="button" id="copy-share-btn" data-action="copy-share-url" ${copyStatus === 'copying' ? 'disabled' : ''} class="secondary-btn talk-dock-btn">${copyLabel}</button>
      </div>
      <p role="status" aria-live="polite">${copyStatus === 'failed' ? '주소를 복사하지 못했습니다. 위 수업 주소를 직접 선택해 복사해 주세요.' : copyStatus === 'copied' ? '수업 주소가 클립보드에 복사되었습니다.' : ''}</p>
    </div>
  </div>`;
}

function renderTeacherTalkBar(p: Phase): string {
  const dur = talkDuration();
  const bellLabel = talkSecondsLeft > 0 ? `🔔 짝 토론 (${talkSecondsLeft}초)` : talkFinished ? '🔔 토론 종료!' : `🔔 ${dur}초 짝 토론`;
  const groupBadge = pickedGroup !== null
    ? `<span id="picked-group-badge" class="picked-group-badge" role="status">🎤 발표: <strong>${pickedGroup}모둠</strong>! · 💬 말틀: <em>"${talkFrames[p]}"</em></span>`
    : '';
  return `<div class="teacher-talk-banner">
    <p class="teacher-talk-text">${teacherTalkPrompts[p]}</p>
    <div class="talk-dock" role="group" aria-label="짝 토론 및 발표 모둠 도구">
      <button type="button" id="talk-bell-btn" data-action="talk-bell" class="secondary-btn talk-dock-btn ${talkFinished ? 'talk-bell-done' : ''}" aria-pressed="${talkSecondsLeft > 0}">${bellLabel}</button>
      <button type="button" id="talk-duration-btn" data-action="cycle-talk-duration" class="secondary-btn talk-dock-btn" aria-label="토론 시간 바꾸기">⏱️ ${dur}초</button>
      <button type="button" data-action="pick-group" class="secondary-btn talk-dock-btn">🎲 모둠 뽑기</button>
      <button type="button" id="qr-share-btn" data-action="toggle-qr-modal" class="secondary-btn talk-dock-btn" aria-pressed="${qrModalOpen}">📱 수업 QR</button>
      ${groupBadge}
    </div>
    ${renderQrModalBox()}
  </div>`;
}

function hasPollInput(counts: RawCounts | null): boolean {
  if (!counts) return false;
  return CHOICES.some(ch => counts[ch].trim() !== '');
}

function renderBeforeAfterPollComparison(): string {
  if (pollBlind || !hasPollInput(pollData.again)) return '';
  const [fA] = activeDenominators().first;
  const firstA = Math.max(0, parseInt(pollData.first?.A ?? '0', 10) || 0);
  const againA = Math.max(0, parseInt(pollData.again?.A ?? '0', 10) || 0);
  const n = Math.max(1, parseParticipants(participantsRaw) ?? 20, firstA, againA);
  const firstPct = Math.min(100, Math.round((firstA / n) * 100));
  const againPct = Math.min(100, Math.round((againA / n) * 100));
  const delta = againA - firstA;
  const deltaSign = delta > 0 ? `+${delta}명` : `${delta}명`;

  return `<div id="poll-before-after-chart" class="poll-before-after-chart" role="region" aria-label="실험 전후 학급 정답 인원 비교 차트">
    <strong>📈 실험 전(1단계) vs 실험 후(3단계) 정답(1/${fA}) 인원 변화 (${deltaSign})</strong>
    <div class="poll-bar-row">
      <span class="poll-bar-label">1단계 처음</span>
      <div class="poll-bar-track"><svg class="poll-bar-svg" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><rect class="poll-bar-fill" x="0" y="0" width="${firstPct}" height="14" rx="7"/></svg></div>
      <span class="poll-bar-val">${firstA}명 (${firstPct}%)</span>
    </div>
    <div class="poll-bar-row">
      <span class="poll-bar-label">3단계 실험 후</span>
      <div class="poll-bar-track"><svg class="poll-bar-svg" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true"><rect class="poll-bar-fill poll-bar-correct" x="0" y="0" width="${againPct}" height="14" rx="7"/></svg></div>
      <span class="poll-bar-val">${againA}명 (${againPct}%)</span>
    </div>
  </div>`;
}

/** #7 교사용 선택형 학급 인원 집계 (+1/-1 스마트보드 터치 카운터 & 결과 가리기 & 실시간 막대그래프 포함). */
function renderOptionalClassPoll(poll: Poll, dA: number, dB: number): string {
  const counts = pollData[poll] ?? emptyCounts();
  const [leftD, rightD] = isTransferReversed(poll) ? [dB, dA] : [dA, dB];
  const labels = [`A (1/${leftD})`, `B (1/${rightD})`, 'C (같다)', 'D (모름)'];
  const participantsId = poll === 'transfer' ? 'participants-transfer' : 'participants';

  return `<details class="class-poll-details" data-poll-details="${poll}" ${classPollOpen[poll] ? 'open' : ''}>
    <summary>👩‍🏫 교실 거수 투표·인원 기록 (선택)</summary>
    <div class="class-poll-body">
      <div class="poll-top-row">
        <label>참여 인원(1~${MAX_PARTICIPANTS}명) <input id="${participantsId}" data-participants-input="${poll}" type="text" inputmode="numeric" value="${participantsRaw}" autocomplete="off"></label>
        <button type="button" data-action="toggle-poll-blind" data-target-poll="${poll}" class="secondary-btn" aria-pressed="${pollBlind}">${pollBlind ? '👀 결과 공개하기' : '🙈 결과 잠시 가리기'}</button>
      </div>
      <div class="class-poll-inputs">${CHOICES.map((ch, i) => `<div class="poll-counter-card"><label>${labels[i]} <input data-count="${ch}" data-count-poll="${poll}" type="text" inputmode="numeric" value="${pollBlind ? '•' : counts[ch]}" aria-label="${ch} 선택 인원" autocomplete="off" ${pollBlind ? 'readonly' : ''}></label><div class="poll-touch-btns"><button type="button" data-vote-poll="${poll}" data-vote-choice="${ch}" data-vote-delta="-1" class="secondary-btn vote-step-btn" aria-label="${ch} 인원 1명 줄이기">−1</button><button type="button" data-vote-poll="${poll}" data-vote-choice="${ch}" data-vote-delta="1" class="secondary-btn vote-step-btn" aria-label="${ch} 인원 1명 추가">＋1</button></div></div>`).join('')}</div>
      <div class="poll-helpers">
        <button type="button" data-action="fill-zeros" data-target-poll="${poll}" class="secondary-btn">빈 칸 0으로 채우기</button>
        <button type="button" data-action="fill-sample" data-target-poll="${poll}" class="secondary-btn">예시 인원 채우기</button>
      </div>
      ${renderLivePollChart(poll, dA, dB)}
      ${poll === 'again' ? renderBeforeAfterPollComparison() : ''}
      <p class="class-poll-status" data-status-poll="${poll}" role="status">${formatClassPollStatus(poll)}</p>
    </div>
  </details>`;
}

// ─── 4단계 화면별 본문 ───────────────────────────────────────────

/** 1단계: 캡슐형 주제 탭 + 깜짝 분수 뽑기 + 한 줄 질문 배너 + 시각 모형 + 1클릭 선택 & 점진적 후속 질문 + 하단 교사 독. */
function renderThinkPhase(): string {
  const [firstA, firstB] = activeDenominators().first;
  const story = storyDilemmas[selectedUnitId] ?? storyDilemmas.M01;

  const unitCards = listUnits().map(u => {
    const active = !customPair && u.id === selectedUnitId;
    const isCleared = clearedUnits.has(u.id);
    const shortTitle = u.title.replace(' · ', ' (') + ')';
    return `<button type="button" data-unit-id="${u.id}" class="unit-card-btn ${active ? 'unit-card-active' : ''}" aria-pressed="${active}"><strong>${shortTitle}</strong><span class="unit-stamp-tag">${isCleared ? '⭐ 완료' : active ? '🔍 탐구 중' : '시작'}</span></button>`;
  }).join('');

  return `<div class="unit-card-bar" role="group" aria-label="탐구할 분수 이야기 고르기">${unitCards}<button type="button" id="random-unit-btn" data-action="random-unit" class="secondary-btn random-unit-pill ${customPair ? 'unit-card-active' : ''}" aria-pressed="${customPair !== null}">🎲 깜짝 분수${customPair ? ` (1/${firstA} vs 1/${firstB})` : ''}</button></div>
    <div class="step-card">
      <h2 tabindex="-1">① 처음 생각 고르기 · 1/${firstA}과 1/${firstB} 비교</h2>
      <div class="story-dilemma-card" role="region" aria-label="${story.badge}">
        <span class="story-badge">${story.badge}</span>
        <p class="question-lead">${storyLeadForCurrent(firstA, firstB)}</p>
        <button type="button" data-action="speak-story" class="secondary-btn tts-btn">🔊 읽어주기</button>
        ${ttsSpoken ? '<p id="tts-status" class="tts-status" role="status">🔊 음성으로 읽어주었어요!</p>' : ''}
      </div>
      <div class="visual-controls-bar">
        <div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기"><button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'circle'}">${visualModel === 'circle' ? '📏 막대 모양' : '🍕 원형 모양'}</button></div>
        <div class="spoiler-hint-row">
          <button type="button" data-action="toggle-spoiler" class="secondary-btn" aria-pressed="${spoilerPreview}">${spoilerPreview ? '🙈 눈금 가리기' : '👀 눈금 힌트'}</button>
          <button type="button" data-action="toggle-pattern" class="secondary-btn" aria-pressed="${patternMode}">${patternMode ? '🎨 기본 색상' : '🎨 빗금 패턴'}</button>
        </div>
      </div>
      <div class="bar-pair">${bar(firstA, !spoilerPreview)}${bar(firstB, !spoilerPreview)}</div>
      ${renderChoiceButtons('first', firstA, firstB)}
      ${renderInstantFeedback('first', firstA, firstB)}
      <div class="followup-zone ${myChoices.first ? 'followup-ready' : ''}">
        ${renderConfidencePicker('first')}
        <div class="reason-section">
          <h3>💭 왜 그렇게 생각했나요?</h3>
          <div class="actions reason-bubble-list">${reasonCards.map((label, i) => `<button type="button" data-reason="${i}" class="reason-bubble-btn" aria-label="${label}" aria-pressed="${reasonSelected === String(i)}"><span class="student-bubble">${reasonStudentBubbles[i]}</span></button>`).join('')}</div>
          ${aiLinkedCardTitle ? `<p class="ai-linked-badge">🤖 AI 추천 연결: <strong>${aiLinkedCardTitle}</strong></p>` : ''}
        </div>
      </div>
      <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">${renderTeacherTalkBar('think')}${renderOptionalClassPoll('first', firstA, firstB)}</div>
      <div class="actions next-step-bar"><button type="button" data-action="next" class="primary-next-btn ${myChoices.first ? 'next-btn-ready' : ''}">② 직접 실험하러 가기 →</button></div>
    </div>`;
}

function renderExploreDynamicComparison(baseD: number): { barsHtml: string; badgeHtml: string; discoveryHtml: string } {
  const cmpSymbol = baseD < exploreDenominator ? '>' : baseD > exploreDenominator ? '<' : '=';
  const cmpDesc = baseD < exploreDenominator
    ? `${baseD}등분 한 조각이 ${exploreDenominator}등분 한 조각보다 더 큽니다`
    : baseD > exploreDenominator
      ? `${exploreDenominator}등분 한 조각이 ${baseD}등분 한 조각보다 더 큽니다`
      : '두 조각의 크기가 같습니다';

  return {
    barsHtml: `${bar(baseD)}${bar(exploreDenominator)}`,
    badgeHtml: `크기 비교: <strong>1/${baseD} ${cmpSymbol} 1/${exploreDenominator}</strong> (${cmpDesc})`,
    discoveryHtml: exploreMoved
      ? `<p class="answer">💡 <strong>발견 2</strong>: 같은 크기의 전체를 더 많은 조각으로 나눌수록(분모가 커질수록) 한 조각의 크기는 점점 작아집니다!</p>`
      : '',
  };
}

function renderFillWholeContent(): string {
  const clampedFilled = Math.max(1, Math.min(exploreDenominator, filledPieces));
  const { fill, bg, stroke } = snackColors();
  const segW = 600 / exploreDenominator;
  const filledW = segW * clampedFilled;
  const dividers = Array.from({ length: exploreDenominator - 1 }, (_, i) => {
    const x = ((i + 1) * segW).toFixed(2);
    return `<line x1="${x}" y1="10" x2="${x}" y2="54" stroke="${stroke}" stroke-width="2"/>`;
  }).join('');
  const hitSlices = Array.from({ length: exploreDenominator }, (_, i) => {
    const x = (i * segW).toFixed(2);
    return `<rect class="svg-hit-slice" tabindex="0" role="button" aria-label="1/${exploreDenominator} 조각 ${i + 1}개 채우기" data-fill-slice="${i + 1}" x="${x}" y="10" width="${segW.toFixed(2)}" height="44" fill="transparent"/>`;
  }).join('');
  const isComplete = clampedFilled === exploreDenominator;
  const fillPattern = patternMode
    ? `<line x1="4" y1="22" x2="${Math.max(6, filledW - 4).toFixed(2)}" y2="22" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="6 4"/><line x1="4" y1="42" x2="${Math.max(6, filledW - 4).toFixed(2)}" y2="42" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2" stroke-dasharray="2 5"/>`
    : '';

  return `<figure class="whole-fill-figure ${patternMode ? 'pattern-active' : ''}">
      <svg class="touchable-svg" viewBox="0 0 600 66" role="img" aria-label="1/${exploreDenominator} 조각을 ${clampedFilled}개 모아 ${clampedFilled}/${exploreDenominator}만큼 채운 막대">
        <rect x="0" y="10" width="600" height="44" rx="6" fill="${bg}" stroke="${stroke}" stroke-width="3"/>
        <rect x="0" y="10" width="${filledW.toFixed(2)}" height="44" rx="4" fill="${fill}"/>
        ${fillPattern}
        ${dividers}
        ${hitSlices}
      </svg>
      <figcaption>1/${exploreDenominator} 조각 <strong>${clampedFilled}개</strong> = <strong>${clampedFilled}/${exploreDenominator}</strong> ${isComplete ? '(= 전체 1 완성!)' : ''}</figcaption>
    </figure>
    <div class="fill-whole-controls" role="group" aria-label="단위분수 조각 모아 전체 1 채우기 조작">
      <button type="button" data-action="fill-piece-add" class="secondary-btn" ${isComplete ? 'disabled' : ''}>➕ 1/${exploreDenominator} 추가</button>
      <button type="button" data-action="fill-piece-full" class="secondary-btn" ${isComplete ? 'disabled' : ''}>⚡ 끝까지 채우기</button>
      <button type="button" data-action="fill-piece-reset" class="secondary-btn" ${clampedFilled <= 1 ? 'disabled' : ''}>🔄 비우기</button>
    </div>
    <p id="fill-whole-status" class="answer" role="status">${
      isComplete
        ? `🎉 <strong>전체 1 완성!</strong> <strong>1/${exploreDenominator}</strong> 조각 <strong>${exploreDenominator}개</strong>로 전체 1을 채웠어요!`
        : `🧩 현재 <strong>${clampedFilled}/${exploreDenominator}</strong> · 전체 1까지 <strong>${exploreDenominator - clampedFilled}개</strong> 남았어요!`
    }</p>`;
}

function syncExploreCompletionDOM() {
  const coreDone = showOverlap || exploreMoved;
  const conceptDone = filledPieces === exploreDenominator || fairCutAligned;
  const lifeDone = pinnedFlags.length >= 4 || showTrapExperiment || showRealLife;
  const anyExpDone = coreDone || conceptDone || lifeDone;

  const coreBtn = app.querySelector<HTMLButtonElement>('button[data-explore-tab="core"]');
  if (coreBtn) coreBtn.textContent = `✂️ 핵심 비교 (실험 1·2)${coreDone ? ' ✅' : ''}`;
  const conceptBtn = app.querySelector<HTMLButtonElement>('button[data-explore-tab="concept"]');
  if (conceptBtn) conceptBtn.textContent = `🧩 원리 실험 (실험 3·4)${conceptDone ? ' ✅' : ''}`;
  const lifeBtn = app.querySelector<HTMLButtonElement>('button[data-explore-tab="life"]');
  if (lifeBtn) lifeBtn.textContent = `🚩 수직선·실생활 (실험 5·6·7)${lifeDone ? ' ✅' : ''}`;
  const nextBtn = app.querySelector<HTMLButtonElement>('.primary-next-btn[data-action="next"]');
  if (nextBtn) nextBtn.classList.toggle('next-btn-ready', anyExpDone);
}

function updateExploreSliderDOM() {
  filledPieces = Math.max(1, Math.min(exploreDenominator, filledPieces));
  const { barsHtml, badgeHtml, discoveryHtml } = renderExploreDynamicComparison(exploreBaseDenominator);

  const barsEl = app.querySelector<HTMLElement>('#explore-exp2-bars');
  if (barsEl) barsEl.innerHTML = barsHtml;

  const baseOutputEl = app.querySelector<HTMLElement>('#explore-base-output');
  if (baseOutputEl) baseOutputEl.textContent = `기준 분수: 1/${exploreBaseDenominator} (${exploreBaseDenominator}등분)`;

  const baseLessBtn = app.querySelector<HTMLButtonElement>('button[data-action="base-less"]');
  if (baseLessBtn) baseLessBtn.disabled = exploreBaseDenominator <= DENOMINATOR_MIN;

  const baseMoreBtn = app.querySelector<HTMLButtonElement>('button[data-action="base-more"]');
  if (baseMoreBtn) baseMoreBtn.disabled = exploreBaseDenominator >= DENOMINATOR_MAX;

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

  const fillWholeEl = app.querySelector<HTMLElement>('#fill-whole-box');
  if (fillWholeEl) fillWholeEl.innerHTML = renderFillWholeContent();

  syncExploreCompletionDOM();
}

function renderAdaptiveMissionGuide(_firstA: number, firstB: number): string {
  if (myChoices.first === 'B' || reasonSelected === '0') {
    return `🎯 <strong>맞춤 실험 미션</strong>: 분모(${firstB})가 클수록 조각도 클까요? <strong>[실험 1 · 조각 포개기]</strong>와 <strong>[실험 3 · 전체 1 채우기]</strong>를 해 보세요!`;
  }
  if (myChoices.first === 'C' || reasonSelected === '2') {
    return `🎯 <strong>맞춤 실험 미션</strong>: <strong>[실험 4 · 등분할 조건]</strong>과 <strong>[실험 6 · 전체 크기가 다를 때]</strong>를 먼저 확인해 보세요!`;
  }
  if (myChoices.first === 'A' || reasonSelected === '1') {
    return `🎯 <strong>맞춤 실험 미션</strong>: <strong>[실험 2 · 분모 자유 비교]</strong>와 <strong>[실험 5 · 수직선 깃발]</strong>에 도전해 보세요!`;
  }
  return `🎯 <strong>맞춤 실험 미션</strong>: 아래 <strong>[실험 1 · 조각 포개기]</strong>부터 차례대로 눌러 조각 크기를 비교해 보세요!`;
}

function renderFlagNumberLine(): string {
  return renderFlagNumberLineSvg(pinnedFlags, FLAG_DENOMS);
}

/** 2단계: 탭형 카테고리 필터 + 2열 컴팩트 그리드 실험 + 하단 교사 독. */
function renderExplorePhase(): string {
  const [firstA, firstB] = activeDenominators().first;
  const myFirstText = choiceLabel(myChoices.first, firstA, firstB, 'first');
  const myReasonText = reasonSelected !== '' ? reasonStudentBubbles[Number(reasonSelected)] : '직접 실험으로 확인하기';

  const wA = 600 / firstA;
  const wB = 600 / firstB;
  const diffW = Math.max(0, wA - wB);
  const { barsHtml, badgeHtml, discoveryHtml } = renderExploreDynamicComparison(exploreBaseDenominator);

  const quickDenomBtns = QUICK_DENOMS.map(d => {
    const active = exploreDenominator === d;
    return `<button type="button" data-quick-denom="${d}" class="secondary-btn quick-denom-btn ${active ? 'quick-denom-active' : ''}" aria-pressed="${active}">👧 ${d}명 (1/${d})</button>`;
  }).join('');

  const flagBtns = FLAG_DENOMS.map(d => {
    const active = pinnedFlags.includes(d);
    return `<button type="button" data-flag-denom="${d}" class="secondary-btn ${active ? 'quick-denom-active' : ''}" aria-pressed="${active}">🚩 1/${d}</button>`;
  }).join('');

  const showCore = exploreTab === 'all' || exploreTab === 'core';
  const showConcept = exploreTab === 'all' || exploreTab === 'concept';
  const showLife = exploreTab === 'all' || exploreTab === 'life';

  const coreDone = showOverlap || exploreMoved;
  const conceptDone = filledPieces === exploreDenominator || fairCutAligned;
  const lifeDone = pinnedFlags.length >= 4 || showTrapExperiment || showRealLife;
  const anyExpDone = coreDone || conceptDone || lifeDone;

  return `<div class="step-card">
    <h2 tabindex="-1">② 직접 실험하기 · 눈으로 확인하는 분수 실험</h2>
    <div class="hypothesis-banner" role="region" aria-label="나의 처음 생각">
      <p>💭 <strong>처음 생각</strong>: <strong>${myFirstText}</strong> <span class="hypothesis-sub">(${myReasonText})</span></p>
      <p id="adaptive-mission-card" class="adaptive-mission-card">${renderAdaptiveMissionGuide(firstA, firstB)}</p>
    </div>
    <div class="exp-tab-bar" role="group" aria-label="실험 묶음 선택">
      <button type="button" data-explore-tab="all" class="secondary-btn exp-tab-btn ${exploreTab === 'all' ? 'quick-denom-active' : ''}" aria-pressed="${exploreTab === 'all'}">🌟 전체 보기</button>
      <button type="button" data-explore-tab="core" class="secondary-btn exp-tab-btn ${exploreTab === 'core' ? 'quick-denom-active' : ''}" aria-pressed="${exploreTab === 'core'}">✂️ 핵심 비교 (실험 1·2)${coreDone ? ' ✅' : ''}</button>
      <button type="button" data-explore-tab="concept" class="secondary-btn exp-tab-btn ${exploreTab === 'concept' ? 'quick-denom-active' : ''}" aria-pressed="${exploreTab === 'concept'}">🧩 원리 실험 (실험 3·4)${conceptDone ? ' ✅' : ''}</button>
      <button type="button" data-explore-tab="life" class="secondary-btn exp-tab-btn ${exploreTab === 'life' ? 'quick-denom-active' : ''}" aria-pressed="${exploreTab === 'life'}">🚩 수직선·실생활 (실험 5·6·7)${lifeDone ? ' ✅' : ''}</button>
    </div>
    ${showCore ? `<section class="experiment-box" aria-label="실험 1 조각 포개어 비교하기">
      <h3>✂️ 실험 1 · 두 조각 포개어 대어 보기</h3>
      <button type="button" data-action="toggle-overlap" class="overlap-trigger-btn" aria-pressed="${showOverlap}">${showOverlap ? '✂️ 포개어 비교한 결과 닫기' : '✂️ 1/' + firstA + ' 조각과 1/' + firstB + ' 조각 포개어 비교하기'}</button>
      ${showOverlap ? `<div class="overlap-comparison" role="region" aria-label="조각 포개어 겹쳐 비교하기">
        <svg viewBox="0 0 600 92" role="img" aria-label="1/${firstA} 조각과 1/${firstB} 조각을 겹쳐 길이 차이를 비교한 그림"><rect x="0" y="8" width="600" height="74" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="0" y="14" width="${wA.toFixed(2)}" height="26" rx="4" fill="var(--lesson-bar-fill, #ffca62)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><text x="${Math.min(535, wA + 8).toFixed(2)}" y="32" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${firstA} 한 조각</text><rect x="0" y="46" width="${wB.toFixed(2)}" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><rect x="${wB.toFixed(2)}" y="46" width="${diffW.toFixed(2)}" height="26" rx="4" fill="#fde2e2" stroke="#d9381e" stroke-width="2" stroke-dasharray="4 2"/><text x="${Math.min(430, wA + 8).toFixed(2)}" y="64" font-size="13" font-weight="800" fill="#d9381e">← 이만큼 1/${firstA}이 더 길어요!</text><line x1="${wB.toFixed(2)}" y1="10" x2="${wB.toFixed(2)}" y2="78" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="4 3"/></svg>
        <p class="answer">💡 <strong>발견 1</strong>: 덜 나눈 <strong>1/${firstA}</strong> 조각이 <strong>1/${firstB}</strong> 조각보다 빨간 점선 칸만큼 확실히 더 깁니다!</p>
      </div>` : ''}
    </section>
    <section class="experiment-box" aria-label="실험 2 나누는 조각 수 바꿔 보기">
      <h3>🎚️ 실험 2 · 양쪽 분모(2~12등분) 자유 비교</h3>
      <div class="visual-controls-bar">
        <div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기"><button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'circle'}">${visualModel === 'circle' ? '📏 막대 모양' : '🍕 원형 모양'}</button></div>
        <div class="base-denom-controls" role="group" aria-label="위쪽 기준 분수 분모 조절">
          <button type="button" data-action="base-less" class="secondary-btn" ${exploreBaseDenominator <= DENOMINATOR_MIN ? 'disabled' : ''} aria-label="기준 분모 줄이기">기준 −1</button>
          <output id="explore-base-output" aria-live="polite">기준 분수: 1/${exploreBaseDenominator} (${exploreBaseDenominator}등분)</output>
          <button type="button" data-action="base-more" class="secondary-btn" ${exploreBaseDenominator >= DENOMINATOR_MAX ? 'disabled' : ''} aria-label="기준 분모 늘리기">기준 ＋1</button>
          <button type="button" data-action="toggle-pattern" class="secondary-btn" aria-pressed="${patternMode}">${patternMode ? '🎨 기본 색상' : '🎨 빗금 패턴'}</button>
        </div>
      </div>
      <div class="quick-denom-bar" role="group" aria-label="나누는 사람 수 빠른 선택">${quickDenomBtns}</div>
      <div id="explore-exp2-bars" class="bar-pair">${barsHtml}</div>
      <div class="slider-experiment-controls">
        <button type="button" data-action="less" ${exploreDenominator <= DENOMINATOR_MIN ? 'disabled' : ''} aria-label="등분 수 줄이기">−</button>
        <input id="explore-slider" type="range" min="${DENOMINATOR_MIN}" max="${DENOMINATOR_MAX}" value="${exploreDenominator}" aria-label="나누는 조각 수 슬라이더">
        <output id="explore-denom-output" aria-live="polite">${exploreDenominator}등분 (1/${exploreDenominator})</output>
        <button type="button" data-action="more" ${exploreDenominator >= DENOMINATOR_MAX ? 'disabled' : ''} aria-label="등분 수 늘리기">＋</button>
      </div>
      <p id="explore-cmp-badge" class="comparison-badge" aria-live="polite">${badgeHtml}</p>
      <div id="explore-discovery-2" aria-live="polite">${discoveryHtml}</div>
    </section>` : ''}
    ${showConcept ? `<div class="exp-grid-2col">
      <section class="experiment-box" aria-label="실험 3 단위분수 조각 모아 전체 1 채우기">
        <h3>🧩 실험 3 · 조각 모아 '전체 1' 채우기</h3>
        <div id="fill-whole-box">${renderFillWholeContent()}</div>
      </section>
      <section class="experiment-box fair-cut-box" aria-label="실험 4 공평하게 똑같이 나누기 조건 실험">
        <h3>🔪 실험 4 · 공평하게 나누기(등분할) 조건</h3>
        <figure class="fair-cut-figure"><svg class="touchable-svg" tabindex="0" role="button" data-svg-action="toggle-fair-cut" viewBox="0 0 600 66" aria-label="${fairCutAligned ? '눈금을 똑같은 간격(200씩)으로 정렬해 바르게 3등분한 1/3 모형' : '눈금이 90, 260으로 불공평하게 잘려 크기가 제각각인 3조각 모형'}"><rect x="0" y="10" width="600" height="44" rx="6" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/><rect x="0" y="10" width="${fairCutAligned ? 200 : 90}" height="44" rx="4" fill="${fairCutAligned ? '#ffca62' : '#fde2e2'}"/><line x1="${fairCutAligned ? 200 : 90}" y1="10" x2="${fairCutAligned ? 200 : 90}" y2="54" stroke="#d9381e" stroke-width="3"/><line x1="${fairCutAligned ? 400 : 260}" y1="10" x2="${fairCutAligned ? 400 : 260}" y2="54" stroke="#d9381e" stroke-width="3"/><text x="300" y="37" text-anchor="middle" font-size="14" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">${fairCutAligned ? '✅ 세 조각의 크기가 모두 똑같음 → 진짜 1/3!' : '⚠️ 조각 크기가 제각각(불공평 분할) → 1/3이 아니에요!'}</text></svg></figure>
        <button type="button" data-action="toggle-fair-cut" class="secondary-btn" aria-pressed="${fairCutAligned}">${fairCutAligned ? '🔀 불공평 분할 보기' : '📏 똑같은 간격(등분할) 정렬'}</button>
        <p id="fair-cut-status" class="answer" role="status">${fairCutAligned ? '🎉 <strong>등분할 성공!</strong> 전체를 <strong>똑같은 크기</strong>로 나누었을 때만 <strong>1/3</strong>이라고 부를 수 있어요!' : '💡 조각 크기가 다르면 3조각 중 1조각이어도 <strong>1/3이 아닙니다</strong>. 똑같이 나누어 보세요!'}</p>
      </section>
    </div>` : ''}
    ${showLife ? `<section class="experiment-box flag-line-box" aria-label="실험 5 수직선 위에 단위분수 깃발 꽂기">
      <h3>📍 실험 5 · 0~1 수직선 단위분수 깃발 꽂기</h3>
      <div class="flag-controls" role="group" aria-label="수직선 깃발 선택">${flagBtns}<button type="button" data-action="flag-all" class="secondary-btn">🚩 모두 꽂기</button><button type="button" data-action="flag-reset" class="secondary-btn">🔄 기본 깃발</button></div>
      ${renderFlagNumberLine()}
      <p id="flag-line-status" class="answer" role="status">${pinnedFlags.length >= 4 ? '🎉 <strong>한눈에 발견!</strong> 분모가 <strong>2 → 3 → 4 → 6 → 12</strong>로 커질수록 깃발이 <strong>0 쪽으로 가까워집니다!</strong>' : '📍 깃발을 더 눌러 분모가 커질수록 0과 1 중 어디에 가까워지는지 비교해 보세요!'}</p>
    </section>
    <div class="exp-grid-2col">
      <section class="experiment-box trap-box" aria-label="깜짝 실험 원래 전체 크기가 다를 때">
        <h3>😮 실험 6 · 원래 ${snackName()} 전체 크기가 다르면?</h3>
        <button type="button" data-action="toggle-trap" class="secondary-btn" aria-pressed="${showTrapExperiment}">${showTrapExperiment ? '😮 깜짝 실험 닫기' : '😮 미니 간식의 1/2 vs 특대형 간식의 1/4 보기'}</button>
        ${showTrapExperiment ? `<div class="trap-experiment-content" role="region" aria-label="전체 크기가 서로 다른 두 간식 비교"><svg viewBox="0 0 600 84" role="img" aria-label="작은 미니 간식의 1/2 조각(길이 100)과 특대형 간식의 1/4 조각(길이 140) 비교"><rect x="0" y="10" width="200" height="26" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><rect x="0" y="10" width="100" height="26" rx="4" fill="#ffca62" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><text x="212" y="28" font-size="13" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">작은 미니 ${snackName()}의 1/2</text><rect x="0" y="46" width="560" height="26" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><rect x="0" y="46" width="140" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><text x="150" y="64" font-size="13" font-weight="700" fill="#d9381e">특대형 ${snackName()}의 1/4 (더 큼!)</text></svg><p class="answer">💡 <strong>깜짝 발견!</strong> 원래 전체 크기가 다르면 <strong>1/4</strong>이 <strong>1/2</strong>보다 클 수도 있어요! 반드시 <strong>"전체 크기가 같다"</strong>는 약속이 필요합니다.</p></div>` : ''}
      </section>
      <section class="experiment-box reallife-box" aria-label="생활 속 숨은 단위분수 찾기">
        <h3>🕒 실험 7 · 시계(60분)·판초콜릿(12칸) 분수</h3>
        <button type="button" data-action="toggle-reallife" class="secondary-btn" aria-pressed="${showRealLife}">${showRealLife ? '🕒 생활 속 실험 닫기' : '🕒 1시간의 1/2(30분) vs 1/4(15분) & 12칸 초콜릿'}</button>
        ${showRealLife ? `<div class="reallife-content" role="region" aria-label="시계판과 12칸 초콜릿 단위분수 비교"><div class="reallife-grid"><div class="reallife-item"><strong>⏰ 1시간(60분) 시계판</strong><div class="reallife-svg-wrap"><svg viewBox="0 0 220 90" role="img" aria-label="1시간의 1/2(30분 반원)과 1/4(15분 부채꼴) 비교 시계판"><circle cx="55" cy="45" r="34" fill="#fff" stroke="#153a69" stroke-width="2.5"/><path d="M 55 45 L 55 11 A 34 34 0 0 1 55 79 Z" fill="#ffca62"/><circle cx="55" cy="45" r="34" fill="none" stroke="#153a69" stroke-width="2.5"/><text x="55" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/2시간 = 30분</text><circle cx="165" cy="45" r="34" fill="#fff" stroke="#153a69" stroke-width="2.5"/><path d="M 165 45 L 165 11 A 34 34 0 0 1 199 45 Z" fill="#7cc6fe"/><circle cx="165" cy="45" r="34" fill="none" stroke="#153a69" stroke-width="2.5"/><text x="165" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/4시간 = 15분</text></svg></div><p><strong>1/2시간(30분) &gt; 1/4시간(15분)</strong></p></div><div class="reallife-item"><strong>🍫 12칸 판초콜릿</strong><div class="reallife-svg-wrap"><svg viewBox="0 0 220 90" role="img" aria-label="12칸 판초콜릿의 1/3(4칸)과 1/4(3칸) 비교"><rect x="10" y="14" width="90" height="52" rx="4" fill="#fff" stroke="#5c3317" stroke-width="2"/><rect x="10" y="14" width="30" height="52" rx="3" fill="#e08e2b"/><line x1="40" y1="14" x2="40" y2="66" stroke="#5c3317" stroke-width="2"/><line x1="70" y1="14" x2="70" y2="66" stroke="#5c3317" stroke-width="2"/><text x="55" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">12칸의 1/3 = 4칸</text><rect x="120" y="14" width="90" height="52" rx="4" fill="#fff" stroke="#5c3317" stroke-width="2"/><rect x="120" y="14" width="22.5" height="52" rx="3" fill="#7cc6fe"/><line x1="142.5" y1="14" x2="142.5" y2="66" stroke="#5c3317" stroke-width="2"/><line x1="165" y1="14" x2="165" y2="66" stroke="#5c3317" stroke-width="2"/><line x1="187.5" y1="14" x2="187.5" y2="66" stroke="#5c3317" stroke-width="2"/><text x="165" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">12칸의 1/4 = 3칸</text></svg></div><p><strong>1/3(4칸) &gt; 1/4(3칸)</strong></p></div></div></div>` : ''}
      </section>
    </div>` : ''}
    <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">${renderTeacherTalkBar('explore')}</div>
    <div class="actions next-step-bar">
      <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
      <button type="button" data-action="next" class="primary-next-btn ${anyExpDone ? 'next-btn-ready' : ''}">③ 내 생각 다시 점검하기 →</button>
    </div>
  </div>`;
}

/** 3단계: 2열 컴팩트 점검 카드 + 번개 미니게임 + 기차/추리 2열 퍼즐 + 하단 교사 독. */
function renderCheckPhase(): string {
  const { first: [firstA, firstB], transfer: [transferA, transferB] } = activeDenominators();

  const duelScore = duelRounds.filter(r => duelPicks[r.id] === r.answer).length;
  const duelRowsHtml = duelRounds.map(r => {
    const picked = duelPicks[r.id];
    const isCorrect = picked === r.answer;
    const teamTag = duelBattleMode ? (r.id % 2 === 0 ? ' · 🔵청팀' : ' · 🔴홍팀') : '';
    return `<div class="duel-round-row">
      <span class="duel-round-badge">라운드 ${r.id + 1}${teamTag}</span>
      <div class="duel-btn-pair" role="group" aria-label="라운드 ${r.id + 1} 더 큰 분수 고르기">
        <button type="button" data-duel-round="${r.id}" data-duel-pick="left" class="secondary-btn duel-card-btn ${picked === 'left' ? 'solo-choice-selected' : ''}" aria-pressed="${picked === 'left'}">1/${r.leftDenom} 조각</button>
        <span class="duel-vs">VS</span>
        <button type="button" data-duel-round="${r.id}" data-duel-pick="right" class="secondary-btn duel-card-btn ${picked === 'right' ? 'solo-choice-selected' : ''}" aria-pressed="${picked === 'right'}">1/${r.rightDenom} 조각</button>
      </div>
      <span class="duel-result-tag" role="status">${picked === null ? '👆 터치!' : isCorrect ? '🎉 정답!' : `💡 1/${Math.min(r.leftDenom, r.rightDenom)}이 더 커요!`}</span>
    </div>`;
  }).join('');

  const tPool = currentTrainPool();
  const sortedTrain = [...tPool].sort((a, b) => a - b);
  const trainComplete = trainOrder.length === tPool.length;
  const trainCorrect = trainComplete && trainOrder[0] === sortedTrain[0] && trainOrder[1] === sortedTrain[1] && trainOrder[2] === sortedTrain[2];
  const trainStatusHtml = !trainComplete
    ? '👆 가장 큰 조각부터 차례대로 눌러 1호차 → 2호차 → 3호차에 태워 보세요!'
    : trainCorrect
      ? `🎉 <strong>칙칙폭폭 출발!</strong> <strong>1/${sortedTrain[0]} &gt; 1/${sortedTrain[1]} &gt; 1/${sortedTrain[2]}</strong> 순서로 완벽하게 줄을 세웠어요!`
      : `💡 <strong>다시 줄을 세워 볼까요?</strong> 분모가 작을수록 조각이 더 커요. 가장 큰 조각(1/${sortedTrain[0]})부터 태워 보세요!`;

  const mSet = currentMysterySet();
  const mysteryCorrect = mysteryDenomPick !== null && mysteryDenomPick > mSet.low && mysteryDenomPick < mSet.high;
  const mysteryStatusHtml = mysteryDenomPick === null
    ? `🕵️ 1/${mSet.low}보다 작고 1/${mSet.high}보다 큰 단위분수의 분모 □를 골라 보세요!`
    : mysteryCorrect
      ? `🎉 <strong>추리 성공!</strong> ${mSet.low} &lt; <strong>${mysteryDenomPick}</strong> &lt; ${mSet.high}이므로 <strong>1/${mSet.low} &gt; 1/${mysteryDenomPick} &gt; 1/${mSet.high}</strong>이 성립합니다!`
      : `💡 <strong>다시 추리해 볼까요?</strong> ${mSet.low}과(와) ${mSet.high} 사이에 있는 분모 숫자를 골라 보세요!`;

  const allDuelPicked = duelRounds.every(r => duelPicks[r.id] !== null);
  const battleResultTag = allDuelPicked
    ? battleScores[0] > battleScores[1]
      ? ' · 🏆 🔵청팀 승리!'
      : battleScores[1] > battleScores[0]
        ? ' · 🏆 🔴홍팀 승리!'
        : ' · 🤝 무승부!'
    : '';

  return `<div class="step-card">
    <h2 tabindex="-1">③ 다시 점검하기 · 내 생각 확인과 분수 대결</h2>
    <div class="check-grid-2col">
      <section class="check-subcard" aria-label="같은 문제 다시 선택하기">
        <h3>1) 처음 문제 다시 고르기 (1/${firstA} vs 1/${firstB})</h3>
        <p class="first-memory-tag">💭 1단계 처음 생각: <strong>${choiceLabel(myChoices.first, firstA, firstB, 'first')}</strong></p>
        ${renderChoiceButtons('again', firstA, firstB)}
        ${renderInstantFeedback('again', firstA, firstB)}
        ${renderConfidencePicker('again')}
        ${renderOptionalClassPoll('again', firstA, firstB)}
      </section>
      <section class="check-subcard" aria-label="한 걸음 더 새로운 응용 문제">
        <h3>2) 응용 문제 도전 (<strong>1/${transferB}</strong> vs <strong>1/${transferA}</strong>)</h3>
        ${renderSimpleVisualPair(transferB, transferA, true)}
        ${renderChoiceButtons('transfer', transferA, transferB)}
        ${renderInstantFeedback('transfer', transferA, transferB)}
        ${renderOptionalClassPoll('transfer', transferA, transferB)}
      </section>
    </div>
    <section class="check-subcard duel-game-box" aria-label="번개 미니게임 더 큰 단위분수 찾기">
      <div class="duel-header-row">
        <h3>3) ⚡ 번개 미니게임 · 더 큰 분수 고르기</h3>
        <div class="duel-header-actions">
          <button type="button" id="duel-battle-toggle" data-action="toggle-duel-battle" class="secondary-btn" aria-pressed="${duelBattleMode}">${duelBattleMode ? '👯 1:1 대결 켜짐' : '👯 1:1 대결 모드'}</button>
          <button type="button" data-action="duel-shuffle" class="secondary-btn">🎲 랜덤 ${duelBattleMode ? 4 : 3}문제</button>
        </div>
      </div>
      ${duelBattleMode ? `<div id="duel-battle-board" class="duel-battle-board" role="status">🔵 청팀 <strong>${battleScores[0]}점</strong> <span class="battle-vs">VS</span> 🔴 홍팀 <strong>${battleScores[1]}점</strong>${battleResultTag}</div>` : ''}
      <div class="duel-rounds-list">${duelRowsHtml}</div>
      <p class="duel-score-banner" role="status">🎯 점수: <strong>${duelScore} / ${duelRounds.length}</strong> ${duelScore === duelRounds.length ? '🏆 퍼펙트!' : ''} · <span id="duel-streak-badge">🔥 콤보: ${duelStreak}연속</span></p>
    </section>
    <div class="check-grid-2col">
      <section class="check-subcard train-puzzle-box" aria-label="분수 기차 줄 세우기 퍼즐">
        <div class="duel-header-row">
          <h3>4) 🚂 분수 기차 (큰 조각부터 태우기)</h3>
          <button type="button" id="puzzle-shuffle-btn" data-action="puzzle-shuffle" class="secondary-btn">🎲 새 퍼즐</button>
        </div>
        <div class="train-pick-row" role="group" aria-label="기차에 태울 단위분수 고르기">
          ${tPool.map(d => `<button type="button" data-train-denom="${d}" class="secondary-btn train-pick-btn" ${trainOrder.includes(d) ? 'disabled' : ''}>🚂 1/${d} 태우기</button>`).join('')}
          <button type="button" data-action="train-reset" class="secondary-btn">🔄 다시</button>
        </div>
        <div class="train-cars" role="group" aria-label="분수 기차 칸">${[0, 1, 2].map(idx => `<div class="train-car">${idx + 1}호차: <strong>${trainOrder[idx] ? `1/${trainOrder[idx]}` : '빈칸'}</strong></div>`).join('<span class="train-link" aria-hidden="true">&gt;</span>')}</div>
        <p id="train-status" class="answer" role="status">${trainStatusHtml}</p>
      </section>
      <section class="check-subcard mystery-quiz-box" aria-label="숨은 분모 추리 퀴즈">
        <h3>5) 🕵️ 숨은 분모 추리 (<strong class="mystery-equation">1/${mSet.low} &gt; 1/□ &gt; 1/${mSet.high}</strong>)</h3>
        <div class="mystery-pick-row" role="group" aria-label="빈칸 분모 후보 고르기">${mSet.candidates.map(d => `<button type="button" data-mystery-denom="${d}" class="secondary-btn mystery-btn ${mysteryDenomPick === d ? 'solo-choice-selected' : ''}" aria-pressed="${mysteryDenomPick === d}">□ = ${d} (1/${d})</button>`).join('')}</div>
        <p id="mystery-status" class="answer" role="status">${mysteryStatusHtml}</p>
      </section>
    </div>
    <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">${renderTeacherTalkBar('check')}</div>
    <div class="actions next-step-bar">
      <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
      <button type="button" data-action="next" class="primary-next-btn ${myChoices.again && myChoices.transfer ? 'next-btn-ready' : ''}">④ 오늘의 발견 결과 보기 →</button>
    </div>
  </div>`;
}

/** 4단계: 성장 카드 + 2열 규칙/편지 + 2열 브릿지/스탬프 + 하단 교사 독. */
function renderResultPhase(): string {
  clearedUnits.add(selectedUnitId);
  const { first: [fA, fB], transfer: [tA, tB] } = activeDenominators();
  const story = storyDilemmas[selectedUnitId] ?? storyDilemmas.M01;
  const blankText = notebookBlankRevealed ? '작아집니다!' : ruleChoice === 'bigger' ? '커집니다(?)' : ruleChoice === 'same' ? '같습니다(?)' : '______';

  const againCorrect = myChoices.again === correctChoiceForPoll('again');
  const transferCorrect = myChoices.transfer === correctChoiceForPoll('transfer');
  const growthMessage = againCorrect && transferCorrect
    ? '🏆 최고예요! 단위분수의 크기 비교 원리를 완벽하게 마스터했어요!'
    : againCorrect || transferCorrect
      ? '🌟 참 잘했어요! 더 많이 나눌수록 한 조각이 작아진다는 점을 발견했어요!'
      : '🌱 끝까지 스스로 실험하며 단위분수의 비밀을 탐구했어요!';

  const n = parseParticipants(participantsRaw);
  const firstPoll = !pollBlind && n && pollData.first ? validateCounts(pollData.first, n) : null;
  const againPoll = !pollBlind && n && pollData.again ? validateCounts(pollData.again, n) : null;
  const transferPoll = !pollBlind && n && pollData.transfer ? validateCounts(pollData.transfer, n) : null;
  const classSummaryParts: string[] = [];
  if (firstPoll && againPoll && n) {
    const diffPp = percentagePointChange(firstPoll.counts.A, againPoll.counts.A, n);
    classSummaryParts.push(`처음·재선택 정답(1/${fA}) 인원: <strong>${firstPoll.counts.A}/${n}명 → ${againPoll.counts.A}/${n}명</strong> (${diffPp >= 0 ? '+' : ''}${diffPp.toFixed(1)}%p)`);
  }
  if (transferPoll && n) {
    classSummaryParts.push(`응용 문제 정답(1/${tA}, B번) 인원: <strong>${transferPoll.counts.B}/${n}명</strong>`);
  }
  const classSummaryHtml = classSummaryParts.length > 0
    ? `<p class="comparison">👩‍🏫 <strong>학급 집계 요약</strong>: ${classSummaryParts.join(' · ')}</p>`
    : '';

  const ruleFeedbackHtml = notebookBlankRevealed
    ? '<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 더 많이 나눌수록 한 조각의 크기는 <strong>점점 작아집니다!</strong></p>'
    : ruleChoice === 'bigger' || ruleChoice === 'same'
      ? '<p class="answer feedback-hint" role="status">💡 <strong>다시 골라 볼까요?</strong> 나누는 사람 수를 늘렸을 때 한 조각 크기가 어떻게 변했나요?</p>'
      : '';

  const letterReplyHtml = friendLetterChoice === 'correct'
    ? `<p id="letter-reply" class="answer feedback-correct" role="status">📬 <strong>${story.friend}의 답장</strong>: "아하! 더 많은 사람이 나눌수록 한 조각이 작아지니까 분모가 작은 단위분수가 더 크구나. 고마워!"</p>`
    : friendLetterChoice === 'wrong'
      ? `<p id="letter-reply" class="answer feedback-hint" role="status">💡 ${story.friend}가 아직 헷갈려해요! 더 많이 나눌수록 한 조각이 어떻게 변했는지 다시 골라 볼까요?</p>`
      : '';

  const confLabels: Record<ConfidenceLevel, string> = {
    '': '미선택',
    low: '🌱 조금 헷갈려요',
    mid: '🙂 어느 정도 맞을 것 같아요',
    high: '🔥 완전히 확신해요!',
  };
  const metacogHtml = `<p id="metacog-summary" class="metacog-summary">🌡️ <strong>확신 온도 변화</strong>: 처음 <strong>[${confLabels[confidence.first]}]</strong> → 실험 후 <strong>[${confLabels[confidence.again]}]</strong></p>`;

  const bridgeStatusHtml = bridgeChoice === 'right'
    ? '🎉 <strong>정답이에요!</strong> 같은 <strong>1/5</strong> 조각을 더 많이 모은 <strong>3/5</strong>(3개)이 <strong>2/5</strong>(2개)보다 더 큽니다!'
    : bridgeChoice === 'left'
      ? '💡 <strong>다시 살펴볼까요?</strong> 똑같은 <strong>1/5 조각</strong> 2개와 3개 중 어느 쪽이 더 길까요?'
      : '👆 똑같은 1/5 조각을 2개 모은 2/5와 3개 모은 3/5 중 더 큰 쪽을 골라 보세요!';

  const allUnits = listUnits();
  const nextUncleared = allUnits.find(u => !clearedUnits.has(u.id)) ?? allUnits[(allUnits.findIndex(u => u.id === selectedUnitId) + 1) % allUnits.length];
  const stampsHtml = allUnits.map(u => {
    const done = clearedUnits.has(u.id);
    return `<div class="stamp-item ${done ? 'stamp-done' : ''}"><span class="stamp-icon">${done ? '🎖️ 클리어!' : '🔒 미도전'}</span><strong>${u.title}</strong></div>`;
  }).join('');

  return `<div class="step-card">
    <div id="confetti-burst" class="confetti-burst" aria-hidden="true"><svg viewBox="0 0 600 28" preserveAspectRatio="none"><circle cx="45" cy="14" r="5" fill="#f59e0b"/><rect x="110" y="6" width="10" height="6" rx="2" fill="#3b82f6"/><circle cx="185" cy="18" r="6" fill="#10b981"/><rect x="260" y="5" width="12" height="6" rx="2" fill="#ec4899"/><circle cx="340" cy="16" r="5" fill="#8b5cf6"/><rect x="415" y="8" width="10" height="6" rx="2" fill="#f97316"/><circle cx="490" cy="12" r="6" fill="#06b6d4"/><rect x="550" y="6" width="10" height="6" rx="2" fill="#eab308"/></svg></div>
    <h2 tabindex="-1">④ 오늘의 발견 · 성장 카드와 마스터 스탬프</h2>
    <div class="solo-report-card" role="region" aria-label="내 생각의 성장 카드">
      <p class="praise-badge">${growthMessage}</p>
      <div class="growth-journey-grid">
        <div class="journey-step"><span class="journey-label">① 처음 생각 (1/${fA} vs 1/${fB})</span><strong>${choiceLabel(myChoices.first, fA, fB, 'first')}</strong></div>
        <div class="journey-arrow" aria-hidden="true">→</div>
        <div class="journey-step ${againCorrect ? 'journey-correct' : ''}"><span class="journey-label">② 실험 후 (1/${fA} vs 1/${fB})</span><strong>${choiceLabel(myChoices.again, fA, fB, 'again')} ${againCorrect ? '⭐' : ''}</strong></div>
        <div class="journey-arrow" aria-hidden="true">→</div>
        <div class="journey-step ${transferCorrect ? 'journey-correct' : ''}"><span class="journey-label">③ 응용 문제 (1/${tB} vs 1/${tA})</span><strong>${choiceLabel(myChoices.transfer, tA, tB, 'transfer')} ${transferCorrect ? '⭐' : ''}</strong></div>
      </div>
      ${metacogHtml}
      ${classSummaryHtml}
      ${renderBeforeAfterPollComparison()}
    </div>
    <div class="result-grid-2col">
      <div class="notebook-summary-card" role="region" aria-label="오늘 내가 발견한 규칙">
        <h3>🧩 오늘의 단위분수 규칙 완성하기</h3>
        <div class="notebook-line"><p>"같은 전체를 똑같이 더 많이 나눌수록(분모가 커질수록), 한 조각의 크기는 <strong class="notebook-blank">[ ${blankText} ]</strong>"</p></div>
        <div class="rule-word-cards" role="group" aria-label="빈칸에 들어갈 알맞은 말 고르기">
          <button type="button" data-rule-choice="bigger" class="secondary-btn rule-card-btn ${ruleChoice === 'bigger' ? 'rule-card-wrong' : ''}" aria-pressed="${ruleChoice === 'bigger'}">📈 커집니다</button>
          <button type="button" data-rule-choice="smaller" data-action="toggle-notebook-blank" class="secondary-btn rule-card-btn ${notebookBlankRevealed ? 'solo-choice-selected' : ''}" aria-pressed="${notebookBlankRevealed}">📉 작아집니다!</button>
          <button type="button" data-rule-choice="same" class="secondary-btn rule-card-btn ${ruleChoice === 'same' ? 'rule-card-wrong' : ''}" aria-pressed="${ruleChoice === 'same'}">🟰 같습니다</button>
        </div>
        ${ruleFeedbackHtml}
      </div>
      <div class="friend-letter-card" role="region" aria-label="고민하던 친구에게 보내는 설명 편지">
        <h3>💌 ${story.friend}에게 설명 편지 보내기</h3>
        <div class="letter-choice-list" role="group" aria-label="친구에게 보낼 설명 고르기">
          <button type="button" data-letter-choice="correct" class="secondary-btn letter-choice-btn ${friendLetterChoice === 'correct' ? 'solo-choice-selected' : ''}" aria-pressed="${friendLetterChoice === 'correct'}">💌 "같은 전체를 더 많이 나눌수록 한 조각의 크기는 작아지기 때문이야!"</button>
          <button type="button" data-letter-choice="wrong" class="secondary-btn letter-choice-btn ${friendLetterChoice === 'wrong' ? 'rule-card-wrong' : ''}" aria-pressed="${friendLetterChoice === 'wrong'}">💌 "분모 숫자가 크면 한 조각의 크기도 항상 커지기 때문이야!"</button>
        </div>
        ${letterReplyHtml}
      </div>
    </div>
    <div class="result-grid-2col">
      <div class="bridge-mission-card" role="region" aria-label="다음 개념 연결 분모가 같은 진분수 비교">
        <h3>🚀 다음 차시 브릿지 · <strong>2/5 vs 3/5</strong></h3>
        <figure class="bridge-figure"><svg viewBox="0 0 600 84" role="img" aria-label="5등분 중 2조각을 칠한 2/5 막대와 3조각을 칠한 3/5 막대 비교"><rect x="0" y="8" width="600" height="28" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><rect x="0" y="8" width="240" height="28" rx="4" fill="#ffca62"/><line x1="120" y1="8" x2="120" y2="36" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><line x1="240" y1="8" x2="240" y2="36" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><line x1="360" y1="8" x2="360" y2="36" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><line x1="480" y1="8" x2="480" y2="36" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><text x="252" y="27" font-size="13" font-weight="800" fill="var(--lesson-bar-stroke, #153a69)">2/5 (1/5이 2개)</text><rect x="0" y="46" width="600" height="28" rx="4" fill="var(--lesson-bar-bg, #fff)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><rect x="0" y="46" width="360" height="28" rx="4" fill="#7cc6fe"/><line x1="120" y1="46" x2="120" y2="74" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><line x1="240" y1="46" x2="240" y2="74" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><line x1="360" y1="46" x2="360" y2="74" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><line x1="480" y1="46" x2="480" y2="74" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/><text x="372" y="65" font-size="13" font-weight="800" fill="#d9381e">3/5 (1/5이 3개)</text></svg></figure>
        <div class="bridge-choice-row" role="group" aria-label="2/5와 3/5 중 더 큰 분수 고르기">
          <button type="button" data-bridge-pick="left" class="secondary-btn ${bridgeChoice === 'left' ? 'rule-card-wrong' : ''}" aria-pressed="${bridgeChoice === 'left'}">🧩 2/5가 더 크다</button>
          <button type="button" data-bridge-pick="right" class="secondary-btn ${bridgeChoice === 'right' ? 'solo-choice-selected' : ''}" aria-pressed="${bridgeChoice === 'right'}">🧩 3/5가 더 크다</button>
        </div>
        <p id="bridge-status" class="answer" role="status">${bridgeStatusHtml}</p>
      </div>
      <div class="stamp-tour-board" role="region" aria-label="분수 탐구 3대 주제 스탬프 투어">
        <h3>🎖️ 분수 탐구 스탬프 투어 (${clearedUnits.size} / ${allUnits.length} 클리어!)</h3>
        <div class="stamp-grid">${stampsHtml}</div>
      </div>
    </div>
    <div class="print-certificate-box" role="region" aria-label="단위분수 탐구 박사 인증서 서명란">
      <p class="cert-title">🎓 단위분수 탐구 박사 인증서 · 배움 공책 붙임용</p>
      <p class="cert-sign-line">학번·이름: ____________________ &nbsp;|&nbsp; 오늘 나의 한 줄 소감: ________________________________________</p>
    </div>
    <div class="teacher-dock-zone" role="region" aria-label="선생님 수업 도구">${renderTeacherTalkBar('result')}</div>
    <div class="actions next-step-bar">
      <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
      <button type="button" data-action="print-summary" class="secondary-btn">🖨️ 결과 인쇄</button>
      <button type="button" data-action="next-unit" data-next-unit-id="${nextUncleared.id}" class="primary-next-btn">🚀 다음 이야기(${nextUncleared.title.split('·')[0].trim()}) →</button>
      <button type="button" data-action="restart" class="secondary-btn">🔄 다시 하기</button>
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

// ─── 상단 초슬림 헤더 및 4단계 진행 바 ────────────────────────────

function renderPageHeader(): string {
  const dark = isDarkTheme();
  const large = isLargeScale();
  return `<header class="slim-header">
    <div class="header-brand">
      <h1>🧭 생각의 갈림길 AI</h1>
      <span class="eyebrow">${aiEnabled ? '로컬 AI 수업' : '단위분수 탐구'}</span>
    </div>
    <div class="header-controls">
      <button id="sound-toggle" class="scale-toggle" aria-label="효과음 전환" aria-pressed="${soundEnabled}" type="button">${soundEnabled ? '🔊 효과음' : '🔇 음소거'}</button>
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
    '<footer>🔒 활동 내용은 현재 브라우저 메모리에만 머물며 외부로 전송·저장되지 않습니다.</footer>',
  ].join('');

  const [fA, fB] = activeDenominators().first;
  aiPanel?.sync(phase === 'think', fA, fB, selectedUnitId === 'M01' && !customPair ? '리본' : snackName());
  if (focus) {
    app.querySelector<HTMLElement>('#step h2')?.focus();
    const announce = app.querySelector('#step-announce');
    if (announce) announce.textContent = `${phaseLabels[phase]} 단계로 이동했습니다.`;
  }
}

function updateClassPollStatusesDOM() {
  const { first: [fA, fB], transfer: [tA, tB] } = activeDenominators();
  app.querySelectorAll<HTMLElement>('.class-poll-status[data-status-poll]').forEach(el => {
    const p = el.dataset.statusPoll as Poll;
    el.textContent = formatClassPollStatus(p);
  });
  app.querySelectorAll<HTMLElement>('.live-poll-chart[data-chart-poll]').forEach(el => {
    const p = el.dataset.chartPoll as Poll;
    const [dA, dB] = p === 'transfer' ? [tA, tB] : [fA, fB];
    el.outerHTML = renderLivePollChart(p, dA, dB);
  });
  const baChart = app.querySelector<HTMLElement>('#poll-before-after-chart');
  const nextBa = renderBeforeAfterPollComparison();
  if (baChart) {
    if (nextBa) baChart.outerHTML = nextBa;
    else baChart.remove();
  } else if (nextBa) {
    const againLiveChart = app.querySelector<HTMLElement>('.live-poll-chart[data-chart-poll="again"]');
    againLiveChart?.insertAdjacentHTML('afterend', nextBa);
  }
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
    const p = (details.dataset.pollDetails || 'first') as Poll;
    classPollOpen[p] = details.open;
  }
}, true);

app.addEventListener('input', event => {
  const target = event.target as HTMLInputElement;

  if (target.id === 'explore-slider') {
    exploreDenominator = Number(target.value);
    filledPieces = 1;
    exploreMoved = true;
    updateExploreSliderDOM();
    return;
  }

  if (target.id === 'participants' || target.dataset.participantsInput) {
    participantsRaw = target.value;
    const p = (target.dataset.participantsInput || 'first') as Poll;
    classPollOpen[p] = true;
    updateClassPollStatusesDOM();
    return;
  }

  if (target.dataset.count && target.dataset.countPoll) {
    if (pollBlind) return;
    const p = target.dataset.countPoll as Poll;
    const ch = target.dataset.count as Choice;
    pollData[p] ??= emptyCounts();
    pollData[p]![ch] = target.value;
    classPollOpen[p] = true;
    updateClassPollStatusesDOM();
  }
});

// 단축키 지원 (Alt+←, Alt+→, 무선 프리젠터 PageDown/PageUp, Space 액션, 1~4 숫자키)
window.addEventListener('keydown', event => {
  if (event.repeat) return;
  const activeEl = document.activeElement as HTMLElement | null;
  const activeTag = activeEl?.tagName;
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

  if ((event.key === 'Enter' || event.key === ' ') && activeEl && (activeEl.hasAttribute('data-fill-slice') || activeEl.hasAttribute('data-svg-flag') || activeEl.hasAttribute('data-svg-action'))) {
    event.preventDefault();
    activeEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return;
  }

  const idx = order.indexOf(phase);

  if (!event.altKey && !event.ctrlKey && !event.metaKey) {
    if (['1', '2', '3', '4'].includes(event.key)) {
      if (phase === 'think' || phase === 'check') {
        const inTransfer = (document.activeElement as HTMLElement | null)?.closest('[aria-label="한 걸음 더 새로운 응용 문제"]') !== null;
        const targetPoll: Poll = phase === 'think' ? 'first' : inTransfer ? 'transfer' : 'again';
        const ch = CHOICES[Number(event.key) - 1];
        if (ch) {
          myChoices[targetPoll] = ch;
          error = '';
          playSound(targetPoll !== 'first' && ch === correctChoiceForPoll(targetPoll) ? 'correct' : 'click');
          render();
        }
      }
      return;
    }
    if (event.key === 'PageDown' && idx < order.length - 1) {
      event.preventDefault();
      stopSpeech();
      stopTalkCountdown();
      phase = order[idx + 1];
      render(true);
      return;
    }
    if (event.key === 'PageUp' && idx > 0) {
      event.preventDefault();
      stopSpeech();
      stopTalkCountdown();
      phase = order[idx - 1];
      render(true);
      return;
    }
    if (event.key === ' ' && (activeTag === 'BODY' || activeTag === 'MAIN' || activeTag === 'H2')) {
      event.preventDefault();
      if (phase === 'think') spoilerPreview = !spoilerPreview;
      else if (phase === 'explore') showOverlap = !showOverlap;
      else if (phase === 'result') notebookBlankRevealed = !notebookBlankRevealed;
      playSound('click');
      render();
      return;
    }
  }

  if (!event.altKey) return;

  if (event.key === 'ArrowRight' && idx < order.length - 1) {
    event.preventDefault();
    stopSpeech();
    stopTalkCountdown();
    phase = order[idx + 1];
    render(true);
  } else if (event.key === 'ArrowLeft' && idx > 0) {
    event.preventDefault();
    stopSpeech();
    stopTalkCountdown();
    phase = order[idx - 1];
    render(true);
  }
});

app.addEventListener('click', async event => {
  const targetEl = event.target as HTMLElement;

  const fillSliceEl = targetEl.closest<SVGElement>('[data-fill-slice]');
  if (fillSliceEl && fillSliceEl.dataset.fillSlice) {
    filledPieces = Math.max(1, Math.min(exploreDenominator, Number(fillSliceEl.dataset.fillSlice)));
    playSound(filledPieces === exploreDenominator ? 'fanfare' : 'click');
    render();
    return;
  }

  const svgFlagEl = targetEl.closest<SVGElement>('[data-svg-flag]');
  if (svgFlagEl && svgFlagEl.dataset.svgFlag) {
    const d = Number(svgFlagEl.dataset.svgFlag);
    pinnedFlags = pinnedFlags.includes(d) ? pinnedFlags.filter(x => x !== d) : [...pinnedFlags, d];
    playSound('click');
    render();
    return;
  }

  const svgActionEl = targetEl.closest<SVGElement>('[data-svg-action]');
  if (svgActionEl && svgActionEl.dataset.svgAction) {
    const svgAct = svgActionEl.dataset.svgAction;
    if (svgAct === 'toggle-spoiler') {
      spoilerPreview = !spoilerPreview;
      playSound('click');
      render();
      return;
    }
    if (svgAct === 'toggle-fair-cut') {
      fairCutAligned = !fairCutAligned;
      playSound(fairCutAligned ? 'correct' : 'click');
      render();
      return;
    }
  }

  const button = targetEl.closest<HTMLButtonElement>('button');
  if (!button) return;

  // 효과음 토글, 다크 모드 & 큰 글씨 모드
  if (button.id === 'sound-toggle') {
    soundEnabled = !soundEnabled;
    if (!soundEnabled) stopSpeech();
    button.textContent = soundEnabled ? '🔊 효과음' : '🔇 음소거';
    button.setAttribute('aria-pressed', String(soundEnabled));
    if (soundEnabled) playSound('click');
    return;
  }

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
      stopSpeech();
      stopTalkCountdown();
      phase = order[idx];
      error = '';
      render(true);
    }
    return;
  }

  // 1단계·3단계 확신 온도계 선택
  if (button.dataset.confPoll && button.dataset.confLevel) {
    const p = button.dataset.confPoll as 'first' | 'again';
    const lvl = button.dataset.confLevel as ConfidenceLevel;
    confidence[p] = lvl;
    playSound('click');
    render();
    return;
  }

  // 2단계 실험 카테고리 탭 전환
  if (button.dataset.exploreTab) {
    exploreTab = button.dataset.exploreTab as 'all' | 'core' | 'concept' | 'life';
    playSound('click');
    render();
    return;
  }

  // 2단계 수직선 단위분수 깃발 꽂기/빼기
  if (button.dataset.flagDenom !== undefined) {
    const d = Number(button.dataset.flagDenom);
    if (pinnedFlags.includes(d)) {
      pinnedFlags = pinnedFlags.filter(x => x !== d);
    } else {
      pinnedFlags = [...pinnedFlags, d];
    }
    playSound('click');
    render();
    return;
  }

  // 3단계 숨은 분모 추리 퀴즈 선택
  if (button.dataset.mysteryDenom !== undefined) {
    const d = Number(button.dataset.mysteryDenom);
    const mSet = currentMysterySet();
    mysteryDenomPick = d;
    playSound(d > mSet.low && d < mSet.high ? 'correct' : 'click');
    render();
    return;
  }

  // 4단계 진분수 비교 브릿지 미션 선택
  if (button.dataset.bridgePick) {
    const pick = button.dataset.bridgePick as DuelPick;
    bridgeChoice = pick;
    playSound(pick === 'right' ? 'fanfare' : 'click');
    render();
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
    filledPieces = 1;
    exploreMoved = true;
    playSound('click');
    updateExploreSliderDOM();
    return;
  }

  // 3단계 번개 미니게임 카드 선택
  if (button.dataset.duelRound !== undefined && button.dataset.duelPick) {
    const r = Number(button.dataset.duelRound);
    const pick = button.dataset.duelPick as DuelPick;
    if (duelPicks[r] === pick) return;
    duelPicks[r] = pick;
    const roundObj = duelRounds.find(item => item.id === r);
    if (roundObj && roundObj.answer === pick) {
      duelStreak++;
      playSound('correct');
    } else {
      duelStreak = 0;
    }
    battleScores = [
      duelRounds.filter(item => item.id % 2 === 0 && duelPicks[item.id] === item.answer).length,
      duelRounds.filter(item => item.id % 2 === 1 && duelPicks[item.id] === item.answer).length,
    ];
    render();
    return;
  }

  // 3단계 분수 기차 줄 세우기
  if (button.dataset.trainDenom !== undefined) {
    const denom = Number(button.dataset.trainDenom);
    const tPool = currentTrainPool();
    const sorted = [...tPool].sort((a, b) => a - b);
    if (!trainOrder.includes(denom) && trainOrder.length < tPool.length) {
      trainOrder = [...trainOrder, denom];
      if (trainOrder.length === 3 && trainOrder[0] === sorted[0] && trainOrder[1] === sorted[1] && trainOrder[2] === sorted[2]) {
        playSound('fanfare');
      } else {
        playSound('click');
      }
      render();
    }
    return;
  }

  // 4단계 단어 카드 규칙 퀴즈 선택
  if (button.dataset.ruleChoice) {
    const picked = button.dataset.ruleChoice as RuleChoice;
    ruleChoice = picked;
    notebookBlankRevealed = picked === 'smaller';
    if (notebookBlankRevealed) playSound('correct');
    render();
    return;
  }

  // 4단계 친구에게 보내는 설명 편지 선택
  if (button.dataset.letterChoice) {
    friendLetterChoice = button.dataset.letterChoice as LetterChoice;
    if (friendLetterChoice === 'correct') playSound('fanfare');
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
      if (!/^(?:0|[1-9]\d*)$/.test(pollData[p]![c].trim())) pollData[p]![c] = '0';
    }
    const otherSum = CHOICES.filter(c => c !== ch).reduce((acc, c) => acc + (parseInt(pollData[p]![c], 10) || 0), 0);
    const currentVal = parseInt(pollData[p]![ch], 10) || 0;
    const maxForChoice = Math.max(0, MAX_PARTICIPANTS - otherSum);
    const nextVal = Math.max(0, Math.min(maxForChoice, currentVal + delta));
    pollData[p]![ch] = String(nextVal);
    const totalNow = otherSum + nextVal;
    const parsedN = parseParticipants(participantsRaw);
    if (!parsedN || totalNow > parsedN) {
      participantsRaw = String(Math.max(1, Math.min(MAX_PARTICIPANTS, totalNow)));
    }
    classPollOpen[p] = true;
    render();
    return;
  }

  // 4지선다 보기 1클릭 선택
  if (button.dataset.pickPoll && button.dataset.pickChoice) {
    const poll = button.dataset.pickPoll as Poll;
    const ch = button.dataset.pickChoice as Choice;
    myChoices[poll] = ch;
    error = '';
    playSound(poll !== 'first' && ch === correctChoiceForPoll(poll) ? 'correct' : 'click');
    render();
    return;
  }

  // 생각 이유 말풍선 선택
  if (button.dataset.reason !== undefined) {
    reasonSelected = button.dataset.reason;
    aiLinkedCardTitle = '';
    playSound('click');
    render();
    return;
  }

  const action = button.dataset.action;

  if (action === 'random-unit') {
    const pair = RANDOM_PAIR_POOL[randomPairIdx % RANDOM_PAIR_POOL.length];
    randomPairIdx++;
    resetSession(true, true);
    customPair = pair;
    exploreBaseDenominator = pair[0];
    exploreDenominator = pair[1];
    playSound('click');
    render();
  } else if (action === 'toggle-qr-modal') {
    qrModalOpen = !qrModalOpen;
    copyStatus = 'idle';
    copyRequest++;
    playSound('click');
    render();
  } else if (action === 'copy-share-url') {
    if (copyStatus === 'copying') return;
    const url = currentShareUrl();
    const request = ++copyRequest;
    copyStatus = 'copying';
    render();
    const copied = await copyLessonUrl(url, navigator.clipboard);
    // Ignore a late clipboard response after closing, resetting, or changing units.
    if (request !== copyRequest || !qrModalOpen || url !== currentShareUrl()) return;
    copyStatus = copied ? 'copied' : 'failed';
    if (copied) playSound('correct');
    render();
  } else if (action === 'toggle-duel-battle') {
    duelBattleMode = !duelBattleMode;
    if (duelBattleMode && duelRounds.length < 4) {
      duelRounds = [...duelRounds, { ...EXTRA_BATTLE_ROUND }];
    } else if (!duelBattleMode && duelRounds.length > 3) {
      duelRounds = duelRounds.slice(0, 3);
    }
    battleScores = [
      duelRounds.filter(item => item.id % 2 === 0 && duelPicks[item.id] === item.answer).length,
      duelRounds.filter(item => item.id % 2 === 1 && duelPicks[item.id] === item.answer).length,
    ];
    playSound('click');
    render();
  } else if (action === 'speak-story') {
    ttsSpoken = true;
    playSound('click');
    try {
      const [fA, fB] = activeDenominators().first;
      const plain = storyLeadForCurrent(fA, fB).replace(/<[^>]+>/g, '');
      if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(plain);
        u.lang = 'ko-KR';
        window.speechSynthesis.speak(u);
      }
    } catch {
      // 음성 합성 미지원 환경 무시
    }
    render();
  } else if (action === 'toggle-model') {
    visualModel = visualModel === 'circle' ? 'bar' : 'circle';
    render();
  } else if (action === 'toggle-spoiler') {
    spoilerPreview = !spoilerPreview;
    render();
  } else if (action === 'toggle-pattern') {
    patternMode = !patternMode;
    playSound('click');
    render();
  } else if (action === 'toggle-fair-cut') {
    fairCutAligned = !fairCutAligned;
    playSound(fairCutAligned ? 'correct' : 'click');
    render();
  } else if (action === 'flag-all') {
    pinnedFlags = [...FLAG_DENOMS];
    playSound('fanfare');
    render();
  } else if (action === 'flag-reset') {
    pinnedFlags = [2, 4];
    playSound('click');
    render();
  } else if (action === 'talk-bell') {
    if (talkSecondsLeft > 0) {
      stopTalkCountdown();
      playSound('click');
      render();
    } else {
      stopTalkCountdown();
      talkFinished = false;
      talkSecondsLeft = talkDuration();
      playSound('click');
      render();
      talkInterval = setInterval(() => {
        talkSecondsLeft = Math.max(0, talkSecondsLeft - 1);
        const bellBtn = app.querySelector<HTMLButtonElement>('#talk-bell-btn');
        if (bellBtn) {
          bellBtn.textContent = talkSecondsLeft > 0 ? `🔔 짝 토론 (${talkSecondsLeft}초)` : '🔔 토론 종료!';
          bellBtn.setAttribute('aria-pressed', String(talkSecondsLeft > 0));
          bellBtn.classList.toggle('talk-bell-done', talkSecondsLeft <= 0);
        }
        if (talkSecondsLeft <= 0) {
          stopTalkCountdown();
          talkFinished = true;
          playSound('fanfare');
        }
      }, 1000);
    }
  } else if (action === 'cycle-talk-duration') {
    talkDurationIdx = (talkDurationIdx + 1) % TALK_DURATIONS.length;
    if (talkSecondsLeft > 0) stopTalkCountdown();
    talkFinished = false;
    playSound('click');
    render();
  } else if (action === 'pick-group') {
    pickedGroup = ((pickedGroup ?? 0) % 6) + 1;
    playSound('click');
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
  } else if (action === 'toggle-reallife') {
    showRealLife = !showRealLife;
    render();
  } else if (action === 'toggle-poll-blind') {
    pollBlind = !pollBlind;
    const p = (button.dataset.targetPoll || 'first') as Poll;
    classPollOpen[p] = true;
    render();
  } else if (action === 'base-less' || action === 'base-more') {
    exploreBaseDenominator = Math.max(
      DENOMINATOR_MIN,
      Math.min(DENOMINATOR_MAX, exploreBaseDenominator + (action === 'base-more' ? 1 : -1)),
    );
    exploreMoved = true;
    updateExploreSliderDOM();
  } else if (action === 'less' || action === 'more') {
    exploreDenominator = Math.max(
      DENOMINATOR_MIN,
      Math.min(DENOMINATOR_MAX, exploreDenominator + (action === 'more' ? 1 : -1)),
    );
    filledPieces = 1;
    exploreMoved = true;
    updateExploreSliderDOM();
  } else if (action === 'fill-piece-add') {
    filledPieces = Math.min(exploreDenominator, filledPieces + 1);
    if (filledPieces === exploreDenominator) playSound('fanfare');
    else playSound('click');
    const fillWholeEl = app.querySelector<HTMLElement>('#fill-whole-box');
    if (fillWholeEl) fillWholeEl.innerHTML = renderFillWholeContent();
    syncExploreCompletionDOM();
  } else if (action === 'fill-piece-full') {
    filledPieces = exploreDenominator;
    playSound('fanfare');
    const fillWholeEl = app.querySelector<HTMLElement>('#fill-whole-box');
    if (fillWholeEl) fillWholeEl.innerHTML = renderFillWholeContent();
    syncExploreCompletionDOM();
  } else if (action === 'fill-piece-reset') {
    filledPieces = 1;
    const fillWholeEl = app.querySelector<HTMLElement>('#fill-whole-box');
    if (fillWholeEl) fillWholeEl.innerHTML = renderFillWholeContent();
    syncExploreCompletionDOM();
  } else if (action === 'duel-shuffle') {
    duelShuffleCount++;
    const pool = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const roundIds = duelBattleMode ? [0, 1, 2, 3] : [0, 1, 2];
    duelRounds = roundIds.map(id => {
      const i1 = (id * 3 + duelShuffleCount * 2 + duelStreak) % pool.length;
      const i2 = (i1 + id + (duelShuffleCount % 4) + 2) % pool.length;
      const leftDenom = pool[i1];
      const rightDenom = pool[i2] === leftDenom ? pool[(i2 + 1) % pool.length] : pool[i2];
      return {
        id,
        leftDenom,
        rightDenom,
        answer: leftDenom < rightDenom ? 'left' : 'right',
      };
    });
    duelPicks = { 0: null, 1: null, 2: null, 3: null };
    battleScores = [0, 0];
    playSound('click');
    render();
  } else if (action === 'puzzle-shuffle') {
    puzzleSetIdx = (puzzleSetIdx + 1) % TRAIN_POOLS.length;
    trainOrder = [];
    mysteryDenomPick = null;
    playSound('click');
    render();
  } else if (action === 'train-reset') {
    trainOrder = [];
    render();
  } else if (action === 'toggle-notebook-blank') {
    notebookBlankRevealed = true;
    render();
  } else if (action === 'fill-zeros') {
    const p = (button.dataset.targetPoll || 'first') as Poll;
    pollData[p] ??= emptyCounts();
    for (const ch of CHOICES) {
      if (!/^(?:0|[1-9]\d*)$/.test(pollData[p]![ch].trim())) pollData[p]![ch] = '0';
    }
    classPollOpen[p] = true;
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
    classPollOpen[p] = true;
    render();
  } else if (action === 'next') {
    const idx = order.indexOf(phase);
    if (idx < order.length - 1) {
      stopSpeech();
      stopTalkCountdown();
      phase = order[idx + 1];
      error = '';
      render(true);
    }
  } else if (action === 'back') {
    const idx = order.indexOf(phase);
    if (idx > 0) {
      stopSpeech();
      stopTalkCountdown();
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
try {
  const urlParams = new URLSearchParams(window.location.search);
  const qTopic = urlParams.get('topic') || urlParams.get('unit');
  if (qTopic === '1' || qTopic === 'M01') selectedUnitId = 'M01';
  else if (qTopic === '2' || qTopic === 'M02') selectedUnitId = 'M02';
  else if (qTopic === '3' || qTopic === 'M03') selectedUnitId = 'M03';
  const qPair = urlParams.get('pair');
  if (qPair) {
    const [pA, pB] = qPair.split('-').map(Number);
    if (Number.isInteger(pA) && Number.isInteger(pB) && pA >= DENOMINATOR_MIN && pB <= DENOMINATOR_MAX && pA < pB) {
      customPair = [pA, pB];
    }
  }
  if (urlParams.get('scale') === 'large') {
    document.documentElement.setAttribute('data-scale', 'large');
  }
} catch {
  // URL 파라미터 파싱 실패 시 무시
}
const [initA, initB] = activeDenominators().first;
exploreBaseDenominator = initA;
exploreDenominator = initB;
render();

if (aiEnabled) {
  void import('./lesson-ai-panel').then(({ createLessonAiPanel }) => {
    aiPanel = createLessonAiPanel(app, (cardId, cardTitle) => {
      const mapped = cardId === 'A' ? '0' : cardId === 'B' ? '1' : '2';
      reasonSelected = mapped;
      aiLinkedCardTitle = cardTitle;
      render();
    });
    const [fA, fB] = activeDenominators().first;
    aiPanel.sync(phase === 'think', fA, fB, selectedUnitId === 'M01' && !customPair ? '리본' : snackName());
  });
}
