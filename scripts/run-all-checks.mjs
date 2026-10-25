/**
 * 통합 무결성 검증 러너 (v1.0.0).
 * 1. TypeScript 타입 검사 (tsc --noEmit)
 * 2. 단위 테스트 (node --test)
 * 3. 빌드 산출물(dist/assets) 용량 가드 및 중복 WASM 부재 검증
 * 4. 공유 도메인(gmlduqzhd123-lab.github.io) 다른 앱 보호 규칙(CLAUDE.md) 및 개발용 문구 제거 정적 검사
 * 5. 로컬 프리뷰 서버 자동 기동 → E2E 검증 (lesson-check, e2e-features) → 서버 자동 종료 (데몬 잔류 원천 방지)
 */

import { spawn, execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PORT = Number(process.env.TEST_PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}/`;
const WITH_AI = process.argv.includes('--with-ai');
const isWin = process.platform === 'win32';

function runStep(title, cmd, args, extraEnv = {}) {
  console.log(`\n▶ [검증] ${title}...`);
  const execBin = cmd === 'node' ? process.execPath : cmd;
  execFileSync(execBin, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
}

function checkBundleSizes() {
  console.log('\n▶ [검증] 빌드 산출물(dist/assets) 용량 가드 확인...');
  const assetsDir = join(ROOT, 'dist', 'assets');
  if (!existsSync(assetsDir)) {
    throw new Error('dist/assets 디렉토리가 없습니다. 먼저 npm run build를 실행하세요.');
  }
  const files = readdirSync(assetsDir);
  const lessonJs = files.find(f => /^lesson-(?!ai-panel).+\.js$/.test(f));
  const lessonCss = files.find(f => /^lesson-.+\.css$/.test(f));
  const duplicateJsep = files.find(f => /^ort-wasm-simd-threaded\.jsep-[\w-]+\.wasm$/.test(f));

  if (!lessonJs || !lessonCss) {
    throw new Error('필수 수업 번들(lesson-*.js / lesson-*.css)이 누락되었습니다.');
  }
  if (duplicateJsep) {
    throw new Error(`불필요한 중복 WASM 파일이 남아 있습니다: ${duplicateJsep}`);
  }

  const jsSizeKb = statSync(join(assetsDir, lessonJs)).size / 1024;
  const cssSizeKb = statSync(join(assetsDir, lessonCss)).size / 1024;
  if (jsSizeKb > 85) {
    throw new Error(`lesson JS 번들 크기(${jsSizeKb.toFixed(1)}KB)가 상한(85KB)을 초과했습니다.`);
  }
  if (cssSizeKb > 40) {
    throw new Error(`lesson CSS 번들 크기(${cssSizeKb.toFixed(1)}KB)가 상한(40KB)을 초과했습니다.`);
  }
  console.log(`✅ 번들 용량 정상: ${lessonJs} (${jsSizeKb.toFixed(1)}KB), ${lessonCss} (${cssSizeKb.toFixed(1)}KB)`);
}

function checkSharedOriginAndProductionCopy() {
  console.log('\n▶ [검증] 공유 도메인 보호 규칙(CLAUDE.md) 및 정식 출시 문구 검사...');
  const srcDir = join(ROOT, 'src');
  const collectFiles = dir => {
    const out = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) out.push(...collectFiles(full));
      else if (entry.name.endsWith('.ts')) out.push(full);
    }
    return out;
  };
  const forbiddenPatterns = [
    { regex: /localStorage\.clear\s*\(/, desc: 'localStorage.clear() 사용 금지' },
    { regex: /sessionStorage\.clear\s*\(/, desc: 'sessionStorage.clear() 사용 금지' },
    { regex: /caches\.keys\s*\(\)\.then\([^)]*caches\.delete/, desc: '이름 필터 없는 caches 전체 삭제 금지' },
  ];
  for (const file of collectFiles(srcDir)) {
    const content = readFileSync(file, 'utf8');
    for (const rule of forbiddenPatterns) {
      if (rule.regex.test(content)) {
        throw new Error(`${file}: ${rule.desc}`);
      }
    }
  }

  const uiFiles = [
    join(ROOT, 'index.html'),
    join(ROOT, 'lesson.html'),
    join(ROOT, 'lesson-ai.html'),
    ...collectFiles(srcDir),
  ];
  const devDraftRegex = /개발판|개발 전용|개발용|미완료|승인 전|검수 전|사용하지 마세요/;
  for (const file of uiFiles) {
    const content = readFileSync(file, 'utf8');
    if (devDraftRegex.test(content)) {
      throw new Error(`${file}: 개발중/미완료 문구가 남아 있습니다.`);
    }
  }
  console.log('✅ 공유 도메인 보호 규칙 및 정식 출시 문구(개발중 문구 0건) 검증 통과');
}

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // 대기 중
    }
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error(`프리뷰 서버(${url})가 ${timeoutMs}ms 내에 응답하지 않았습니다.`);
}

function stopServerProcess(proc) {
  if (!proc || proc.killed) return;
  try {
    if (isWin && proc.pid) {
      execFileSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      proc.kill('SIGTERM');
    }
  } catch {
    // 이미 종료됨
  }
}

// 1. 타입 체크
runStep('TypeScript 타입 검사', 'node', [join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc'), '--noEmit']);

// 2. 단위 테스트
runStep('단위 테스트 (node --test)', 'node', ['--test', 'tests/embedding-integrity.test.mjs', 'tests/errors.test.mjs', 'tests/judge.test.mjs', 'tests/lesson-core.test.mjs', 'tests/privacy.test.mjs', 'tests/unit-registry.test.mjs']);

// 3. 번들 용량 가드 및 공유 도메인 보호 규칙 검사
checkBundleSizes();
checkSharedOriginAndProductionCopy();

// 4. 프리뷰 서버 기동 후 E2E 실행 및 즉시 정리
console.log(`\n▶ [검증] 프리뷰 서버(${BASE_URL}) 임시 기동 중...`);
const serverProc = spawn(process.execPath, [join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
  cwd: ROOT,
  stdio: 'ignore',
});

try {
  await waitForServer(BASE_URL);
  runStep('수업 기본 흐름 E2E (lesson-check)', 'node', ['scripts/lesson-check.mjs'], { TEST_URL: BASE_URL });
  runStep('4단계 단순화 및 핵심 기능 E2E (e2e-features)', 'node', ['scripts/e2e-features.mjs'], { BASE_URL });
  runStep('모바일·태블릿 5종 뷰포트 호환성 E2E (mobile-check)', 'node', ['scripts/mobile-check.mjs'], { TEST_URL: BASE_URL.replace(/\/$/, '') });
  if (WITH_AI) {
    runStep('수업 로컬 AI E2E (lesson-ai-check)', 'node', ['scripts/lesson-ai-check.mjs'], { TEST_URL: BASE_URL });
    runStep('M0 브라우저 기술 검증 E2E (browser-check)', 'node', ['scripts/browser-check.mjs'], { TEST_URL: BASE_URL });
  }
  console.log('\n🎉 모든 통합 무결성 검증을 통과했습니다 (임시 프리뷰 서버 즉시 종료).');
} finally {
  stopServerProcess(serverProc);
}
