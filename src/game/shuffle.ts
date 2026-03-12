/**
 * In-place Fisher-Yates shuffle using Math.random().
 * Returns the same array (mutated) for convenience.
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}

/**
 * Seeded pseudo-random number generator (Mulberry32).
 * Given the same seed, always returns the same sequence.
 */
function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Derives a numeric seed from a game ID string.
 * Uses a simple djb2-style hash.
 */
function hashId(id: string): number {
  let h = 5381;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(h, 33) ^ id.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * In-place Fisher-Yates shuffle using a seeded PRNG.
 * The same gameId always produces the same result.
 */
export function seededShuffle<T>(array: T[], gameId: string): T[] {
  const rand = mulberry32(hashId(gameId));
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}
