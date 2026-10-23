import { CHOICES, FIRST_ITEM, TRANSFER_ITEM, emptyCounts, fractionSegments, parseParticipants, percentagePointChange, validateCounts, type RawCounts } from './lesson-core';
import { DEFAULT_MINUTES, MINUTES_OPTIONS, MAX_PARTICIPANTS, TIMER_INTERVAL_MS, TIMER_EXTEND_SECONDS, DENOMINATOR_MIN, DENOMINATOR_MAX } from './constants';
import './lesson.css';

// ─── 타입 ────────────────────────────────────────────────────────
type Poll = 'first' | 'again' | 'transfer';
type Phase = 'concept' | 'preview' | 'first' | 'reason' | 'inquiry' | 'summary' | 'again' | 'transfer' | 'memory' | 'end';

// ─── 상수 ────────────────────────────────────────────────────────
const order: Phase[] = ['concept', 'preview', 'first', 'reason', 'inquiry', 'summary', 'again', 'transfer', 'memory', 'end'];
const reasonCards = ['분모가 클수록 조각이 크다고 생각함', '전체가 같은지 확인이 필요함', '아직 이유를 말하기 어려움'] as const;

// ─── DOM ─────────────────────────────────────────────────────────
const app = document.querySelector<HTMLElement>('#lesson-app')!;
const aiEnabled = app.dataset.aiEnabled === 'true';

// ─── 상태 ────────────────────────────────────────────────────────
let aiPanel: { sync(active: boolean): void; dispose(): void } | undefined;
let phase: Phase = 'concept';
let mode: 'example' | 'class' = 'example';
let participantsRaw = '';
let minutes: 10 | 20 | 40 = DEFAULT_MINUTES as 10 | 20 | 40;
let remainingSeconds = DEFAULT_MINUTES * 60;
let timerRunning = false;
let lastTick = Date.now();
let inquiryIndex = 0;
let inquiryDenominator = 6;
let summaryVisible = false;
let transferAnswerVisible = false;
let memoryVisible = false;
let pollData: Record<Poll, RawCounts | null> = { first: null, again: null, transfer: null };
let reasonSelected = '';
let error = '';

// ─── 세션 초기화 ─────────────────────────────────────────────────
function resetSession() {
  aiPanel?.dispose();
  phase = 'concept'; mode = 'example'; participantsRaw = ''; minutes = DEFAULT_MINUTES as 10 | 20 | 40;
  remainingSeconds = DEFAULT_MINUTES * 60; timerRunning = false; inquiryIndex = 0; inquiryDenominator = 6;
  summaryVisible = false; transferAnswerVisible = false; memoryVisible = false;
  pollData = { first: null, again: null, transfer: null }; reasonSelected = ''; error = '';
  render();
}

// ─── 렌더링 컴포넌트 ────────────────────────────────────────────

/** 분수 막대 SVG를 생성합니다. */
function bar(denominator: number): string {
  const segments = fractionSegments(denominator);
  const segmentWidth = 600 / denominator;
  const dividers = segments.slice(1).map(s =>
    `<line x1="${600 * s.start}" y1="10" x2="${600 * s.start}" y2="58" stroke="#153a69" stroke-width="2"/>`
  ).join('');

  return `<figure class="fraction">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${denominator}등분하고 첫 한 조각을 칠한 분수 막대, 1/${denominator}">
      <rect x="0" y="10" width="600" height="48" fill="white" stroke="#153a69" stroke-width="3"/>
      <rect x="0" y="10" width="${segmentWidth}" height="48" fill="#ffca62"/>
      ${dividers}
    </svg>
    <figcaption>같은 전체의 1/${denominator} · ${denominator}등분 중 한 조각</figcaption>
  </figure>`;
}

/** 투표(선택) 템플릿을 생성합니다. */
function pollTemplate(poll: Poll, denominatorA: number, denominatorB: number): string {
  const item = poll === 'transfer' ? TRANSFER_ITEM : FIRST_ITEM;
  const labels = [`A. 1/${denominatorA}이 더 크다`, `B. 1/${denominatorB}이 더 크다`, 'C. 두 조각이 같다', 'D. 모르겠다'];
  const counts = pollData[poll];
  const checked = counts && parseParticipants(participantsRaw) !== null
    ? validateCounts(counts, parseParticipants(participantsRaw)!)
    : null;

  const choiceInputs = CHOICES.map((choice, i) =>
    `<label>${labels[i]} <input data-count="${choice}" inputmode="numeric" type="text" aria-label="${choice} 선택 인원" autocomplete="off"></label>`
  ).join('');

  const noteText = checked
    ? `모르겠다 ${checked.counts.D}명 · 미응답 ${checked.noResponse}명`
    : '집계를 입력하려면 네 칸 모두 0 이상의 정수를 입력하세요. 미응답은 참여 인원에서 집계 합계를 뺀 값입니다.';

  return `
    <p class="item-id">문항 ID ${item.id} · 버전 ${item.version}</p>
    <p>길이가 같은 두 리본에서 한 조각의 길이를 비교합니다. 어느 쪽이 더 클까요?</p>
    <div class="bar-pair">${bar(denominatorA)}${bar(denominatorB)}</div>
    <ol class="choices">${labels.map(label => `<li>${label}</li>`).join('')}</ol>
    <p>교사가 손들기·카드·말하기로 선택을 확인합니다. 개인별 응답은 입력하지 않습니다.</p>
    <fieldset>
      <legend>집계 입력 · 선택 사항</legend>
      ${choiceInputs}
      <p id="poll-note" role="status">${noteText}</p>
    </fieldset>
    <div class="actions">
      <button data-action="record">집계 확인 후 계속</button>
      <button data-action="skip">집계 생략하고 계속</button>
    </div>`;
}

