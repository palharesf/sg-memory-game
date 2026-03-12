import { shuffle } from "./shuffle";
import { POOL } from "@/data/imagePool";
import type { Card } from "@/types/game";

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
  const shuffledPool = shuffle([...POOL]); // copy to avoid mutating the module constant
  const selected = shuffledPool.slice(0, pairs);

  // Each image appears twice; pairId links the two
  const doubled: Omit<Card, "id">[] = selected.flatMap((poolImage, pairId) => [
    { image: poolImage.path, pairId, status: "hidden" },
    { image: poolImage.path, pairId, status: "hidden" },
  ]);

  const shuffled = shuffle(doubled);

  const cards: Card[] = shuffled.map((card, id) => ({ ...card, id }));

  console.debug("board generated", { pairs, cards });

  return cards;
}
