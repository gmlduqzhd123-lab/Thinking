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

// ─── 상수 ────────────────────────────────────────────────────────
const order: Phase[] = ['think', 'explore', 'check', 'result'];
const phaseLabels: Record<Phase, string> = {
  think: '1. 생각 고르기',
  explore: '2. 직접 실험하기',
  check: '3. 다시 점검하기',
  result: '4. 오늘의 발견',
};

const reasonCards = [
  '분모가 클수록 조각이 크다고 생각함',
  '더 많이 나눌수록 조각이 작아진다고 생각함',
  '전체가 같은지 확인이 필요함',
] as const;

const reasonStudentBubbles = [
  '💬 "분모 숫자가 더 크니까 한 조각도 더 클 것 같아요!"',
  '💬 "같은 전체를 더 많이 나누면 한 조각은 더 작아질 것 같아요!"',
  '💬 "두 리본의 원래 전체 길이가 똑같은지 먼저 확인해야 해요!"',
] as const;

// ─── DOM ─────────────────────────────────────────────────────────
const app = document.querySelector<HTMLElement>('#lesson-app')!;
const aiEnabled = app.dataset.aiEnabled === 'true';

// ─── 상태 ────────────────────────────────────────────────────────
let aiPanel: { sync(active: boolean): void; dispose(): void } | undefined;
let selectedUnitId = 'M01';
let visualModel: VisualModel = 'bar';
let phase: Phase = 'think';
let myChoices: Record<Poll, Choice | null> = { first: null, again: null, transfer: null };
let reasonSelected = '';
let aiLinkedCardTitle = '';
let showOverlap = false;
let exploreDenominator = 5;
let exploreMoved = false;
let notebookBlankRevealed = false;
let classPollOpen = false;
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

function resetSession(keepUnit = false) {
  aiPanel?.dispose();
  if (!keepUnit) selectedUnitId = 'M01';
  visualModel = 'bar';
  phase = 'think';
  myChoices = { first: null, again: null, transfer: null };
  reasonSelected = '';
  aiLinkedCardTitle = '';
  showOverlap = false;
  exploreDenominator = currentUnit().denominators.first[1];
  exploreMoved = false;
  notebookBlankRevealed = false;
  classPollOpen = false;
  participantsRaw = '20';
  pollData = { first: null, again: null, transfer: null };
  error = '';
  render();
}

// ─── 분수 시각 모형 컴포넌트 ─────────────────────────────────────

function circleFraction(denominator: number): string {
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

  return `<figure class="fraction fraction-circle">
    <svg viewBox="0 0 160 160" role="img"
      aria-label="같은 크기의 전체를 ${denominator}등분하고 첫 한 조각을 칠한 분수 원형 모형, 1/${denominator}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <path d="${sectorPath}" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${dividers}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
    </svg>
    <figcaption>같은 전체의 <strong>1/${denominator}</strong> (${denominator}조각 중 한 조각)</figcaption>
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

function bar(denominator: number): string {
  if (visualModel === 'circle') return circleFraction(denominator);
  if (visualModel === 'numberline') return numberLineFraction(denominator);
  if (visualModel === 'cup') return cupFraction(denominator);

  const segments = fractionSegments(denominator);
  const segmentWidth = 600 / denominator;
  const dividers = segments.slice(1).map(s =>
    `<line x1="${600 * s.start}" y1="10" x2="${600 * s.start}" y2="58" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>`
  ).join('');

  return `<figure class="fraction">
    <svg viewBox="0 0 600 70" role="img"
      aria-label="같은 길이의 전체를 ${denominator}등분하고 첫 한 조각을 칠한 분수 막대, 1/${denominator}">
      <rect x="0" y="10" width="600" height="48" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="3"/>
      <rect x="0" y="10" width="${segmentWidth}" height="48" rx="4" fill="var(--lesson-bar-fill, #ffca62)"/>
      ${dividers}
    </svg>
    <figcaption>같은 전체의 <strong>1/${denominator}</strong> (${denominator}조각 중 한 조각)</figcaption>
  </figure>`;
}

function renderSimpleVisualPair(dA: number, dB: number, allowExtraModels = false): string {
  const extraBtns = allowExtraModels
    ? `<button type="button" data-action="toggle-numberline" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'numberline'}">📐 수직선으로 보기</button>
       <button type="button" data-action="toggle-cup" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'cup'}">🥤 주스 컵으로 보기</button>`
    : '';
  return `<div class="visual-toolbar" role="group" aria-label="분수 모양 바꾸기">
      <button type="button" data-action="toggle-model" class="secondary-btn visual-btn" aria-pressed="${visualModel === 'circle'}">${visualModel === 'circle' ? '📏 막대 모양으로 보기' : '🍕 둥근 피자 모양으로 보기'}</button>
      ${extraBtns}
    </div>
    <div class="bar-pair">${bar(dA)}${bar(dB)}</div>`;
}

