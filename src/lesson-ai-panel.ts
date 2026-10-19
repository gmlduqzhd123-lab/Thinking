import { cards } from './cards';
import { modelContract } from './model-contract';

type Outcome = { hold: boolean; reason: string; scores: { id: string; similarity: number }[] };
type WorkerReply = { type: string; requestId: number; sessionRevision: number; contract?: string; result?: Outcome };
type State = '미준비' | '준비 중' | '준비됨' | '추론 중' | '취소' | '실패';

export function createLessonAiPanel(root: HTMLElement) {
  let active = false;
  let worker: Worker | undefined;
  let requestId = 0;
  let sessionRevision = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let state: State = '미준비';
  let query = '';
  let message = '모델을 준비한 뒤 일반적인 개념 설명을 입력해 주세요.';
  let candidate: (typeof cards)[number] | undefined;
  let approved = false;

  function clearTimer() { if (timer) clearTimeout(timer); timer = undefined; }
  function invalidate() { requestId++; sessionRevision++; clearTimer(); candidate = undefined; approved = false; }
  function stopWorker() { clearTimer(); worker?.terminate(); worker = undefined; }
  function reset() {
    invalidate(); stopWorker(); state = '미준비'; query = '';
    message = '이전 입력과 AI 후보를 지웠습니다.';
  }
  function sensitive(value: string) {
    return /\b\d{2,3}[- ]?\d{3,4}[- ]?\d{4}\b|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b\d{6}[- ]?\d{7}\b/.test(value);
  }
  function draw() {
    if (!active) return;
    root.querySelector('#lesson-ai-panel')?.remove();
    const panel = document.createElement('section');
    panel.id = 'lesson-ai-panel';
    panel.setAttribute('aria-label', '개발용 로컬 AI 후보');
    panel.innerHTML = `<h2>로컬 AI 후보 · 개발 전용</h2><p>위의 기본 이유 카드와 별개입니다. 학생 이름·번호·발언 원문 없이 수학 개념상의 혼동만 적어 주세요.</p><label for="lesson-ai-query">일반적인 개념 설명</label><textarea id="lesson-ai-query" maxlength="160" rows="3" autocomplete="off"></textarea><p>개인정보 필터는 보조 장치이며 완전한 익명화를 보장하지 않습니다.</p><div class="actions"><button type="button" data-ai="prepare">모델 준비</button><button type="button" data-ai="infer" ${state === '준비됨' ? '' : 'disabled'}>AI 후보 요청</button><button type="button" data-ai="cancel" ${state === '준비 중' || state === '추론 중' ? '' : 'disabled'}>AI 요청 취소</button></div><p id="lesson-ai-state" role="status">모델 상태: ${state}</p><div id="lesson-ai-result" aria-live="polite"></div>`;
    root.querySelector('#step')?.after(panel);
    const input = panel.querySelector<HTMLTextAreaElement>('#lesson-ai-query')!;
    input.value = query;
    const result = panel.querySelector<HTMLElement>('#lesson-ai-result')!;
    const detail = document.createElement('p'); detail.textContent = message; result.append(detail);
    if (candidate) {
      const heading = document.createElement('h3'); heading.textContent = approved ? '교사가 이 세션에서 확인한 카드' : 'AI 후보 · 교사 확인 전'; result.append(heading);
      const title = document.createElement('p'); title.textContent = candidate.title; result.append(title);
      if (approved) {
        const body = document.createElement('p'); body.textContent = candidate.text; result.append(body);
      } else {
        const approve = document.createElement('button'); approve.type = 'button'; approve.dataset.ai = 'approve'; approve.textContent = '교사가 후보 카드 확인'; result.append(approve);
      }
    }
    input.addEventListener('input', () => {
      query = input.value;
      if (candidate || state === '추론 중') {
        invalidate();
        if (state === '추론 중') { stopWorker(); state = '취소'; }
        message = '입력을 수정해 이전 추천과 확인을 무효화했습니다. 다시 요청해 주세요.';
        draw();
      }
    });
    panel.addEventListener('click', event => {
      const action = (event.target as HTMLElement).closest<HTMLButtonElement>('button')?.dataset.ai;
      if (action === 'prepare') prepare();
      if (action === 'infer') infer();
      if (action === 'cancel') { invalidate(); stopWorker(); state = '취소'; message = '요청을 취소했습니다. 기본 탐구로 계속할 수 있습니다.'; draw(); }
      if (action === 'approve' && candidate) { approved = true; message = '교사가 이 세션에서 후보를 확인했습니다. 교육 자료 검수 완료를 뜻하지 않습니다.'; draw(); }
    });
  }
  function fail(reason: string) {
    invalidate(); stopWorker(); state = '실패'; message = `${reason} 기본 이유 카드와 탐구로 계속해 주세요.`; draw();
  }
  function prepare() {
    invalidate(); stopWorker(); state = '준비 중'; message = '같은 출처의 모델과 WASM을 준비하고 있습니다.';
    worker = new Worker(new URL('./ai.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }: MessageEvent<WorkerReply>) => {
      if (!active || data.requestId !== requestId || data.sessionRevision !== sessionRevision) return;
      if ((data.type === 'ready' || data.type === 'result') && data.contract !== modelContract) { fail('모델과 카드 색인의 버전이 일치하지 않습니다.'); return; }
      if (data.type === 'ready') { state = '준비됨'; message = '모델이 준비됐습니다. 교사의 일반적인 개념 설명만 입력해 주세요.'; draw(); }
      else if (data.type === 'error') fail('모델을 실행하지 못했습니다.');
      else if (data.type === 'result') {
        clearTimer(); state = '준비됨';
        const outcome = data.result;
        const top = outcome?.scores[0];
        candidate = !outcome?.hold && top && Number.isFinite(top.similarity) ? cards.find(card => card.id === top.id) : undefined;
        approved = false;
        message = outcome?.hold ? `판단 보류: ${outcome.reason}` : candidate ? '모델의 의미 비교 후보입니다. 교사가 확인하기 전에는 카드 내용을 열지 않습니다.' : '유효한 후보가 없어 판단을 보류합니다.';
        draw();
      }
    };
    worker.onerror = () => fail('모델 오류가 발생했습니다.');
    worker.postMessage({ type: 'prepare', requestId, sessionRevision }); draw();
  }
  function infer() {
    const text = query.trim();
    if (state !== '준비됨' || !worker || !text) { message = '설명을 입력하고 모델을 준비해 주세요.'; draw(); return; }
    if (sensitive(text)) { message = '연락처·식별 번호로 보이는 입력은 사용할 수 없습니다.'; draw(); return; }
    invalidate(); state = '추론 중'; message = '의미를 비교하고 있습니다.';
    worker.postMessage({ type: 'infer', requestId, sessionRevision, text });
    timer = setTimeout(() => fail('추론이 10초를 넘었습니다.'), 10_000); draw();
  }
  return {
    sync(isActive: boolean) {
      if (!isActive) { if (active) reset(); active = false; return; }
      active = true; draw();
    },
    dispose() { reset(); active = false; },
  };
}
