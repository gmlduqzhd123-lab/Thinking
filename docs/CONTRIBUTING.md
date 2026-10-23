# 기여 가이드

**생각의 갈림길 AI** 프로젝트에 기여해 주셔서 감사합니다. 이 문서는 개발 환경 설정부터 PR 제출까지의 과정을 안내합니다.

---

## 개발 환경 설정

### 사전 요구 사항

- **Node.js 24 이상**
- Git

### 설치

```bash
git clone <repository-url>
cd Thinking
npm ci
npm run fetch:assets
```

### 개발 서버 실행

```bash
npm run dev
```

Vite 개발 서버가 `http://127.0.0.1:5173`에서 시작됩니다.

---

## 코딩 컨벤션

### TypeScript

- `tsconfig.json`의 `strict` 모드를 따릅니다.
- 매직 넘버는 `src/constants.ts`에 상수로 정의합니다.
- 타입은 명시적으로 선언하되, 추론이 명확한 경우 생략할 수 있습니다.

### 모듈 구조

- 한 파일은 한 가지 역할만 담당합니다.
- 순환 의존이 발생하지 않도록 합니다.
- `export` 대상은 파일 상단에 모아둡니다.

### CSS

- 반응형 레이아웃을 기본으로 합니다.
- 다크 모드는 `prefers-color-scheme: dark` 미디어 쿼리를 사용합니다.
- 페이지별 CSS 파일을 분리합니다 (`style.css`, `lesson.css`).

### 주석

- 파일 상단에 역할을 설명하는 JSDoc 주석을 작성합니다.
- 교사 검수 전 개발자 초안인 경우 명시합니다.
- 매개변수·반환값의 의미가 모호한 경우 인라인 주석을 추가합니다.

---

## 테스트 요구 사항

PR을 제출하기 전에 아래 세 가지 검사가 모두 통과해야 합니다.

```bash
# 1. TypeScript 타입 검사
npm run typecheck

# 2. 단위 테스트
npm test

# 3. 프로덕션 빌드
npm run build
```

### 추가 테스트 (권장)

```bash
# 브라우저 E2E 테스트 (실제 모델 필요)
npm run test:browser

# M1 수업 흐름 E2E 테스트
npm run test:lesson

# M2 AI 수업 흐름 E2E 테스트
npm run test:lesson-ai

# AI 홀드아웃 smoke 테스트
npm run test:ai
```

### 테스트 파일 규약

> [!WARNING]
> 테스트 파일 작성 시 반드시 아래 규칙을 따라 주세요.

- 테스트 파일은 `tests/` 디렉터리에 `*.test.mjs` 확장자로 작성합니다.
- **독립 실행 가능한 `.mjs` 파일**이어야 합니다 (번들러 없이 `node --test`로 실행).
- 임포트 경로에 **확장자를 반드시 포함**합니다. 확장자 없는 임포트(`import '../src/judge'`)는 사용할 수 없습니다.
- 테스트 파일 안에서 브라우저 API를 직접 사용하지 않습니다.
- Node.js 내장 `node:test` 및 `node:assert` 모듈을 사용합니다.

```javascript
// ✅ 올바른 예
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ❌ 잘못된 예 — 확장자 누락
import { judge } from '../src/judge';
```

---

## 새 단원 추가 방법

1. `src/units/` 디렉터리에 새 파일(예: `m02.ts`)을 생성합니다.
2. `UnitConfig` 타입을 따르는 단원 설정 객체를 작성합니다.

```typescript
import type { UnitConfig } from '../unit-types';

const m02: UnitConfig = {
  id: 'M02',
  title: '대분수 뺄셈',
  description: '대분수에서 빼기를 할 때 자연수 부분과 분수 부분을 나누어 계산합니다.',
  cards: [
    { id: 'A', title: '...', text: '...', hint: '...' },
    { id: 'B', title: '...', text: '...', hint: '...' },
    // 최소 2장 이상
  ],
  examples: [
    { id: 'E1', text: '...', expected: 'A' },
    { id: 'E2', text: '...', expected: 'hold' },
  ],
  denominators: {
    first: [3, 5],
    transfer: [4, 7],
  },
  holdPatterns: [
    { pattern: '...', reason: '...' },
  ],
  thresholds: {
    minSimilarity: 0.50,
    minMargin: 0.05,
  },
};

export default m02;
```

3. `UnitConfig` 인터페이스 필드 설명:

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 단원 ID (예: `'M02'`) |
| `title` | `string` | 단원 제목 |
| `description` | `string` | 단원 한 줄 설명 |
| `cards` | `Card[]` | 탐구 카드 목록 (최소 2장) |
| `examples` | `Example[]` | 개발용 예시 질의 |
| `denominators` | `{ first, transfer }` | 분수 비교에 사용할 분모 쌍 |
| `holdPatterns` | `HoldPattern[]` | 판단 보류 정규식 패턴 |
| `thresholds` | `{ minSimilarity, minMargin }` | 유사도 임계값 |

4. 탐구 카드의 `hint`와 `text`는 AI 임베딩에 사용되므로 개념을 명확히 설명하는 문장으로 작성합니다.
5. `examples`에는 `expected: 'hold'`인 항목을 반드시 포함합니다.

---

## PR 프로세스

1. 기능 브랜치를 생성합니다: `feature/<간단한-설명>` 또는 `fix/<간단한-설명>`.
2. 변경 사항을 커밋합니다. 커밋 메시지는 한국어 또는 영어로 작성합니다.
3. 아래 검사가 모두 통과하는지 확인합니다:
   ```bash
   npm run typecheck
   npm test
   npm run build
   ```
4. PR을 생성합니다. PR 설명에 다음을 포함합니다:
   - 변경 이유
   - 주요 변경 내용
   - 테스트 결과
5. 리뷰어의 피드백을 반영한 후 머지합니다.

> [!IMPORTANT]
> - `docs/STATUS.md`는 개발 상태 이력이므로 직접 수정하지 마세요.
> - 교사 검수가 필요한 항목(임계값, 보류 규칙, 카드 문구 등)은 교사 검수 증거 없이 PASS로 변경하지 마세요.
> - 모델 자산 파일(ONNX, WASM)은 Git에 포함하지 않습니다. `npm run fetch:assets`로 다운로드합니다.
