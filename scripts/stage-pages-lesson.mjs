import { readFile, readdir, mkdir, copyFile } from 'node:fs/promises';
import { resolve, join, basename } from 'node:path';

const targetArg = process.argv[2];
if (!targetArg) throw new Error('Usage: node scripts/stage-pages-lesson.mjs <empty-stage-directory>');
const target = resolve(targetArg);
const dist = resolve(import.meta.dirname, '../dist');
const html = await readFile(join(dist, 'lesson.html'), 'utf8');
if (!html.includes('<title>M01 단위분수 비교 · 개발용 수업</title>') || !html.includes('noindex, nofollow')) throw new Error('Missing development-preview labels');
const references = [...html.matchAll(/(?:src|href)="(\/Thinking\/assets\/[^"\s]+)"/g)].map(match => match[1]);
const assets = [...new Set(references.map(reference => reference.split('/').at(-1)))];
if (assets.length !== 3 || !assets.some(name => /^lesson-.+\.js$/.test(name)) || !assets.some(name => /^lesson-.+\.css$/.test(name)) || !assets.some(name => /^(?:modulepreload-polyfill|constants)-.+\.js$/.test(name))) throw new Error('Unexpected lesson asset graph');
if (assets.some(name => basename(name) !== name)) throw new Error('Unexpected asset path');
try { await readdir(target); throw new Error('Stage directory already exists'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(join(target, 'assets'), { recursive: true });
await copyFile(join(dist, 'lesson.html'), join(target, 'lesson.html'));
for (const asset of assets) await copyFile(join(dist, 'assets', asset), join(target, 'assets', asset));
const staged = await readdir(join(target, 'assets'));
if (staged.length !== 3) throw new Error('Staged asset count mismatch');
console.log(JSON.stringify({ staged: ['lesson.html', ...staged.map(name => `assets/${name}`)], omitted: 'M0 model, WASM, holdout draft, M0 app' }, null, 2));
