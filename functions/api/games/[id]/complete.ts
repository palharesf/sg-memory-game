/**
 * POST /api/games/:id/complete — submit a win, receive the secret
 *
 * Works for both anonymous and authenticated users.
 * Authenticated users get their best time recorded.
 */

import type { Env } from "../../../_types";
import type { CompleteGameRequest, CompleteGameResponse } from "../../../../src/types/game";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params["id"] as string;
  const body = await ctx.request.json<CompleteGameRequest>();

  if (body.timeMs < 0) {
    return Response.json({ error: "timeMs must be non-negative" }, { status: 400 });
  }

  const game = await ctx.env.DB.prepare(
    "SELECT id, secret, pairs, mistakes, time_limit, is_random FROM games WHERE id = ?"
  )
    .bind(id)
    .first<{
      id: string;
      secret: string;
      pairs: number;
      mistakes: number | null;
      time_limit: number | null;
      is_random: number;
    }>();

  if (!game) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  // Non-random games always submit timeMs=0 — skip time-based checks
  const isRandom = game.is_random === 1;

  // Sanity check: submitted time must be plausible (at least 300ms per pair).
  // 1000ms per pair was too strict — a fast human can clear a 4-pair game in ~3s.
  if (isRandom && body.timeMs < game.pairs * 300) {
    return Response.json({ error: "Implausible completion time" }, { status: 400 });
  }

  // Time limit check (server-authoritative, random games only)
  if (isRandom && game.time_limit && body.timeMs / 1000 > game.time_limit) {
    return Response.json({ error: "Time limit exceeded" }, { status: 400 });
  }

  let isNewRecord = false;
  let scoreSaved = true;
  const user = ctx.data.user;

  if (user) {
    try {
      const existing = await ctx.env.DB.prepare(
        "SELECT best_time_ms FROM user_game_records WHERE steam_id = ? AND game_id = ?"
      )
        .bind(user.steamId, id)
        .first<{ best_time_ms: number | null }>();

      const now = Math.floor(Date.now() / 1000);

      if (!existing) {
        await ctx.env.DB.prepare(
          `INSERT INTO user_game_records
             (steam_id, game_id, has_played, has_won, best_time_ms, first_played_at, won_at)
           VALUES (?, ?, 1, 1, ?, ?, ?)`
        )
          .bind(user.steamId, id, body.timeMs, now, now)
          .run();
        isNewRecord = true;
      } else if (existing.best_time_ms === null || body.timeMs < existing.best_time_ms) {
        await ctx.env.DB.prepare(
          "UPDATE user_game_records SET has_won = 1, best_time_ms = ?, won_at = ? WHERE steam_id = ? AND game_id = ?"
        )
          .bind(body.timeMs, now, user.steamId, id)
          .run();
        isNewRecord = true;
      }
    } catch (err) {
      console.error("failed to save score", { id, user: user.steamId, err });
      scoreSaved = false;
    }
  }

  console.debug("game completed", { id, timeMs: body.timeMs, user: user?.steamId, scoreSaved });

  return Response.json({
    secret: game.secret,
    isNewRecord,
    scoreSaved,
  } satisfies CompleteGameResponse);
};
