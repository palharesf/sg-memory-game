/**
 * GET /api/auth/callback — Steam OpenID return URL
 *
 * Verifies the OpenID assertion, upserts the user in D1,
 * issues a signed JWT session cookie, and redirects to the app.
 */

import type { Env } from "../../_types";
import { signJwt, verifyOpenId, fetchSteamProfile } from "../../_lib/auth";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);

  // Verify the OpenID assertion with Steam
  const steamId = await verifyOpenId(url, ctx.env.APP_URL).catch(() => null);

  if (!steamId) {
    return Response.redirect(`${ctx.env.APP_URL}/?auth=failed`, 302);
  }

  // Fetch Steam profile (username + avatar)
  const profile = await fetchSteamProfile(steamId, ctx.env.STEAM_API_KEY);

  // Upsert user in D1
  const now = Math.floor(Date.now() / 1000);
  await ctx.env.DB.prepare(
    `INSERT INTO users (steam_id, username, avatar_url, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(steam_id) DO UPDATE
       SET username = excluded.username,
           avatar_url = excluded.avatar_url,
           updated_at = excluded.updated_at`
  )
    .bind(steamId, profile.username, profile.avatarUrl, now)
    .run();

  // Issue JWT session cookie (7 day expiry)
  const token = await signJwt({ steamId }, ctx.env.JWT_SECRET);

  return new Response(null, {
    status: 302,
    headers: {
      Location: ctx.env.APP_URL,
      "Set-Cookie": [
        `session=${token}`,
        "HttpOnly",
        "SameSite=Lax",
        "Path=/",
        `Max-Age=${7 * 24 * 60 * 60}`,
        ctx.env.APP_URL.startsWith("https") ? "Secure" : "",
      ]
        .filter(Boolean)
        .join("; "),
    },
  });
};
