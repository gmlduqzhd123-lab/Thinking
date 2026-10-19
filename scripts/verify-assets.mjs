import { readFileSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(readFileSync(new URL('../model-assets.json', import.meta.url)));
const root = new URL('../public/', import.meta.url);
let total = 0;
for (const [name, [bytes, hash]] of Object.entries(manifest.files)) {
  const file = new URL(name, root);
  if (!existsSync(file)) throw new Error(`Missing asset: ${name}`);
  if (statSync(file).size !== bytes) throw new Error(`Size mismatch: ${name}`);
  if (createHash('sha256').update(readFileSync(file)).digest('hex') !== hash) throw new Error(`Hash mismatch: ${name}`);
  total += bytes;
}
console.log(`Verified ${Object.keys(manifest.files).length} assets, ${total} bytes, ${(total / 1048576).toFixed(2)} MiB`);
