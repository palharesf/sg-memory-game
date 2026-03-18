import type { PoolImage } from "./imagePool";
import { POOL, INSECTS_POOL, DONATED_POOL } from "./imagePool";

// ---------------------------------------------------------------------------
// Theme registry — add new themes here, nothing else needs to change.
// ---------------------------------------------------------------------------

/** Max pairs supported by the game engine (mirrors backend validation). */
export const MAX_PAIRS = 18;

export interface ThemeDef {
  key: string;
  name: string;
  /** Short text shown on the selection card. Receives the live pool. */
  cardDescription: (pool: PoolImage[]) => string;
  /** Image pool for this theme. */
  pool: PoolImage[];
  /**
   * Minimum pool size required to unlock the theme.
   * 0 = always available.
   */
  minPoolSize: number;
  /**
   * Apply CSS `invert` filter on card images.
   * True for monochrome game-icons.net SVGs; false for full-colour art.
   */
  invertImages: boolean;
  /** Optional license / attribution line shown in the gallery. */
  credit?: { text: string; url?: string };
  /** If set, renders a donation CTA in the gallery section. */
  donationUrl?: string;
}

export const THEME_REGISTRY: ThemeDef[] = [
  {
    key: "generic",
    name: "Generic Icons",
    cardDescription: (pool) => `${pool.length} gaming symbols from game-icons.net`,
    pool: POOL,
    minPoolSize: 0,
    invertImages: true,
    credit: { text: "game-icons.net — Creative Commons 3.0 BY", url: "https://game-icons.net" },
  },
  {
    key: "insects",
    name: "Insects",
    cardDescription: (pool) =>
      pool.length < MAX_PAIRS
        ? `${pool.length}/${MAX_PAIRS} images — donated by Yamaraus`
        : `${pool.length} hand-drawn insects — donated by Yamaraus`,
    pool: INSECTS_POOL,
    minPoolSize: MAX_PAIRS,
    invertImages: false,
  },
  {
    key: "donated",
    name: "SG Community Art",
    cardDescription: (pool) =>
      pool.length === 0
        ? "Community-contributed artwork — accepting donations"
        : `${pool.length}/${MAX_PAIRS} images collected`,
    pool: DONATED_POOL,
    minPoolSize: MAX_PAIRS,
    invertImages: false,
    donationUrl: "https://www.steamgifts.com/discussion/xbMXq/sg-memory-game#aepUQi8",
  },
];

/** Look up a theme by key. Falls back to 'generic' for unknown keys. */
export function getTheme(key: string): ThemeDef {
  return THEME_REGISTRY.find((t) => t.key === key) ?? THEME_REGISTRY[0]!;
}

/** True if key matches a registered theme. */
export function isValidTheme(key: string): boolean {
  return THEME_REGISTRY.some((t) => t.key === key);
}
