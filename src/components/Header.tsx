import { Link } from "react-router-dom";
import { api } from "@/services/api";

// TODO: Phase 5 — wire up real auth state via context/hook
export default function Header() {
  return (
    <header className="h-14 flex items-center px-4 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        <img src="/logo.png" alt="SG Memory Game" className="w-9 h-9 rounded-md" />
        <span className="font-semibold text-[var(--color-text-bright)]">SG Memory Game</span>
      </Link>

      <nav className="ml-auto flex items-center gap-4">
        <Link
          to="/history"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          My Games
        </Link>

        {/* Ad slot — top-right, reserved from day one */}
        <div
          className="hidden lg:block w-[160px] h-[30px] bg-[var(--color-bg-elevated)] rounded text-center text-xs text-[var(--color-text-muted)] leading-[30px]"
          aria-label="Advertisement"
          data-ad-slot="header"
        >
          {/* AdSense unit goes here */}
        </div>

        <a
          href={api.steamLoginUrl()}
          className="text-sm px-3 py-1.5 rounded bg-[var(--color-primary)] text-[var(--color-bg-base)] font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Sign in with Steam
        </a>
      </nav>
    </header>
  );
}
