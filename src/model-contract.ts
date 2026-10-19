import manifest from '../model-assets.json';
import { cards } from './cards';

export const embedding = {
  model: 'm01',
  device: 'wasm',
  dtype: 'q8',
  numThreads: 1,
  pooling: 'mean',
  normalize: true,
} as const;

// The main thread and Worker are separate bundles. Compare their complete
// declared model/index contract before accepting any recommendation.
export const modelContract = JSON.stringify({
  source: manifest.source,
  revision: manifest.revision,
  runtime: manifest.runtime,
  files: manifest.files,
  embedding,
  index: cards.map(({ id, hint, text }) => ({ id, hint, text })),
});
