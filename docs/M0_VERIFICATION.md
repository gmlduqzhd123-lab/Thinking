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

다른 셸에서 `TEST_URL=http://127.0.0.1:4173/ npm run test:browser`를 실행한다. Windows PowerShell에서는 `$env:TEST_URL='http://127.0.0.1:4173/'; npm run test:browser`를 사용한다. 하위 경로 시험은 `$env:APP_BASE='/qa-forks/'; npm run build`로 다시 빌드하고 preview를 재시작한 뒤 `TEST_URL`을 `http://127.0.0.1:4173/qa-forks/`로 설정한다. `fetch:assets`만 개발·빌드 중 공식 모델 저장소와 통신한다.

## 결과

| 항목 | 상태 | 관찰 |
|---|---|---|
| 타입 검사·단위 시험(2건)·정적 빌드 | PASS | `npm run typecheck`, `npm test`, `npm run build` |
| 자산 무결성·용량 | PASS | 6개 파일 SHA-256 확인, 157,032,711바이트(149.76MiB). 정적 산출물에서 중복 WASM을 제거 후 실제 로딩 재시험 |
| 실제 모델 로딩·한국어 추론 | PASS | Edge Worker의 WASM 단일 스레드, 실제 `model_quantized.onnx`와 `tokenizer.json` 로딩 |
| 루트 `/` | PASS | 정적 preview에서 모델·Worker·WASM 로딩 및 질의 결과. 준비 전체 5,581ms, 파일 로딩 4,449ms, 초기화 856ms, 카드 색인 276ms. 질의 20~38ms (한 실행 관찰) |
| 하위 `/qa-forks/` | PASS | 정적 preview에서 전 자산 경로가 하위 경로 유지. 준비 전체 6,002ms, 파일 로딩 4,688ms, 초기화 1,028ms, 카드 색인 286ms (한 실행 관찰) |
| 가상 질의 6건 | PASS/한계 | E1 AI A(0.720); E2 원시 AI A(0.699)여서 보류 규칙 적용; E3 다른 전체 보류; E4 분모 뜻 모름 보류; E5 정보 부족 보류; E6 범위 밖 보류. 기본 키워드는 E1 A, E2 B, E4 C. 교사 품질 검수는 아님 |
| 입력 변경·초기화·연속 요청·취소 | PASS | requestId/sessionRevision으로 늦은 결과 무시, 입력 변경 중 Worker 종료, 준비 중 취소 후 거짓 준비 완료 없음 |
| 모델 파일 누락·손상 | PASS | Playwright가 ONNX 요청을 404 또는 손상 바이트로 대체했을 때 `실패`, 원격 우회 없음 |
| 수업 입력 보호 | PASS(시험 범위) | 추적한 요청 모두 같은 출처, 입력 문자열이 요청 URL·콘솔·URL에 없음; localStorage·sessionStorage·IndexedDB·Cache Storage 비어 있음 |
| 교사 작성 보류 시험 60건, 학교 PC 30회 p95, 실물 기기, 실제 수업 | NOT_RUN | 자료와 기기가 없어 확인하지 않음 |
| 변환본 공개 배포 라이선스 | BLOCKED | 원 모델 Apache-2.0 확인, 변환본의 별도 라이선스 표기는 확인되지 않음 |

## 해석과 제한

이 시험은 로컬 개발 PC의 브라우저 성공이다. 개발 질의 6건은 개발자가 작성한 가상 초안이며 실제 교사 검수 자료가 아니다. `minSimilarity=0.48`, `minMargin=0.045`는 잠정값이다. E2와 E3의 원시 점수는 모델만으로 반대 의미와 적용 조건을 안전하게 구분하지 못함을 보여 준다. 보류 규칙은 정답을 맞추도록 점수를 바꾸는 방식이 아니라 위험 조건에서 추천을 중단하는 안전 장치이며, 다양한 문장에 대한 일반화는 미검증이다.

파일 로딩 측정은 브라우저의 모델 로딩 콜백으로 관찰한 벽시계 시간이다. 브라우저 HTTP 캐시·로컬 디스크·CPU 상태가 결과에 영향을 주므로 학교 PC 다운로드·추론 시간으로 일반화하지 않는다. 모델 준비 시간에는 10초 제한을 걸지 않았고, 준비 후 개별 추론에만 10초 제한을 적용했다.
