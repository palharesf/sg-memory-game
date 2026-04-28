import { Link } from "react-router-dom";

const KOFI_URL = "https://ko-fi.com/fernandopa";
const WISHLIST_URL = "https://store.steampowered.com/wishlist/id/fernandopaa/";
const GITHUB_REPO_URL = "https://github.com/palharesf/sg-memory-game";
const AUTHOR_URL = "https://palharesf.github.io";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <div className="max-w-2xl mx-auto px-4 py-2 space-y-1.5 text-xs text-[var(--color-text-muted)]">
        {/* Creator / support row */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>
            Built by{" "}
            <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
              fernandopa
            </a>
          </span>
          <span className="select-none opacity-30">•</span>
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
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
        </div>

        {/* Nav row */}
        <div className="flex items-center justify-center gap-x-4">
          <Link to="/theme" className="hover:text-[var(--color-text)] transition-colors">
            Card Theme &amp; Attributions
          </Link>
          <span className="select-none opacity-30">•</span>
          <span>v{APP_VERSION}</span>
          <span className="select-none opacity-30">•</span>
          <Link to="/privacy" className="hover:text-[var(--color-text)] transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
