/**
 * GET /api/games/:id — fetch public game config (secret excluded)
 */

import type { Env } from "../../../_types";
import type { GameConfigResponse } from "../../../../src/types/game";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const id = ctx.params["id"] as string;

  const row = await ctx.env.DB.prepare(
    `SELECT g.id, g.pairs, g.mistakes, g.time_limit, g.is_random, g.theme, g.creator_steam_id, g.created_at,
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
  };

  return Response.json(response);
};
