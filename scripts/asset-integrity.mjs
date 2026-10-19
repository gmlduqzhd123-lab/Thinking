import { readFileSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
export function verifyAssets(root, manifest) {
  let total = 0;
  for (const [name, [bytes, hash]] of Object.entries(manifest.files)) {
    const file = new URL(name, root);
    if (!existsSync(file)) throw new Error(`Missing asset: ${name}`);
    if (statSync(file).size !== bytes) throw new Error(`Size mismatch: ${name}`);
    if (createHash('sha256').update(readFileSync(file)).digest('hex') !== hash) throw new Error(`Hash mismatch: ${name}`);
    total += bytes;
  }
  return { count: Object.keys(manifest.files).length, total };
}
