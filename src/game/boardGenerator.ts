import { shuffle } from "./shuffle";
import { IMAGE_DIR, IMAGE_POOL_SIZE } from "./constants";
import type { Card } from "@/types/game";

/**
 * Builds the full filename for a pool image by index (1-based).
 * e.g. index 7 → "/images/007.webp"
 */
function imageFilename(index: number): string {
  return `${IMAGE_DIR}${String(index).padStart(3, "0")}.webp`;
}

/**
 * Returns an array of all available image filenames from the pool.
 */
function buildImagePool(): string[] {
  return Array.from({ length: IMAGE_POOL_SIZE }, (_, i) => imageFilename(i + 1));
}

/**
 * Generates a shuffled board of cards for the given number of pairs.
 *
 * Process:
 * 1. Shuffle the full image pool.
 * 2. Take the first `pairs` images.
 * 3. Duplicate each to create matched pairs.
 * 4. Shuffle the resulting 2*pairs cards.
 * 5. Assign sequential ids for position tracking.
 */
export function generateBoard(pairs: number): Card[] {
  const pool = shuffle(buildImagePool());
  const selected = pool.slice(0, pairs);

  // Each image appears twice; pairId links the two
  const doubled: Omit<Card, "id">[] = selected.flatMap((image, pairId) => [
    { image, pairId, status: "hidden" },
    { image, pairId, status: "hidden" },
  ]);

  const shuffled = shuffle(doubled);

  const cards: Card[] = shuffled.map((card, id) => ({ ...card, id }));

  console.debug("board generated", { pairs, cards });

  return cards;
}
