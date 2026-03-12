/**
 * Global Pages middleware — runs before every /api/* request.
 * Reads the session cookie and populates ctx.data.user.
 */

import type { Env } from "./_types";
import { verifyJwt } from "./_lib/auth";

export const onRequest: PagesFunction<Env> = async (ctx) => {
  ctx.data.user = null;

  const cookie = ctx.request.headers.get("Cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  const token = match?.[1];

  if (token) {
    const payload = await verifyJwt(token, ctx.env.JWT_SECRET).catch(() => null);
    if (payload?.steamId) {
      ctx.data.user = { steamId: payload.steamId };
    }
  }

  return ctx.next();
};
