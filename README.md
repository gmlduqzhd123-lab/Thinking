# 생각의 갈림길 AI — 초등 수학 AI 수업 도구

> **🌐 라이브 수업 페이지**: [https://gmlduqzhd123-lab.github.io/Thinking/](https://gmlduqzhd123-lab.github.io/Thinking/)

**생각의 갈림길 AI**는 초등학교 수학 수업에서 학생들의 개념 혼동(misconception)을 비교·분석하는 교사 지원 도구입니다. 단위분수 크기 비교(`M01: 1/3 vs 1/5`, `M02: 1/4 vs 1/7`, `M03: 1/2 vs 1/6`) 단원에서 학생들이 흔히 보이는 오개념 패턴을 로컬 AI(문장 임베딩)로 매칭하여 탐구 카드를 추천합니다.

---

## 주요 기능

- 📊 **실시간 투표 집계** — 학생 선택을 입력하면 즉시 분포 차트를 시각화합니다.
- 🤖 **로컬 AI 추천** — ONNX WASM 기반 문장 임베딩으로 학생 혼동 패턴을 탐구 카드에 매칭합니다. 외부 서버 없이 브라우저 안에서만 동작합니다.
- 🔒 **개인정보 보호** — 학생 이름·번호·발언 원문을 입력하지 않으며, 모든 데이터는 브라우저 메모리에만 존재합니다. 서버 전송·저장 없음.
- 📱 **반응형 UI** — 데스크톱·태블릿·모바일 화면에 맞는 레이아웃을 제공합니다.
- 🌙 **다크 모드** — 시스템 설정 및 수동 테마 전환(라이트/다크/시스템)을 지원합니다.
- 📋 **JSON 내보내기 & 수업 요약 인쇄** — 수업 결과를 JSON 파일로 저장하거나 인쇄용 리포트로 즉시 출력할 수 있습니다.
- 🧩 **다단원 지원 (M01·M02·M03)** — 3개 단위분수 비교 단원(`1/3 vs 1/5`, `1/4 vs 1/7`, `1/2 vs 1/6`)을 즉시 전환하여 수업할 수 있습니다.

---

## 사전 요구 사항

| 항목 | 버전 |
|------|------|
| Node.js | **24 이상** |
| npm | Node.js에 포함 |

---

## 설치

```bash
npm ci
npm run fetch:assets
```

`fetch:assets`는 ONNX 모델 파일과 WASM 런타임을 다운로드합니다. 네트워크 연결이 필요합니다.

---

## 개발

```bash
npm run dev
```

Vite 개발 서버가 `http://127.0.0.1:5173`에서 시작됩니다.

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 로컬 AI 탐구 카드 | `/` (`index.html`) | 로컬 AI 탐구 카드 추천 화면 |
| 단위분수 비교 수업 | `/lesson.html` | 10단계 단위분수 비교 탐구 수업 화면 |
| 로컬 AI 보조 수업 | `/lesson-ai.html` | 로컬 AI 탐구 카드 추천 패널이 포함된 수업 화면 |

---

## 빌드

```bash
npm run build
```

빌드 과정:
1. `verify:assets` — 모델 파일 SHA-256 무결성 검증
2. `tsc --noEmit` — TypeScript 타입 검사
3. `vite build` — 프로덕션 번들 생성
4. `prune-build.mjs` — 빌드 산출물 정리

---

## 테스트

| 명령어 | 설명 |
|--------|------|
| `npm test` | 단위 테스트 (Node.js `--test` 러너) |
| `npm run test:browser` | 정적 빌드의 브라우저 E2E 테스트 (Playwright) |
| `npm run test:lesson` | M1 수업 흐름 E2E 테스트 |
| `npm run test:lesson-ai` | M2 AI 수업 흐름 E2E 테스트 |
| `npm run test:ai` | AI 홀드아웃 smoke 테스트 |
| `npm run test:holdout` | 홀드아웃 전체 평가 |
| `npm run test:performance` | 로컬 모델 성능 측정 (30회) |
| `npm run test:pages` | GitHub Pages 배포 확인 |
| `npm run typecheck` | TypeScript 타입 검사만 실행 |

---

## 프로젝트 구조

```
Thinking/
├── index.html              # M0 기술 검증 페이지
├── lesson.html             # M1 기본 수업 페이지
├── lesson-ai.html          # M2 AI 수업 페이지
├── model-assets.json       # 모델 파일 목록·해시·출처
├── vite.config.ts          # Vite 빌드 설정
├── tsconfig.json           # TypeScript 설정
├── src/
│   ├── main.ts             # M0 페이지 진입점
│   ├── lesson.ts           # M1/M2 수업 렌더러 (10단계 수업 흐름)
│   ├── lesson-ai-panel.ts  # M2 AI 후보 패널 UI
│   ├── lesson-core.ts      # 수업 핵심 로직 (투표 검증·분수 계산)
│   ├── ai.worker.ts        # Web Worker — 모델 로드·임베딩·추론
│   ├── judge.ts            # AI 판단 로직 (보류 규칙·임계값)
│   ├── cards.ts            # 탐구 카드 정의·기본 매칭
│   ├── constants.ts        # 프로젝트 전역 상수
│   ├── model-contract.ts   # 메인↔Worker 모델 계약
│   ├── embedding-integrity.ts # 임베딩 벡터 무결성 검증
│   ├── privacy.ts          # 개인정보 감지 필터
│   ├── unit-types.ts       # 다단원 타입 정의
│   ├── units/
│   │   ├── m01.ts          # M01 단위분수 기초 비교 (1/3 vs 1/5)
│   │   ├── m02.ts          # M02 단위분수 심화 비교 (1/4 vs 1/7)
│   │   └── m03.ts          # M03 단위분수 응용 비교 (1/2 vs 1/6)
│   ├── style.css           # M0 스타일
│   └── lesson.css          # 수업 페이지 스타일
├── scripts/                # 빌드·테스트·배포 스크립트
├── tests/                  # 단위 테스트 (.test.mjs)
├── docs/                   # 문서·검증 기록
└── test-screenshots/       # 반응형 테스트 스크린샷
```

---

## 라이선스

이 프로젝트의 라이선스 정보는 저장소 루트를 참고하세요. 사용된 ONNX 모델은 원 저장소의 Apache-2.0 라이선스를 따릅니다.

---

## 관련 문서

- [아키텍처](docs/ARCHITECTURE.md)
- [교사 안내서](docs/TEACHER_GUIDE.md)
- [기여 가이드](docs/CONTRIBUTING.md)
- [변경 이력](CHANGELOG.md)
- [개발 상태](docs/STATUS.md)
