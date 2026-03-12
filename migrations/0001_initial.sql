-- sg-memory-game — initial D1 schema

CREATE TABLE IF NOT EXISTS games (
  id          TEXT    PRIMARY KEY,
  pairs       INTEGER NOT NULL,
  mistakes    INTEGER NOT NULL,
  time_limit  INTEGER,                          -- seconds; NULL = no limit
  secret      TEXT    NOT NULL,                 -- stored as-is; shown only on win
  creator_steam_id TEXT,                        -- NULL if created anonymously
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS users (
  steam_id    TEXT    PRIMARY KEY,
  username    TEXT    NOT NULL,
  avatar_url  TEXT    NOT NULL,
  games_created INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS user_game_records (
  steam_id        TEXT    NOT NULL,
  game_id         TEXT    NOT NULL,
  has_played      INTEGER NOT NULL DEFAULT 1,   -- always 1 when row exists
  has_won         INTEGER NOT NULL DEFAULT 0,   -- 0 or 1
  best_time_ms    INTEGER,                      -- NULL until first win
  first_played_at INTEGER NOT NULL DEFAULT (unixepoch()),
  won_at          INTEGER,                      -- NULL until first win
  PRIMARY KEY (steam_id, game_id),
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (steam_id) REFERENCES users(steam_id)
);

-- Leaderboard query: game_id + won + time
CREATE INDEX IF NOT EXISTS idx_records_leaderboard
  ON user_game_records(game_id, has_won, best_time_ms);

-- History query: all games for a user
CREATE INDEX IF NOT EXISTS idx_records_user
  ON user_game_records(steam_id, first_played_at DESC);
