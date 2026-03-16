// ---------------------------------------------------------------------------
// Game configuration — stored in D1, encoded in the URL as a short ID
// ---------------------------------------------------------------------------

export type GameTheme = 'generic' | 'donated';

export interface GameConfig {
  id: string;
  pairs: number;
  mistakes: number | null; // null = unlimited; always null for non-random games
  timeLimit: number | null; // seconds; null = no limit; always null for non-random games
  isRandom: boolean;
  creatorSteamId: string | null;
  createdAt: number; // unix seconds
}

// ---------------------------------------------------------------------------
// Card types
// ---------------------------------------------------------------------------

export type CardStatus = "hidden" | "flipped" | "matched";

export interface Card {
  /** Unique position index on the board */
  id: number;
  /** Image filename, e.g. "001.webp" */
  image: string;
  /** Both cards in a pair share the same pairId */
  pairId: number;
  status: CardStatus;
  isGeneric?: boolean; // Added for conditional styling based on theme
}

// ---------------------------------------------------------------------------
// Game state — lives in useGameState hook, never persisted client-side
// ---------------------------------------------------------------------------

export type GameStatus = "idle" | "playing" | "won" | "lost";

export interface GameState {
  cards: Card[];
  /** Indices of currently face-up (not yet resolved) cards — max 2 */
  flippedIds: number[];
  matchedPairIds: number[];
  mistakesMade: number;
  status: GameStatus;
  /** ms elapsed since first card flip; driven by requestAnimationFrame */
  timeElapsed: number;
  /** True while the board is locked during a mismatch delay */
  boardLocked: boolean;
}

// ---------------------------------------------------------------------------
// API request / response shapes
// ---------------------------------------------------------------------------

export interface CreateGameRequest {
  pairs: number;
  mistakes: number | null;
  timeLimit: number | null;
  isRandom: boolean;
  secret: string;
}

export interface CreateGameResponse {
  id: string;
}

export interface GameConfigResponse {
  id: string;
  pairs: number;
  mistakes: number | null;
  timeLimit: number | null;
  isRandom: boolean;
  theme: GameTheme;
  creatorSteamId: string | null;
  creatorUsername: string | null;
  creatorAvatar: string | null;
  createdAt: number;
}

export interface CompleteGameRequest {
  timeMs: number;
}

export interface CompleteGameResponse {
  secret: string;
  isNewRecord: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  steamId: string;
  username: string;
  avatarUrl: string;
  bestTimeMs: number;
  completedAt: number;
}

export interface HistoryEntry {
  gameId: string;
  hasWon: boolean;
  bestTimeMs: number | null;
  firstPlayedAt: number;
  wonAt: number | null;
}

export interface CreatedGame {
  id: string;
  pairs: number;
  mistakes: number | null;
  timeLimit: number | null;
  isRandom: boolean;
  createdAt: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface CurrentUser {
  steamId: string;
  username: string;
  avatarUrl: string;
}
