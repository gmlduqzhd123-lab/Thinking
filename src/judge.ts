/**
 * AI 판단 로직.
 * holdRules 배열에 보류 규칙을 추가하면 새 혼동 패턴을 인식합니다.
 * thresholds는 교사 검수 자료로 조정되지 않은 잠정값입니다.
 */

export type Score = { id: string; similarity: number };

/** 판단 보류 규칙. 교사가 새 패턴을 추가하려면 이 배열에 항목을 추가합니다. */
export interface HoldRule {
  test: RegExp;
  reason: string;
}

/**
 * 판단 보류 패턴 목록.
 * 순서대로 검사하며, 처음 일치하는 규칙의 사유를 반환합니다.
 * 교사 검수 전 개발자 초안입니다.
 */
export const holdRules: HoldRule[] = [
  {
    test: /전체.{0,8}(서로 다르|다르)|서로 다른 전체/,
    reason: '전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다.',
  },
  {
    test: /더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아/,
    reason: '같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다.',
  },
  {
    test: /모르겠|정보가 없|알 수 없/,
    reason: '설명 정보가 부족해 이유를 더 확인해야 합니다.',
  },
];

/** 유사도 임계값. 교사 검증 자료로 조정되지 않은 잠정값입니다. */
export const thresholds = {
  minSimilarity: 0.48,
  minMargin: 0.045,
} as const;

export function judge(
  scores: Score[],
  query = '',
): { hold: boolean; reason: string; scores: Score[] } {
  const sorted = [...scores].sort((a, b) => b.similarity - a.similarity);

  // 패턴 기반 보류 검사
  for (const rule of holdRules) {
    if (rule.test.test(query)) {
      return { hold: true, reason: rule.reason, scores: sorted };
    }
  }

  // 유사도 기반 보류 검사
  if (!sorted.length || sorted[0].similarity < thresholds.minSimilarity) {
    return { hold: true, reason: '관련성이 낮습니다.', scores: sorted };
  }
  if (sorted.length > 1 && sorted[0].similarity - sorted[1].similarity < thresholds.minMargin) {
    return { hold: true, reason: '후보의 의미가 서로 가깝습니다.', scores: sorted };
  }

  return { hold: false, reason: '', scores: sorted };
}
