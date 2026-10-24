import { env, pipeline } from '@huggingface/transformers';
import { cards, examples } from './cards';
import { judge, type ThresholdOptions } from './judge';
import { embedding, modelContract } from './model-contract';
import { requireUnitEmbedding } from './embedding-integrity';

type Msg = {
  type: 'prepare' | 'infer' | 'batch-eval';
  requestId: number;
  sessionRevision: number;
  text?: string;
  thresholds?: ThresholdOptions;
};
const base = new URL(import.meta.env.BASE_URL, self.location.origin).href;
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = new URL('models/', base).href;
env.useBrowserCache = false;
env.useFSCache = false;
env.backends.onnx.wasm!.numThreads = embedding.numThreads;
env.backends.onnx.wasm!.wasmPaths = new URL('wasm/', base).href;
let extractor: any;
let preparing: Promise<void> | undefined;
let cardVectors: number[][] = [];
let prepareMetrics = { downloadMs: 0, initMs: 0, indexedMs: 0 };
let activeRequest = { requestId: 0, sessionRevision: 0 };

function send(type: string, requestId: number, sessionRevision: number, extra: Record<string, unknown> = {}) {
  self.postMessage({ type, requestId, sessionRevision, ...extra });
}

function cosine(a: number[], b: number[]) {
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; aa += a[i] ** 2; bb += b[i] ** 2; }
  return dot / (Math.sqrt(aa) * Math.sqrt(bb));
}

async function embed(text: string): Promise<number[]> {
  const output = await (extractor as any)(text, { pooling: embedding.pooling, normalize: embedding.normalize });
  return requireUnitEmbedding(output.data as Float32Array, embedding.dimension);
}

async function prepare(rid: number, rev: number) {
  activeRequest = { requestId: rid, sessionRevision: rev };
  if (!preparing) preparing = (async () => {
    const start = performance.now();
    let firstTransfer = 0;
    let lastTransfer = 0;

    extractor = await pipeline('feature-extraction', embedding.model, {
      device: embedding.device,
      dtype: embedding.dtype,
      progress_callback: (progress: { status: string; progress?: number; file?: string }) => {
        const now = performance.now();
        if (progress.status === 'initiate' && !firstTransfer) firstTransfer = now;
        if (progress.status === 'done') lastTransfer = now;

        // 다운로드 진행률을 최신 요청 기준으로 메인 스레드에 전달
        if (typeof progress.progress === 'number') {
          send('progress', activeRequest.requestId, activeRequest.sessionRevision, {
            percent: Math.round(progress.progress),
            file: progress.file || '',
          });
        }
      },
    });

    const loaded = performance.now();
    const vectorStart = performance.now();
    cardVectors = await Promise.all(cards.map(c => embed(`${c.hint} ${c.text}`)));
    prepareMetrics = {
      downloadMs: firstTransfer && lastTransfer ? lastTransfer - firstTransfer : 0,
      initMs: loaded - Math.max(lastTransfer, start),
      indexedMs: performance.now() - vectorStart,
    };
  })().then(() => undefined).catch(e => {
    preparing = undefined;
    extractor = undefined;
    cardVectors = [];
    throw e;
  });
  await preparing;
}

self.onmessage = async (event: MessageEvent<Msg>) => {
  const { type, requestId, sessionRevision, text, thresholds } = event.data;
  try {
    if (type === 'prepare') {
      const start = performance.now();
      await prepare(requestId, sessionRevision);
      send('ready', requestId, sessionRevision, {
        contract: modelContract,
        prepareMs: performance.now() - start,
        ...prepareMetrics,
      });
    } else if (type === 'infer' && text) {
      await prepare(requestId, sessionRevision);
      const start = performance.now();
      const v = await embed(text);
      const scores = cards.map((c, i) => ({ id: c.id, similarity: cosine(v, cardVectors[i]) }));
      send('result', requestId, sessionRevision, {
        contract: modelContract,
        result: judge(scores, text, thresholds),
        inferMs: performance.now() - start,
      });
    } else if (type === 'batch-eval') {
      await prepare(requestId, sessionRevision);
      const start = performance.now();
      const items = [];
      for (const ex of examples) {
        const v = await embed(ex.text);
        const scores = cards.map((c, i) => ({ id: c.id, similarity: cosine(v, cardVectors[i]) }));
        const outcome = judge(scores, ex.text, thresholds);
        const predicted = outcome.hold ? 'hold' : (outcome.scores[0]?.id ?? 'hold');
        items.push({
          id: ex.id,
          text: ex.text,
          expected: ex.expected,
          predicted,
          pass: predicted === ex.expected,
          topSimilarity: outcome.scores[0]?.similarity ?? 0,
          margin: outcome.scores.length > 1 ? outcome.scores[0].similarity - outcome.scores[1].similarity : 0,
          scores: outcome.scores,
          reason: outcome.reason,
        });
      }
      send('batch-result', requestId, sessionRevision, {
        contract: modelContract,
        items,
        batchMs: performance.now() - start,
      });
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    const code = detail.includes('WebAssembly') ? 'WASM_UNSUPPORTED'
      : detail.includes('fetch') || detail.includes('network') ? 'MODEL_DOWNLOAD'
      : 'UNKNOWN';
    send('error', requestId, sessionRevision, { errorCode: code, errorDetail: detail });
  }
};
