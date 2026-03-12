/**
 * GET /api/games/:id/leaderboard — top 10 players for a game
 */

import type { Env } from "../../../_types";
import type { LeaderboardEntry } from "../../../../src/types/game";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params["id"] as string;

  const { results } = await ctx.env.DB.prepare(
    `SELECT r.steam_id, u.username, u.avatar_url, r.best_time_ms, r.won_at
     FROM user_game_records r
     JOIN users u ON u.steam_id = r.steam_id
     WHERE r.game_id = ? AND r.has_won = 1
     ORDER BY r.best_time_ms ASC
     LIMIT 10`
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
