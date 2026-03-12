/**
 * GET /api/history — authenticated user's game history
 */

import type { Env } from "../_types";
import type { HistoryEntry } from "../../src/types/game";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const user = ctx.data.user;
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { results } = await ctx.env.DB.prepare(
    `SELECT game_id, has_won, best_time_ms, first_played_at, won_at
     FROM user_game_records
     WHERE steam_id = ?
     ORDER BY first_played_at DESC`
  )
    .bind(user.steamId)
    .all<{
      game_id: string;
      has_won: number;
      best_time_ms: number | null;
      first_played_at: number;
      won_at: number | null;
    }>();

  const entries: HistoryEntry[] = results.map((row) => ({
    gameId: row.game_id,
    hasWon: row.has_won === 1,
    bestTimeMs: row.best_time_ms,
    firstPlayedAt: row.first_played_at,
    wonAt: row.won_at,
  }));

  return Response.json(entries);
};
