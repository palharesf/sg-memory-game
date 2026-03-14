import { POOL, DONATED_POOL, AUTHORS } from "@/data/imagePool";
import { useTheme } from "@/hooks/useTheme";
import type { GameTheme } from "@/types/game";

// Group generic pool images by author
function groupByAuthor() {
  const groups: Record<string, typeof POOL> = {};
  for (const img of POOL) {
    if (!groups[img.authorKey]) groups[img.authorKey] = [];
    groups[img.authorKey]!.push(img);
  }
  return groups;
}

const GROUPED = groupByAuthor();
const AUTHOR_KEYS = Object.keys(GROUPED).sort();

interface ThemeCardProps {
  name: string;
  description: string;
  themeKey: GameTheme;
  active: boolean;
  locked: boolean;
  onSelect: () => void;
}

function ThemeCard({ name, description, themeKey: _themeKey, active, locked, onSelect }: ThemeCardProps) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onSelect}
      className={[
        "relative flex-1 min-w-0 rounded-lg border-2 px-5 py-4 text-left transition-colors",
        locked
          ? "opacity-50 cursor-not-allowed border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
          : active
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-focus)]",
      ].join(" ")}
    >
      {active && !locked && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-[var(--color-primary)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Active
        </span>
      )}
      {locked && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6V7a4 4 0 00-8 0v4" />
            <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Coming soon
        </span>
      )}
      <p className="font-semibold text-[var(--color-text-bright)] mb-1">{name}</p>
      <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
    </button>
  );
}

export default function ThemePage() {
  const [theme, setTheme] = useTheme();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-bright)] mb-1">Card Theme</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Your theme preference applies to every game you play. It's saved to this device.
        </p>
      </div>

      {/* Theme selector */}
      <div className="flex gap-3">
        <ThemeCard
          name="Generic Icons"
          description={`${POOL.length} gaming symbols from game-icons.net`}
          themeKey="generic"
          active={theme === "generic"}
          locked={false}
          onSelect={() => setTheme("generic")}
        />
        <ThemeCard
          name="SG Donated Art"
          description="Community-contributed artwork — accepting donations now"
          themeKey="donated"
          active={theme === "donated"}
          locked={DONATED_POOL.length === 0}
          onSelect={() => setTheme("donated")}
        />
      </div>

      {/* Generic Icons — image grid + attributions */}
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-bright)] mb-0.5">Generic Icons</h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Icons from{" "}
            <a
              href="https://game-icons.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              game-icons.net
            </a>
            {" "}— Creative Commons 3.0 BY
          </p>
        </div>

        {AUTHOR_KEYS.map((key) => {
          const author = AUTHORS[key]!;
          const images = GROUPED[key]!;
          return (
            <div key={key}>
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-sm font-medium text-[var(--color-text)]">{author.displayName}</h3>
                {author.url && (
                  <a
                    href={author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-primary)] hover:underline"
                  >
                    {author.url}
                  </a>
                )}
                <span className="text-xs text-[var(--color-text-muted)] ml-auto">
                  {images.length} icon{images.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {images.map((img) => (
                  <div
                    key={img.path}
                    className="w-10 h-10 rounded bg-[var(--color-bg-elevated)] flex items-center justify-center p-1.5"
                    title={img.name}
                  >
                    <img
                      src={img.path}
                      alt={img.name}
                      className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity invert"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* SG Donated Art — locked */}
      <div className="space-y-3 opacity-50">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-bright)] mb-0.5">SG Donated Art</h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Community-contributed artwork. Want to donate? Drop a 512×512 transparent PNG in the{" "}
            <a
              href="https://www.steamgifts.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              SteamGifts thread
            </a>
            .
          </p>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] italic">No images yet — be the first to contribute!</p>
      </div>
    </div>
  );
}