/** 탐구 단계 템플릿을 생성합니다. */
function inquiryTemplate(): string {
  const data = [
    { title: '탐구 1 · 같은 전체', prompt: '같은 길이의 전체를 3등분, 5등분하면 한 조각은 어떻게 달라질까요?', a: 3, b: 5, answer: '전체 길이가 같다면 3등분한 한 조각이 5등분한 한 조각보다 깁니다.' },
    { title: '탐구 2 · 더 많이 나누기', prompt: '한 전체를 4등분한 조각과 8등분한 조각을 살펴보세요.', a: 4, b: 8, answer: '같은 전체를 더 많이 나눌수록 한 조각은 작아집니다.' },
    { title: '탐구 3 · 직접 조절', prompt: '버튼으로 두 번째 막대의 등분 수를 2~12 사이에서 바꿔 보세요.', a: 3, b: inquiryDenominator, answer: '두 막대의 전체 길이를 같게 둔 뒤 한 조각의 길이를 비교합니다.' },
  ][inquiryIndex];

  const controls = inquiryIndex === 2
    ? `<div class="actions">
        <button data-action="less" ${inquiryDenominator <= DENOMINATOR_MIN ? 'disabled' : ''} aria-label="등분 수 줄이기">−</button>
        <output aria-live="polite">${inquiryDenominator}등분</output>
        <button data-action="more" ${inquiryDenominator >= DENOMINATOR_MAX ? 'disabled' : ''} aria-label="등분 수 늘리기">＋</button>
      </div>`
    : '';

  return `
    <h2 tabindex="-1">${data.title}</h2>
    <p>${data.prompt}</p>
    <div class="bar-pair">${bar(data.a)}${bar(data.b)}</div>
    ${controls}
    <button data-action="reveal-inquiry">교사가 설명 공개</button>
    <p id="answer" class="answer" hidden>${data.answer}</p>
    <div class="actions">
      <button data-action="inquiry-next">${inquiryIndex === 2 ? '개념 정리로' : '다음 탐구로'}</button>
    </div>`;
}

/** 메모리 요약 텍스트를 생성합니다. */
function memoryText(): string {
  const n = parseParticipants(participantsRaw)!;
  const first = pollData.first && validateCounts(pollData.first, n);
  const again = pollData.again && validateCounts(pollData.again, n);
  const transfer = pollData.transfer && validateCounts(pollData.transfer, n);

  const parts = ['같은 전체의 단위분수는 더 많이 나눌수록 한 조각이 작아진다는 점을 탐구했습니다.'];

  parts.push(reasonSelected
    ? `교사가 선택해 탐구한 이유 카드: ${reasonCards[Number(reasonSelected)]}. 이는 수업에서 고른 탐구 주제이며 학생 개개인의 생각으로 확정하지 않습니다.`
    : '교사가 선택한 이유 카드는 없습니다.');

  if (first && again) {
    const change = percentagePointChange(first.counts.A, again.counts.A, n);
    parts.push(`같은 문항 ${FIRST_ITEM.id} v${FIRST_ITEM.version}에서 1/3을 고른 집계는 ${first.counts.A}/${n}명에서 ${again.counts.A}/${n}명으로 바뀌었습니다 (${change >= 0 ? '+' : ''}${change.toFixed(1)}%p). 이는 집단 집계의 차이이며 개인별 성장으로 해석하지 않습니다.`);
  } else {
    parts.push('첫 선택 또는 재선택의 집계를 생략해 변화 수치를 계산하지 않았습니다.');
  }

  if (transfer) {
    parts.push(`새 문항 ${TRANSFER_ITEM.id} v${TRANSFER_ITEM.version}의 집계: 1/4 선택 ${transfer.counts.A}명, 모르겠다 ${transfer.counts.D}명, 미응답 ${transfer.noResponse}명.`);
  } else {
    parts.push(`새 문항 ${TRANSFER_ITEM.id} v${TRANSFER_ITEM.version}의 집계를 생략했습니다.`);
  }

  return parts.join(' ');
}

