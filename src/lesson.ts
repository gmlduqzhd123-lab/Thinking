import { CHOICES, FIRST_ITEM, TRANSFER_ITEM, emptyCounts, fractionSegments, parseParticipants, percentagePointChange, validateCounts, type Choice, type RawCounts } from './lesson-core';
import { DEFAULT_MINUTES, MINUTES_OPTIONS, MAX_PARTICIPANTS, TIMER_INTERVAL_MS, TIMER_EXTEND_SECONDS, DENOMINATOR_MIN, DENOMINATOR_MAX } from './constants';
import { registerUnit, getUnit, listUnits } from './unit-registry';
import m01 from './units/m01';
import m02 from './units/m02';
import './lesson.css';

// ─── 단원 레지스트리 초기 등록 (#1) ─────────────────────────────
if (listUnits().length === 0) {
  registerUnit(m01);
  registerUnit(m02);
}

// ─── 타입 ────────────────────────────────────────────────────────
type Poll = 'first' | 'again' | 'transfer';
type Phase = 'concept' | 'preview' | 'first' | 'reason' | 'inquiry' | 'summary' | 'again' | 'transfer' | 'memory' | 'end';
type VisualModel = 'bar' | 'circle';

// ─── 상수 ────────────────────────────────────────────────────────
const order: Phase[] = ['concept', 'preview', 'first', 'reason', 'inquiry', 'summary', 'again', 'transfer', 'memory', 'end'];
const phaseLabels: Record<Phase, string> = {
  concept: '개념', preview: '미리보기', first: '첫 선택', reason: '이유',
  inquiry: '탐구', summary: '정리', again: '재선택', transfer: '새 문제',
  memory: '요약', end: '종료',
};
const reasonCards = ['분모가 클수록 조각이 크다고 생각함', '전체가 같은지 확인이 필요함', '아직 이유를 말하기 어려움'] as const;

/** 이유 카드별 교사 추천 발문 가이드 (#5). */
const reasonScaffolds: Record<number, { focus: string; questions: readonly string[] }> = {
  0: {
    focus: '자연수의 크기(분모 숫자)와 단위분수 한 조각의 크기를 구분하도록 돕는 발문',
    questions: [
      '같은 리본을 3명이 똑같이 나누어 가질 때와 5명이 나누어 가질 때, 한 사람이 받는 길이는 언제 더 길까요?',
      '분모의 숫자가 커진다는 것은 한 조각이 커진다는 뜻일까요, 나눈 조각의 개수가 많아진다는 뜻일까요?',
    ],
  },
  1: {
    focus: '단위분수 크기 비교의 전제 조건인 "같은 크기의 전체"를 확인하는 발문',
    questions: [
      '만약 처음 리본 두 개의 전체 길이가 서로 다르다면 한 조각끼리 바로 비교할 수 있을까요?',
      '두 단위분수의 크기를 공정하게 비교하려면 먼저 무엇을 같게 맞추어야 할까요?',
    ],
  },
  2: {
    focus: '단위분수와 등분의 기본 의미(전체와 한 조각의 관계)를 되짚는 발문',
    questions: [
      '분수에서 가로선 아래 숫자(분모)와 위 숫자(분자 1)는 각각 무엇을 나타낼까요?',
      '색칠된 한 조각을 몇 개 모으면 처음 리본 전체 길이와 똑같아질까요?',
    ],
  },
};

// ─── DOM ─────────────────────────────────────────────────────────
const app = document.querySelector<HTMLElement>('#lesson-app')!;
const aiEnabled = app.dataset.aiEnabled === 'true';

// ─── 상태 ────────────────────────────────────────────────────────
let aiPanel: { sync(active: boolean): void; dispose(): void } | undefined;
let selectedUnitId = 'M01';
let visualModel: VisualModel = 'bar';
let showGuideLine = false;
let phase: Phase = 'concept';
let mode: 'example' | 'class' = 'example';
let participantsRaw = '';
let minutes: 10 | 20 | 40 = DEFAULT_MINUTES as 10 | 20 | 40;
let remainingSeconds = DEFAULT_MINUTES * 60;
let timerRunning = false;
let lastTick = Date.now();
let inquiryIndex = 0;
let inquiryBaseDenominator = 3;
let inquiryDenominator = 6;
let inquiryAnswerVisible = false;
let summaryVisible = false;
let transferAnswerVisible = false;
let memoryVisible = false;
let summaryCopied = false;
let pollData: Record<Poll, RawCounts | null> = { first: null, again: null, transfer: null };
let reasonSelected = '';
let aiLinkedCardTitle = '';
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

// ─── 세션 초기화 ─────────────────────────────────────────────────
function resetSession() {
  aiPanel?.dispose();
  selectedUnitId = 'M01';
  visualModel = 'bar';
  showGuideLine = false;
  phase = 'concept';
  mode = 'example';
  participantsRaw = '';
  minutes = DEFAULT_MINUTES as 10 | 20 | 40;
  remainingSeconds = DEFAULT_MINUTES * 60;
  timerRunning = false;
  inquiryIndex = 0;
  inquiryBaseDenominator = 3;
  inquiryDenominator = 6;
  inquiryAnswerVisible = false;
  summaryVisible = false;
  transferAnswerVisible = false;
  memoryVisible = false;
  summaryCopied = false;
  pollData = { first: null, again: null, transfer: null };
  reasonSelected = '';
  aiLinkedCardTitle = '';
  error = '';
  render();
}

// ─── 렌더링 컴포넌트 ────────────────────────────────────────────

