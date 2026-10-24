import { readFile, readdir, mkdir, copyFile } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';

const targetArg = process.argv[2];
if (!targetArg) throw new Error('Usage: node scripts/stage-pages-lesson.mjs <empty-stage-directory>');
const target = resolve(targetArg);
const dist = resolve(import.meta.dirname, '../dist');
const html = await readFile(join(dist, 'lesson.html'), 'utf8');
if (!html.includes('<title>생각의 갈림길 AI · 단위분수 비교 수업</title>')) throw new Error('Missing lesson page title');
const references = [...html.matchAll(/(?:src|href)="(\/Thinking\/assets\/[^"\s]+)"/g)].map(match => match[1]);
const assets = [...new Set(references.map(reference => reference.split('/').at(-1)))];
if (assets.length !== 3 || !assets.some(name => /^lesson-.+\.js$/.test(name)) || !assets.some(name => /^lesson-.+\.css$/.test(name)) || !assets.some(name => /^(?:modulepreload-polyfill|constants)-.+\.js$/.test(name))) throw new Error('Unexpected lesson asset graph');
if (assets.some(name => basename(name) !== name)) throw new Error('Unexpected asset path');
try { await readdir(target); throw new Error('Stage directory already exists'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(join(target, 'assets'), { recursive: true });
await copyFile(join(dist, 'lesson.html'), join(target, 'lesson.html'));
await copyFile(join(dist, 'lesson.html'), join(target, 'index.html'));
for (const asset of assets) await copyFile(join(dist, 'assets', asset), join(target, 'assets', asset));
const staged = await readdir(join(target, 'assets'));
if (staged.length !== 3) throw new Error('Staged asset count mismatch');
console.log(JSON.stringify({ staged: ['index.html', 'lesson.html', ...staged.map(name => `assets/${name}`)], omitted: 'local ONNX model, WASM, holdout TSV' }, null, 2));
