# M0 상태

- 현재 단계: M0 로컬 AI 실행 가능성 검증. 개발 전용, 모델 채택 보류.
- 확인됨: M01 초안 페이지, 실제 Worker/WASM 추론, 같은 출처 자산, SHA-256 검증, 보류 규칙, 기본 카드, 입력·취소·초기화·종료, 루트·하위 경로 브라우저 시험. 실패한 모델 준비를 시험 명령이 실패로 보고하는지 확인했고, 누락·손상·시간 초과·입력 비복원 경로를 보강했다.
- 이번 작업: 추론 중에도 활성화돼 있던 ‘추천 실행’ 버튼을 비활성화해 중복 실행을 막았다. 수정 전 실제 모델 브라우저 회귀 시험 FAIL, 수정 후 PASS를 확인했다. 결과 이후에는 다시 실행할 수 있다. M0 앱은 공개하지 않았다.
- 남은 차단: 교사가 작성·검수한 독립 시험 60건이 없어 품질 지표는 미측정. 학교 PC·실물 기기 성능도 미확인. 현재 모델은 라이선스가 표시된 원 저장소의 고정 리비전 자산으로 교체했다.
- 다음 작업 하나: 교사가 초안 문장과 허용 탐구 집합을 검토해 독립 시험 파일을 확정한다.
- 공개 주소: GitHub Pages 게시 소스는 `gh-pages` 브랜치 루트다. 브랜치에는 개발 상태 `index.html`과 `.nojekyll` 두 파일만 있다. M0 앱·개발용 콘텐츠·모델 파일은 사이트에 게시하지 않는다. 앱 출시는 위 차단 항목이 해소될 때까지 BLOCKED다.
- Pages 실행: 이전 `main/docs` 게시가 뒤늦게 완료되면서 개발용 초안 TSV가 Pages URL에서 HTTP 200으로 노출된 것을 발견했다. Pages를 일시 중지한 뒤 두 파일만 담은 `gh-pages` 브랜치를 게시 소스로 설정하고 `main`의 중복 workflow를 제거했다. 2026-10-20 재검증에서 공개 안내 페이지 HTTP 200 및 `gh-pages/index.html`과 본문 동일, 초안 TSV·모델·WASM 경로 HTTP 404를 확인했다. 수업용 앱은 게시되지 않았다.
- 현재 모델 시험: 원 모델 저장소의 Apache-2.0 양자화 ONNX로 고정 자산을 교체했다. 6개 파일 SHA-256 PASS, 총 142.27MiB. Edge 정적 빌드의 루트·하위 경로 `test:browser` PASS, 실제 브라우저 `test:ai` 기술 smoke PASS. 교사 품질 평가와 실물 기기 시험은 NOT_RUN이므로 M0 관문은 보류한다.
- Pages 재검증 (2026-10-20): 이전 안전한 `gh-pages` 실행 #5의 build·report·deploy가 모두 success로 확인됐다. 이번 재게시 브랜치 커밋은 `5e71db4`이며 `npm run test:pages` 네 항목 **PASS**. 새 공개 페이지 본문 1,081자는 `gh-pages/index.html`과 정확히 일치한다.
- 성능 재현 코드 (2026-10-20): `npm run test:performance`는 실제 로컬 모델 준비 후 160자 질의 30회의 화면 응답 시간을 측정한다. 개발 PC Edge 헤드리스에서 준비 5,700ms, 준비 후 p95 265ms(최소 228ms, 최대 274ms). **학교 PC 30회 p95와 실물 기기 시험은 NOT_RUN**이며 이 수치로 M0 출시 관문을 통과시키지 않는다.
- 입력 수정 회귀 (2026-10-20): `npm run build`, `npm run typecheck`, `npm test` 5건, 실제 모델을 사용하는 `npm run test:browser` 및 `npm run test:ai` 기술 smoke PASS. 초기 회귀 시험은 입력 수정 후 이전 `data-hold`가 남아 FAIL했고, 코드 수정 후 같은 검사에서 PASS했다. 교사 검수나 실제 수업 승인으로 해석하지 않는다.
- 모델·색인 계약 (2026-10-20): `npm run typecheck`, `npm test` 5건, `npm run build`, 실제 모델 `npm run test:browser`와 `npm run test:ai` 기술 smoke PASS. 브라우저 시험에서 준비 완료 계약을 고의로 불일치시키자 실패 상태·추천 차단·기본 카드 전환을 확인했다. 이 검사는 혼합 JS 번들에 대한 실행 시 계약 검사이며, 모델 바이너리의 실행 시 해시 검사는 아니다. 바이너리 해시는 빌드 전 `verify:assets`에서 검증한다.
- 임베딩 무결성 (2026-10-20): `npm run typecheck`, `npm test` 6건, `npm run build`, 실제 모델 `npm run test:browser`와 `npm run test:ai` 기술 smoke PASS. 벡터 차원 불일치·NaN·영벡터·비정규화 값은 단위 시험에서 거부했다. 교사 검수와 학교 기기 시험은 NOT_RUN이며 M0 출시 관문은 여전히 BLOCKED다.
- 페이지 복귀 회귀 (2026-10-20): 수정 전 `test:browser`는 `pagehide` 후 ‘준비됨’이 남아 FAIL했다. 수정 후 실제 뒤로 가기와 `pagehide`·`pageshow.persisted` 이벤트 시험 PASS. `typecheck`, 단위 시험 6건, 정적 `build`, 실제 모델 `test:browser`·`test:ai` 기술 smoke PASS. 실제 기기의 BFCache 동작과 교사 검수 시험은 NOT_RUN이다.
- 준비 중 입력 회귀 (2026-10-20): 수정 전 실제 모델 `test:browser`는 준비 중 입력 후 20초 동안 ‘준비됨’에 도달하지 못해 FAIL했다. 수정 후 정적 빌드의 실제 Edge 모델 `test:browser` PASS, `test:ai` 기술 smoke 2건 PASS, `typecheck`·단위 시험 6건·`build` PASS. 교사 검수 독립 60건과 학교 실물 기기 시험은 NOT_RUN이며 M0 관문은 BLOCKED다.
- 중복 추론 방지 (2026-10-20): 실제 모델 `test:browser`에서 결과 응답을 지연한 상태의 ‘추천 실행’ 버튼이 활성화돼 있어 수정 전 FAIL했다. 추론 중 버튼을 비활성화하고 결과 수신 후 다시 활성화하도록 수정했다. 수정 후 `build`, `typecheck`, 단위 시험 6건, 실제 모델 `test:browser`·`test:ai` 기술 smoke 2건 PASS. 교사 검수 독립 60건과 학교 실물 기기 시험은 NOT_RUN이며 M0 관문은 BLOCKED다.
