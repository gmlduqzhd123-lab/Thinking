# M1 기본 수업 개발 검증 · 2026-10-20

## 범위와 전제

사용자는 교사 검수 자료와 학교 기기 검증이 완료됐다고 **가정하고** 개발을 계속하도록 요청했다. 이 문서는 가정을 시험 결과로 바꾸지 않는다. M0의 교사 검수 독립 60건과 학교 실물 기기 시험은 실제 증거가 없으므로 **NOT_RUN/BLOCKED**다. M01 콘텐츠도 개발자 초안으로 표시하며 `published`로 승격하지 않았다.

기존 M0 기술 검증 화면은 유지하고 `lesson.html`에 AI 추천 없이 진행하는 기본 수업을 추가했다. 개념 선택 → 미리보기 → 첫 선택 → 이유 카드 → 기본 탐구 3개 → 개념 정리 → 같은 문항 재선택 → 새로운 문제 → 메모리 요약 → 종료 순서다. 답과 정리는 교사의 공개 버튼을 누른 뒤에만 나타난다.

## 구현·시험 결과

- **PASS:** 첫 선택·재선택 모두 `M01-UF-01` 버전 1, 새 문제는 `M01-UF-02` 버전 1. 10/20→15/20은 `+25.0%p`로 표시하며 개인별 성장으로 해석하지 않는다.
- **PASS:** 참여 인원 1~60, 빈값·음수·소수·합계 초과 차단, 선택적 집계 생략. `D. 모르겠다`는 선택 집계이고 미응답은 참여 인원에서 선택 합계를 뺀 값으로 별도 표시한다.
- **PASS:** SVG 막대는 동일한 600단위 전체를 2~12등분한다. 버튼과 키보드로 탐구 3의 등분 수를 바꿀 수 있다. 10·20·40분 선택과 타이머 정지·5분 연장을 구현했다.
- **PASS:** 가상 연습에서 실제 수업 입력 모드로 바꾸면 입력 상태를 비운다. 집계를 수정하면 이미 만든 메모리 요약을 무효화한다. 종료·새로고침·뒤로 가기·캐시 복귀 시 이전 입력을 다시 표시하지 않는다. 수업 입력은 브라우저 저장소·요청 본문·URL에 기록하지 않는다.
- **PASS:** `npm run typecheck`, `npm test` 9건, `npm run build`(고정 모델 자산 6개 검증 포함), 루트 정적 preview `npm run test:lesson`, `/qa-forks/` 정적 preview `npm run test:lesson`. 기존 실제 모델 `npm run test:browser`, `npm run test:ai` 기술 smoke도 루트에서 PASS했다.
- **시험 중 수정:** `/qa-forks/` 첫 시험은 preview 서버에 `APP_BASE`를 전달하지 않아 앱 화면이 아닌 루트 fallback이 나와 FAIL했다. 빌드와 preview 모두 같은 경로를 설정한 뒤 PASS했다. 뒤로 가기 시험은 실제 복귀 상태가 개념 선택으로 초기화됨을 확인하고 기대 화면을 수정해 PASS했다.
- **NOT_RUN:** 교사 검수 자료를 이용한 정식 AI 품질 평가, 학교 PC·실물 기기, 실제 수업, 인쇄·오프라인·200% 확대 등 M3 범위 검사. 콘텐츠는 여전히 개발자 초안이다.

## 재현

저장소 루트에서 `npm ci`, `npm run fetch:assets`, `npm run typecheck`, `npm test`, `npm run build`를 실행한다. 별도 셸에서 `npx vite preview --host 127.0.0.1 --port 4173`을 실행하고 `npm run test:lesson`으로 브라우저 흐름을 검사한다. 브라우저로 `http://127.0.0.1:4173/lesson.html`을 열 수 있다. 하위 경로는 두 셸 모두 `APP_BASE=/qa-forks/`로 설정해 빌드·preview를 실행하고 `TEST_URL=http://127.0.0.1:4173/qa-forks/ npm run test:lesson`으로 검사한다. PowerShell에서는 환경 변수를 `$env:APP_BASE`와 `$env:TEST_URL`로 지정한다.

현재 구현은 수업 내용의 교육적 검수나 학교 현장 사용성을 증명하지 않는다. M1 화면은 개발용 기본 수업이며 AI 추천은 연결하지 않았다.

## GitHub Pages 개발용 미리보기 배포 (2026-10-20)

`APP_BASE=/Thinking/`으로 정적 빌드한 뒤 `node scripts/stage-pages-lesson.mjs <빈 디렉터리>`로 수업 HTML과 참조된 JS/CSS 세 파일만 선별했다. 안내 `index.html`과 `.nojekyll`을 더한 `gh-pages` 브랜치에는 M0 앱·모델·WASM·`HOLDOUT_DRAFT.tsv`가 없다. 로컬 정적 서버에서 `npm run test:lesson`과 `npm run test:pages`가 통과한 뒤 게시했다.

첫 공개 브라우저 실행은 타이머 1분 경계에서 `8:59`가 표시돼 **FAIL**했다. `src/lesson.ts`의 남은 시간 표시를 올림 처리해 수정하고 새 자산으로 재배포했다. 최종 `gh-pages` 커밋 `c4f9eee`가 반영된 뒤 공개 URL에서 `TEST_URL=https://gmlduqzhd123-lab.github.io/Thinking/ npm run test:lesson` **PASS**. `npm run test:pages`는 안내 루트·`lesson.html` HTTP 200, 초안 TSV·모델·WASM HTTP 404로 **PASS**. 교체 전 JS 파일도 HTTP 404로 확인했다. 이 결과는 개발용 미리보기 접속과 기술 동작의 증거이며 실제 교사 검수·학교 기기·수업 실증은 아니다.
