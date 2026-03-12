import type { GameState, Card } from "@/types/game";

/**
 * Returns true when a card click should be ignored.
 */
export function shouldIgnoreClick(state: GameState, cardId: number): boolean {
  if (state.boardLocked) return true;
  if (state.status !== "playing" && state.status !== "idle") return true;
  if (state.flippedIds.length >= 2) return true;

  const card = state.cards[cardId];
  if (!card) return true;
  if (card.status === "matched") return true;
  if (card.status === "flipped") return true;

  return false;
}

/**
 * Checks whether two flipped cards form a match.
 */
export function isMatch(cards: Card[], idA: number, idB: number): boolean {
  const a = cards[idA];
  const b = cards[idB];
  if (!a || !b) return false;
  return a.pairId === b.pairId;
}

/**
 * Returns true when all pairs have been matched (win condition).
 */
export function isWon(state: GameState): boolean {
  return state.cards.every((c) => c.status === "matched");
}

/**
 * Returns true when mistakes exceed the allowed limit (loss condition).
 */
export function isLost(mistakesMade: number, mistakesAllowed: number): boolean {
  return mistakesMade >= mistakesAllowed;
}
