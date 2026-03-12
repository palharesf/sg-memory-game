/**
 * Auth helpers:
 * - JWT sign / verify (using Web Crypto — available in Workers runtime)
 * - Steam OpenID assertion verification
 * - Steam Web API profile fetch
 */

// ---------------------------------------------------------------------------
// JWT (HS256 via SubtleCrypto)
// ---------------------------------------------------------------------------

async function importKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(secret);
  return crypto.subtle.importKey("raw", enc, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64urlDecode(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export interface JwtPayload {
  steamId: string;
  exp: number;
}

export async function signJwt(
  data: { steamId: string },
  secret: string
): Promise<string> {
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const payload = base64url(
    new TextEncoder().encode(JSON.stringify({ ...data, exp }))
  );

  const key = await importKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${header}.${payload}`)
  );

  return `${header}.${payload}.${base64url(sig)}`;
}

export async function verifyJwt(token: string, secret: string): Promise<JwtPayload> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT");

  const [header, payload, sig] = parts as [string, string, string];
  const key = await importKey(secret);

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64urlDecode(sig),
    new TextEncoder().encode(`${header}.${payload}`)
  );

  if (!valid) throw new Error("JWT signature invalid");

  const claims = JSON.parse(new TextDecoder().decode(base64urlDecode(payload))) as JwtPayload;

  if (claims.exp < Math.floor(Date.now() / 1000)) throw new Error("JWT expired");

  return claims;
}

// ---------------------------------------------------------------------------
// Steam OpenID 2.0 verification
// ---------------------------------------------------------------------------

/**
 * Verifies the OpenID assertion returned by Steam.
 * Returns the SteamID64 string on success, throws on failure.
 */
export async function verifyOpenId(returnUrl: URL, realm: string): Promise<string> {
  // Extract steamId from claimed_id
  const claimedId = returnUrl.searchParams.get("openid.claimed_id") ?? "";
  const match = claimedId.match(/\/id\/(\d+)$/);
  if (!match) throw new Error("No steamId in claimed_id");
  const steamId = match[1]!;

  // Re-submit the assertion to Steam for server-side verification
  const params = new URLSearchParams(returnUrl.searchParams);
  params.set("openid.mode", "check_authentication");

  const verifyRes = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const text = await verifyRes.text();
  if (!text.includes("is_valid:true")) {
    throw new Error("Steam OpenID verification failed");
  }

  return steamId;
}

// ---------------------------------------------------------------------------
// Steam Web API — fetch player summary
// ---------------------------------------------------------------------------

interface SteamProfile {
  username: string;
  avatarUrl: string;
}

export async function fetchSteamProfile(
  steamId: string,
  apiKey: string
): Promise<SteamProfile> {
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`;
  const res = await fetch(url);
  const data = (await res.json()) as {
    response: {
      players: Array<{ personaname: string; avatarfull: string }>;
    };
  };

  const player = data.response.players[0];
  if (!player) throw new Error("Steam profile not found");

  return {
    username: player.personaname,
    avatarUrl: player.avatarfull,
  };
}
