import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { formatTime } from "@/lib/formatTime";
import type { HistoryEntry } from "@/types/game";

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api
      .getHistory()
      .then(setEntries)
      .catch(() => setError("Could not load history."))
      .finally(() => setLoading(false));
  }, [user]);

  // Still determining auth state
  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-[var(--color-text-muted)] animate-pulse">Loading…</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-[var(--color-text-muted)]">
          Sign in to see your game history.
        </p>
        <a
          href={api.steamLoginUrl()}
          className="inline-block text-sm px-4 py-2 rounded bg-[var(--color-primary)] text-[var(--color-bg-base)] font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Sign in with Steam
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Player header */}
      <div className="flex items-center gap-3">
        <img
          src={user.avatarUrl}
          alt={user.username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-[var(--color-text-bright)]">{user.username}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Game history</p>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <p className="text-[var(--color-text-muted)] animate-pulse text-sm">Loading…</p>
      )}

      {error && (
        <p className="text-sm text-[var(--color-danger)]">{error}</p>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-[var(--color-text-muted)]">No games won yet.</p>
          <Link
            to="/"
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            Create a game
          </Link>
        </div>
      )}

      {entries.length > 0 && (
        <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                <th className="text-left px-4 py-2.5 font-medium text-[var(--color-text-muted)]">Game</th>
                <th className="text-left px-4 py-2.5 font-medium text-[var(--color-text-muted)]">Best time</th>
                <th className="text-left px-4 py-2.5 font-medium text-[var(--color-text-muted)]">Won</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={e.gameId}
                  className={[
                    "border-b border-[var(--color-border)] last:border-0",
                    i % 2 === 1 ? "bg-[var(--color-bg-elevated)]/40" : "",
                  ].join(" ")}
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/play/${e.gameId}`}
                      className="font-mono text-[var(--color-primary)] hover:underline"
                    >
                      {e.gameId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text)]">
                    {e.bestTimeMs ? formatTime(e.bestTimeMs) : <span className="text-[var(--color-text-muted)]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {e.wonAt ? formatDate(e.wonAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