/** 현재 phase에 맞는 본문을 생성합니다. */
function body(): string {
  switch (phase) {
    case 'concept':
      return `<h2 tabindex="-1">개념 선택</h2>
        <p>M01 단위분수 비교 · 같은 전체에서 1/3과 1/5 한 조각을 비교합니다.</p>
        <button data-action="next">M01 미리보기</button>`;

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
      return `<h2 tabindex="-1">첫 선택</h2>${pollTemplate('first', 3, 5)}`;

    case 'reason':
      return `<h2 tabindex="-1">이유 카드</h2>
        <p>학생의 말을 듣고 다음 중 탐구할 이유를 교사가 고릅니다. 이름이나 발언 원문은 기록하지 않습니다.</p>
        <div class="actions">
          ${reasonCards.map((label, i) =>
            `<button data-reason="${i}" aria-pressed="${reasonSelected === String(i)}">${label}</button>`
          ).join('')}
        </div>
        <p>선택한 이유 카드는 요약에만 반영되며 브라우저 저장소에는 남기지 않습니다.</p>
        <button data-action="next">기본 탐구 시작</button>`;

    case 'inquiry':
      return inquiryTemplate();

    case 'summary':
      return `<h2 tabindex="-1">개념 정리</h2>
        <p>학생 설명을 먼저 들은 뒤 교사가 정리를 공개합니다.</p>
        <button data-action="summary-reveal">교사가 개념 정리 공개</button>
        ${summaryVisible
          ? `<p class="answer">같은 전체에서 1/3은 1/5보다 큽니다. 전체를 같은 크기로 더 많이 나누면 한 조각은 작아집니다.</p>
             <button data-action="next">같은 문항 다시 선택</button>`
          : ''}`;

    case 'again': {
      const n = parseParticipants(participantsRaw)!;
      const first = pollData.first && validateCounts(pollData.first, n);
      const again = pollData.again && validateCounts(pollData.again, n);
      const comparison = first && again
        ? `<p class="comparison">1/3 선택 집계 ${first.counts.A}/${n} → ${again.counts.A}/${n}, ${percentagePointChange(first.counts.A, again.counts.A, n).toFixed(1)}%p 차이. 개인별 성장으로 해석하지 않습니다.</p>`
        : '';
      return `<h2 tabindex="-1">다시 선택 · 첫 선택과 동일한 문항</h2>
        ${pollTemplate('again', 3, 5)}${comparison}`;
    }

    case 'transfer':
      return `<h2 tabindex="-1">새로운 문제</h2>
        <p>이 문항은 첫 선택·재선택 문항과 별개입니다.</p>
        ${pollTemplate('transfer', 4, 6)}
        <button data-action="transfer-reveal">교사가 새 문제 설명 공개</button>
        <p class="answer" ${transferAnswerVisible ? '' : 'hidden'}>같은 전체라면 1/4이 1/6보다 큽니다.</p>`;

    case 'memory':
      return `<h2 tabindex="-1">메모리 요약</h2>
        <p>선택한 이유 카드와 집단 집계만 요약하며 학생별 변화는 추론하지 않습니다.</p>
        <button data-action="memory-generate">요약 만들기</button>
        ${memoryVisible ? `<p class="memory">${memoryText()}</p>` : ''}
        <button data-action="finish">종료하고 입력 지우기</button>`;

    case 'end':
      return `<h2 tabindex="-1">종료</h2>
        <p>이 수업의 입력과 집계는 메모리에서 지웠습니다.</p>
        <button data-action="restart">새 수업 시작</button>`;
  }
}

