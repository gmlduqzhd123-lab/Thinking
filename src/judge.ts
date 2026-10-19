export type Score = { id: string; similarity: number };
export const provisional = { minSimilarity: 0.48, minMargin: 0.045 };
export function judge(scores: Score[], query = ''): { hold: boolean; reason: string; scores: Score[] } {
  const sorted = [...scores].sort((a, b) => b.similarity - a.similarity);
  if (/전체.{0,8}(서로 다르|다르)|서로 다른 전체/.test(query)) return { hold: true, reason: '전체의 크기가 다르다는 조건이 있어 별도 확인이 필요합니다.', scores: sorted };
  if (/더 많이 나누면.{0,12}작아|더 많이 나눌수록.{0,12}작아/.test(query)) return { hold: true, reason: '같은 전체에서 한 조각이 작아진다는 설명입니다. 혼동으로 단정하지 않습니다.', scores: sorted };
  if (/모르겠|정보가 없|알 수 없/.test(query)) return { hold: true, reason: '설명 정보가 부족해 이유를 더 확인해야 합니다.', scores: sorted };
  if (!sorted.length || sorted[0].similarity < provisional.minSimilarity) return { hold: true, reason: '관련성이 낮습니다.', scores: sorted };
  if (sorted.length > 1 && sorted[0].similarity - sorted[1].similarity < provisional.minMargin) return { hold: true, reason: '후보의 의미가 서로 가깝습니다.', scores: sorted };
  return { hold: false, reason: '', scores: sorted };
}
