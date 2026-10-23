import { cards, examples, baseline } from './cards';
import { modelContract } from './model-contract';
import { sensitive } from './privacy';
import { INFERENCE_TIMEOUT_MS, MAX_QUERY_LENGTH } from './constants';
import './style.css';

// ─── 타입 ────────────────────────────────────────────────────────
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
  percent?: number;
  file?: string;
  result?: {
    hold: boolean;
    reason: string;
    scores: { id: string; similarity: number }[];
  };
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

// ─── 상태 업데이트 함수 ──────────────────────────────────────────
function setState(label: string) {
  $('state').textContent = `모델 상태: ${label}`;
}

function setResult(message: string) {
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
}

function nextRevision() {
  sessionRevision++;
  requestId++;
  clearTimer();
}

// ─── 진행률 업데이트 (#7) ────────────────────────────────────────
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
  return `<header>
    <p class="eyebrow">M0 · 로컬 AI 기술 검증</p>
    <h1>생각의 갈림길 AI</h1>
    <p>정답을 알려 주는 AI가 아니라, 생각을 바꾸는 탐구를 돕는 AI</p>
  </header>`;
}

function renderNotice(): string {
  return `<section class="notice">
    <strong>개발판 · 가상 예시</strong>
    <p>M01: 길이가 같은 두 리본에서 1/3과 1/5 한 조각을 비교합니다.
       아래 자료는 개발자가 쓴 초안이며 교사 검수를 받지 않았습니다.
       실제 수업용으로 사용하지 마세요.</p>
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
    <h2>가상 개발 질의</h2>
    <p>개발자 작성 · 교사 검수 미완료. 시험 기대값은 진단 정답이 아닙니다.</p>
    <ul id="examples"></ul>
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

// ─── 결과 렌더링 (#5 유사도 시각화) ──────────────────────────────
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
    : 'AI 의미 비교 후보 · 교사 검토 필요';
  result.append(title);

  const detail = document.createElement('p');
  detail.textContent = outcome.hold
    ? outcome.reason
    : '가상 초안 카드의 의미 유사도 순서입니다. 교사 승인 전 자동 전환되지 않습니다.';
  result.append(detail);

  // 유사도 시각화 (#5)
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
  const result = $('result');
  result.removeAttribute('data-hold');
  result.replaceChildren();

  const h = document.createElement('h2');
  h.textContent = '기본 탐구 카드 · 개발자 초안';
  result.append(h);

  const list = document.createElement('ul');
  cards.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.title}: ${c.text}`;
    list.append(li);
  });
  result.append(list);
}

// ─── Worker 관리 ─────────────────────────────────────────────────
function createWorker() {
  stopWorker();
  worker = new Worker(new URL('./ai.worker.ts', import.meta.url), { type: 'module' });

  worker.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
    if (data.requestId !== requestId || data.sessionRevision !== sessionRevision) return;

    // 진행률 업데이트 (#7)
    if (data.type === 'progress' && typeof data.percent === 'number') {
      updateProgress(data.percent, data.file || '');
      return;
    }

    // 계약 불일치 검사
    if ((data.type === 'ready' || data.type === 'result') && data.contract !== modelContract) {
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
      setState('준비됨');
      renderRecommendation(data.result, $<HTMLTextAreaElement>('query').value, data.inferMs || 0);
    } else if (data.type === 'error') {
      stopWorker();
      hideProgress();
      setState('실패');
      setResult('모델 파일 또는 실행 환경을 확인해 주세요. 기본 카드로 계속할 수 있습니다.');
    }
  };

  worker.onerror = () => {
    stopWorker();
    hideProgress();
    setState('실패');
    setResult('모델을 실행하지 못했습니다. 기본 카드로 계속할 수 있습니다.');
  };
}

// ─── 이벤트 핸들러 ───────────────────────────────────────────────
function handlePrepare() {
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
    setResult('연락처·식별 번호로 보이는 입력은 사용할 수 없습니다. 일반적인 개념 설명만 적어 주세요.');
    return;
  }

  nextRevision();
  setState('추론 중');
  $<HTMLButtonElement>('infer').disabled = true;
  $<HTMLButtonElement>('cancel').disabled = false;
  setResult('의미를 비교하고 있습니다.');
  worker!.postMessage({ type: 'infer', requestId, sessionRevision, text });

  timeout = setTimeout(() => {
    nextRevision();
    stopWorker();
    setState('실패');
    setResult('추론이 10초를 넘어 기본 탐구로 전환합니다. 기본 카드를 열어 주세요.');
  }, INFERENCE_TIMEOUT_MS);
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
$('cancel').addEventListener('click', handleCancel);
$('reset').addEventListener('click', handleReset);
$('close').addEventListener('click', handleClose);
$('basic').addEventListener('click', renderBasicCards);
$<HTMLTextAreaElement>('query').addEventListener('input', handleQueryInput);

// 가상 개발 질의 목록 렌더
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

// 페이지 이동/복귀 시 세션 초기화
window.addEventListener('pagehide', clearNavigationSession);
window.addEventListener('pageshow', event => {
  if (event.persisted) clearNavigationSession();
});
