/**
 * GET /api/auth/me — return the current session user or null
 */

import type { Env } from "../../_types";
import type { CurrentUser } from "../../../src/types/game";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const user = ctx.data.user;
  if (!user) return Response.json(null);

  const row = await ctx.env.DB.prepare(
    "SELECT username, avatar_url FROM users WHERE steam_id = ?"
  )
    .bind(user.steamId)
    .first<{ username: string; avatar_url: string }>();

  if (!row) return Response.json(null);

  return Response.json({
    steamId: user.steamId,
    username: row.username,
    avatarUrl: row.avatar_url,
  } satisfies CurrentUser);
};
