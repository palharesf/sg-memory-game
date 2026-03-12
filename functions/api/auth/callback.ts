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
  const appUrl = ctx.env.APP_URL ?? "https://sg-memory-game.pages.dev";

  try {
    // Verify the OpenID assertion with Steam
    const steamId = await verifyOpenId(url, appUrl).catch((e) => {
      console.error("verifyOpenId failed:", e);
      return null;
    });

    if (!steamId) {
      return Response.redirect(`${appUrl}/?auth=failed&step=verify`, 302);
    }

    // Fetch Steam profile (username + avatar)
    let profile;
    try {
      profile = await fetchSteamProfile(steamId, ctx.env.STEAM_API_KEY);
    } catch (e) {
      const msg = encodeURIComponent(e instanceof Error ? e.message : String(e));
      console.error("fetchSteamProfile failed:", e);
      return Response.redirect(`${appUrl}/?auth=failed&step=profile&reason=${msg}`, 302);
    }

    // Upsert user in D1
    try {
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
    } catch (e) {
      console.error("DB upsert failed:", e);
      return Response.redirect(`${appUrl}/?auth=failed&step=db`, 302);
    }

    // Issue JWT session cookie (7 day expiry)
    const token = await signJwt({ steamId }, ctx.env.JWT_SECRET);

    return new Response(null, {
      status: 302,
      headers: {
        Location: appUrl,
        "Set-Cookie": [
          `session=${token}`,
          "HttpOnly",
          "SameSite=Lax",
          "Path=/",
          `Max-Age=${7 * 24 * 60 * 60}`,
          appUrl.startsWith("https") ? "Secure" : "",
        ]
          .filter(Boolean)
          .join("; "),
      },
    });
  } catch (err) {
    console.error("Auth callback error:", err);
    return Response.redirect(`${appUrl}/?auth=failed&step=jwt`, 302);
  }
};