/** 원형(피자/부채꼴) 분수 SVG (#2). */
function circleFraction(denominator: number, refDenominator?: number): string {
  const cx = 80;
  const cy = 80;
  const r = 60;
  const angleStep = (2 * Math.PI) / denominator;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + angleStep;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = angleStep > Math.PI ? 1 : 0;
  const sectorPath = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

  const dividers = Array.from({ length: denominator }, (_, i) => {
    const a = startAngle + i * angleStep;
    const lx = cx + r * Math.cos(a);
    const ly = cy + r * Math.sin(a);
    return `<line x1="${cx}" y1="${cy}" x2="${lx.toFixed(2)}" y2="${ly.toFixed(2)}" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.8"/>`;
  }).join('');

  let guideLine = '';
  if (showGuideLine && refDenominator) {
    const refAngle = startAngle + (2 * Math.PI) / refDenominator;
    const gx = cx + (r + 8) * Math.cos(refAngle);
    const gy = cy + (r + 8) * Math.sin(refAngle);
    guideLine = `<line class="guide-line" x1="${cx}" y1="${cy}" x2="${gx.toFixed(2)}" y2="${gy.toFixed(2)}" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="4 3"/>`;
  }

  return `<figure class="fraction fraction-circle">
    <svg viewBox="0 0 160 160" role="img"
      aria-label="같은 크기의 전체를 ${denominator}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${denominator}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <path d="${sectorPath}" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${dividers}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      ${guideLine}
    </svg>
    <figcaption>같은 전체의 1/${denominator} · ${denominator}등분 중 한 조각</figcaption>
  </figure>`;
}

/** 분수 막대/원형 SVG (#1 다크 모드 CSS 변수 연동, #2 기준선 및 원형 전환). */
function bar(denominator: number, refDenominator?: number): string {
  if (visualModel === 'circle') {
    return circleFraction(denominator, refDenominator);
  }
  const segments = fractionSegments(denominator);
  const segmentWidth = 600 / denominator;
  const dividers = segments.slice(1).map(s =>
    `<line x1="${600 * s.start}" y1="10" x2="${600 * s.start}" y2="58" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>`
  ).join('');

  const guideLine = showGuideLine && refDenominator
    ? `<line class="guide-line" x1="${(600 / refDenominator).toFixed(2)}" y1="2" x2="${(600 / refDenominator).toFixed(2)}" y2="66" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="5 3"/>`
    : '';

  return `<figure class="fraction">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${denominator}등분하고 첫 한 조각을 칠한 분수 막대, 1/${denominator}">
      <rect x="0" y="10" width="600" height="48" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="0" y="10" width="${segmentWidth}" height="48" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${dividers}
      ${guideLine}
    </svg>
    <figcaption>같은 전체의 1/${denominator} · ${denominator}등분 중 한 조각</figcaption>
  </figure>`;
}

/** 분수 비교 시각화 도구 모음 및 쌍 렌더링 (#2). */
function renderVisualPair(dA: number, dB: number): string {
  return `<div class="visual-toolbar" role="group" aria-label="분수 시각화 도구">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'circle'}">${visualModel === 'circle' ? '📏 막대 모형 보기' : '🍕 원형 모형 보기'}</button>
      <button type="button" data-action="toggle-guide" class="secondary-btn visual-btn" aria-pressed="${showGuideLine}">${showGuideLine ? '📐 비교 기준선 숨기기' : '📐 비교 기준선 보기'}</button>
    </div>
    <div class="bar-pair">${bar(dA, dA)}${bar(dB, dA)}</div>`;
}

/** 집계 입력 상태 안내 문구 생성 (#5). */
function formatPollNote(counts: RawCounts | null, participants: number | null): string {
  if (!counts || participants === null) {
    return '집계를 입력하려면 네 칸 모두 0 이상의 정수를 입력하세요. 미응답은 참여 인원에서 집계 합계를 뺀 값입니다.';
  }

  const checked = validateCounts(counts, participants);
  if (checked) {
    return `모르겠다 ${checked.counts.D}명 · 미응답 ${checked.noResponse}명`;
  }

  const emptyChoices = CHOICES.filter(choice => counts[choice].trim() === '');
  const filledChoices = CHOICES.filter(choice => counts[choice].trim() !== '');

  const hasInvalidFilled = filledChoices.some(choice => !/^(?:0|[1-9]\d*)$/.test(counts[choice]));
  if (hasInvalidFilled) {
    return '네 칸 모두 0 이상의 정수를 입력하고 합계가 참여 인원을 넘지 않게 해 주세요.';
  }

  const partialSum = filledChoices.reduce((sum, choice) => sum + Number(counts[choice]), 0);
  if (partialSum > participants) {
    return `입력 합계(${partialSum}명)가 참여 인원(${participants}명)을 초과했습니다. 네 칸 모두 0 이상의 정수를 입력하고 합계가 참여 인원을 넘지 않게 해 주세요.`;
  }

  if (emptyChoices.length > 0 && filledChoices.length > 0) {
    return `입력 중: 현재 합계 ${partialSum}/${participants}명 · 남은 인원 ${participants - partialSum}명 (미입력: ${emptyChoices.join(', ')})`;
  }

  return '집계를 입력하려면 네 칸 모두 0 이상의 정수를 입력하세요. 미응답은 참여 인원에서 집계 합계를 뺀 값입니다.';
}

function getPollItemMeta(poll: Poll) {
  if (selectedUnitId === 'M01') {
    return poll === 'transfer' ? TRANSFER_ITEM : FIRST_ITEM;
  }
  return {
    id: poll === 'transfer' ? `${selectedUnitId}-UF-02` : `${selectedUnitId}-UF-01`,
    version: 1,
  };
}

/** 투표 템플릿 (#5 빈 칸 0 채우기, #8 가상 연습 샘플 채우기 포함). */
function pollTemplate(poll: Poll, denominatorA: number, denominatorB: number): string {
  const item = getPollItemMeta(poll);
  const labels = [`A. 1/${denominatorA}이 더 크다`, `B. 1/${denominatorB}이 더 크다`, 'C. 두 조각이 같다', 'D. 모르겠다'];
  const counts = pollData[poll];
  const n = parseParticipants(participantsRaw);

  const choiceInputs = CHOICES.map((choice, i) =>
    `<label>${labels[i]} <input data-count="${choice}" inputmode="numeric" type="text" aria-label="${choice} 선택 인원" autocomplete="off"></label>`
  ).join('');

  const noteText = formatPollNote(counts, n);
  const sampleBtn = mode === 'example'
    ? `<button type="button" data-action="fill-sample" class="secondary-btn">가상 샘플 집계 채우기</button>`
    : '';

  return `
    <p class="item-id">문항 ID ${item.id} · 버전 ${item.version}</p>
    <p>길이가 같은 두 리본에서 한 조각의 길이를 비교합니다. 어느 쪽이 더 클까요?</p>
    ${renderVisualPair(denominatorA, denominatorB)}
    <ol class="choices">${labels.map(label => `<li>${label}</li>`).join('')}</ol>
    <p>교사가 손들기·카드·말하기로 선택을 확인합니다. 개인별 응답은 입력하지 않습니다.</p>
    <fieldset>
      <legend>집계 입력 · 선택 사항</legend>
      ${choiceInputs}
      <div class="poll-helpers">
        <button type="button" data-action="fill-zeros" class="secondary-btn">빈 칸 0으로 채우기</button>
        ${sampleBtn}
      </div>
      <p id="poll-note" role="status">${noteText}</p>
    </fieldset>
    <div class="actions">
      <button data-action="record">집계 확인 후 계속</button>
      <button data-action="skip">집계 생략하고 계속</button>
    </div>`;
}

