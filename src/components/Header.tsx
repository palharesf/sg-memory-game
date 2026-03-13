import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="h-14 flex items-center px-4 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <img src="/logo.png" alt="SG Memory Game" className="w-9 h-9 rounded-md" />
        <span className="hidden sm:inline font-semibold text-[var(--color-text-bright)]">SG Memory Game</span>
      </Link>

      <nav aria-label="Main navigation" className="ml-auto flex items-center gap-2 sm:gap-4">
        {user && (
          <Link
            to="/history"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-2 rounded"
          >
            My Games
          </Link>
        )}

        {/* Ad slot — reserved for future AdSense unit */}
        <div className="hidden" data-ad-slot="header" />

        {!loading && (
          user ? (
            <div className="flex items-center gap-2">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden sm:inline text-sm text-[var(--color-text)]">{user.username}</span>
              <button
                onClick={logout}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-2 rounded"
              >
                Sign out
              </button>
            </div>
          ) : (
            <a
              href={api.steamLoginUrl()}
              className="text-sm px-3 py-1.5 rounded bg-[var(--color-primary)] text-[var(--color-bg-base)] font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Sign in with Steam
            </a>
          )
        )}
      </nav>
    </header>
  );
}
