import type { GameState, GameConfig } from "@/types/game";
import { formatTime } from "@/lib/formatTime";

interface StatusBarProps {
  state: GameState;
  config: GameConfig;
}

export default function StatusBar({ state, config }: StatusBarProps) {
  const pairs = config.pairs;
  const matched = state.matchedPairIds.length;
  const unlimited = config.mistakes === null;
  const mistakesLeft = unlimited ? Infinity : config.mistakes! - state.mistakesMade;

  return (
    <div className="flex items-center justify-between px-2 py-2 text-sm">
      {/* Mistakes */}
      <div className="flex items-center gap-1.5">
        <span className="text-[var(--color-text-muted)]">
          {unlimited ? "Mistakes:" : "Left:"}
        </span>
        <span
          className={[
            "font-semibold font-mono",
            !unlimited && mistakesLeft <= 1
              ? "text-[var(--color-danger)]"
              : !unlimited && mistakesLeft <= Math.ceil(config.mistakes! / 3)
              ? "text-[var(--color-warning)]"
              : "text-[var(--color-text-bright)]",
          ].join(" ")}
        >
          {unlimited ? state.mistakesMade : mistakesLeft}
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1.5">
        <span className="text-[var(--color-text-muted)]">Pairs:</span>
        <span className="font-semibold font-mono text-[var(--color-text-bright)]">
          {matched}/{pairs}
        </span>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-1.5">
        <span className="text-[var(--color-text-muted)]">Time:</span>
        <span
          className={[
            "font-semibold font-mono",
            config.timeLimit &&
              state.timeElapsed / 1000 > config.timeLimit * 0.8
              ? "text-[var(--color-warning)]"
              : "text-[var(--color-text-bright)]",
          ].join(" ")}
        >
          {formatTime(state.timeElapsed)}
          {config.timeLimit && (
            <span className="text-[var(--color-text-muted)] font-normal">
              /{config.timeLimit}s
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
