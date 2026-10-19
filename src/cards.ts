export const cards = [
  { id: 'A', title: '같은 전체 나누기', text: '같은 길이의 전체를 3등분과 5등분해 한 조각의 길이를 직접 비교합니다.', hint: '분모가 커지면 한 조각도 커진다는 생각을 살핍니다.' },
  { id: 'B', title: '나누는 수 바꾸기', text: '전체 길이를 고정하고 등분 수를 바꾸며 한 조각의 변화를 관찰합니다.', hint: '분모와 한 조각 크기의 관계를 설명해 봅니다.' },
  { id: 'C', title: '전체 다시 만들기', text: '1/3 세 조각과 1/5 다섯 조각을 모아 같은 전체를 만듭니다.', hint: '분모가 무엇을 뜻하는지 확인합니다.' },
] as const;
export const examples = [
  { id: 'E1', text: '5가 3보다 크니까 1/5 한 조각이 더 길다고 생각해요.', expected: 'A' },
  { id: 'E2', text: '같은 길이를 더 많이 나누면 한 조각은 작아져요.', expected: 'B' },
  { id: 'E3', text: '두 리본의 전체 길이가 서로 다르면 비교가 달라질 수 있어요.', expected: 'hold' },
  { id: 'E4', text: '분모가 무엇을 뜻하는지 모르겠어요.', expected: 'C' },
  { id: 'E5', text: '어떤 물건인지도 모르고 길이 정보가 없어요.', expected: 'hold' },
  { id: 'E6', text: '오늘 날씨가 좋아서 운동장에 갔어요.', expected: 'hold' },
] as const;
export function baseline(query: string): string {
  if (/분모/.test(query)) return 'C';
  if (/더 많이|작아|나누는 수/.test(query)) return 'B';
  if (/5가 3보다|더 크|더 길/.test(query)) return 'A';
  return 'hold';
}