// ─── 선택지 및 피드백 렌더링 ─────────────────────────────────────

function choiceLabel(choice: Choice | null, dA: number, dB: number): string {
  if (!choice) return '아직 선택하지 않음';
  const labels: Record<Choice, string> = {
    A: `1/${dA}이 더 크다`,
    B: `1/${dB}이 더 크다`,
    C: '두 조각의 크기가 같다',
    D: '아직 잘 모르겠다',
  };
  return labels[choice];
}

function renderChoiceButtons(poll: Poll, dA: number, dB: number): string {
  const selected = myChoices[poll];
  const labels = [
    `A. 1/${dA} 조각이 더 크다`,
    `B. 1/${dB} 조각이 더 크다`,
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
    return `<p id="poll-note" class="solo-feedback-box" role="status">✅ 내 처음 생각으로 <strong>"${choiceLabel(selected, dA, dB)}"</strong>을(를) 골랐어요!</p>`;
  }
  if (selected === 'A') {
    return `<p class="answer feedback-correct" role="status">🎉 <strong>정답이에요!</strong> 같은 전체를 더 적게 나눈 <strong>1/${dA}</strong> 한 조각이 <strong>1/${dB}</strong> 한 조각보다 더 큽니다.</p>`;
  }
  if (selected === 'B') {
    return `<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 분모 숫자 ${dB}이 ${dA}보다 크지만, 같은 전체를 더 여러 조각으로 나누면 한 조각의 크기는 오히려 작아져요! 따라서 <strong>1/${dA}</strong>이 더 큽니다.</p>`;
  }
  if (selected === 'C') {
    return `<p class="answer feedback-hint" role="status">💡 <strong>다시 살펴볼까요?</strong> 나눈 조각 수가 ${dA}등분과 ${dB}등분으로 서로 다르기 때문에 한 조각의 크기도 달라요. 덜 나눈 <strong>1/${dA}</strong>이 더 큽니다.</p>`;
  }
  return `<p class="answer feedback-hint" role="status">🌱 <strong>괜찮아요!</strong> 같은 전체를 덜 나눈 조각일수록 한 조각의 크기가 더 커요. 따라서 <strong>1/${dA}</strong> 조각이 <strong>1/${dB}</strong> 조각보다 더 큽니다.</p>`;
}

