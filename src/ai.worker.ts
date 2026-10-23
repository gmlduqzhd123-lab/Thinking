import { env, pipeline } from '@huggingface/transformers';
import { cards } from './cards';
import { judge } from './judge';
import { embedding, modelContract } from './model-contract';
import { requireUnitEmbedding } from './embedding-integrity';

type Msg = { type: 'prepare' | 'infer'; requestId: number; sessionRevision: number; text?: string };
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

        // 다운로드 진행률을 메인 스레드에 전달
        if (typeof progress.progress === 'number') {
          send('progress', rid, rev, {
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
  })().then(() => undefined).catch(e => { preparing = undefined; throw e; });
  await preparing;
}

self.onmessage = async (event: MessageEvent<Msg>) => {
  const { type, requestId, sessionRevision, text } = event.data;
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
        result: judge(scores, text),
        inferMs: performance.now() - start,
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
