# 생각의 갈림길 AI — 개발판

초등 수학 M01의 단위분수 비교를 위한 개발판입니다. 루트는 M0 로컬 AI 기술 검증, `/lesson.html`은 M1 기본 수업 화면입니다. 모든 콘텐츠는 개발자 작성 초안이며 교사 검수 전입니다. 공개 수업 자료가 아닙니다.

## 실행

Node.js 24에서:

```sh
npm ci
npm run fetch:assets
npm run verify:assets
npm run typecheck
npm test
npm run dev
```

개발 서버 주소는 명령 출력에서 확인합니다. 페이지에서 **모델 준비**를 눌러 같은 출처의 정적 모델 자산을 로드한 뒤 설명을 입력하고 **추천 실행**을 누릅니다. 모델이 준비되지 않으면 **기본 카드 보기**를 사용합니다. 모델 바이너리는 Git에 넣지 않으며, `fetch:assets`는 개발·빌드 단계에서만 공식 모델 저장소에 접속합니다. 실행 중 브라우저는 외부 모델 저장소에 접속하지 않습니다.

정적 빌드: `npm run build`; 로컬 시험: `npx vite preview --host 127.0.0.1`. 하위 경로 시험은 PowerShell에서 `$env:APP_BASE='/qa-forks/'; npm run build` 후 같은 preview 명령을 실행합니다. `npm run test:browser`는 설치된 Microsoft Edge를 사용합니다. `TEST_URL`로 시험 주소를, `M0_BROWSER_PATH`로 브라우저 실행 파일 경로를 지정할 수 있습니다. 모델을 의도적으로 누락시킨 시험 명령은 `TEST_FORCE_MISSING_MODEL=1`을 설정하고 종료 코드 1을 기대합니다.

모델 채택 여부와 한계는 [MODEL_DECISION.md](MODEL_DECISION.md), 재현 결과는 [docs/M0_VERIFICATION.md](docs/M0_VERIFICATION.md)에 기록했습니다.

M01 기본 수업 개발 화면은 로컬 정적 preview의 `/lesson.html` 또는 [GitHub Pages 개발용 미리보기](https://gmlduqzhd123-lab.github.io/Thinking/lesson.html)에서 열 수 있습니다. AI 추천 없이 개념 선택부터 종료까지 진행하며, 교사 검수 전 콘텐츠로 표시합니다. 흐름 검사는 `npm run test:lesson`, 범위와 미검증 항목은 [docs/M1_VERIFICATION.md](docs/M1_VERIFICATION.md)에 기록했습니다. 공개 미리보기에는 로컬 AI 모델과 검수 전 시험 파일을 포함하지 않았습니다.

교사 검수 전용 초안과 집계 평가 절차는 [docs/HOLDOUT_REVIEW.md](docs/HOLDOUT_REVIEW.md)에 있습니다. `npm run test:ai`는 실제 브라우저 모델을 사용하는 기술 smoke 시험이며, `npm run test:holdout -- 경로`는 별도 검수 파일이 있어야 실행됩니다.
