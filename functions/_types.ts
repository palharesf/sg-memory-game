import type { D1Database } from "@cloudflare/workers-types";

/** Cloudflare Pages environment bindings — must match wrangler.toml */
export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  STEAM_API_KEY: string;
  APP_URL: string;
}

/** Data attached to each request context by the auth middleware */
export interface RequestData {
  user: { steamId: string } | null;
}

// Augment PagesFunction to include our typed data
declare module "@cloudflare/workers-types" {
  interface EventContext<Env, P extends string, Data> {
    data: RequestData;
  }
}
