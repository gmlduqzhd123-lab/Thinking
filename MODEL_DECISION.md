# M0 모델 결정: 보류

## 확인한 후보

- 원 모델: [`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2). 모델 카드의 라이선스 표기는 Apache-2.0이며 384차원 다국어 임베딩 모델이다.
- ONNX 변환본: [`Xenova/paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/Xenova/paraphrase-multilingual-MiniLM-L12-v2), 리비전 `2c4055b12046f11709e9df2c122e59ffbdc2f900`. 변환본 카드에서 원 모델을 ONNX로 변환했다고 밝힌다. 2026-10-19에 고정 리비전의 README frontmatter와 Hugging Face 모델 API를 확인했으나 둘 다 별도 라이선스를 표시하지 않았다. 원 모델의 Apache-2.0 표기만으로 변환본의 공개 배포 권리를 확정하지 않는다.
- 현재 기술 검증 자산: 원 모델 저장소의 [`onnx/model_quint8_avx2.onnx`](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/tree/e8f8c211226b894fcb81acc59f3b34ba3efd5f42/onnx), 리비전 `e8f8c211226b894fcb81acc59f3b34ba3efd5f42`. 원 저장소의 모델 카드에 Apache-2.0이 명시돼 있다. 같은 리비전의 config·tokenizer·ONNX 4개 파일을 해시 고정해 시험했고, Edge 브라우저 WASM의 루트·하위 경로 정적 빌드에서 실제 추론이 성공했다. Xenova 변환본은 현재 파일 목록에서 제외했다.
- 실행 조합: `@huggingface/transformers@3.8.1`, 함께 설치된 `onnxruntime-web`의 JSEP WASM, `device: wasm`, `dtype: q8`, `numThreads: 1`, mean pooling + L2 정규화. 질의와 카드 벡터 모두 동일 실행 조합으로 생성한다.
- 실제 카드·질의 임베딩은 각 실행에서 384차원, 유한값, L2 길이 0.98~1.02를 통과해야 추천에 사용한다. 이 구조 검사는 모델 출력 오류를 거르는 기술 조건이며 한국어 추천 품질을 보증하지 않는다.
- 파일명, 바이트, SHA-256은 `model-assets.json`에 고정했다. 현재 모델+토크나이저+WASM 파일 총 **149,177,062바이트(142.27MiB)**. 앱 JS/CSS를 더해도 160MiB 목표 안에 있다. 빌드가 불필요하게 생성하는 중복 WASM 파일은 빌드 후 제거한다.
- 카드 벡터는 현재 Worker가 모델 준비 시 생성한다. 화면과 Worker는 고정 리비전·기대 자산 해시·임베딩 설정·카드 내용을 공통 계약으로 비교하고, 불일치 시 AI 추천을 중단한다. 브라우저에서 모델 바이너리 전체를 다시 해시하는 검사는 아직 없으므로, 이 계약만으로 운영 자산의 실제 바이트 일치를 증명하지는 않는다.
- 공식 [Transformers.js 설정 문서](https://huggingface.co/docs/transformers.js/v3.8.1/en/api/env)상 브라우저에서 원격 모델 기본 허용, 로컬 모델 기본 비허용, 브라우저 캐시 기본 사용 가능성이 있어, 코드에서 로컬 허용·원격 차단·같은 출처 경로·브라우저 캐시 비활성화를 명시했다. [커스텀 모델 문서](https://huggingface.co/docs/transformers.js/v3.8.1/en/custom_usage)의 WASM 경로 설정을 적용했다.

## 실제 관찰과 한계

Windows 로컬 Microsoft Edge 헤드리스 브라우저, Vite 정적 preview에서 현재 고정 리비전의 가중치·토크나이저·WASM을 Worker에 불러와 한국어 문장 추론을 실행했다. 새 모델의 루트 빌드 한 번의 준비 전체 7,357ms(파일 로딩 5,623ms, 초기화 1,255ms, 초안 카드 색인 477ms), 하위 경로 준비 전체 5,300ms였다. 준비 후 질의는 이 두 실행에서 대략 24~38ms였다. 개발 PC 관찰값이며 학교 PC p95가 아니다. 브라우저 요청은 모두 같은 출처였다.

가상 6문장에서 혼동 문장 E1은 A가 1순위(유사도 0.731)였으나, 올바른 설명 E2도 원시 의미 비교에서는 A가 1순위(0.729)였다. E2와 서로 다른 전체 E3은 명시적인 조건 확인 규칙으로 판단 보류했다. E4~E6도 정보 부족 또는 낮은 관련성으로 보류했다. 이 결과는 정답 확률이나 추천 품질 달성이 아니다. 잠정 임계값 `minSimilarity=0.48`, `minMargin=0.045`는 교사 검증 자료로 조정되지 않았다.

키워드 기준은 가상 질의 E1→A, E2→B, E4→C를 반환했다. 의미 비교는 E1만 직접 추천하고 E2/E4를 보류하므로, 현재 자료로 AI의 추가 효용이 입증되지 않았다. AI 후보로 채택하거나 공개 수업으로 승격하지 않는다.

## 다음 작업

교사가 작성·검토한 독립 보류 시험 60건과 반대 의미 사례로 의미 비교·키워드 기준을 함께 평가한다. 학교 교사 PC 30회 p95와 실물 기기 시험은 이후 별도로 측정한다. 원 저장소의 라이선스 표기는 확인했지만 교사 검수·품질 관문을 통과한 것은 아니다.
