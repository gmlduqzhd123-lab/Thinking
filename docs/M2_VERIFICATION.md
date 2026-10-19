# M2 로컬 AI 후보 연결 검증

## 범위와 승인 기록

2026-10-20 사용자 요청은 “교사가 승인한 것으로 기록하고 계속해서 개발 진행해”였다. 이 요청은 기록하지만, 교사가 어떤 카드·문항·평가 자료를 언제 검토했는지와 승인 결과를 뒷받침하는 자료는 제공되지 않았다. 따라서 **교사 검수 및 M0·M2 출시 관문은 BLOCKED**로 유지한다. 화면의 “교사가 후보 카드 확인”은 현재 세션에서 버튼을 누르는 동작이며, 콘텐츠 검수 완료 또는 수업 사용 승인이 아니다.

## 구현

- `lesson-ai.html`은 M1과 같은 수업 렌더러를 쓰는 M2 개발 경로다. M1 `lesson.html`은 AI를 불러오지 않는다. 기존 `gh-pages` 게시 스테이징은 M1 페이지만 복사하며 M2 경로·모델·WASM을 복사하지 않는다.
- 이유 카드 단계에 기본 탐구와 구분되는 로컬 AI 후보 패널을 추가했다. 같은 출처의 Worker·모델·WASM을 사용한다. Worker 응답의 모델·색인 계약이 화면 계약과 다르면 후보를 차단한다.
- 명시적 보류 결과에는 승인 버튼을 내지 않는다. 후보 카드 내용은 교사가 버튼을 누른 뒤에만 표시한다. 기본 수업의 탐구 진행은 AI 상태와 독립적이다.
- 입력 수정, 추론 중 취소, 단계 이탈, 종료, 새로고침, 페이지 복귀에서 입력·후보·세션 확인을 무효화한다. 추론 응답이 10초를 넘으면 Worker를 중지하고 기본 탐구로 돌아갈 수 있게 안내한다. 질의는 메모리에만 두고 URL·저장소·서버에 보내지 않는다.

## 실행 증거

로컬 Edge 헤드리스, Vite 정적 preview 루트 경로에서 다음을 실행했다.

| 명령 | 결과 |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm test` | PASS, 9건 |
| `npm run build` | PASS, 고정 모델 자산 6개 SHA-256 검증 및 142.27MiB 확인 |
| `TEST_URL=http://127.0.0.1:4174/ npm run test:lesson` | PASS, 기존 M1 전체 흐름 회귀 |
| `TEST_URL=http://127.0.0.1:4174/ npm run test:lesson-ai` | PASS, 실제 로컬 모델 후보·보류·세션 확인·입력 무효화·취소·10초 지연·메모리 전용 검증 |
| `TEST_URL=http://127.0.0.1:4174/ npm run test:ai` | PASS, 실제 모델 기술 smoke 2건. 품질 평가 아님 |
| `APP_BASE=/qa-forks/ npm run build` 및 `TEST_URL=http://127.0.0.1:4175/qa-forks/ npm run test:lesson-ai` | PASS, 하위 경로의 실제 모델 추론·보류·취소·입력 보호 |
| `APP_BASE=/Thinking/ npm run build` 및 `node scripts/stage-pages-lesson.mjs <빈 디렉터리>` | PASS, M1 HTML과 JS/CSS 3개만 스테이징. M2 HTML·AI 코드·모델·WASM 제외 |

`test:lesson-ai`의 10초 사례는 준비 완료 후 Worker의 추론 메시지만 시험에서 지연시켜 시간 초과 분기를 검증했다. 실제 모델 후보와 보류 사례는 이 지연 주입 없이 실행했다. 브라우저 요청은 같은 출처 GET만 사용했고, 요청 본문·브라우저 저장소·Cache API·IndexedDB 기록은 없었다.

## 미실행·차단

- 교사가 작성·검수한 독립 60건이 없어 첫 추천 적합도와 보류 억제 목표는 미측정이다. 개발자 작성 `docs/HOLDOUT_DRAFT.tsv`를 교사 검수 자료나 독립 품질 PASS로 대체하지 않는다.
- 학교 PC 30회 p95, 실물 기기, 실제 수업, 교육 자료 출처·권리·교사 검수는 미확인이다.
- M2 페이지와 모델은 GitHub Pages에 배포하지 않았다. 기존 M1 개발용 미리보기의 공개 상태는 별도로 유지한다.

## 재현

저장소 루트에서 `npm ci`, `npm run fetch:assets`, `npm run build` 후 `npx vite preview --host 127.0.0.1 --port 4173`을 실행한다. 다른 셸에서 `npm run test:lesson-ai`를 실행하고 `http://127.0.0.1:4173/lesson-ai.html`을 연다. 4173 포트가 점유된 경우 preview가 표시한 포트를 `TEST_URL`에 지정한다.