/** 교사용 선택형 학급 인원 집계 (기본은 접혀 있어서 화면을 복잡하게 만들지 않음). */
function renderOptionalClassPoll(poll: Poll, dA: number, dB: number): string {
  const counts = pollData[poll] ?? emptyCounts();
  const labels = [`A (1/${dA})`, `B (1/${dB})`, 'C (같다)', 'D (모름)'];

  return `<details class="class-poll-details" data-poll-details="${poll}" ${classPollOpen ? 'open' : ''}>
    <summary>👩‍🏫 교실 수업용 인원수 기록하기 (필요할 때만 열기)</summary>
    <div class="class-poll-body">
      <label>참여 인원(1~${MAX_PARTICIPANTS}명) <input id="participants" data-participants-input="${poll}" type="text" inputmode="numeric" value="${participantsRaw}" autocomplete="off"></label>
      <div class="class-poll-inputs">
        ${CHOICES.map((ch, i) =>
          `<label>${labels[i]} <input data-count="${ch}" data-count-poll="${poll}" type="text" inputmode="numeric" value="${counts[ch]}" aria-label="${ch} 선택 인원" autocomplete="off"></label>`
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

/** 1단계: 단원 카드 1클릭 선택 + 내 처음 생각 & 이유 고르기 (#1, #3, #4, #6). */
function renderThinkPhase(): string {
  const unit = currentUnit();
  const [firstA, firstB] = unit.denominators.first;

  const unitCards = listUnits().map(u => {
    const active = u.id === selectedUnitId;
    return `<button type="button" data-unit-id="${u.id}" class="unit-card-btn ${active ? 'unit-card-active' : ''}" aria-pressed="${active}">
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
      <p class="question-lead">크기가 똑같은 두 전체에서 <strong>1/${firstA}</strong> 한 조각과 <strong>1/${firstB}</strong> 한 조각 중 어느 쪽이 더 클까요?</p>
      ${renderSimpleVisualPair(firstA, firstB)}
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

  const badgeEl = app.querySelector<HTMLElement>('#explore-cmp-badge');
  if (badgeEl) badgeEl.innerHTML = badgeHtml;

  const discEl = app.querySelector<HTMLElement>('#explore-discovery-2');
  if (discEl) discEl.innerHTML = discoveryHtml;
}

function formatClassPollStatus(poll: Poll): string {
  const counts = pollData[poll] ?? emptyCounts();
  const n = parseParticipants(participantsRaw);
  const checked = n ? validateCounts(counts, n) : null;
  return checked
    ? `집계 완료: 정답(A) ${checked.counts.A}/${n}명 · 미응답 ${checked.noResponse}명`
    : '학급 인원 집계를 기록하려면 숫자를 입력하세요.';
}

