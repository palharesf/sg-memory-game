/**
 * GET /api/games/:id/secret — return the secret for a game the user has already won.
 *
 * Used to auto-reveal the secret when a winner revisits a game page.
 * Returns 401 if not authenticated, 403 if the user hasn't won yet.
 */

import type { Env } from "../../../_types";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const user = ctx.data.user;
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = ctx.params["id"] as string;

  const record = await ctx.env.DB.prepare(
    "SELECT has_won FROM user_game_records WHERE steam_id = ? AND game_id = ?"
  )
    .bind(user.steamId, id)
    .first<{ has_won: number }>();

  if (!record || record.has_won !== 1) {
    return Response.json({ error: "Not won" }, { status: 403 });
  }

  const game = await ctx.env.DB.prepare(
    "SELECT secret FROM games WHERE id = ?"
  )
    .bind(id)
    .first<{ secret: string }>();

  if (!game) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  return Response.json({ secret: game.secret });
};
