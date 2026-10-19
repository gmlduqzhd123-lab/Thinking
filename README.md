# 생각의 갈림길 AI — M0 기술 검증

초등 수학 M01의 단위분수 비교를 위한 개발 전용 시험판입니다. 모든 카드와 질의는 개발자가 작성한 가상 초안이며 교사 검수 전입니다. 공개 수업 자료가 아닙니다.

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

정적 빌드: `npm run build`; 로컬 시험: `npx vite preview --host 127.0.0.1`. 하위 경로 시험은 PowerShell에서 `$env:APP_BASE='/qa-forks/'; npm run build` 후 같은 preview 명령을 실행합니다. `npm run test:browser`는 설치된 Microsoft Edge를 사용하는 현재 Windows 시험용입니다. `TEST_URL`로 시험 주소를 지정할 수 있습니다.

모델 채택 여부와 한계는 [MODEL_DECISION.md](MODEL_DECISION.md), 재현 결과는 [docs/M0_VERIFICATION.md](docs/M0_VERIFICATION.md)에 기록했습니다.