/** 타이머 표시 텍스트. */
function timerText(): string {
  const seconds = Math.ceil(remainingSeconds);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── 레이아웃 렌더링 ─────────────────────────────────────────────

function renderPageHeader(): string {
  return `<header>
    <p class="eyebrow">${aiEnabled ? 'M2' : 'M1'} 개발판 · 교사 검수 미완료 콘텐츠</p>
    <h1>생각의 갈림길 AI</h1>
    <p>정답을 알려 주는 AI가 아니라, 생각을 바꾸는 탐구를 돕는 AI</p>
  </header>`;
}

function renderPageNotice(): string {
  const aiNote = aiEnabled
    ? 'AI 후보는 교사가 별도로 검토·승인해야 하며 검수 완료 자료가 아닙니다.'
    : '이 화면은 기본 수업이며 AI 추천을 실행하지 않습니다.';
  return `<aside class="notice">
    <strong>개발 전용 초안 · 실제 수업 승인 전</strong>
    <p>학생 개인정보를 입력하지 마세요. ${aiNote}</p>
  </aside>`;
}

function renderProgressNav(): string {
  const backButton = phase !== 'concept' && phase !== 'end'
    ? '<button data-action="back">이전 단계</button>'
    : '';
  return `<nav aria-label="수업 진행">
    <span>단계 ${order.indexOf(phase) + 1}/${order.length} · ${mode === 'example' ? '가상 연습' : '실제 수업 입력'}</span>
    ${backButton}
  </nav>`;
}

function renderTimer(): string {
  if (phase === 'concept' || phase === 'end') return '';
  return `<section class="timer">
    <strong>수업 타이머 <output id="timer-output">${timerText()}</output></strong>
    <button data-action="timer-toggle">${timerRunning ? '정지' : '시작'}</button>
    <button data-action="timer-extend">5분 연장</button>
  </section>`;
}

function render(focus = false) {
  app.innerHTML = [
    renderPageHeader(),
    renderPageNotice(),
    renderProgressNav(),
    renderTimer(),
    `<section id="step">${body()}<p id="error" role="alert">${error}</p></section>`,
    '<footer>수업 입력은 이 탭의 메모리에서만 사용합니다. 자동 저장·전송·인쇄하지 않습니다.</footer>',
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
  if (focus) app.querySelector<HTMLElement>('#step h2')?.focus();
}

// ─── 네비게이션 ──────────────────────────────────────────────────
function activePoll(): Poll | null {
  return phase === 'first' ? 'first' : phase === 'again' ? 'again' : phase === 'transfer' ? 'transfer' : null;
}

function next() {
  phase = order[order.indexOf(phase) + 1];
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
  next();
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

    const n = parseParticipants(participantsRaw);
    const checked = n && validateCounts(pollData[poll]!, n);
    app.querySelector('#poll-note')!.textContent = checked
      ? `모르겠다 ${checked.counts.D}명 · 미응답 ${checked.noResponse}명`
      : '네 칸 모두 0 이상의 정수를 입력하고 합계가 참여 인원을 넘지 않게 해 주세요.';
  }
});

app.addEventListener('change', event => {
  const target = event.target as HTMLInputElement;

  if (target.name === 'mode') {
    mode = target.value as 'example' | 'class';
    pollData = { first: null, again: null, transfer: null };
    participantsRaw = '';
    memoryVisible = false;
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

app.addEventListener('click', event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!button) return;

  const action = button.dataset.action;

  // 이유 카드 선택
  if (button.dataset.reason !== undefined) {
    if (reasonSelected !== button.dataset.reason) memoryVisible = false;
    reasonSelected = button.dataset.reason;
    render();
    return;
  }

  // 단계 전환
  if (action === 'next') {
    if (phase === 'preview' && parseParticipants(participantsRaw) === null) {
      error = '참여 인원은 1~60의 정수로 입력하세요.';
      app.querySelector('#error')!.textContent = error;
      return;
    }
    next();
  } else if (action === 'record') {
    continuePoll(true);
  } else if (action === 'skip') {
    continuePoll(false);
  } else if (action === 'back') {
    if (phase === 'inquiry' && inquiryIndex > 0) {
      inquiryIndex--;
    } else {
      phase = order[order.indexOf(phase) - 1];
      if (phase === 'inquiry') inquiryIndex = 2;
    }
    error = '';
    render(true);
  } else if (action === 'inquiry-next') {
    if (inquiryIndex < 2) inquiryIndex++;
    else phase = 'summary';
    render(true);
  } else if (action === 'less' || action === 'more') {
    inquiryDenominator = Math.max(DENOMINATOR_MIN, Math.min(DENOMINATOR_MAX, inquiryDenominator + (action === 'more' ? 1 : -1)));
    render();
  } else if (action === 'reveal-inquiry') {
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
    render();
  } else if (action === 'timer-toggle') {
    timerRunning = !timerRunning;
    lastTick = Date.now();
    render();
  } else if (action === 'timer-extend') {
    remainingSeconds += TIMER_EXTEND_SECONDS;
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

  if (remainingSeconds === 0) {
    timerRunning = false;
    app.querySelector<HTMLButtonElement>('[data-action="timer-toggle"]')!.textContent = '시작';
  }
}, TIMER_INTERVAL_MS);

// ─── 페이지 이동/복귀 ────────────────────────────────────────────
window.addEventListener('pagehide', resetSession);
window.addEventListener('pageshow', event => { if (event.persisted) resetSession(); });

// ─── 초기 렌더 ───────────────────────────────────────────────────
render();

if (aiEnabled) {
  void import('./lesson-ai-panel').then(({ createLessonAiPanel }) => {
    aiPanel = createLessonAiPanel(app);
    aiPanel.sync(phase === 'reason');
  });
}
