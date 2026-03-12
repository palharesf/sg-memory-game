import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="h-14 flex items-center px-4 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <img src="/logo.png" alt="SG Memory Game" className="w-9 h-9 rounded-md" />
        <span className="font-semibold text-[var(--color-text-bright)]">SG Memory Game</span>
      </Link>

      <nav className="ml-auto flex items-center gap-4">
        {user && (
          <Link
            to="/history"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            My Games
          </Link>
        )}

        {/* Ad slot — top-right, reserved from day one */}
        <div
          className="hidden lg:block w-[160px] h-[30px] bg-[var(--color-bg-elevated)] rounded text-center text-xs text-[var(--color-text-muted)] leading-[30px]"
          aria-label="Advertisement"
          data-ad-slot="header"
        >
          {/* AdSense unit goes here */}
        </div>

        {!loading && (
          user ? (
            <div className="flex items-center gap-2">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-[var(--color-text)]">{user.username}</span>
              <button
                onClick={logout}
                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
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
