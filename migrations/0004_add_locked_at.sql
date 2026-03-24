-- sg-memory-game — add locked_at to games
-- NULL = active; unix seconds = locked since this timestamp
ALTER TABLE games ADD COLUMN locked_at INTEGER;
