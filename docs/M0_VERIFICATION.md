# M0 실행 및 검증 기록

## 기준과 환경

- 기준 문서(읽기 전용): `C:/Users/user/Desktop/생각의_갈림길_AI_CODEX_전달용_통합/thinking_forks_ai_prd_v1/AGENTS.md`, `TASKS.md`, `ACCEPTANCE.md`, `PRD.md`의 0·7·9·11·12·16·22절.
- 작업 코드: 이 문서의 상위 폴더. 기존 작업 공간에는 코드와 Git 저장소가 없었다. 원격 `https://github.com/gmlduqzhd123-lab/Thinking`은 브랜치가 없는 빈 저장소였고, 로컬 `main`에 `origin`만 연결했다.
- 시험 환경: Windows, Node 24.15.0, Vite 7.1.12, Transformers.js 3.8.1, 설치된 Microsoft Edge 헤드리스, 로컬 loopback HTTP. 학교 기기 시험이 아니다.

## 재현 명령

```sh
npm ci
npm run fetch:assets
npm run verify:assets
npm run typecheck
npm test
npm run build
npx vite preview --host 127.0.0.1 --port 4173
```

다른 셸에서 `TEST_URL=http://127.0.0.1:4173/ npm run test:browser`를 실행한다. Windows PowerShell에서는 `$env:TEST_URL='http://127.0.0.1:4173/'; npm run test:browser`를 사용한다. 하위 경로 시험은 `$env:APP_BASE='/qa-forks/'; npm run build`로 다시 빌드하고 **같은 `APP_BASE` 환경 변수로 preview를 재시작**한 뒤 `TEST_URL`을 `http://127.0.0.1:4173/qa-forks/`로 설정한다. `fetch:assets`만 개발·빌드 중 공식 모델 저장소와 통신한다.

## 초기 Xenova 후보 결과 (교체 전 기록)

| 항목 | 상태 | 관찰 |
|---|---|---|
| 타입 검사·단위 시험(3건)·정적 빌드 | PASS | `npm run typecheck`, `npm test`, `npm run build` |
| 자산 무결성·용량 | PASS | 6개 파일 SHA-256 확인, 157,032,711바이트(149.76MiB). 정적 산출물에서 중복 WASM을 제거 후 실제 로딩 재시험 |
| 실제 모델 로딩·한국어 추론 | PASS | Edge Worker의 WASM 단일 스레드, 실제 `model_quantized.onnx`와 `tokenizer.json` 로딩 |
| 루트 `/` | PASS | 정적 preview에서 모델·Worker·WASM 로딩 및 질의 결과. 준비 전체 5,581ms, 파일 로딩 4,449ms, 초기화 856ms, 카드 색인 276ms. 질의 20~38ms (한 실행 관찰) |
| 하위 `/qa-forks/` | PASS | 정적 preview에서 전 자산 경로가 하위 경로 유지. 준비 전체 6,002ms, 파일 로딩 4,688ms, 초기화 1,028ms, 카드 색인 286ms (한 실행 관찰) |
| 가상 질의 6건 | PASS/한계 | E1 AI A(0.720); E2 원시 AI A(0.699)여서 보류 규칙 적용; E3 다른 전체 보류; E4 분모 뜻 모름 보류; E5 정보 부족 보류; E6 범위 밖 보류. 기본 키워드는 E1 A, E2 B, E4 C. 교사 품질 검수는 아님 |
| 입력 변경·초기화·연속 요청·취소 | PASS | requestId/sessionRevision으로 늦은 결과 무시, 입력 변경 중 Worker 종료, 준비 중 취소 후 거짓 준비 완료 없음 |
| 모델 파일 누락·손상 | PASS | Playwright가 ONNX 요청을 404 또는 손상 바이트로 대체했을 때 `실패`, 원격 우회 없음 |
| 수업 입력 보호 | PASS(시험 범위) | 추적한 요청 모두 같은 출처, 입력 문자열이 요청 URL·콘솔·URL에 없음; localStorage·sessionStorage·IndexedDB·Cache Storage 비어 있음 |
| 교사 작성 보류 시험 60건, 학교 PC 30회 p95, 실물 기기, 실제 수업 | NOT_RUN | 자료와 기기가 없어 확인하지 않음 |
| 변환본 공개 배포 라이선스 | BLOCKED | 원 모델 Apache-2.0 확인. 변환본 고정 리비전 README와 모델 API에서 별도 라이선스 표기를 찾지 못함 |

