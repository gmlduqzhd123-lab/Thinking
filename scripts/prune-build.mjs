import { readdirSync, unlinkSync } from 'node:fs';
const dir = new URL('../dist/assets/', import.meta.url);
for (const name of readdirSync(dir)) {
  if (/^ort-wasm-simd-threaded\.jsep-[\w-]+\.wasm$/.test(name)) {
    unlinkSync(new URL(name, dir));
    console.log(`Removed unused duplicate: ${name}`);
  }
}