/** 이유 카드 추천 발문 가이드 렌더링 (#5). */
function renderReasonScaffold(): string {
  if (reasonSelected === '') return '';
  const idx = Number(reasonSelected);
  const scaffold = reasonScaffolds[idx];
  if (!scaffold) return '';
  const aiBadge = aiLinkedCardTitle
    ? `<p class="ai-linked-badge">🔗 로컬 AI 후보 카드 연결됨: <strong>${aiLinkedCardTitle}</strong></p>`
    : '';

  return `<div class="scaffold-guide" role="region" aria-label="교사 추천 발문 가이드">
    <h3>💡 교사 추천 발문 가이드</h3>
    ${aiBadge}
    <p class="scaffold-focus">${scaffold.focus}</p>
    <ul>
      ${scaffold.questions.map(q => `<li>"${q}"</li>`).join('')}
    </ul>
  </div>`;
}

/** 탐구 단계 템플릿 (#3 양방향 분모 조절 및 실시간 부등호 비교). */
function inquiryTemplate(): string {
  const [firstA, firstB] = currentUnit().denominators.first;
  const data = [
    { title: '탐구 1 · 같은 전체', prompt: `같은 길이의 전체를 ${firstA}등분, ${firstB}등분하면 한 조각은 어떻게 달라질까요?`, a: firstA, b: firstB, answer: `전체 길이가 같다면 ${firstA}등분한 한 조각이 ${firstB}등분한 한 조각보다 깁니다.` },
    { title: '탐구 2 · 더 많이 나누기', prompt: '한 전체를 4등분한 조각과 8등분한 조각을 살펴보세요.', a: 4, b: 8, answer: '같은 전체를 더 많이 나눌수록 한 조각은 작아집니다.' },
    { title: '탐구 3 · 직접 조절', prompt: '버튼으로 두 막대의 등분 수를 2~12 사이에서 바꿔 보세요.', a: inquiryBaseDenominator, b: inquiryDenominator, answer: '두 막대의 전체 길이를 같게 둔 뒤 한 조각의 길이를 비교합니다.' },
  ][inquiryIndex];

  const cmpSymbol = data.a < data.b ? '>' : data.a > data.b ? '<' : '=';
  const cmpDesc = data.a < data.b
    ? `${data.a}등분 한 조각이 더 큽니다`
    : data.a > data.b
      ? `${data.b}등분 한 조각이 더 큽니다`
      : '두 조각의 크기가 같습니다';
  const cmpBadge = `<p class="comparison-badge" aria-live="polite">크기 비교: <strong>1/${data.a} ${cmpSymbol} 1/${data.b}</strong> (${cmpDesc})</p>`;

  const controls = inquiryIndex === 2
    ? `<div class="actions inquiry-controls">
        <span class="control-group">
          <button type="button" data-action="base-less" class="secondary-btn" ${inquiryBaseDenominator <= DENOMINATOR_MIN ? 'disabled' : ''} aria-label="기준 분모 줄이기">기준 −</button>
          <span class="base-denom-label">기준 ${inquiryBaseDenominator}등분</span>
          <button type="button" data-action="base-more" class="secondary-btn" ${inquiryBaseDenominator >= DENOMINATOR_MAX ? 'disabled' : ''} aria-label="기준 분모 늘리기">기준 ＋</button>
        </span>
        <span class="control-group">
          <button data-action="less" ${inquiryDenominator <= DENOMINATOR_MIN ? 'disabled' : ''} aria-label="등분 수 줄이기">−</button>
          <output aria-live="polite">${inquiryDenominator}등분</output>
          <button data-action="more" ${inquiryDenominator >= DENOMINATOR_MAX ? 'disabled' : ''} aria-label="등분 수 늘리기">＋</button>
        </span>
      </div>`
    : '';

  return `
    <h2 tabindex="-1">${data.title}</h2>
    <p>${data.prompt}</p>
    ${renderVisualPair(data.a, data.b)}
    ${cmpBadge}
    ${controls}
    <button data-action="reveal-inquiry" ${inquiryAnswerVisible ? 'disabled' : ''}>교사가 설명 공개</button>
    <p id="answer" class="answer" ${inquiryAnswerVisible ? '' : 'hidden'}>${data.answer}</p>
    <div class="actions">
      <button data-action="inquiry-next">${inquiryIndex === 2 ? '개념 정리로' : '다음 탐구로'}</button>
    </div>`;
}

// ─── 집계 차트 및 오개념 이동 분석 (#6, #7) ─────────────────────

function renderPollChart(title: string, data: Record<Choice, number>, n: number, dA: number, dB: number): string {
  const labels = [`A. 1/${dA}`, `B. 1/${dB}`, 'C. 같다', 'D. 모름'];
  return `<div class="poll-chart">
    <h4>${title}</h4>
    ${CHOICES.map((choice, i) => {
      const count = data[choice];
      const pct = n > 0 ? (count / n * 100) : 0;
      const isCorrect = choice === 'A';
      return `<div class="chart-row ${isCorrect ? 'chart-row-correct' : ''}">
        <span class="chart-label">${labels[i]}${isCorrect ? ' ★' : ''}</span>
        <div class="chart-track"><div class="chart-fill ${isCorrect ? 'chart-fill-correct' : ''}" style="width: ${pct.toFixed(0)}%"></div></div>
        <span class="chart-count">${count}명 (${pct.toFixed(0)}%)</span>
      </div>`;
    }).join('')}
  </div>`;
}

