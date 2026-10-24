import { cards, examples, baseline } from './cards';
import { judge, thresholds, type Score } from './judge';
import { modelContract } from './model-contract';
import { sensitive, detectSensitiveType } from './privacy';
import { INFERENCE_TIMEOUT_MS, MAX_QUERY_LENGTH } from './constants';
import { checkWasmSupport, getUserMessage, type ErrorCode } from './errors';
import './style.css';

// ─── 타입 ────────────────────────────────────────────────────────
type BatchItem = {
  id: string;
  text: string;
  expected: string;
  predicted: string;
  pass: boolean;
  topSimilarity: number;
  margin: number;
  scores: Score[];
  reason: string;
};

type WorkerMessage = {
  type: string;
  requestId: number;
  sessionRevision: number;
  contract?: string;
  prepareMs?: number;
  downloadMs?: number;
  initMs?: number;
  indexedMs?: number;
  inferMs?: number;
  batchMs?: number;
  percent?: number;
  file?: string;
  errorCode?: ErrorCode;
  errorDetail?: string;
  result?: {
    hold: boolean;
    reason: string;
    scores: Score[];
  };
  items?: BatchItem[];
};

// ─── DOM 헬퍼 ────────────────────────────────────────────────────
const app = document.querySelector<HTMLDivElement>('#app')!;
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// ─── 상태 ────────────────────────────────────────────────────────
let worker: Worker | undefined;
let requestId = 0;
let sessionRevision = 0;
let ready = false;
let timeout: ReturnType<typeof setTimeout> | undefined;
let customMinSim: number = thresholds.minSimilarity;
let customMinMargin: number = thresholds.minMargin;
let lastInferData: { scores: Score[]; queryText: string; inferMs: number } | undefined;
let lastBatchItems: BatchItem[] | undefined;

// ─── 상태 업데이트 함수 ──────────────────────────────────────────
function setState(label: string) {
  $('state').textContent = `모델 상태: ${label}`;
}

function setResult(message: string) {
  lastInferData = undefined;
  const result = $('result');
  result.removeAttribute('data-hold');
  result.textContent = message;
}

function clearTimer() {
  if (timeout) clearTimeout(timeout);
  timeout = undefined;
}

function stopWorker() {
  clearTimer();
  worker?.terminate();
  worker = undefined;
  ready = false;
  $<HTMLButtonElement>('infer').disabled = true;
  $<HTMLButtonElement>('cancel').disabled = true;
  const batchBtn = document.getElementById('batch-eval') as HTMLButtonElement | null;
  if (batchBtn) batchBtn.disabled = true;
}

function nextRevision() {
  sessionRevision++;
  requestId++;
  clearTimer();
}

// ─── 진행률 업데이트 ─────────────────────────────────────────────
function updateProgress(percent: number, file: string) {
  const container = $('progress');
  const fill = $('progress-fill');
  const text = $('progress-text');
  if (!container || !fill || !text) return;

  container.hidden = false;
  fill.style.width = `${percent}%`;
  fill.setAttribute('aria-valuenow', String(percent));

  const fileName = file ? file.split('/').pop() || '' : '';
  text.textContent = fileName
    ? `${fileName} · ${percent}%`
    : `${percent}%`;
}

function hideProgress() {
  const container = document.getElementById('progress');
  if (container) container.hidden = true;
}

// ─── 렌더링 컴포넌트 ────────────────────────────────────────────
function renderHeader(): string {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const large = document.documentElement.getAttribute('data-scale') === 'large';
  return `<header>
    <p class="eyebrow">초등 수학 탐구 · 로컬 AI 카드 추천</p>
    <h1>생각의 갈림길 AI</h1>
    <p>정답을 알려 주는 AI가 아니라, 생각을 바꾸는 탐구를 돕는 AI</p>
    <div class="header-controls">
      <button id="scale-toggle" class="scale-toggle" aria-label="큰 글씨 모드 전환" aria-pressed="${large}" type="button">${large ? '🔍 기본' : '🔍 큰글씨'}</button>
      <button id="theme-toggle" class="theme-toggle" aria-label="다크 모드 전환" aria-pressed="${dark}" type="button">${dark ? '☀️' : '🌙'}</button>
    </div>
  </header>`;
}

function renderNotice(): string {
  return `<section class="notice">
    <strong>단위분수 크기 비교 · 로컬 AI 탐구 지원</strong>
    <p>M01: 길이가 같은 두 리본에서 1/3과 1/5 한 조각을 비교합니다.
       학생 개인정보 없이 수학 개념 설명을 입력하면 알맞은 탐구 카드를 추천합니다.</p>
  </section>`;
}

