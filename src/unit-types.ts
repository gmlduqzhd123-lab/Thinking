/**
 * 다단원 확장을 위한 타입 정의.
 * 새 단원을 추가하려면 이 타입을 따르는 데이터 파일을 작성합니다.
 */

/** 탐구 카드 한 장의 구조. */
export interface Card {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly hint: string;
}

/** 예시 질의. */
export interface Example {
  readonly id: string;
  readonly text: string;
  readonly expected: string;
}

/** 판단 보류 패턴. */
export interface HoldPattern {
  readonly pattern: string;
  readonly reason: string;
}

/**
 * 한 단원의 전체 설정.
 *
 * @example
 * ```typescript
 * const m02: UnitConfig = {
 *   id: 'M02',
 *   title: '대분수 뺄셈',
 *   description: '대분수에서 빼기를 할 때 자연수 부분과 분수 부분을 나누어 계산합니다.',
 *   cards: [...],
 *   examples: [...],
 *   denominators: { first: [3, 5], transfer: [4, 7] },
 *   holdPatterns: [...],
 *   thresholds: { minSimilarity: 0.50, minMargin: 0.05 },
 * };
 * ```
 */
export interface UnitConfig {
  /** 단원 ID (예: 'M01', 'M02'). */
  readonly id: string;
  /** 단원 제목. */
  readonly title: string;
  /** 단원 설명 (한 줄). */
  readonly description: string;
  /** 탐구 카드 목록 (최소 2장). */
  readonly cards: readonly Card[];
  /** 예시 질의 목록. */
  readonly examples: readonly Example[];
  /** 분수 비교에 사용할 분모 쌍. */
  readonly denominators: {
    readonly first: readonly [number, number];
    readonly transfer: readonly [number, number];
  };
  /** 판단 보류 패턴 목록 (정규식 문자열). */
  readonly holdPatterns: readonly HoldPattern[];
  /** 유사도 임계값. */
  readonly thresholds: {
    readonly minSimilarity: number;
    readonly minMargin: number;
  };
}
