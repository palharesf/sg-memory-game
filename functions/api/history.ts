/**
 * GET /api/history?page=1 — authenticated user's won games
 */

import type { Env } from "../_types";
import type { HistoryEntry, PaginatedResult } from "../../src/types/game";

const PAGE_SIZE = 50;

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const user = ctx.data.user;
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(ctx.request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const [countRow, { results }] = await Promise.all([
    ctx.env.DB.prepare(
      "SELECT COUNT(*) as total FROM user_game_records WHERE steam_id = ? AND has_won = 1"
    )
      .bind(user.steamId)
      .first<{ total: number }>(),

    ctx.env.DB.prepare(
      `SELECT ugr.game_id, ugr.has_won, ugr.best_time_ms, ugr.first_played_at, ugr.won_at, g.secret
       FROM user_game_records ugr
       JOIN games g ON g.id = ugr.game_id
       WHERE ugr.steam_id = ? AND ugr.has_won = 1
       ORDER BY ugr.won_at DESC
       LIMIT ? OFFSET ?`
    )
      .bind(user.steamId, PAGE_SIZE, offset)
      .all<{
        game_id: string;
        has_won: number;
        best_time_ms: number | null;
        first_played_at: number;
        won_at: number | null;
        secret: string;
      }>(),
  ]);

  const items: HistoryEntry[] = results.map((row) => ({
    gameId: row.game_id,
    hasWon: row.has_won === 1,
    bestTimeMs: row.best_time_ms,
    firstPlayedAt: row.first_played_at,
    wonAt: row.won_at,
    secret: row.secret,
  }));

  return Response.json({
    items,
    total: countRow?.total ?? 0,
  } satisfies PaginatedResult<HistoryEntry>);
};
