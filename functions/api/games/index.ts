/**
 * POST /api/games — create a new game
 */

import type { Env } from "../../_types";
import { nanoid } from "nanoid";
import type { CreateGameRequest, CreateGameResponse } from "../../../src/types/game";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const body = await ctx.request.json<CreateGameRequest>();

  const isRandom = body.isRandom !== false; // default true

  // Basic validation
  if (!body.pairs || body.pairs < 4 || body.pairs > 18) {
    return Response.json({ error: "pairs must be between 4 and 18" }, { status: 400 });
  }
  if (isRandom) {
    if (body.mistakes !== null && body.mistakes !== undefined) {
      if (body.mistakes < Math.ceil(body.pairs / 2)) {
        return Response.json(
          { error: "mistakes must be at least half of pairs (rounded up)" },
          { status: 400 }
        );
      }
    }
    if (body.timeLimit !== null && body.timeLimit !== undefined && body.timeLimit <= 0) {
      return Response.json({ error: "timeLimit must be positive" }, { status: 400 });
    }
  }
  if (!body.secret || body.secret.trim() === "") {
    return Response.json({ error: "secret is required" }, { status: 400 });
  }

  const id = nanoid(8);
  const creatorSteamId = ctx.data.user?.steamId ?? null;

  // Non-random games always have null mistakes and time limit
  const mistakes = isRandom ? (body.mistakes ?? null) : null;
  const timeLimit = isRandom ? (body.timeLimit ?? null) : null;

  const theme = body.theme === "donated" ? "donated" : "generic";
  const requireLoginToReveal = body.requireLoginToReveal === true ? 1 : 0;

  await ctx.env.DB.prepare(
    "INSERT INTO games (id, pairs, mistakes, time_limit, is_random, theme, secret, creator_steam_id, require_login_to_reveal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(id, body.pairs, mistakes, timeLimit, isRandom ? 1 : 0, theme, body.secret.trim(), creatorSteamId, requireLoginToReveal)
    .run();

  // Track games created if user is logged in
  if (creatorSteamId) {
    await ctx.env.DB.prepare(
      "UPDATE users SET games_created = games_created + 1 WHERE steam_id = ?"
    )
      .bind(creatorSteamId)
      .run();
  }

  console.debug("game created", { id, pairs: body.pairs });

  return Response.json({ id } satisfies CreateGameResponse, { status: 201 });
};
