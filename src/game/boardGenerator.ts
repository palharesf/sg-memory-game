import { shuffle, seededShuffle } from "./shuffle";
import { POOL } from "@/data/imagePool";
import type { Card } from "@/types/game";

function buildCards(pairs: number, shuffleFn: <T>(arr: T[]) => T[]): Card[] {
  const pool = shuffleFn([...POOL]);
  const selected = pool.slice(0, pairs);

  const doubled: Omit<Card, "id">[] = selected.flatMap((poolImage, pairId) => [
    { image: poolImage.path, pairId, status: "hidden" },
    { image: poolImage.path, pairId, status: "hidden" },
  ]);

  const cards: Card[] = shuffleFn(doubled).map((card, id) => ({ ...card, id }));

  console.debug("board generated", { pairs, cards });
  return cards;
}

/** Random board — different every time. */
export function generateBoard(pairs: number): Card[] {
  return buildCards(pairs, (arr) => shuffle(arr));
}

/** Fixed board — same layout every time for this game ID. */
export function generateFixedBoard(pairs: number, gameId: string): Card[] {
  return buildCards(pairs, (arr) => seededShuffle(arr, gameId));
}
