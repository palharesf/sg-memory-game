import type {
  CreateGameRequest,
  CreateGameResponse,
  GameConfigResponse,
  CompleteGameRequest,
  CompleteGameResponse,
  LeaderboardEntry,
  HistoryEntry,
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

  /** Current authenticated user (null if not logged in) */
  getMe: () =>
    request<CurrentUser | null>("/auth/me").catch(() => null),

  /** Player's game history (requires auth) */
  getHistory: () =>
    request<HistoryEntry[]>("/history"),

  /** Redirect URL to start Steam OpenID flow */
  steamLoginUrl: () => `${BASE}/auth/steam`,

  /** Log out */
  logout: () =>
    request<void>("/auth/logout", { method: "POST" }),
};