/** 2단계: 내가 고른 생각 확인 + 딱 2가지 직관적 실험(포개어 보기 & 등분 슬라이더) (#2, #6, #7, #8). */
function renderExplorePhase(): string {
  const [firstA, firstB] = currentUnit().denominators.first;
  const myFirstText = choiceLabel(myChoices.first, firstA, firstB);
  const myReasonText = reasonSelected !== '' ? reasonStudentBubbles[Number(reasonSelected)] : '내 처음 생각을 직접 실험으로 확인해 볼까요?';

  const wA = 600 / firstA;
  const wB = 600 / firstB;
  const { barsHtml, badgeHtml, discoveryHtml } = renderExploreDynamicComparison(firstA);

  return `
    <div class="step-card">
      <h2 tabindex="-1">② 직접 실험하기 · 눈으로 확인하는 두 가지 실험</h2>

      <div class="hypothesis-banner" role="region" aria-label="나의 처음 생각">
        <p>💭 <strong>나의 처음 생각</strong>: <strong>${myFirstText}</strong></p>
        <p class="hypothesis-sub">${myReasonText}</p>
      </div>

      <section class="experiment-box" aria-label="실험 1 조각 포개어 비교하기">
        <h3>실험 1 · 가위로 잘라 두 조각을 포개어 대어 보기</h3>
        <p>1/${firstA} 조각과 1/${firstB} 조각의 왼쪽 끝을 똑같이 맞추어 겹쳐 볼까요?</p>
        <button type="button" data-action="toggle-overlap" class="overlap-trigger-btn" aria-pressed="${showOverlap}">
          ${showOverlap ? '✂️ 포개어 비교한 결과 닫기' : '✂️ 1/' + firstA + ' 조각과 1/' + firstB + ' 조각 포개어 비교하기'}
        </button>

        ${showOverlap ? `
          <div class="overlap-comparison" role="region" aria-label="조각 포개어 겹쳐 비교하기">
            <svg viewBox="0 0 600 82" role="img" aria-label="1/${firstA} 조각과 1/${firstB} 조각을 겹쳐 길이를 비교한 그림">
              <rect x="0" y="8" width="600" height="66" rx="6" fill="var(--lesson-bar-bg, white)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="1.5" stroke-dasharray="4 4"/>
              <rect x="0" y="12" width="${wA.toFixed(2)}" height="26" rx="4" fill="var(--lesson-bar-fill, #ffca62)" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <text x="${Math.min(540, wA + 8).toFixed(2)}" y="30" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${firstA} 한 조각</text>
              <rect x="0" y="44" width="${wB.toFixed(2)}" height="26" rx="4" fill="#7cc6fe" stroke="var(--lesson-bar-stroke, #153a69)" stroke-width="2"/>
              <text x="${Math.min(540, wB + 8).toFixed(2)}" y="62" font-size="14" font-weight="700" fill="var(--lesson-bar-stroke, #153a69)">1/${firstB} 한 조각</text>
              <line x1="${wB.toFixed(2)}" y1="8" x2="${wB.toFixed(2)}" y2="74" stroke="#d9381e" stroke-width="2.5" stroke-dasharray="4 3"/>
            </svg>
            <p class="answer">💡 <strong>발견 1</strong>: 왼쪽 끝을 맞추어 포개어 보니, 덜 나눈 <strong>1/${firstA}</strong> 조각이 <strong>1/${firstB}</strong> 조각보다 확실히 더 깁니다!</p>
          </div>
        ` : ''}
      </section>

      <section class="experiment-box" aria-label="실험 2 나누는 조각 수 바꿔 보기">
        <h3>실험 2 · 나누는 조각 수(분모)를 2~12 사이에서 직접 바꿔 보기</h3>
        <p>아래 슬라이더나 <strong>− / ＋</strong> 버튼을 움직여 전체를 더 많이 나눌 때 한 조각이 어떻게 변하는지 관찰해 보세요.</p>

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

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">③ 내 생각 다시 점검하기 →</button>
      </div>
    </div>`;
}

/** 3단계: 처음 문제 다시 고르기 + 한 걸음 더 응용 문제 (클릭 즉시 정답/힌트 표시) (#8). */
function renderCheckPhase(): string {
  const [firstA, firstB] = currentUnit().denominators.first;
  const [transferA, transferB] = currentUnit().denominators.transfer;

  return `
    <div class="step-card">
      <h2 tabindex="-1">③ 다시 점검하기 · 실험 후 내 생각 확인과 응용</h2>

      <section class="check-subcard" aria-label="같은 문제 다시 선택하기">
        <h3>1) 처음 문제 다시 고르기: 1/${firstA}과 1/${firstB} 중 어느 쪽이 더 클까요?</h3>
        <p class="first-memory-tag">💭 1단계에서 고른 내 처음 생각: <strong>${choiceLabel(myChoices.first, firstA, firstB)}</strong></p>
        ${renderChoiceButtons('again', firstA, firstB)}
        ${renderInstantFeedback('again', firstA, firstB)}
        ${renderOptionalClassPoll('again', firstA, firstB)}
      </section>

      <section class="check-subcard" aria-label="한 걸음 더 새로운 응용 문제">
        <h3>2) 한 걸음 더! 새로운 문제: 같은 전체에서 <strong>1/${transferA}</strong>과 <strong>1/${transferB}</strong> 중 어느 쪽이 더 클까요?</h3>
        ${renderSimpleVisualPair(transferA, transferB, true)}
        ${renderChoiceButtons('transfer', transferA, transferB)}
        ${renderInstantFeedback('transfer', transferA, transferB)}
        ${renderOptionalClassPoll('transfer', transferA, transferB)}
      </section>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="next" class="primary-next-btn">④ 오늘의 발견 결과 보기 →</button>
      </div>
    </div>`;
}

