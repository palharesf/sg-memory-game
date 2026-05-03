/**
 * GET /api/games/:id/leaderboard
 * Returns top 10 solvers for regular games, all solvers for login-required games.
 */

import type { Env } from "../../../_types";
import type { LeaderboardEntry } from "../../../../src/types/game";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params["id"] as string;

  const gameRow = await ctx.env.DB.prepare(
    "SELECT require_login_to_reveal FROM games WHERE id = ?"
  )
    .bind(id)
    .first<{ require_login_to_reveal: number }>();

  const requiresLogin = gameRow?.require_login_to_reveal === 1;

  const baseQuery = `
    SELECT r.steam_id, u.username, u.avatar_url, r.best_time_ms, r.won_at
    FROM user_game_records r
    JOIN users u ON u.steam_id = r.steam_id
    WHERE r.game_id = ? AND r.has_won = 1
    ORDER BY r.best_time_ms ASC`;

  const { results } = await ctx.env.DB.prepare(
    requiresLogin ? baseQuery : baseQuery + "\n    LIMIT 10"
  )
    .bind(id)
    .all<{
      steam_id: string;
      username: string;
      avatar_url: string;
      best_time_ms: number;
      won_at: number;
    }>();

  const entries: LeaderboardEntry[] = results.map((row, i) => ({
    rank: i + 1,
    steamId: row.steam_id,
    username: row.username,
    avatarUrl: row.avatar_url,
    bestTimeMs: row.best_time_ms,
    completedAt: row.won_at,
  }));

  return Response.json(entries);
};
