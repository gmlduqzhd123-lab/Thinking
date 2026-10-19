# M0 모델 결정: 보류

## 확인한 후보

- 원 모델: [`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2). 모델 카드의 라이선스 표기는 Apache-2.0이며 384차원 다국어 임베딩 모델이다.
- ONNX 변환본: [`Xenova/paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/Xenova/paraphrase-multilingual-MiniLM-L12-v2), 리비전 `2c4055b12046f11709e9df2c122e59ffbdc2f900`. 변환본 카드에서 원 모델을 ONNX로 변환했다고 밝힌다. 변환본 저장소의 별도 라이선스 메타데이터는 확인되지 않았다. 따라서 공개 배포 권리는 추가 확인이 필요하다.
- 실행 조합: `@huggingface/transformers@3.8.1`, 함께 설치된 `onnxruntime-web`의 JSEP WASM, `device: wasm`, `dtype: q8`, `numThreads: 1`, mean pooling + L2 정규화. 질의와 카드 벡터 모두 동일 실행 조합으로 생성한다.
- 파일명, 바이트, SHA-256은 `model-assets.json`에 고정했다. 모델+토크나이저+WASM 파일 총 **157,032,711바이트(149.76MiB)**. 앱 JS/CSS를 더해도 160MiB 목표 안에 있다. 빌드가 불필요하게 생성하는 중복 WASM 파일은 빌드 후 제거하고 정적 preview에서 재시험했다.
- 공식 [Transformers.js 설정 문서](https://huggingface.co/docs/transformers.js/v3.8.1/en/api/env)상 브라우저에서 원격 모델 기본 허용, 로컬 모델 기본 비허용, 브라우저 캐시 기본 사용 가능성이 있어, 코드에서 로컬 허용·원격 차단·같은 출처 경로·브라우저 캐시 비활성화를 명시했다. [커스텀 모델 문서](https://huggingface.co/docs/transformers.js/v3.8.1/en/custom_usage)의 WASM 경로 설정을 적용했다.

## 실제 관찰과 한계

Windows 로컬 Microsoft Edge 헤드리스 브라우저, Vite 정적 preview에서 실제 모델 가중치·토크나이저·WASM을 Worker에 불러와 한국어 문장 추론을 실행했다. 루트 빌드 한 번의 준비 전체 5,581ms(파일 로딩 4,449ms, 초기화 856ms, 초안 카드 색인 276ms), 준비 후 질의 20~38ms였다. 첫 접속 캐시와 호스트 상태에 따라 달라지는 개발 PC 측정값이며 학교 PC p95가 아니다. 브라우저 요청은 모두 같은 출처였다.

가상 6문장에서 분모가 클수록 조각이 크다는 혼동 문장은 A가 1순위(유사도 0.720)였으나, 올바른 설명도 원시 의미 비교만으로는 A가 1순위(0.699 vs B 0.650)였다. 서로 다른 전체 조건도 원시 의미 비교에서는 B를 1순위로 냈다. 이 둘은 명시적인 조건 확인 규칙으로 판단 보류 처리했다. 분모의 뜻을 모르겠다는 설명은 관련성 수치가 낮아 보류됐다. 이 결과는 정답 확률이나 추천 품질 달성이 아니다. 잠정 임계값 `minSimilarity=0.48`, `minMargin=0.045`는 교사 검증 자료로 조정되지 않았다.

키워드 기준은 가상 질의 E1→A, E2→B, E4→C를 반환했다. 의미 비교는 E1만 직접 추천하고 E2/E4를 보류하므로, 현재 자료로 AI의 추가 효용이 입증되지 않았다. AI 후보로 채택하거나 공개 수업으로 승격하지 않는다.

## 다음 작업

교사가 작성·검토한 독립 보류 시험 60건과 반대 의미 사례로 의미 비교·키워드 기준을 함께 평가하고, 변환본의 공개 배포 권리를 확인한다. 학교 교사 PC 30회 p95와 실물 기기 시험은 이후 별도로 측정한다.