/** 4단계: 버튼 클릭 없이 즉시 열리는 '내 생각의 성장 카드' 및 한 줄 규칙 완성 (#10). */
function renderResultPhase(): string {
  const unit = currentUnit();
  const [fA, fB] = unit.denominators.first;
  const [tA, tB] = unit.denominators.transfer;
  const blankText = notebookBlankRevealed ? '작아집니다!' : '______';

  const againCorrect = myChoices.again === 'A';
  const transferCorrect = myChoices.transfer === 'A';
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

  return `
    <div class="step-card">
      <h2 tabindex="-1">④ 오늘의 발견 · 내 생각의 성장 카드</h2>

      <div class="solo-report-card" role="region" aria-label="내 생각의 성장 카드">
        <p class="praise-badge">${growthMessage}</p>
        <div class="growth-journey-grid">
          <div class="journey-step">
            <span class="journey-label">① 처음 내 생각 (1/${fA} vs 1/${fB})</span>
            <strong>${choiceLabel(myChoices.first, fA, fB)}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${againCorrect ? 'journey-correct' : ''}">
            <span class="journey-label">② 실험 후 내 생각 (1/${fA} vs 1/${fB})</span>
            <strong>${choiceLabel(myChoices.again, fA, fB)} ${againCorrect ? '⭐' : ''}</strong>
          </div>
          <div class="journey-arrow" aria-hidden="true">→</div>
          <div class="journey-step ${transferCorrect ? 'journey-correct' : ''}">
            <span class="journey-label">③ 응용 문제 (1/${tA} vs 1/${tB})</span>
            <strong>${choiceLabel(myChoices.transfer, tA, tB)} ${transferCorrect ? '⭐' : ''}</strong>
          </div>
        </div>
        ${classSummaryHtml}
      </div>

      <div class="notebook-summary-card" role="region" aria-label="오늘 내가 발견한 규칙">
        <h3>📝 오늘 내가 발견한 단위분수의 규칙</h3>
        <div class="notebook-line">
          <p>"크기가 같은 전체를 똑같이 더 많이 나눌수록(분모가 커질수록), 한 조각의 크기는 <strong class="notebook-blank">[ ${blankText} ]</strong>"</p>
          <button type="button" data-action="toggle-notebook-blank" class="secondary-btn" aria-pressed="${notebookBlankRevealed}">
            ${notebookBlankRevealed ? '빈칸 다시 가리기' : '정답 빈칸 채우기'}
          </button>
        </div>
      </div>

      <div class="actions next-step-bar">
        <button type="button" data-action="back" class="secondary-btn">← 이전 단계</button>
        <button type="button" data-action="print-summary" class="secondary-btn">🖨️ 결과 인쇄하기</button>
        <button type="button" data-action="restart" class="primary-next-btn">🔄 처음부터 다른 단원 해보기</button>
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

// ─── 상단 헤더 및 4단계 진행 바 (#1, #5, #9) ─────────────────────

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

  // 1단계 단원 카드 1클릭 전환
  if (button.dataset.unitId) {
    selectedUnitId = button.dataset.unitId;
    resetSession(true);
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
  } else if (action === 'toggle-numberline') {
    visualModel = visualModel === 'numberline' ? 'bar' : 'numberline';
    render();
  } else if (action === 'toggle-cup') {
    visualModel = visualModel === 'cup' ? 'bar' : 'cup';
    render();
  } else if (action === 'toggle-overlap') {
    showOverlap = !showOverlap;
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
    const a = p === 'first' ? Math.round(n * 0.4) : Math.round(n * 0.8);
    const b = p === 'first' ? Math.round(n * 0.45) : Math.round(n * 0.1);
    const c = Math.round(n * 0.05);
    const d = Math.max(0, n - a - b - c);
    pollData[p] = { A: String(a), B: String(b), C: String(c), D: String(d) };
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