function renderInputSection(): string {
  return `<section>
    <h2>개념 설명 입력</h2>
    <label for="query">학생 이름·번호·개인 사정 없이 수학 개념상의 혼동만 적어 주세요.</label>
    <textarea id="query" maxlength="${MAX_QUERY_LENGTH}" rows="3"
      placeholder="예: 분모가 커지면 한 조각도 커진다고 생각해요."></textarea>
    <p id="count">0/${MAX_QUERY_LENGTH}자</p>
    <p class="hint">개인정보 필터는 보조 장치이며 완전한 익명화를 보장하지 않습니다.</p>
    <div class="buttons">
      <button id="prepare">모델 준비</button>
      <button id="infer" disabled>추천 실행</button>
      <button id="cancel" disabled>취소</button>
      <button id="reset">초기화</button>
      <button id="basic">기본 카드 보기</button>
      <button id="close">종료</button>
    </div>
    <p id="state" role="status">모델 상태: 미준비</p>
    <div id="progress" class="progress-container" hidden>
      <div class="progress-track">
        <div id="progress-fill" class="progress-fill" role="progressbar"
          aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" style="width: 0%"></div>
      </div>
      <p id="progress-text" class="progress-text"></p>
    </div>
    <p id="timing"></p>
  </section>`;
}

function renderResultSection(): string {
  return `<section id="result" aria-live="polite">
    <h2>결과</h2>
    <p>모델 준비 후 일반적인 개념 설명을 입력해 주세요.</p>
  </section>`;
}

function renderExamplesSection(): string {
  return `<section>
    <h2>예시 질문 모음</h2>
    <p>자주 나오는 학생 생각 예시를 눌러 바로 테스트해 볼 수 있습니다.</p>
    <ul id="examples"></ul>
    <div class="benchmark-panel" role="region" aria-label="임계값 시뮬레이터 및 일괄 검증">
      <h3>임계값 시뮬레이터 &amp; 일괄 검증</h3>
      <div class="slider-group">
        <label for="threshold-sim">최소 유사도 (<output id="threshold-sim-val">${customMinSim.toFixed(2)}</output>)
          <input id="threshold-sim" type="range" min="0.20" max="0.80" step="0.01" value="${customMinSim}">
        </label>
        <label for="threshold-margin">최소 격차 (<output id="threshold-margin-val">${customMinMargin.toFixed(3)}</output>)
          <input id="threshold-margin" type="range" min="0.000" max="0.200" step="0.005" value="${customMinMargin}">
        </label>
      </div>
      <div class="buttons">
        <button id="threshold-reset" type="button" class="secondary-btn">임계값 초기화</button>
        <button id="batch-eval" type="button" disabled>가상 질의 일괄 검증</button>
      </div>
      <div id="batch-table-container" aria-live="polite"></div>
    </div>
  </section>`;
}

function renderFooter(): string {
  return `<footer>입력과 결과는 실행 메모리에만 둡니다. 유사도는 정답 확률이나 학생 진단 정확도가 아닙니다.</footer>`;
}

/** 전체 페이지를 조합합니다. */
function renderApp() {
  app.innerHTML = [
    renderHeader(),
    renderNotice(),
    renderInputSection(),
    renderResultSection(),
    renderExamplesSection(),
    renderFooter(),
  ].join('');
}

// ─── 결과 렌더링 ─────────────────────────────────────────────────
function renderRecommendation(
  outcome: NonNullable<WorkerMessage['result']>,
  queryText: string,
  inferMs: number,
) {
  const result = $('result');
  result.dataset.hold = String(outcome.hold);
  result.replaceChildren();

  const title = document.createElement('h2');
  title.textContent = outcome.hold
    ? '이유를 더 확인해야 합니다'
    : 'AI 의미 비교 후보 · 교사 검토';
  result.append(title);

  const detail = document.createElement('p');
  detail.textContent = outcome.hold
    ? outcome.reason
    : '탐구 카드의 의미 유사도 순서입니다. 교사 확인 후 수업에 활용합니다.';
  result.append(detail);

  const list = document.createElement('ol');
  list.className = 'score-list';
  for (const score of outcome.scores) {
    const card = cards.find(c => c.id === score.id)!;
    const item = document.createElement('li');
    item.dataset.cardId = card.id;

    const label = document.createElement('span');
    label.className = 'score-label';
    label.textContent = card.title;
    item.append(label);

    const barTrack = document.createElement('div');
    barTrack.className = 'similarity-track';
    const barFill = document.createElement('div');
    barFill.className = 'similarity-fill';
    barFill.style.width = `${Math.max(0, Math.min(100, score.similarity * 100))}%`;
    barTrack.append(barFill);
    item.append(barTrack);

    const value = document.createElement('span');
    value.className = 'score-value';
    value.textContent = score.similarity.toFixed(3);
    item.append(value);

    list.append(item);
  }
  result.append(list);

  const note = document.createElement('p');
  note.textContent = `기본 키워드 검색: ${baseline(queryText)} · 준비 후 추론 ${Math.round(inferMs)}ms`;
  result.append(note);
}

