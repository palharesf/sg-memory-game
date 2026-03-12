import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatTime } from "@/lib/formatTime";
import type { LeaderboardEntry } from "@/types/game";

interface LeaderboardProps {
  gameId: string;
  /** Pass a new value each time the board should re-fetch (e.g. after a new win) */
  refreshKey?: number;
}

export default function Leaderboard({ gameId, refreshKey }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getLeaderboard(gameId)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [gameId, refreshKey]);

  if (loading) {
    return <p className="text-sm text-[var(--color-text-muted)] animate-pulse">Loading leaderboard…</p>;
  }

  if (entries.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">No completions yet. Be the first!</p>;
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
        Leaderboard
      </h3>
      <ol className="space-y-1">
        {entries.map((entry) => (
          <li
            key={entry.steamId}
            className="flex items-center gap-3 px-3 py-2 rounded bg-[var(--color-bg-elevated)] text-sm"
          >
            <span className="w-5 text-center font-mono text-[var(--color-text-muted)]">
              {entry.rank}
            </span>
            <img
              src={entry.avatarUrl}
              alt=""
              className="w-6 h-6 rounded-full"
            />
            <span className="flex-1 truncate text-[var(--color-text)]">{entry.username}</span>
            <span className="font-mono text-[var(--color-primary)] font-semibold">
              {formatTime(entry.bestTimeMs)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