function renderPollComparison(): string {
  const n = parseParticipants(participantsRaw);
  if (!n) return '';
  const [fA, fB] = currentUnit().denominators.first;
  const [tA, tB] = currentUnit().denominators.transfer;
  const first = pollData.first && validateCounts(pollData.first, n);
  const again = pollData.again && validateCounts(pollData.again, n);
  const transfer = pollData.transfer && validateCounts(pollData.transfer, n);
  if (!first && !again && !transfer) return '';

  let html = '<div class="poll-comparison">';
  if (first) html += renderPollChart(`첫 선택 (1/${fA} vs 1/${fB})`, first.counts, n, fA, fB);
  if (again) html += renderPollChart(`재선택 (1/${fA} vs 1/${fB})`, again.counts, n, fA, fB);
  if (transfer) html += renderPollChart(`새로운 문제 (1/${tA} vs 1/${tB})`, transfer.counts, n, tA, tB);
  html += '</div>';
  return html;
}

/** 첫 선택 대비 재선택의 선택지별 증감(%p) 분석표 (#7). */
function renderMisconceptionShift(): string {
  const n = parseParticipants(participantsRaw);
  if (!n) return '';
  const first = pollData.first && validateCounts(pollData.first, n);
  const again = pollData.again && validateCounts(pollData.again, n);
  if (!first || !again) return '';

  const [fA, fB] = currentUnit().denominators.first;
  const rows = [
    { label: `A. 1/${fA}이 더 크다 (정답)`, before: first.counts.A, after: again.counts.A },
    { label: `B. 1/${fB}이 더 크다 (분모 비례 오개념)`, before: first.counts.B, after: again.counts.B },
    { label: 'C. 두 조각이 같다', before: first.counts.C, after: again.counts.C },
    { label: 'D. 모르겠다', before: first.counts.D, after: again.counts.D },
    { label: '미응답', before: first.noResponse, after: again.noResponse },
  ];

  return `<div class="shift-analysis" role="region" aria-label="집단 응답 변화 분석표">
    <h4>집단 응답 이동 분석 (첫 선택 → 재선택)</h4>
    <table class="shift-table">
      <thead>
        <tr>
          <th>항목</th>
          <th>첫 선택</th>
          <th>재선택</th>
          <th>변화폭 (%p)</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => {
          const delta = percentagePointChange(r.before, r.after, n);
          const sign = delta > 0 ? '+' : '';
          return `<tr>
            <td>${r.label}</td>
            <td>${r.before}명</td>
            <td>${r.after}명</td>
            <td><strong>${sign}${delta.toFixed(1)}%p</strong></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

// ─── JSON / CSV 내보내기 및 요약 복사 (#7) ──────────────────────

function buildExportData() {
  const n = parseParticipants(participantsRaw)!;
  const first = pollData.first && validateCounts(pollData.first, n);
  const again = pollData.again && validateCounts(pollData.again, n);
  const transfer = pollData.transfer && validateCounts(pollData.transfer, n);

  return {
    unit: selectedUnitId,
    date: new Date().toISOString().slice(0, 10),
    participants: n,
    mode,
    firstPoll: first ? { ...first.counts, noResponse: first.noResponse } : null,
    againPoll: again ? { ...again.counts, noResponse: again.noResponse } : null,
    transferPoll: transfer ? { ...transfer.counts, noResponse: transfer.noResponse } : null,
    reasonCard: reasonSelected ? reasonCards[Number(reasonSelected)] : null,
    aiLinkedCard: aiLinkedCardTitle || null,
    changeA_pp: first && again ? Number(percentagePointChange(first.counts.A, again.counts.A, n).toFixed(1)) : null,
    changeB_pp: first && again ? Number(percentagePointChange(first.counts.B, again.counts.B, n).toFixed(1)) : null,
  };
}

function downloadJSON() {
  const data = buildExportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lesson-${data.unit}-${data.date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildCSVContent(): string {
  const data = buildExportData();
  const lines = [
    '단원,날짜,모드,참여인원,단계,A(정답),B(오개념),C(같다),D(모름),미응답',
  ];
  const addPollRow = (label: string, poll: { A: number; B: number; C: number; D: number; noResponse: number } | null) => {
    if (!poll) {
      lines.push(`${data.unit},${data.date},${data.mode},${data.participants},${label},생략,생략,생략,생략,생략`);
    } else {
      lines.push(`${data.unit},${data.date},${data.mode},${data.participants},${label},${poll.A},${poll.B},${poll.C},${poll.D},${poll.noResponse}`);
    }
  };
  addPollRow('첫선택', data.firstPoll);
  addPollRow('재선택', data.againPoll);
  addPollRow('새로운문제', data.transferPoll);
  return '\uFEFF' + lines.join('\r\n');
}

function downloadCSV() {
  const data = buildExportData();
  const blob = new Blob([buildCSVContent()], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lesson-${data.unit}-${data.date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── 메모리 요약 ─────────────────────────────────────────────────

function memoryText(): string {
  const n = parseParticipants(participantsRaw)!;
  const [fA] = currentUnit().denominators.first;
  const [tA] = currentUnit().denominators.transfer;
  const firstItem = getPollItemMeta('first');
  const transferItem = getPollItemMeta('transfer');
  const first = pollData.first && validateCounts(pollData.first, n);
  const again = pollData.again && validateCounts(pollData.again, n);
  const transfer = pollData.transfer && validateCounts(pollData.transfer, n);

  const parts = ['같은 전체의 단위분수는 더 많이 나눌수록 한 조각이 작아진다는 점을 탐구했습니다.'];

  const aiNote = aiLinkedCardTitle ? ` (AI 후보 카드 '${aiLinkedCardTitle}' 검토 연결)` : '';
  parts.push(reasonSelected
    ? `교사가 선택해 탐구한 이유 카드: ${reasonCards[Number(reasonSelected)]}${aiNote}. 이는 수업에서 고른 탐구 주제이며 학생 개개인의 생각으로 확정하지 않습니다.`
    : '교사가 선택한 이유 카드는 없습니다.');

  if (first && again) {
    const change = percentagePointChange(first.counts.A, again.counts.A, n);
    parts.push(`같은 문항 ${firstItem.id} v${firstItem.version}에서 1/${fA}을 고른 집계는 ${first.counts.A}/${n}명에서 ${again.counts.A}/${n}명으로 바뀌었습니다 (${change >= 0 ? '+' : ''}${change.toFixed(1)}%p). 이는 집단 집계의 차이이며 개인별 성장으로 해석하지 않습니다.`);
  } else {
    parts.push('첫 선택 또는 재선택의 집계를 생략해 변화 수치를 계산하지 않았습니다.');
  }

  if (transfer) {
    parts.push(`새 문항 ${transferItem.id} v${transferItem.version}의 집계: 1/${tA} 선택 ${transfer.counts.A}명, 모르겠다 ${transfer.counts.D}명, 미응답 ${transfer.noResponse}명.`);
  } else {
    parts.push(`새 문항 ${transferItem.id} v${transferItem.version}의 집계를 생략했습니다.`);
  }

  return parts.join(' ');
}

/** 현재 phase에 맞는 본문. */
function body(): string {
  const unit = currentUnit();
  const [firstA, firstB] = unit.denominators.first;
  const [transferA, transferB] = unit.denominators.transfer;

  switch (phase) {
    case 'concept':
      return `<h2 tabindex="-1">개념 선택</h2>
        <fieldset class="unit-selector">
          <legend>단원 선택</legend>
          ${listUnits().map(u =>
            `<label><input type="radio" name="unit" value="${u.id}" ${selectedUnitId === u.id ? 'checked' : ''}> ${u.id} · ${u.title}</label>`
          ).join('')}
        </fieldset>
        <p>${unit.id} ${unit.title} · ${unit.description}</p>
        <button data-action="next">${unit.id} 미리보기</button>`;

    case 'preview':
      return `<h2 tabindex="-1">수업 미리보기</h2>
        <p>첫 선택 → 이유 카드 → 기본 탐구 3개 → 개념 정리 → 같은 문항 재선택 → 새로운 문제 → 메모리 요약 → 종료</p>
        <fieldset>
          <legend>진행 모드</legend>
          <label><input type="radio" name="mode" value="example" ${mode === 'example' ? 'checked' : ''}> 가상 연습</label>
          <label><input type="radio" name="mode" value="class" ${mode === 'class' ? 'checked' : ''}> 실제 수업 입력</label>
        </fieldset>
        <label>참여 인원 1~${MAX_PARTICIPANTS}명 <input id="participants" type="text" inputmode="numeric" autocomplete="off"></label>
        <fieldset>
          <legend>수업 시간</legend>
          ${MINUTES_OPTIONS.map(value =>
            `<label><input type="radio" name="minutes" value="${value}" ${minutes === value ? 'checked' : ''}> ${value}분</label>`
          ).join('')}
        </fieldset>
        <p>가상 예시 10/20→15/20은 25%p 차이입니다. 이 수치는 실제 수업 집계에 자동 입력되지 않습니다.</p>
        <button data-action="next">첫 선택으로</button>`;

    case 'first':
      return `<h2 tabindex="-1">첫 선택</h2>${pollTemplate('first', firstA, firstB)}`;

    case 'reason':
      return `<h2 tabindex="-1">이유 카드</h2>
        <p>학생의 말을 듣고 다음 중 탐구할 이유를 교사가 고릅니다. 이름이나 발언 원문은 기록하지 않습니다.</p>
        <div class="actions">
          ${reasonCards.map((label, i) =>
            `<button data-reason="${i}" aria-pressed="${reasonSelected === String(i)}">${label}</button>`
          ).join('')}
        </div>
        <div id="scaffold-container">${renderReasonScaffold()}</div>
        <p>선택한 이유 카드는 요약에만 반영되며 브라우저 저장소에는 남기지 않습니다.</p>
        <button data-action="next">기본 탐구 시작</button>`;

    case 'inquiry':
      return inquiryTemplate();

    case 'summary':
      return `<h2 tabindex="-1">개념 정리</h2>
        <p>학생 설명을 먼저 들은 뒤 교사가 정리를 공개합니다.</p>
        <button data-action="summary-reveal">교사가 개념 정리 공개</button>
        ${summaryVisible
          ? `<p class="answer">같은 전체에서 1/${firstA}은 1/${firstB}보다 큽니다. 전체를 같은 크기로 더 많이 나누면 한 조각은 작아집니다.</p>
             <button data-action="next">같은 문항 다시 선택</button>`
          : ''}`;

    case 'again': {
      const n = parseParticipants(participantsRaw)!;
      const first = pollData.first && validateCounts(pollData.first, n);
      const again = pollData.again && validateCounts(pollData.again, n);
      const comparison = first && again
        ? `<p class="comparison">1/${firstA} 선택 집계 ${first.counts.A}/${n} → ${again.counts.A}/${n}, ${percentagePointChange(first.counts.A, again.counts.A, n).toFixed(1)}%p 차이. 개인별 성장으로 해석하지 않습니다.</p>`
        : '';
      return `<h2 tabindex="-1">다시 선택 · 첫 선택과 동일한 문항</h2>
        ${pollTemplate('again', firstA, firstB)}${comparison}`;
    }

    case 'transfer':
      return `<h2 tabindex="-1">새로운 문제</h2>
        <p>이 문항은 첫 선택·재선택 문항과 별개입니다.</p>
        ${pollTemplate('transfer', transferA, transferB)}
        <button data-action="transfer-reveal">교사가 새 문제 설명 공개</button>
        <p class="answer" ${transferAnswerVisible ? '' : 'hidden'}>같은 전체라면 1/${transferA}이 1/${transferB}보다 큽니다.</p>`;

    case 'memory':
      return `<h2 tabindex="-1">메모리 요약</h2>
        <p>선택한 이유 카드와 집단 집계만 요약하며 학생별 변화는 추론하지 않습니다.</p>
        <button data-action="memory-generate">요약 만들기</button>
        ${memoryVisible ? `
          <p class="memory">${memoryText()}</p>
          ${renderPollComparison()}
          ${renderMisconceptionShift()}
          <div class="actions">
            <button data-action="export-json">집계 JSON 다운로드</button>
            <button type="button" data-action="export-csv" class="secondary-btn">집계 CSV 다운로드</button>
            <button type="button" data-action="copy-summary" class="secondary-btn">${summaryCopied ? '✓ 요약 복사 완료' : '요약 텍스트 복사'}</button>
          </div>
        ` : ''}
        <button data-action="finish">종료하고 입력 지우기</button>`;

    case 'end':
      return `<h2 tabindex="-1">종료</h2>
        <p>이 수업의 입력과 집계는 메모리에서 지웠습니다.</p>
        <button data-action="restart">새 수업 시작</button>`;
  }
}

/** 타이머 표시. */
function timerText(): string {
  const seconds = Math.ceil(remainingSeconds);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── 스텝 인디케이터 (#7 완료 단계 클릭 이동 & 탐구 진행도) ──────

function renderStepIndicator(): string {
  const currentIndex = order.indexOf(phase);
  return `<div class="step-indicator" aria-label="수업 진행 단계">
    ${order.map((p, i) => {
      const isDone = i < currentIndex;
      const isCurrent = i === currentIndex;
      const cls = isDone ? 'step-dot done' : isCurrent ? 'step-dot current' : 'step-dot';
      const label = phaseLabels[p];
      const interactiveAttrs = isDone
        ? `data-step-index="${i}" role="button" tabindex="0"`
        : '';
      return `<span class="${cls}" ${interactiveAttrs} aria-label="${label} ${isDone ? '완료 (클릭하여 이동)' : isCurrent ? '진행 중' : ''}" title="${label}">${i + 1}</span>`;
    }).join('')}
  </div>`;
}

// ─── 레이아웃 렌더링 (#1 다크모드 아이콘 유지, #8 큰 글씨 모드) ──

function renderPageHeader(): string {
  const dark = isDarkTheme();
  const large = isLargeScale();
  return `<header>
    <p class="eyebrow">${aiEnabled ? 'M2' : 'M1'} 개발판 · 교사 검수 미완료 콘텐츠</p>
    <h1>생각의 갈림길 AI</h1>
    <p>정답을 알려 주는 AI가 아니라, 생각을 바꾸는 탐구를 돕는 AI</p>
    <div class="header-controls">
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${large}" type="button">${large ? '🔍 기본' : '🔍 큰글씨'}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${dark}" type="button">${dark ? '☀️' : '🌙'}</button>
    </div>
  </header>`;
}

function renderPageNotice(): string {
  const aiNote = aiEnabled
    ? 'AI 후보는 교사가 별도로 검토·승인해야 하며 검수 완료 자료가 아닙니다.'
    : '이 화면은 기본 수업이며 AI 추천을 실행하지 않습니다.';
  return `<aside class="notice" role="note">
    <strong>개발 전용 초안 · 실제 수업 승인 전</strong>
    <p>학생 개인정보를 입력하지 마세요. ${aiNote}</p>
  </aside>`;
}

function renderProgressNav(): string {
  const backButton = phase !== 'concept' && phase !== 'end'
    ? '<button data-action="back">이전 단계</button>'
    : '';
  const currentPhaseLabel = phase === 'inquiry'
    ? `${phaseLabels[phase]} (${inquiryIndex + 1}/3)`
    : phaseLabels[phase];
  return `<nav aria-label="수업 진행">
    ${renderStepIndicator()}
    <span class="phase-badge" aria-live="polite">현재: ${currentPhaseLabel} · ${mode === 'example' ? '가상 연습' : '실제 수업 입력'}</span>
    ${backButton}
  </nav>`;
}

function renderTimer(): string {
  if (phase === 'concept' || phase === 'end') return '';
  const isLow = remainingSeconds <= 60 && remainingSeconds > 0;
  return `<section class="timer ${isLow ? 'timer-warning' : ''}">
    <strong>수업 타이머 <output id="timer-output">${timerText()}</output></strong>
    <button data-action="timer-toggle">${timerRunning ? '정지' : '시작'}</button>
    <button data-action="timer-extend">5분 연장</button>
    <button data-action="timer-reset" class="secondary-btn">시간 초기화</button>
  </section>`;
}

function render(focus = false) {
  const currentLabel = phaseLabels[phase];
  app.innerHTML = [
    renderPageHeader(),
    renderPageNotice(),
    renderProgressNav(),
    renderTimer(),
    `<section id="step" role="region" aria-label="${currentLabel}">${body()}<p id="error" role="alert">${error}</p></section>`,
    `<div id="step-announce" class="sr-only" aria-live="assertive" role="status"></div>`,
    '<footer>수업 입력은 이 탭의 메모리에서만 사용합니다. 자동 저장·전송·인쇄하지 않습니다. <span class="shortcut-hint">(단축키: Alt+←/→ 단계 이동 · Alt+T 타이머)</span></footer>',
  ].join('');

  // 값 복원
  const p = app.querySelector<HTMLInputElement>('#participants');
  if (p) p.value = participantsRaw;

  const poll: Poll | null = phase === 'first' ? 'first' : phase === 'again' ? 'again' : phase === 'transfer' ? 'transfer' : null;
  if (poll && pollData[poll]) {
    for (const choice of CHOICES) {
      app.querySelector<HTMLInputElement>(`[data-count="${choice}"]`)!.value = pollData[poll]![choice];
    }
  }

  aiPanel?.sync(phase === 'reason');
  if (focus) {
    app.querySelector<HTMLElement>('#step h2')?.focus();
    const announce = app.querySelector('#step-announce');
    if (announce) announce.textContent = `${phaseLabels[phase]} 단계로 이동했습니다.`;
  }
}

// ─── 네비게이션 ──────────────────────────────────────────────────
function activePoll(): Poll | null {
  return phase === 'first' ? 'first' : phase === 'again' ? 'again' : phase === 'transfer' ? 'transfer' : null;
}

function next() {
  phase = order[order.indexOf(phase) + 1];
  inquiryAnswerVisible = false;
  error = '';
  render(true);
}

function continuePoll(record: boolean) {
  const poll = activePoll()!;
  if (record) {
    const n = parseParticipants(participantsRaw)!;
    const raw = pollData[poll] ?? emptyCounts();
    if (!validateCounts(raw, n)) {
      error = '빈값·음수·소수·참여 인원 초과는 입력할 수 없습니다. 네 칸을 확인하세요.';
      app.querySelector('#error')!.textContent = error;
      return;
    }
  } else {
    pollData[poll] = null;
  }
  memoryVisible = false;
  summaryCopied = false;
  next();
}

/** 가상 연습 모드 전용 샘플 집계 생성 (#8). */
function fillSampleCounts(poll: Poll) {
  const n = parseParticipants(participantsRaw) ?? 20;
  let a = 0, b = 0, c = 0, d = 0;
  if (poll === 'first') {
    a = Math.round(n * 0.4);
    b = Math.round(n * 0.45);
    c = Math.round(n * 0.1);
    d = Math.max(0, n - a - b - c);
  } else if (poll === 'again') {
    a = Math.round(n * 0.75);
    b = Math.round(n * 0.15);
    c = Math.round(n * 0.05);
    d = Math.max(0, n - a - b - c);
  } else {
    a = Math.round(n * 0.8);
    b = Math.round(n * 0.1);
    c = Math.round(n * 0.05);
    d = Math.max(0, n - a - b - c);
  }
  pollData[poll] = { A: String(a), B: String(b), C: String(c), D: String(d) };
  memoryVisible = false;
  summaryCopied = false;
  error = '';
  render();
}

// ─── 이벤트 핸들러 ───────────────────────────────────────────────
app.addEventListener('input', event => {
  const target = event.target as HTMLInputElement;

  if (target.id === 'participants') {
    participantsRaw = target.value;
    memoryVisible = false;
  }

  const poll = activePoll();
  if (target.dataset.count && poll) {
    pollData[poll] ??= emptyCounts();
    pollData[poll]![target.dataset.count as keyof RawCounts] = target.value;
    memoryVisible = false;
    summaryCopied = false;

    const n = parseParticipants(participantsRaw);
    app.querySelector('#poll-note')!.textContent = formatPollNote(pollData[poll], n);
  }
});

app.addEventListener('change', event => {
  const target = event.target as HTMLInputElement;

  if (target.name === 'unit') {
    selectedUnitId = target.value;
    inquiryBaseDenominator = currentUnit().denominators.first[0];
    pollData = { first: null, again: null, transfer: null };
    memoryVisible = false;
    error = '';
    render();
  }

  if (target.name === 'mode') {
    mode = target.value as 'example' | 'class';
    pollData = { first: null, again: null, transfer: null };
    participantsRaw = '';
    memoryVisible = false;
    summaryCopied = false;
    error = '';
    render();
  }

  if (target.name === 'minutes') {
    minutes = Number(target.value) as 10 | 20 | 40;
    remainingSeconds = minutes * 60;
    timerRunning = false;
    render();
  }
});

// 완료된 스텝 인디케이터 키보드 이동 지원 (#7)
app.addEventListener('keydown', event => {
  const stepEl = (event.target as HTMLElement).closest<HTMLElement>('.step-dot.done[data-step-index]');
  if (stepEl && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    const idx = Number(stepEl.dataset.stepIndex);
    if (Number.isInteger(idx) && idx >= 0 && idx < order.indexOf(phase)) {
      phase = order[idx];
      inquiryIndex = 0;
      inquiryAnswerVisible = false;
      error = '';
      render(true);
    }
  }
});

// 전자칠판·프리젠터용 글로벌 단축키 지원 (#6: Alt+←, Alt+→, Alt+T)
window.addEventListener('keydown', event => {
  if (!event.altKey) return;
  const activeTag = (document.activeElement as HTMLElement | null)?.tagName;
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

  if (event.key === 'ArrowRight') {
    const forwardBtn = app.querySelector<HTMLButtonElement>('button[data-action="next"], button[data-action="inquiry-next"]');
    if (forwardBtn && !forwardBtn.disabled) {
      event.preventDefault();
      forwardBtn.click();
    }
  } else if (event.key === 'ArrowLeft') {
    const backBtn = app.querySelector<HTMLButtonElement>('button[data-action="back"]');
    if (backBtn && !backBtn.disabled) {
      event.preventDefault();
      backBtn.click();
    }
  } else if (event.key.toLowerCase() === 't') {
    const timerBtn = app.querySelector<HTMLButtonElement>('button[data-action="timer-toggle"]');
    if (timerBtn && !timerBtn.disabled) {
      event.preventDefault();
      timerBtn.click();
    }
  }
});

app.addEventListener('click', event => {
  // 완료된 스텝 인디케이터 클릭 시 해당 단계로 이동 (#7)
  const stepEl = (event.target as HTMLElement).closest<HTMLElement>('.step-dot.done[data-step-index]');
  if (stepEl) {
    const idx = Number(stepEl.dataset.stepIndex);
    if (Number.isInteger(idx) && idx >= 0 && idx < order.indexOf(phase)) {
      phase = order[idx];
      inquiryIndex = 0;
      inquiryAnswerVisible = false;
      error = '';
      render(true);
    }
    return;
  }

  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!button) return;

  // 다크 모드 토글 (#1)
  if (button.id === 'theme-toggle') {
    const nextTheme = isDarkTheme() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    button.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
    button.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    return;
  }

  // 큰 글씨 모드 토글 (#8)
  if (button.id === 'scale-toggle') {
    const nextScale = isLargeScale() ? 'normal' : 'large';
    document.documentElement.setAttribute('data-scale', nextScale);
    button.textContent = nextScale === 'large' ? '🔍 기본' : '🔍 큰글씨';
    button.setAttribute('aria-pressed', String(nextScale === 'large'));
    return;
  }

  const action = button.dataset.action;

  if (button.dataset.reason !== undefined) {
    if (reasonSelected !== button.dataset.reason) {
      memoryVisible = false;
      summaryCopied = false;
      aiLinkedCardTitle = '';
    }
    reasonSelected = button.dataset.reason;
    // AI 패널 상태를 유지하기 위해 부분 갱신
    app.querySelectorAll<HTMLButtonElement>('button[data-reason]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.reason === reasonSelected));
    });
    const scaffoldContainer = app.querySelector<HTMLElement>('#scaffold-container');
    if (scaffoldContainer) scaffoldContainer.innerHTML = renderReasonScaffold();
    return;
  }

  if (action === 'toggle-model') {
    visualModel = visualModel === 'bar' ? 'circle' : 'bar';
    render();
  } else if (action === 'toggle-guide') {
    showGuideLine = !showGuideLine;
    render();
  } else if (action === 'next') {
    if (phase === 'preview' && parseParticipants(participantsRaw) === null) {
      error = '참여 인원은 1~60의 정수로 입력하세요.';
      app.querySelector('#error')!.textContent = error;
      return;
    }
    next();
  } else if (action === 'fill-zeros') {
    const poll = activePoll();
    if (poll) {
      pollData[poll] ??= emptyCounts();
      for (const choice of CHOICES) {
        if (pollData[poll]![choice].trim() === '') {
          pollData[poll]![choice] = '0';
        }
      }
      memoryVisible = false;
      summaryCopied = false;
      error = '';
      render();
    }
  } else if (action === 'fill-sample') {
    const poll = activePoll();
    if (poll && mode === 'example') {
      fillSampleCounts(poll);
    }
  } else if (action === 'record') {
    continuePoll(true);
  } else if (action === 'skip') {
    continuePoll(false);
  } else if (action === 'back') {
    inquiryAnswerVisible = false;
    if (phase === 'inquiry' && inquiryIndex > 0) {
      inquiryIndex--;
    } else {
      phase = order[order.indexOf(phase) - 1];
      if (phase === 'inquiry') inquiryIndex = 2;
    }
    error = '';
    render(true);
  } else if (action === 'inquiry-next') {
    inquiryAnswerVisible = false;
    if (inquiryIndex < 2) inquiryIndex++;
    else phase = 'summary';
    render(true);
  } else if (action === 'base-less' || action === 'base-more') {
    inquiryBaseDenominator = Math.max(
      DENOMINATOR_MIN,
      Math.min(DENOMINATOR_MAX, inquiryBaseDenominator + (action === 'base-more' ? 1 : -1)),
    );
    render();
  } else if (action === 'less' || action === 'more') {
    inquiryDenominator = Math.max(DENOMINATOR_MIN, Math.min(DENOMINATOR_MAX, inquiryDenominator + (action === 'more' ? 1 : -1)));
    render();
  } else if (action === 'reveal-inquiry') {
    inquiryAnswerVisible = true;
    app.querySelector<HTMLElement>('#answer')!.hidden = false;
    button.disabled = true;
  } else if (action === 'summary-reveal') {
    summaryVisible = true;
    render();
  } else if (action === 'transfer-reveal') {
    transferAnswerVisible = true;
    render();
  } else if (action === 'memory-generate') {
    memoryVisible = true;
    summaryCopied = false;
    render();
  } else if (action === 'export-json') {
    downloadJSON();
  } else if (action === 'export-csv') {
    downloadCSV();
  } else if (action === 'copy-summary') {
    const text = memoryText();
    void navigator.clipboard?.writeText(text).catch(() => {});
    summaryCopied = true;
    render();
  } else if (action === 'timer-toggle') {
    timerRunning = !timerRunning;
    lastTick = Date.now();
    render();
  } else if (action === 'timer-extend') {
    remainingSeconds += TIMER_EXTEND_SECONDS;
    render();
  } else if (action === 'timer-reset') {
    remainingSeconds = minutes * 60;
    timerRunning = false;
    render();
  } else if (action === 'finish') {
    resetSession();
    phase = 'end';
    render(true);
  } else if (action === 'restart') {
    resetSession();
  }
});

// ─── 타이머 ──────────────────────────────────────────────────────
setInterval(() => {
  if (!timerRunning) return;
  const now = Date.now();
  remainingSeconds = Math.max(0, remainingSeconds - Math.max(0, (now - lastTick) / 1000));
  lastTick = now;

  const output = app.querySelector('#timer-output');
  if (output) output.textContent = timerText();

  // 타이머 경고
  const timerSection = app.querySelector('.timer');
  if (timerSection) {
    if (remainingSeconds <= 60 && remainingSeconds > 0) {
      timerSection.classList.add('timer-warning');
    } else {
      timerSection.classList.remove('timer-warning');
    }
  }

  if (remainingSeconds === 0) {
    timerRunning = false;
    app.querySelector<HTMLButtonElement>('[data-action="timer-toggle"]')!.textContent = '시작';
  }
}, TIMER_INTERVAL_MS);

// ─── 세션 보호 ───────────────────────────────────────────────────
window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
  if (phase !== 'concept' && phase !== 'end') {
    e.preventDefault();
  }
});

window.addEventListener('pagehide', resetSession);
window.addEventListener('pageshow', event => { if (event.persisted) resetSession(); });

// ─── 초기 렌더 ───────────────────────────────────────────────────
render();

if (aiEnabled) {
  void import('./lesson-ai-panel').then(({ createLessonAiPanel }) => {
    aiPanel = createLessonAiPanel(app, (cardId, cardTitle) => {
      const mapped = cardId === 'A' ? '0' : cardId === 'B' ? '1' : '2';
      reasonSelected = mapped;
      aiLinkedCardTitle = cardTitle;
      memoryVisible = false;
      summaryCopied = false;
      app.querySelectorAll<HTMLButtonElement>('button[data-reason]').forEach(btn => {
        btn.setAttribute('aria-pressed', String(btn.dataset.reason === reasonSelected));
      });
      const scaffoldContainer = app.querySelector<HTMLElement>('#scaffold-container');
      if (scaffoldContainer) scaffoldContainer.innerHTML = renderReasonScaffold();
    });
    aiPanel.sync(phase === 'reason');
  });
}