function renderBasicCards() {
  lastInferData = undefined;
  const result = $('result');
  result.removeAttribute('data-hold');
  result.replaceChildren();

  const h = document.createElement('h2');
  h.textContent = '기본 탐구 카드';
  result.append(h);

  const list = document.createElement('ul');
  cards.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.title}: ${c.text}`;
    list.append(li);
  });
  result.append(list);
}

/** 예시 질의 일괄 검증 결과 표 렌더링. */
function renderBatchTable(items: BatchItem[], batchMs?: number) {
  const container = document.getElementById('batch-table-container');
  if (!container) return;
  const passCount = items.filter(it => it.pass).length;
  const timingNote = typeof batchMs === 'number' && batchMs > 0 ? ` · ${Math.round(batchMs)}ms` : '';

  container.innerHTML = `
    <p class="batch-summary">일괄 검증 결과: <strong>${passCount}/${items.length}건 기대값 일치</strong> (최소 유사도 ${customMinSim.toFixed(2)}, 최소 격차 ${customMinMargin.toFixed(3)}${timingNote})</p>
    <div class="table-scroll">
      <table class="batch-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>기대값</th>
            <th>판정</th>
            <th>일치</th>
            <th>최고 유사도</th>
            <th>1·2위 격차</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(it => `<tr class="${it.pass ? 'batch-row-pass' : 'batch-row-fail'}">
            <td>${it.id}</td>
            <td>${it.expected}</td>
            <td>${it.predicted}</td>
            <td>${it.pass ? '✅' : '⚠️'}</td>
            <td>${it.topSimilarity.toFixed(3)}</td>
            <td>${it.margin.toFixed(3)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/** 임계값 슬라이더 변경 시 기존 추론 결과 및 일괄 검증 표를 즉시 재판정. */
function reEvaluateWithThresholds() {
  const currentThresholds = { minSimilarity: customMinSim, minMargin: customMinMargin };
  if (lastInferData) {
    const rejudged = judge(lastInferData.scores, lastInferData.queryText, currentThresholds);
    renderRecommendation(rejudged, lastInferData.queryText, lastInferData.inferMs);
  }
  if (lastBatchItems) {
    const updated = lastBatchItems.map(item => {
      const outcome = judge(item.scores, item.text, currentThresholds);
      const predicted = outcome.hold ? 'hold' : (outcome.scores[0]?.id ?? 'hold');
      return {
        ...item,
        predicted,
        pass: predicted === item.expected,
        reason: outcome.reason,
      };
    });
    lastBatchItems = updated;
    renderBatchTable(updated);
  }
}

function resetThresholdsAndBatch() {
  customMinSim = thresholds.minSimilarity;
  customMinMargin = thresholds.minMargin;
  lastBatchItems = undefined;
  const simInput = document.getElementById('threshold-sim') as HTMLInputElement | null;
  const marginInput = document.getElementById('threshold-margin') as HTMLInputElement | null;
  const simVal = document.getElementById('threshold-sim-val');
  const marginVal = document.getElementById('threshold-margin-val');
  const container = document.getElementById('batch-table-container');
  if (simInput) simInput.value = String(customMinSim);
  if (marginInput) marginInput.value = String(customMinMargin);
  if (simVal) simVal.textContent = customMinSim.toFixed(2);
  if (marginVal) marginVal.textContent = customMinMargin.toFixed(3);
  if (container) container.replaceChildren();
}

// ─── Worker 관리 ─────────────────────────────────────────────────
function createWorker() {
  stopWorker();
  worker = new Worker(new URL('./ai.worker.ts', import.meta.url), { type: 'module' });

  worker.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
    if (data.requestId !== requestId || data.sessionRevision !== sessionRevision) return;

    if (data.type === 'progress' && typeof data.percent === 'number') {
      updateProgress(data.percent, data.file || '');
      return;
    }

    if ((data.type === 'ready' || data.type === 'result' || data.type === 'batch-result') && data.contract !== modelContract) {
      nextRevision();
      stopWorker();
      hideProgress();
      setState('실패');
      setResult('모델과 카드 색인의 버전이 일치하지 않습니다. 기본 카드로 계속해 주세요.');
      return;
    }

    if (data.type === 'ready') {
      ready = true;
      $<HTMLButtonElement>('infer').disabled = false;
      $<HTMLButtonElement>('batch-eval').disabled = false;
      $<HTMLButtonElement>('cancel').disabled = true;
      hideProgress();
      setState('준비됨');
      $('timing').textContent = [
        `모델 준비 전체 ${Math.round(data.prepareMs || 0)}ms`,
        `파일 로딩 ${Math.round(data.downloadMs || 0)}ms`,
        `초기화 ${Math.round(data.initMs || 0)}ms`,
        `카드 색인 ${Math.round(data.indexedMs || 0)}ms`,
        '(브라우저 로컬 측정)',
      ].join(' · ');
    } else if (data.type === 'result' && data.result) {
      clearTimer();
      $<HTMLButtonElement>('cancel').disabled = true;
      $<HTMLButtonElement>('infer').disabled = false;
      $<HTMLButtonElement>('batch-eval').disabled = false;
      setState('준비됨');
      const queryText = $<HTMLTextAreaElement>('query').value;
      const inferMs = data.inferMs || 0;
      lastInferData = { scores: data.result.scores, queryText, inferMs };
      renderRecommendation(data.result, queryText, inferMs);
    } else if (data.type === 'batch-result' && data.items) {
      clearTimer();
      $<HTMLButtonElement>('cancel').disabled = true;
      $<HTMLButtonElement>('infer').disabled = false;
      $<HTMLButtonElement>('batch-eval').disabled = false;
      setState('준비됨');
      lastBatchItems = data.items;
      renderBatchTable(data.items, data.batchMs || 0);
    } else if (data.type === 'error') {
      stopWorker();
      hideProgress();
      setState('실패');
      const code = data.errorCode ?? 'UNKNOWN';
      setResult(getUserMessage(code));
    }
  };

  worker.onerror = () => {
    stopWorker();
    hideProgress();
    setState('실패');
    setResult(getUserMessage('WORKER_INIT'));
  };
}

// ─── 이벤트 핸들러 ───────────────────────────────────────────────
function handlePrepare() {
  if (!checkWasmSupport()) {
    setResult(getUserMessage('WASM_UNSUPPORTED'));
    setState('실패');
    return;
  }
  nextRevision();
  createWorker();
  setState('준비 중');
  setResult('같은 출처의 모델과 WASM을 준비하고 있습니다.');
  $<HTMLButtonElement>('cancel').disabled = false;
  worker!.postMessage({ type: 'prepare', requestId, sessionRevision });
}

function handleInfer() {
  const query = $<HTMLTextAreaElement>('query');
  const text = query.value.trim();

  if (!ready || !text) {
    setResult('설명을 입력하고 모델을 준비해 주세요.');
    return;
  }
  if (sensitive(text)) {
    const type = detectSensitiveType(text);
    setResult(`연락처·식별 번호${type ? `(${type})` : ''}로 보이는 입력은 사용할 수 없습니다. 일반적인 개념 설명만 적어 주세요.`);
    return;
  }

  nextRevision();
  setState('추론 중');
  $<HTMLButtonElement>('infer').disabled = true;
  $<HTMLButtonElement>('batch-eval').disabled = true;
  $<HTMLButtonElement>('cancel').disabled = false;
  setResult('의미를 비교하고 있습니다.');
  worker!.postMessage({
    type: 'infer',
    requestId,
    sessionRevision,
    text,
    thresholds: { minSimilarity: customMinSim, minMargin: customMinMargin },
  });

  timeout = setTimeout(() => {
    nextRevision();
    stopWorker();
    setState('실패');
    setResult(getUserMessage('INFERENCE_TIMEOUT'));
  }, INFERENCE_TIMEOUT_MS);
}

function handleBatchEval() {
  if (!ready || !worker) return;
  nextRevision();
  setState('추론 중');
  $<HTMLButtonElement>('infer').disabled = true;
  $<HTMLButtonElement>('batch-eval').disabled = true;
  $<HTMLButtonElement>('cancel').disabled = false;
  worker.postMessage({
    type: 'batch-eval',
    requestId,
    sessionRevision,
    thresholds: { minSimilarity: customMinSim, minMargin: customMinMargin },
  });
}

function handleCancel() {
  nextRevision();
  stopWorker();
  hideProgress();
  setState('취소');
  setResult('요청을 취소했습니다. 기본 카드로 계속할 수 있습니다.');
}

function handleReset() {
  nextRevision();
  stopWorker();
  hideProgress();
  resetThresholdsAndBatch();
  $<HTMLTextAreaElement>('query').value = '';
  $('count').textContent = `0/${MAX_QUERY_LENGTH}자`;
  $('timing').textContent = '';
  setState('미준비');
  setResult('초기화했습니다. 이전 결과는 사용할 수 없습니다.');
}

function handleClose() {
  nextRevision();
  stopWorker();
  hideProgress();
  resetThresholdsAndBatch();
  $<HTMLTextAreaElement>('query').value = '';
  $('count').textContent = `0/${MAX_QUERY_LENGTH}자`;
  $('timing').textContent = '';
  setState('미준비');
  setResult('종료했습니다. 수업 입력과 결과를 메모리에서 비웠습니다.');
}

function handleQueryInput() {
  const query = $<HTMLTextAreaElement>('query');
  const result = $('result');
  const state = $('state');
  const hadRecommendation = result.hasAttribute('data-hold');
  const wasInferring = state.textContent?.includes('추론 중');

  $('count').textContent = `${query.value.length}/${MAX_QUERY_LENGTH}자`;

  if (hadRecommendation || wasInferring) nextRevision();
  if (wasInferring) {
    stopWorker();
    setState('취소');
  }
  if (hadRecommendation || wasInferring) {
    setResult('입력을 수정했습니다. 이전 추천은 무효입니다. 다시 실행해 주세요.');
  }
}

function clearNavigationSession() {
  nextRevision();
  stopWorker();
  hideProgress();
  resetThresholdsAndBatch();
  $<HTMLTextAreaElement>('query').value = '';
  $('count').textContent = `0/${MAX_QUERY_LENGTH}자`;
  $('timing').textContent = '';
  setState('미준비');
  setResult('이전 입력과 추천을 지웠습니다. 모델을 다시 준비해 주세요.');
}

// ─── 초기화 ──────────────────────────────────────────────────────
renderApp();

$('prepare').addEventListener('click', handlePrepare);
$('infer').addEventListener('click', handleInfer);
$('batch-eval').addEventListener('click', handleBatchEval);
$('cancel').addEventListener('click', handleCancel);
$('reset').addEventListener('click', handleReset);
$('close').addEventListener('click', handleClose);
$('basic').addEventListener('click', renderBasicCards);
$<HTMLTextAreaElement>('query').addEventListener('input', handleQueryInput);
$<HTMLInputElement>('threshold-sim').addEventListener('input', event => {
  customMinSim = Number((event.target as HTMLInputElement).value);
  $('threshold-sim-val').textContent = customMinSim.toFixed(2);
  reEvaluateWithThresholds();
});
$<HTMLInputElement>('threshold-margin').addEventListener('input', event => {
  customMinMargin = Number((event.target as HTMLInputElement).value);
  $('threshold-margin-val').textContent = customMinMargin.toFixed(3);
  reEvaluateWithThresholds();
});
$('threshold-reset').addEventListener('click', () => {
  customMinSim = thresholds.minSimilarity;
  customMinMargin = thresholds.minMargin;
  $<HTMLInputElement>('threshold-sim').value = String(customMinSim);
  $<HTMLInputElement>('threshold-margin').value = String(customMinMargin);
  $('threshold-sim-val').textContent = customMinSim.toFixed(2);
  $('threshold-margin-val').textContent = customMinMargin.toFixed(3);
  reEvaluateWithThresholds();
});
$('theme-toggle').addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  $('theme-toggle').textContent = next === 'dark' ? '☀️' : '🌙';
  $('theme-toggle').setAttribute('aria-pressed', String(next === 'dark'));
});
$('scale-toggle').addEventListener('click', () => {
  const html = document.documentElement;
  const current = html.getAttribute('data-scale');
  const next = current === 'large' ? 'normal' : 'large';
  html.setAttribute('data-scale', next);
  $('scale-toggle').textContent = next === 'large' ? '🔍 기본' : '🔍 큰글씨';
  $('scale-toggle').setAttribute('aria-pressed', String(next === 'large'));
});

const exList = $('examples');
examples.forEach(e => {
  const li = document.createElement('li');
  const b = document.createElement('button');
  b.textContent = `${e.id}: ${e.text}`;
  b.addEventListener('click', () => {
    const query = $<HTMLTextAreaElement>('query');
    query.value = e.text;
    query.dispatchEvent(new Event('input'));
  });
  li.append(b);
  exList.append(li);
});

window.addEventListener('pagehide', clearNavigationSession);
window.addEventListener('pageshow', event => {
  if (event.persisted) clearNavigationSession();
});
