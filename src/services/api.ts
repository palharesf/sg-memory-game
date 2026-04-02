import type {
  CreateGameRequest,
  CreateGameResponse,
  GameConfigResponse,
  CompleteGameRequest,
  CompleteGameResponse,
  LeaderboardEntry,
  HistoryEntry,
  CreatedGame,
  PaginatedResult,
  CurrentUser,
} from "@/types/game";

const BASE = "/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send session cookie
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${text}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const api = {
  /** Create a new game and return its short ID */
  createGame: (body: CreateGameRequest) =>
    request<CreateGameResponse>("/games", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** Fetch public game config (no secret) */
  getGame: (id: string) =>
    request<GameConfigResponse>(`/games/${id}`),

  /** Submit a win and receive the secret */
  completeGame: (id: string, body: CompleteGameRequest) =>
    request<CompleteGameResponse>(`/games/${id}/complete`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** Top-10 leaderboard for a game */
  getLeaderboard: (id: string) =>
    request<LeaderboardEntry[]>(`/games/${id}/leaderboard`),

  /** Return the secret if the authenticated user has already won this game */
  getPreviousSecret: (id: string) =>
    request<{ secret: string }>(`/games/${id}/secret`),

  /** Current authenticated user (null if not logged in) */
  getMe: () =>
    request<CurrentUser | null>("/auth/me").catch(() => null),

  /** Player's won games, paginated (requires auth) */
  getHistory: (page = 1) =>
    request<PaginatedResult<HistoryEntry>>(`/history?page=${page}`),

  /** Games created by the player, paginated (requires auth) */
  getMyGames: (page = 1) =>
    request<PaginatedResult<CreatedGame>>(`/my-games?page=${page}`),

  /** Lock or unlock a game (creator only) */
  lockGame: (id: string, locked: boolean) =>
    request<{ lockedAt: number | null }>(`/games/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ locked }),
    }),

  /** Redirect URL to start Steam OpenID flow */
  steamLoginUrl: (returnTo?: string) =>
    returnTo
      ? `${BASE}/auth/steam?returnTo=${encodeURIComponent(returnTo)}`
      : `${BASE}/auth/steam`,

  /** Log out */
  logout: () =>
    request<void>("/auth/logout", { method: "POST" }),
};
