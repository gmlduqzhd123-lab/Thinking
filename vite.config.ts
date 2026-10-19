import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({ base: process.env.APP_BASE || '/', build: { target: 'es2022', rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), lesson: resolve(import.meta.dirname, 'lesson.html') } } } });