## 이어서 수행한 M0 검증 보강 (2026-10-19)

기존 브라우저 스크립트는 정상 모델 준비가 실패해도 뒤 검사를 건너뛰고 종료 코드 0으로 끝날 수 있었다. 준비 완료를 필수 단언으로 바꾸고 `TEST_FORCE_MISSING_MODEL=1`을 주입해 실제 종료 코드 **1**을 확인했다. 같은 정적 빌드에서 정상 자산은 종료 코드 **0**이었다. 이 확인은 모델 추론 실패를 거짓 PASS로 표시하지 않기 위한 시험 코드 자체의 회귀 검사다.

`npm test`는 이제 누락·크기/해시 불일치 자산을 거부하는 실제 검증 함수까지 포함해 3건 PASS다. 정적 preview의 `test:browser`는 연락처 형식 차단, HTML 이벤트 입력 비실행, 종료 및 뒤로 가기 후 입력 비복원, 추론 응답을 시험에서 지연시킨 10초 시간 초과와 기본 카드 전환을 추가로 확인했다. 지연 주입은 시간 초과 경로 시험용이며 모델 성능 측정으로 사용하지 않는다. 루트와 `/qa-forks/`에서 실제 가중치 추론을 재확인했다.

모델의 한국어 추천 품질, 교사 검수 60건, 학교 PC 30회 p95와 배포 권리는 여전히 미검증 또는 차단 상태다. 기존 가상 6건으로 임계값을 확정하거나 M0 관문을 통과했다고 보지 않는다.

## 독립 시험 준비 작업 (2026-10-20)

- **PASS:** `docs/HOLDOUT_DRAFT.tsv`는 개발자 작성 가상 초안 60건(관련 40·보류 20)이며 전 항목 `pending`, 관련 항목의 교사 허용 카드 집합은 비어 있다. SHA-256: `47b007ed59d74ceee277243f6f393903cb4f73ea60c066ec876df01ca7a2fa41`.
- **PASS:** `npm test` 5건. 초안의 크기·구성 검증, 미검수 자료 거부, 개발 예시·초안과 숫자만 바꾼 중복 차단, 허용 카드 계약과 집계 분모를 시험했다. 검수 자료의 실제 사람 작성 여부는 코드가 증명하지 못한다.
- **PASS:** `npm run typecheck`, `/qa-forks/` 정적 `npm run build`, `npm run test:ai`. 마지막 명령은 Edge Worker에서 기존 개발 예시 2건을 실제 모델로 처리하는 기술 연결 시험이며 품질 합격률을 출력하지 않는다.
- **BLOCKED:** `npm run test:holdout -- <검수 파일>` 정식 평가. 현재 교사가 작성·검수한 독립 파일이 없다. 개발자 초안을 직접 입력하면 종료 코드 1로 거부한다. 따라서 관련 40건 첫 추천 85%와 보류 20건 억제 90% 달성 여부는 **NOT_RUN**이다.

초안 문장과 숫자만 바꾼 변형을 거부하는 검사는 완전한 의미 중복 탐지가 아니다. 교사는 독립 작성·검수와 개발 세트와의 분리를 별도로 확인해야 한다. 사용 절차는 `docs/HOLDOUT_REVIEW.md`에 있다.

## GitHub Pages 게시 시도 (2026-10-20)

