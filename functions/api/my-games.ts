/**
 * GET /api/my-games?page=1 — games created by the authenticated user
 */

import type { Env } from "../_types";
import type { CreatedGame, PaginatedResult } from "../../src/types/game";

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
      "SELECT COUNT(*) as total FROM games WHERE creator_steam_id = ?"
    )
      .bind(user.steamId)
      .first<{ total: number }>(),

    ctx.env.DB.prepare(
      `SELECT id, pairs, mistakes, time_limit, is_random, created_at
       FROM games
       WHERE creator_steam_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    )
      .bind(user.steamId, PAGE_SIZE, offset)
      .all<{
        id: string;
        pairs: number;
        mistakes: number | null;
        time_limit: number | null;
        is_random: number;
        created_at: number;
      }>(),
  ]);

  const items: CreatedGame[] = results.map((row) => ({
    id: row.id,
    pairs: row.pairs,
    mistakes: row.mistakes,
    timeLimit: row.time_limit,
    isRandom: row.is_random === 1,
    createdAt: row.created_at,
  }));

  return Response.json({
    items,
    total: countRow?.total ?? 0,
  } satisfies PaginatedResult<CreatedGame>);
};
