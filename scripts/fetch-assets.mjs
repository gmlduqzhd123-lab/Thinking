import { readFileSync, mkdirSync, createWriteStream, renameSync, unlinkSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const manifest = JSON.parse(readFileSync(new URL('../model-assets.json', import.meta.url)));
for (const [name, [bytes, expectedHash]] of Object.entries(manifest.files)) {
  const dest = new URL(`../public/${name}`, import.meta.url);
  mkdirSync(dirname(fileURLToPath(dest)), { recursive: true });
  const temp = `${fileURLToPath(dest)}.part`;
  try {
    if (name.startsWith('wasm/')) {
      const source = new URL(`../node_modules/onnxruntime-web/dist/${name.slice(5)}`, import.meta.url);
      copyFileSync(source, temp);
    } else {
      const url = `https://huggingface.co/${manifest.source}/resolve/${manifest.revision}/${name.replace('models/m01/', '')}`;
      const response = await fetch(url, { redirect: 'follow' });
      if (!response.ok || !response.body) throw new Error(`Download failed for ${name}: HTTP ${response.status}`);
      await pipeline(Readable.fromWeb(response.body), createWriteStream(temp));
    }
    const data = readFileSync(temp);
    if (data.length !== bytes || createHash('sha256').update(data).digest('hex') !== expectedHash) throw new Error(`Integrity check failed for ${name}`);
    renameSync(temp, dest);
    console.log(`Verified ${name} (${bytes} bytes)`);
  } catch (error) {
    try { unlinkSync(temp); } catch { }
    throw error;
  }
}