- `docs/index.html`은 개발 상태 안내만 표시한다. 수업용 앱과 모델 바이너리는 공개 산출물에서 제외했다.
- GitHub Pages 소스를 `main/docs`로 지정한 자동 실행이 대기 상태를 벗어나지 못해, `pages.yml`의 전용 워크플로로 변경했다. 워크플로는 `docs/index.html`만 별도 디렉터리에 복사한 뒤 업로드한다. 개발용 TSV·모델·WASM은 업로드 경로 밖에 있다.
- API에서 Pages `build_type=workflow` 확인, `workflow_dispatch` HTTP 204 확인. 실행 [39281275323](https://github.com/gmlduqzhd123-lab/Thinking/actions/runs/39281275323)은 확인 당시 `queued`다. `https://gmlduqzhd123-lab.github.io/Thinking/`는 HTTP 404였다. 따라서 공개 접속 시험은 **FAIL/미게시**, GitHub 실행 완료는 **BLOCKED**다.
- 재현: 해당 실행이 `success`가 된 뒤 사이트 URL을 GET으로 열고 HTTP 200 및 안내 문구를 확인한다. 그 전에는 배포 성공으로 보고하지 않는다.

2026-10-20에 뒤늦게 완료된 이전 `main/docs` 게시로 루트는 HTTP 200이 됐으나 `HOLDOUT_DRAFT.tsv`도 HTTP 200(7,428바이트)이었다. 개발용 초안을 Pages 게시 대상으로 두지 않기 위해 Pages를 일시 중지했고 루트와 TSV 경로 모두 HTTP 404를 확인했다. `gh-pages` 브랜치에는 `index.html`과 `.nojekyll`만 커밋했다. Pages API는 `build_type=legacy`, `source=gh-pages/`, `status=building`을 반환했다. 중복 게시 경로가 생기지 않도록 `main`의 별도 Pages workflow를 제거했다. 최종 배포가 끝나기 전에는 사이트 게시 PASS로 표시하지 않는다. 완료 후 루트 HTTP 200과 TSV·모델 경로 HTTP 404를 각각 다시 확인한다.

2026-10-20 재검증: `scripts/check-pages.mjs`와 `npm run test:pages`를 추가했다. 실제 GitHub Pages URL에서 안내 루트 HTTP 404로 **FAIL**(명령 종료 코드 1), `HOLDOUT_DRAFT.tsv`·`models/m01/onnx/model_quantized.onnx`·`wasm/ort-wasm-simd-threaded.jsep.wasm`은 각각 HTTP 404로 **PASS**였다. [안전한 `gh-pages` 실행 #5](https://github.com/gmlduqzhd123-lab/Thinking/actions/runs/39285159531)의 build·report 작업 단계는 성공했고 deploy 작업은 확인 시점에 `queued`다. `npm run typecheck` PASS, `npm test` 5건 PASS. 재현은 저장소 루트에서 `npm run test:pages`를 실행하며, 네 항목 모두 PASS와 종료 코드 0이 나오기 전에는 배포 완료를 주장하지 않는다.

이후 같은 날 재검사에서 `npm run test:pages` 네 항목 **PASS**(종료 코드 0): 루트 HTTP 200, 초안 TSV·모델·WASM 경로 HTTP 404. 공개 루트의 1,031자 본문은 별도 `gh-pages` 작업 디렉터리의 `index.html`과 문자열이 완전히 일치했다. 따라서 관찰한 공개 산출물은 개발 상태 안내 페이지다. 확인 당시 실행 #5의 build·report는 성공, deploy 작업 상태는 여전히 `queued`로 표시돼 **Actions 실행 최종 성공은 미확인**이다. GitHub [공식 상태 페이지](https://www.githubstatus.com/)는 Actions와 Pages 처리 지연 장애를 공지했다.

추가 재게시 (2026-10-20): 이전 실행 #5의 build·report·deploy가 모두 `success`로 바뀐 것을 확인했다. `gh-pages` 브랜치에는 `index.html`과 `.nojekyll`만 있으며, 새 커밋 `5e71db4`의 안내 페이지에 ‘실제 수업용 화면이 아닙니다’ 문구를 추가했다. 새 문구를 요구하도록 `npm run test:pages`를 갱신해 게시 전에는 루트 검사가 **FAIL**, 게시 후에는 루트 HTTP 200과 초안 TSV·모델·WASM HTTP 404가 모두 **PASS**였다. 공개 루트 1,081자 본문은 브랜치의 `index.html`과 정확히 일치했다. 이 결과는 **안내 페이지 게시 성공**이며 M0 앱 배포나 수업 출시 관문 통과가 아니다.

## 준비 후 응답 시간 재현 (2026-10-20)

`scripts/measure-performance.mjs`와 `npm run test:performance`를 추가했다. 정적 빌드를 루트에서 preview로 제공한 뒤 브라우저에서 실제 고정 모델을 준비하고, 개인정보 없는 동일한 160자 수학 설명을 30회 입력해 버튼 클릭부터 결과 표시까지의 화면 응답 시간을 재었다. 모델 준비 시간은 별도로 기록한다. 요청은 같은 출처의 GET만 허용하고 질의 비전송·브라우저 저장소 비사용·종료 후 입력 제거를 단언한다. 원문 질의나 개별 결과는 출력하지 않는다.

- **PASS(개발 PC):** Edge 헤드리스 155.0.4283.62, 모델 리비전 `e8f8c211226b894fcb81acc59f3b34ba3efd5f42`, 준비 화면 시간 5,700ms, 준비 후 30회 화면 응답 p95 265ms(최소 228ms, 최대 274ms). 이 값은 Playwright 클릭·대기 오버헤드를 포함한 개발 PC 한 실행의 관찰이다.
- **PASS:** `npm run typecheck`, `npm test` 5건, `npm run build`, `npm run test:performance`, `npm run test:pages`.
- **NOT_RUN/BLOCKED:** 학교 교사 PC에서 같은 30회 p95, 실물 기기, 교사 검수 독립 60건 평가. 개발 PC 수치를 학교 환경 목표 통과로 표시하지 않는다.
- 재현: `npm run build`; 별도 셸에서 `npx vite preview --host 127.0.0.1 --port 4173`; 원래 셸에서 `npm run test:performance`. 다른 포트를 쓰면 `TEST_URL`을 해당 로컬 URL로 지정한다.

## 원 저장소 ONNX로 고정 자산 교체 (2026-10-20)

- 출처: 원 모델 [`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2)의 Apache-2.0 표시, 리비전 `e8f8c211226b894fcb81acc59f3b34ba3efd5f42`. config·tokenizer·`onnx/model_quint8_avx2.onnx`를 같은 리비전에서 내려받고 `model-assets.json`의 크기·SHA-256으로 고정했다. 브라우저 로더가 찾는 로컬 이름 `onnx/model_quantized.onnx`과 원본 경로의 대응을 `fetch-assets.mjs`에 기록했다. Git에는 바이너리를 넣지 않는다.
- 처음에는 Playwright 요청 가로채기로 118MB ONNX를 대체했을 때 브라우저가 종료됐다. 별도 정적 서버에서 같은 해시 파일을 직접 제공하자 Edge WASM 추론이 성공했다. 가로채기 실패를 모델 비호환으로 해석하지 않고 실제 정적 배포 방식으로 재시험했다.
- **PASS:** `npm run fetch:assets`, `npm run verify:assets` — 6개 파일, **149,177,062바이트(142.27MiB)**. Node CPU에서도 한국어 문장 384차원 임베딩을 관찰했다.
- **PASS:** `npm run typecheck`, `npm test` 5건, 루트와 `/qa-forks/`의 `npm run build`, 두 경로의 정적 preview에서 `npm run test:browser`, 루트 정적 preview의 `npm run test:ai` 기술 smoke 2건. 기존 6개 개발 예시의 보류·추천 경로, 누락·손상·추론 시간 초과, 입력 보호 검사는 통과했다. 하위 경로 시험의 첫 시도는 preview에 `APP_BASE`를 전달하지 않아 404가 났고, 환경 변수를 맞춰 재실행해 통과했다.
- 루트 준비 전체 7,357ms(파일 로딩 5,623ms, 초기화 1,255ms, 카드 색인 477ms), 하위 경로 준비 전체 5,300ms(파일 로딩 4,057ms, 초기화 972ms, 카드 색인 270ms). 각각 한 번의 개발 PC 관찰이다.
- **BLOCKED/NOT_RUN:** 교사가 검수한 독립 60건이 없어 추천 품질 목표를 평가하지 않았다. 학교 PC 30회 p95·실물 기기·실제 수업도 미실행이다. 원 저장소의 라이선스 표기 확인과 기술 시험 통과를 수업 출시 승인으로 취급하지 않는다.

## 입력 수정 시 이전 추천 무효화 회귀 (2026-10-20)

실제 모델로 E1 추천을 받은 뒤 질의 입력을 바꾸는 브라우저 회귀 검사를 추가했다. 수정 전에는 이전 카드 목록과 `data-hold="false"`가 남아 `npm run test:browser`가 종료 코드 1로 실패했다. 입력 변경 시 종속 추천 문구와 판정 값을 함께 지우고, 진행 중인 추론은 취소하도록 고쳤다. 준비된 모델은 이미 끝난 추천의 입력 수정에서는 유지해 교사가 새 질의를 다시 실행할 수 있다. 기본 카드·취소·초기화·종료·오류 경로도 이전 판정 값을 남기지 않는다.

수정 후 정적 preview의 실제 Edge 모델로 `npm run test:browser` **PASS**, `npm run test:ai` 기술 smoke 2건 **PASS**. `npm run typecheck`, `npm test` 5건, `npm run build` **PASS**. 교사 검수 독립 시험과 학교 실물 기기 시험은 **NOT_RUN**이다.

## 모델·카드 색인 계약 검사 (2026-10-20)

`src/model-contract.ts`의 단일 선언에 모델 출처·고정 리비전, ONNX·토크나이저·WASM을 포함한 6개 자산의 기대 크기·SHA-256, 임베딩 설정(단일 스레드 WASM, q8, mean pooling, 정규화), 카드 ID·힌트·본문을 포함했다. Worker는 이 설정으로 카드 벡터를 매 준비마다 생성하고, 준비 완료·추론 결과 메시지에 계약을 보낸다. 화면 코드는 같은 계약과 정확히 비교해 불일치 시 Worker를 종료하고 AI 추천을 차단하며 기본 카드를 사용할 수 있게 한다.

- **PASS:** 정적 preview의 실제 Edge 모델에서 정상 준비·가상 예시 추론 유지. 브라우저 시험이 준비 완료 메시지의 계약을 고의로 변경했을 때 실패 상태, 추천 버튼 비활성화, 기본 카드 경로를 확인했다.
- **PASS:** `npm run typecheck`, `npm test` 5건, `npm run build`(6개 자산 해시 확인 포함), `npm run test:browser`, `npm run test:ai` 기술 smoke 2건.
- **한계:** 별도의 저장된 벡터 색인은 없다. 이 실행 시 검사는 화면·Worker의 선언된 계약 불일치를 잡는다. 실제 제공된 ONNX 파일의 바이트를 브라우저에서 다시 해시하지는 않는다. 빌드 산출물 생성 전에 `verify:assets`가 로컬 자산 해시를 검증한다. 교사 검수 독립 60건과 학교 기기 시험은 **NOT_RUN**이다.

## 임베딩 출력 무결성 (2026-10-20)

교사 검수 파일 재확인 결과 저장소에는 개발자 작성 `docs/HOLDOUT_DRAFT.tsv`만 있었다. 따라서 독립 60건 품질 목표는 **BLOCKED/NOT_RUN**으로 유지했다. 대신 `src/embedding-integrity.ts`에서 카드 벡터와 질의 벡터 모두 기대 차원 384, 모든 원소의 유한성, L2 길이 0.98~1.02를 검사한다. 잘못된 출력은 Worker 오류로 처리되어 추천 성공 메시지를 만들지 않는다. 기대 차원은 `src/model-contract.ts`의 선언에 포함했다.

- **PASS:** `npm test` 6건. 새 단위 시험에서 차원 불일치, NaN, 영벡터, 비정규화 벡터 거부를 확인했다.
- **PASS:** `npm run typecheck`, `npm run build`(6개 자산 해시 포함), 정적 preview의 실제 Edge 모델 `npm run test:browser`, `npm run test:ai` 기술 smoke 2건. 현재 모델의 카드·질의 벡터가 새 검사를 통과했다.
- **한계:** 벡터 형상 검사는 추천의 교육적 적합도나 교사 검수를 증명하지 않는다. 학교 교사 PC 30회 p95와 실물 기기 시험도 **NOT_RUN**이다.

## 페이지 이동·복귀 상태 회귀 (2026-10-20)

기존 `pagehide`는 질의와 Worker를 지웠지만 상태 문구와 준비 시간은 남겼다. 실제 Edge 브라우저에서 모델 준비 후 `pagehide` 이벤트를 발생시키는 회귀 검사를 추가하자 ‘모델 상태: 준비됨’이 남아 **FAIL**했다. `pagehide`와 `pageshow.persisted`에 공통 초기화를 적용해 입력, 추천 결과 판정, 준비 시간, 버튼 상태, Worker를 함께 초기화했다.

- **PASS:** 수정 후 정적 preview의 실제 모델 `npm run test:browser`에서 뒤로 가기 경로, `pagehide`, 캐시 복귀를 모사한 `pageshow.persisted` 이벤트의 초기화 확인. `npm run test:ai` 기술 smoke 2건도 PASS.
- **PASS:** `npm run typecheck`, `npm test` 6건, `npm run build`(고정 자산 6개 검증 포함).
- **한계:** Playwright의 뒤로 가기와 복귀 이벤트 모사는 개발 PC 브라우저 검증이다. 학교 실물 기기의 BFCache 동작은 **NOT_RUN**이며, 교사 검수 독립 60건 부재로 M0 출시 관문은 **BLOCKED**다.

## 모델 준비 중 입력 회귀 (2026-10-20)

`모델 준비` 직후 설명을 입력하는 브라우저 회귀 검사를 추가했다. 수정 전에는 입력 이벤트가 준비 요청의 식별 번호를 바꿔 실제 Worker의 준비 완료 응답을 폐기했다. 정적 preview의 실제 Edge 모델에서 20초 동안 준비 상태가 끝나지 않아 `npm run test:browser`가 종료 코드 1로 **FAIL**했다.

입력이 진행 중인 추론이나 이미 표시된 추천에 영향을 줄 때만 식별 번호를 갱신하도록 수정했다. 준비 중 입력은 유지되며 준비 완료 후 추천 실행 버튼을 사용할 수 있다. 수정 후 `npm run build`(고정 자산 6개 검증), `npm run typecheck`, `npm test` 6건, 실제 모델 `npm run test:browser`, `npm run test:ai` 기술 smoke 2건이 **PASS**했다.

재현: `npm run build`; 별도 셸에서 `npx vite preview --host 127.0.0.1 --port 4185 --strictPort`; 원래 셸에서 `$env:TEST_URL='http://127.0.0.1:4185/'; npm run test:browser`. 이 결과는 개발 PC의 입력 처리 검증이다. 교사 검수 독립 60건, 학교 PC·실물 기기 시험은 **NOT_RUN/BLOCKED**이며 M0 관문은 통과하지 않았다.

## 해석과 제한

이 시험은 로컬 개발 PC의 브라우저 성공이다. 개발 질의 6건은 개발자가 작성한 가상 초안이며 실제 교사 검수 자료가 아니다. `minSimilarity=0.48`, `minMargin=0.045`는 잠정값이다. E2와 E3의 원시 점수는 모델만으로 반대 의미와 적용 조건을 안전하게 구분하지 못함을 보여 준다. 보류 규칙은 정답을 맞추도록 점수를 바꾸는 방식이 아니라 위험 조건에서 추천을 중단하는 안전 장치이며, 다양한 문장에 대한 일반화는 미검증이다.

파일 로딩 측정은 브라우저의 모델 로딩 콜백으로 관찰한 벽시계 시간이다. 브라우저 HTTP 캐시·로컬 디스크·CPU 상태가 결과에 영향을 주므로 학교 PC 다운로드·추론 시간으로 일반화하지 않는다. 모델 준비 시간에는 10초 제한을 걸지 않았고, 준비 후 개별 추론에만 10초 제한을 적용했다.
