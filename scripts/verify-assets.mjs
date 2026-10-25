import { existsSync, readFileSync } from 'node:fs';
import { verifyAssets } from './asset-integrity.mjs';
const manifest = JSON.parse(readFileSync(new URL('../model-assets.json', import.meta.url)));
const root = new URL('../public/', import.meta.url);
const firstAsset = Object.keys(manifest.files)[0];
if (process.env.REQUIRE_ASSETS !== '1' && firstAsset && !existsSync(new URL(firstAsset, root))) {
  console.log('Skipped local model asset check (public/models not downloaded; run "npm run fetch:assets" when testing local ONNX assets).');
} else {
  const { count, total } = verifyAssets(root, manifest);
  console.log(`Verified ${count} assets, ${total} bytes, ${(total / 1048576).toFixed(2)} MiB`);
}
