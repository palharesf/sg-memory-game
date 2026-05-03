/**
 * GET  /api/games/:id — fetch public game config (secret excluded)
 * PATCH /api/games/:id — toggle locked state (creator only)
 */

import type { Env } from "../../../_types";
import type { GameConfigResponse } from "../../../../src/types/game";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params["id"] as string;

  const row = await ctx.env.DB.prepare(
    `SELECT g.id, g.pairs, g.mistakes, g.time_limit, g.is_random, g.theme, g.creator_steam_id, g.created_at, g.locked_at, g.require_login_to_reveal,
            u.username AS creator_username, u.avatar_url AS creator_avatar
     FROM games g
     LEFT JOIN users u ON u.steam_id = g.creator_steam_id
     WHERE g.id = ?`
  )
    .bind(id)
    .first<{
      id: string;
      pairs: number;
      mistakes: number | null;
      time_limit: number | null;
      is_random: number;
      theme: string;
      creator_steam_id: string | null;
      created_at: number;
      locked_at: number | null;
      require_login_to_reveal: number;
      creator_username: string | null;
      creator_avatar: string | null;
    }>();

  if (!row) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }

  const response: GameConfigResponse = {
    id: row.id,
    pairs: row.pairs,
    mistakes: row.mistakes,
    timeLimit: row.time_limit,
    isRandom: row.is_random === 1,
    theme: row.theme === "donated" ? "donated" : "generic",
    creatorSteamId: row.creator_steam_id,
    creatorUsername: row.creator_username,
    creatorAvatar: row.creator_avatar,
    createdAt: row.created_at,
    lockedAt: row.locked_at,
    requireLoginToReveal: row.require_login_to_reveal === 1,
  };

  return Response.json(response);
};

export const onRequestPatch: PagesFunction<Env> = async (ctx) => {
  const user = ctx.data.user;
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = ctx.params["id"] as string;
  const body = await ctx.request.json<{ locked: boolean }>();

  const game = await ctx.env.DB.prepare(
    "SELECT creator_steam_id FROM games WHERE id = ?"
  )
    .bind(id)
    .first<{ creator_steam_id: string | null }>();

  if (!game) {
    return Response.json({ error: "Game not found" }, { status: 404 });
  }
  if (game.creator_steam_id !== user.steamId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const lockedAt = body.locked ? Math.floor(Date.now() / 1000) : null;

  await ctx.env.DB.prepare(
    "UPDATE games SET locked_at = ? WHERE id = ?"
  )
    .bind(lockedAt, id)
    .run();

  return Response.json({ lockedAt });
};
