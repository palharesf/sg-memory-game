/**
 * GET /api/auth/steam — redirect to Steam OpenID login
 */

import type { Env } from "../../_types";

const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const appUrl = ctx.env.APP_URL;
  const callbackUrl = `${appUrl}/api/auth/callback`;

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": callbackUrl,
    "openid.realm": appUrl,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  return Response.redirect(`${STEAM_OPENID_URL}?${params.toString()}`, 302);
};
