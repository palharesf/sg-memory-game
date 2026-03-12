/**
 * POST /api/auth/logout — clear the session cookie
 */

import type { Env } from "../../_types";

export const onRequestPost: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": "session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
    },
  });
};
