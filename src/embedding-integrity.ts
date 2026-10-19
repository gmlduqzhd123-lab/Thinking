export function requireUnitEmbedding(values: ArrayLike<number>, dimension: number): number[] {
  if (values.length !== dimension) throw new Error('Embedding dimension mismatch');
  const vector = Array.from(values);
  let normSquared = 0;
  for (const value of vector) {
    if (!Number.isFinite(value)) throw new Error('Embedding has a non-finite value');
    normSquared += value * value;
  }
  const norm = Math.sqrt(normSquared);
  if (norm < 0.98 || norm > 1.02) throw new Error('Embedding is not normalized');
  return vector;
}
