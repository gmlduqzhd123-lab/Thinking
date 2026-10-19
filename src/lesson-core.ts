export const FIRST_ITEM = { id: 'M01-UF-01', version: 1 } as const;
export const TRANSFER_ITEM = { id: 'M01-UF-02', version: 1 } as const;
export const CHOICES = ['A', 'B', 'C', 'D'] as const;
export type Choice = typeof CHOICES[number];
export type RawCounts = Record<Choice, string>;

export function emptyCounts(): RawCounts { return { A: '', B: '', C: '', D: '' }; }

export function parseParticipants(raw: string): number | null {
  if (!/^(?:[1-9]|[1-5][0-9]|60)$/.test(raw)) return null;
  return Number(raw);
}

export function validateCounts(raw: RawCounts, participants: number): { counts: Record<Choice, number>; noResponse: number } | null {
  if (!Number.isInteger(participants) || participants < 1 || participants > 60) return null;
  if (CHOICES.some(choice => !/^(?:0|[1-9]\d*)$/.test(raw[choice]))) return null;
  const counts = Object.fromEntries(CHOICES.map(choice => [choice, Number(raw[choice])])) as Record<Choice, number>;
  const total = CHOICES.reduce((sum, choice) => sum + counts[choice], 0);
  if (total > participants) return null;
  return { counts, noResponse: participants - total };
}

export function percentagePointChange(first: number, second: number, participants: number): number {
  return ((second - first) / participants) * 100;
}

export function fractionSegments(denominator: number): { start: number; end: number }[] {
  if (!Number.isInteger(denominator) || denominator < 2 || denominator > 12) throw new RangeError('denominator must be 2–12');
  return Array.from({ length: denominator }, (_, index) => ({ start: index / denominator, end: (index + 1) / denominator }));
}
