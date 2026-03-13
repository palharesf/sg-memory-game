import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { formatTime } from "@/lib/formatTime";
import type { HistoryEntry, CreatedGame, PaginatedResult } from "@/types/game";

const PAGE_SIZE = 50;

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Generic collapsible section with lazy-loaded paginated data
// ---------------------------------------------------------------------------

interface SectionProps<T> {
  title: string;
  fetchPage: (page: number) => Promise<PaginatedResult<T>>;
  renderRow: (item: T) => React.ReactNode;
  columns: string[];
}

function Section<T>({ title, fetchPage, renderRow, columns }: SectionProps<T>) {
  const contentId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  function loadPage(p: number) {
    setLoading(true);
    setError(null);
    fetchPage(p)
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        setPage(p);
        setFetched(true);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Could not load data.")
      )
      .finally(() => setLoading(false));
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !fetched) loadPage(1);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
      {/* Header / toggle */}
      <button
        onClick={toggle}
        aria-expanded={open}
        aria-controls={contentId}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-surface)] transition-colors text-left focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-[-2px]"
      >
        <span className="font-medium text-[var(--color-text-bright)]">{title}</span>
        <div className="flex items-center gap-2">
          {fetched && (
            <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-base)] px-2 py-0.5 rounded-full">
              {total}
            </span>
          )}
          <svg
            aria-hidden="true"
            className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      {open && (
        <div id={contentId}>
          {loading && (
            <p className="px-4 py-6 text-sm text-[var(--color-text-muted)] animate-pulse">Loading…</p>
          )}
          {error && (
            <p className="px-4 py-6 text-sm text-[var(--color-danger)]">{error}</p>
          )}
          {!loading && !error && items.length === 0 && (
            <p className="px-4 py-6 text-sm text-[var(--color-text-muted)]">Nothing here yet.</p>
          )}
          {!loading && items.length > 0 && (
            <>
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    {columns.map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="text-left px-4 py-2.5 font-medium text-[var(--color-text-muted)]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr
                      key={i}
                      className={[
                        "border-b border-[var(--color-border)] last:border-0",
                        i % 2 === 1 ? "bg-[var(--color-bg-elevated)]/40" : "",
                      ].join(" ")}
                    >
                      {renderRow(item)}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              {/* Pagination — only shown when total exceeds one page */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
                  <button
                    disabled={page <= 1}
                    onClick={() => loadPage(page - 1)}
                    className="text-sm px-3 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => loadPage(page + 1)}
                    className="text-sm px-3 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Row renderers
// ---------------------------------------------------------------------------

function wonGameRow(entry: HistoryEntry) {
  return (
    <>
      <td className="px-4 py-3">
        <Link
          to={`/play/${entry.gameId}`}
          className="font-mono text-[var(--color-primary)] hover:underline"
        >
          {entry.gameId}
        </Link>
      </td>
      <td className="px-4 py-3 text-[var(--color-text)]">
        {entry.bestTimeMs
          ? formatTime(entry.bestTimeMs)
          : entry.bestTimeMs === 0
            ? <span className="text-[var(--color-text-muted)]">Fixed board</span>
            : <span className="text-[var(--color-text-muted)]">—</span>}
      </td>
      <td className="px-4 py-3 text-[var(--color-text-muted)]">
        {entry.wonAt ? formatDate(entry.wonAt) : "—"}
      </td>
    </>
  );
}

function createdGameRow(game: CreatedGame) {
  const mode = game.isRandom ? "Random" : "Fixed";
  const constraints = [
    game.mistakes != null ? `${game.mistakes} mistakes` : null,
    game.timeLimit != null ? `${game.timeLimit}s` : null,
  ].filter(Boolean).join(", ") || "—";

  return (
    <>
      <td className="px-4 py-3">
        <Link
          to={`/play/${game.id}`}
          className="font-mono text-[var(--color-primary)] hover:underline"
        >
          {game.id}
        </Link>
      </td>
      <td className="px-4 py-3 text-[var(--color-text-muted)]">{game.pairs} pairs · {mode}</td>
      <td className="px-4 py-3 text-[var(--color-text-muted)]">{constraints}</td>
      <td className="px-4 py-3 text-[var(--color-text-muted)]">{formatDate(game.createdAt)}</td>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-[var(--color-text-muted)] animate-pulse">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-[var(--color-text-muted)]">Sign in to see your game history.</p>
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
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      {/* Player header */}
      <div className="flex items-center gap-3 mb-6">
        <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold text-[var(--color-text-bright)]">{user.username}</p>
          <p className="text-xs text-[var(--color-text-muted)]">My Games</p>
        </div>
      </div>

      <Section<CreatedGame>
        title="Games Created"
        fetchPage={(p) => api.getMyGames(p)}
        columns={["Game", "Config", "Limits", "Created"]}
        renderRow={createdGameRow}
      />

      <Section<HistoryEntry>
        title="Games Won"
        fetchPage={(p) => api.getHistory(p)}
        columns={["Game", "Best time", "Won"]}
        renderRow={wonGameRow}
      />
    </div>
  );
}
