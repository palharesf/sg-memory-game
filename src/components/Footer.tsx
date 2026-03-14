import { Link } from "react-router-dom";

// TODO: replace these with real URLs once confirmed
const KOFI_URL = "https://ko-fi.com/fernandopa"; // update if different
const WISHLIST_URL = "https://store.steampowered.com/wishlist/id/fernandopa"; // update if different
const GITHUB_URL = "https://github.com/palharesf/sg-memory-game";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--color-text-muted)]">
        <Link to="/theme" className="hover:text-[var(--color-text)] transition-colors">
          Card Theme &amp; Attributions
        </Link>

        <span className="hidden sm:inline select-none opacity-30">·</span>

        <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>Built by fernandopa</span>
          <span className="select-none opacity-30">•</span>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
            Source Code
          </a>
          <span className="select-none opacity-30">•</span>
          <span>Support me:</span>
          <a href={WISHLIST_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
            Reduce my wishlist 🎁
          </a>
          <span className="select-none opacity-30">or</span>
          <a href={KOFI_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
            buy me a coffee ☕
          </a>
        </span>

        <span className="hidden sm:inline select-none opacity-30">·</span>

        <Link to="/privacy" className="hover:text-[var(--color-text)] transition-colors">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
