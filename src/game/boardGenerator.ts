import { shuffle, seededShuffle } from "./shuffle";
import { POOL, DONATED_POOL } from "@/data/imagePool";
import type { Card, GameTheme } from "@/types/game";

function buildCards(
  pairs: number,
  theme: GameTheme,
  shuffleFn: <T>(arr: T[]) => T[]
): Card[] {
  // Use donated pool only if it has enough images; otherwise fall back to generic.
  const source =
    theme === "donated" && DONATED_POOL.length >= pairs ? DONATED_POOL : POOL;

  const pool = shuffleFn([...source]);
  const selected = pool.slice(0, pairs);

  const doubled: Omit<Card, "id">[] = selected.flatMap((poolImage, pairId) => [
    { image: poolImage.path, pairId, status: "hidden", isGeneric: theme === "generic" },
    { image: poolImage.path, pairId, status: "hidden", isGeneric: theme === "generic" },
  ]);

  return shuffleFn(doubled).map((card, id) => ({ ...card, id }));
}

/** Random board — different every time. */
export function generateBoard(pairs: number, theme: GameTheme = "generic"): Card[] {
  return buildCards(pairs, theme, (arr) => shuffle(arr));
}

/** Fixed board — same layout every time for this game ID. */
export function generateFixedBoard(pairs: number, gameId: string, theme: GameTheme = "generic"): Card[] {
  return buildCards(pairs, theme, (arr) => seededShuffle(arr, gameId));
}
