/**
 * POST /api/games — create a new game
 */

import type { Env } from "../../_types";
import { nanoid } from "nanoid";
import type { CreateGameRequest, CreateGameResponse } from "../../../src/types/game";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const body = await ctx.request.json<CreateGameRequest>();

  // Basic validation
  if (!body.pairs || body.pairs < 4 || body.pairs > 18) {
    return Response.json({ error: "pairs must be between 4 and 18" }, { status: 400 });
  }
  if (!body.mistakes || body.mistakes < Math.ceil(body.pairs / 2)) {
    return Response.json(
      { error: "mistakes must be at least half of pairs (rounded up)" },
      { status: 400 }
    );
  }
  if (body.timeLimit !== null && body.timeLimit !== undefined && body.timeLimit <= 0) {
    return Response.json({ error: "timeLimit must be positive" }, { status: 400 });
  }
  if (!body.secret || body.secret.trim() === "") {
    return Response.json({ error: "secret is required" }, { status: 400 });
  }

  const id = nanoid(8);
  const creatorSteamId = ctx.data.user?.steamId ?? null;

  await ctx.env.DB.prepare(
    "INSERT INTO games (id, pairs, mistakes, time_limit, secret, creator_steam_id) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(id, body.pairs, body.mistakes, body.timeLimit ?? null, body.secret.trim(), creatorSteamId)
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
