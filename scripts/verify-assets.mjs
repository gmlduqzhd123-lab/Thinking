import { readFileSync } from 'node:fs';
import { verifyAssets } from './asset-integrity.mjs';
const manifest = JSON.parse(readFileSync(new URL('../model-assets.json', import.meta.url)));
const root = new URL('../public/', import.meta.url);
const { count, total } = verifyAssets(root, manifest);
console.log(`Verified ${count} assets, ${total} bytes, ${(total / 1048576).toFixed(2)} MiB`);
