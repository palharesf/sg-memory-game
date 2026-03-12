import { useState } from "react";
import { POOL, AUTHORS } from "@/data/imagePool";

/**
 * Groups pool images by author for display.
 */
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

export default function AttributionsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors underline-offset-2 hover:underline"
      >
        Attributions
      </button>

      {/* Backdrop + dialog */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

          {/* Panel */}
          <div
            className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-bright)]">
                  Image Attributions
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
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
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xl leading-none ml-4"
              >
                ×
              </button>
            </div>

            {/* Author groups */}
            <div className="space-y-6">
              {AUTHOR_KEYS.map((key) => {
                const author = AUTHORS[key]!;
                const images = GROUPED[key]!;
                return (
                  <div key={key}>
                    <div className="flex items-baseline gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-[var(--color-text)]">
                        {author.displayName}
                      </h3>
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

                    {/* Icon grid */}
                    <div className="flex flex-wrap gap-2">
                      {images.map((img) => (
                        <div
                          key={img.path}
                          className="group relative flex flex-col items-center gap-1"
                          title={img.name}
                        >
                          <div className="w-10 h-10 rounded bg-[var(--color-bg-elevated)] flex items-center justify-center p-1.5">
                            <img
                              src={img.path}
                              alt={img.name}
                              className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity invert"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
