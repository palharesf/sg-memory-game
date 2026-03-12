// ---------------------------------------------------------------------------
// Game constants — single place to tweak during playtesting
// ---------------------------------------------------------------------------

/** Minimum number of pairs allowed in a game */
export const MIN_PAIRS = 4;

/** Maximum number of pairs allowed in a game */
export const MAX_PAIRS = 18;

/** Default mistake allowance when creator doesn't override (equals pairs count) */
export const defaultMistakes = (pairs: number): number => pairs;

/** Minimum mistakes allowed (half of pairs, rounded up) */
export const minMistakes = (pairs: number): number => Math.ceil(pairs / 2);

/** How long (ms) to show a mismatched pair before flipping back */
export const MISMATCH_DELAY_MS = 1000;

/** Image pool directory (relative to public/) */
export const IMAGE_DIR = "/images/";

/** Total images available in the pool */
export const IMAGE_POOL_SIZE = 100;

// ---------------------------------------------------------------------------
// Grid layout — near-square grids for each pair range
// ---------------------------------------------------------------------------

export function getGridDimensions(pairs: number): { rows: number; cols: number } {
  const total = pairs * 2;

  if (pairs <= 6) return { rows: 3, cols: 4 };   // 12 cards
  if (pairs <= 8) return { rows: 4, cols: 4 };   // 16 cards
  if (pairs <= 12) return { rows: 4, cols: 6 };  // 24 cards
  if (pairs <= 15) return { rows: 5, cols: 6 };  // 30 cards
  if (pairs <= 18) return { rows: 6, cols: 6 };  // 36 cards

  // Fallback for future expansion
  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);
  return { rows, cols };
}
