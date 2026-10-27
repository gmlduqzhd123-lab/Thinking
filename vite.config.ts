import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: process.env.APP_BASE || '/',
  build: {
    target: 'es2022',
    rollupOptions: {
      output: { manualChunks: { 'qr-encoder': ['qrcode-generator'] } },
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        lesson: resolve(import.meta.dirname, 'lesson.html'),
        lessonAi: resolve(import.meta.dirname, 'lesson-ai.html'),
      },
    },
  },
});
