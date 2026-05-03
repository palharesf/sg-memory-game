import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameState } from "@/hooks/useGameState";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import Board from "@/components/game/Board";
import StatusBar from "@/components/game/StatusBar";
import Leaderboard from "@/components/game/Leaderboard";
import BackgroundPicker from "@/components/game/BackgroundPicker";
import { useBackground } from "@/hooks/useBackground";
import { useCardBackground } from "@/hooks/useCardBackground";
import { useCardColorize } from "@/hooks/useCardColorize";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { getWonGame, setWonGame } from "@/lib/wonGames";
import { formatTime } from "@/lib/formatTime";
import type { GameConfig, GameConfigResponse } from "@/types/game";

const LINKABLE_PREFIXES = [
  "https://www.steamgifts.com",
  "https://steamgifts.com",
  "https://www.sgtools.info",
  "https://sgtools.info",
];

function SecretValue({ value }: { value: string }) {
  const isLink = LINKABLE_PREFIXES.some((prefix) => value.startsWith(prefix));
  return (
    <p className="font-mono text-[var(--color-text-bright)] break-all bg-[var(--color-bg-elevated)] rounded px-3 py-2 select-all">
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[var(--color-primary)] hover:opacity-80"
        >
          {value}
        </a>
      ) : (
        value
      )}
    </p>
  );
}

function responseToConfig(r: GameConfigResponse): GameConfig {
  return {
    id: r.id,
    pairs: r.pairs,
    mistakes: r.mistakes,
    timeLimit: r.timeLimit,
    isRandom: r.isRandom,
    creatorSteamId: r.creatorSteamId,
    createdAt: r.createdAt,
  };
}

export default function PlayPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [configResponse, setConfigResponse] = useState<GameConfigResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Win-state — secret + record (current session)
  const [secret, setSecret] = useState<string | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  // Previous-win reveal — shown when a logged-in user revisits a game they already won
  const [previousSecret, setPreviousSecret] = useState<string | null>(null);
  const [previousSecretDismissed, setPreviousSecretDismissed] = useState(false);

  // Copy state
  const [copied, setCopied] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copySecretTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyShareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [bg, setBg] = useBackground();
  const [cardBg, setCardBg] = useCardBackground();
  const [colorize, setColorize] = useCardColorize();
  const [theme] = useTheme();

  const config = useMemo(
    () => (configResponse ? responseToConfig(configResponse) : null),
    [configResponse]
  );
  const { state, flipCard, resetGame, isResetting, boardKey } = useGameState(config);

  // Fetch game config on mount
  useEffect(() => {
    if (!id) return;
    api
      .getGame(id)
      .then(setConfigResponse)
      .catch(() => setLoadError("Game not found or unavailable."));
  }, [id]);

  // Non-random wins: just fetch the secret, no score tracking
  useEffect(() => {
    if (state.status !== "won" || !id || config?.isRandom !== false) return;
    if (configResponse?.requireLoginToReveal && !user) return;

    api
      .completeGame(id, { timeMs: 0 })
      .then(({ secret: s }) => setSecret(s))
      .catch(() => setSubmitError("Could not retrieve the secret."));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, id, config?.isRandom]);

  // Submit win when status transitions to "won" (random games only).
  // state.timeElapsed is intentionally omitted from deps — the timer stops
  // when status becomes "won", so the value is stable at that point.
  // Including it would risk a duplicate submission if anything caused a re-render.
  useEffect(() => {
    if (state.status !== "won" || !id || !config?.isRandom) return;
    if (configResponse?.requireLoginToReveal && !user) return;

    let cancelled = false;
    api
      .completeGame(id, { timeMs: state.timeElapsed })
      .then(({ secret: s, isNewRecord: nr, scoreSaved }) => {
        if (cancelled) return;
        setSecret(s);
        setIsNewRecord(nr);
        setLeaderboardKey((k) => k + 1);
        if (!scoreSaved) setSubmitError("Couldn't save your time, but here's your secret anyway.");
      })
      .catch(() => {
        if (!cancelled) setSubmitError("Couldn't retrieve your secret. Please try refreshing.");
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, id, config?.isRandom]);

  // Auto-reveal: check localStorage first (works for everyone), then fall back
  // to D1 for logged-in users (cross-device sync). Saves to localStorage whenever
  // D1 returns a hit so future visits on this device are instant.
  // Suppressed entirely for login-required games when not logged in.
  useEffect(() => {
    if (!id || !config) return;
    if (configResponse?.requireLoginToReveal && !user) return;

    const stored = getWonGame(id);
    if (stored) {
      setPreviousSecret(stored);
      return;
    }

    if (!user) return;
    api
      .getPreviousSecret(id)
      .then(({ secret: s }) => {
        setWonGame(id, s);
        setPreviousSecret(s);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.steamId, config?.id]);

  // Persist secret to localStorage whenever a fresh win produces one.
  // Covers both random and non-random games — the two win effects both
  // set `secret`, so this single watcher is enough.
  useEffect(() => {
    if (secret !== null && id) {
      setWonGame(id, secret);
    }
  }, [secret, id]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleCopyShare() {
    const url = window.location.href;
    const text = config?.isRandom
      ? `I solved the [${id}](${url}) puzzle in ${formatTime(state.timeElapsed)} with ${state.mistakesMade} mistake${state.mistakesMade !== 1 ? "s" : ""}!`
      : `I solved the [${id}](${url}) puzzle!`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedShare(true);
      if (copyShareTimerRef.current) clearTimeout(copyShareTimerRef.current);
      copyShareTimerRef.current = setTimeout(() => setCopiedShare(false), 2000);
    });
  }

  function handleCopySecret(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSecret(true);
      if (copySecretTimerRef.current) clearTimeout(copySecretTimerRef.current);
      copySecretTimerRef.current = setTimeout(() => setCopiedSecret(false), 2000);
    });
  }

  // -------------------------------------------------------------------------

  if (loadError) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-[var(--color-danger)] mb-4">This game doesn't exist or isn't available anymore.</p>
        <a href="/" className="text-[var(--color-primary)] hover:underline">
          Back to home
        </a>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-[var(--color-text-muted)] animate-pulse">Loading game…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-full w-full transition-colors duration-300"
      style={{
        backgroundColor: bg.color,
        "--card-front-bg": cardBg.color,
        "--card-back-bg": cardBg.color,
      } as React.CSSProperties}
    >
    <div className="flex flex-col items-center px-3 py-3 sm:py-4 gap-3 sm:gap-4 max-w-2xl mx-auto w-full">
      {/* Creator attribution + copy link */}
      <div className="flex items-center justify-between w-full">
        {configResponse?.creatorUsername ? (
          <p className="text-xs text-[var(--color-text-muted)]">
            Created by{" "}
            <span className="text-[var(--color-text)]">{configResponse.creatorUsername}</span>
          </p>
        ) : <span />}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[var(--color-success)]">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy game link
            </>
          )}
        </button>
      </div>

      {/* Login-required banner — permanent, shown to everyone */}
      {configResponse?.requireLoginToReveal && (
        <div className="w-full rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger)]/15 px-4 py-3">
          <p className="text-sm font-bold text-[var(--color-danger)]">
            ⚠ The creator of this game requires you to be logged in to Steam to see the secret. Solving this game without being logged in will not reveal anything.
          </p>
        </div>
      )}

      {/* Ended banner */}
      {configResponse?.lockedAt && (
        <div className="w-full rounded-lg border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--color-warning)]">
            This game has been marked as ended by its creator. A reward may no longer be available.
          </p>
        </div>
      )}

      {/* Board area — hidden entirely when a login-required game has been ended */}
      {!(configResponse?.requireLoginToReveal && configResponse?.lockedAt) && (<>

      {/* Background + card colour pickers */}
      <div className="w-full flex flex-wrap justify-end gap-x-4 gap-y-1.5">
        <BackgroundPicker value={bg} onChange={setBg} label="Area:" />
        <BackgroundPicker value={cardBg} onChange={setCardBg} label="Cards:" />
        {theme === "generic" && (
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={colorize}
              onChange={(e) => setColorize(e.target.checked)}
              className="w-3.5 h-3.5 accent-[var(--color-primary)]"
            />
            <span className="text-xs text-[var(--color-text-muted)]">Recolor icons</span>
          </label>
        )}
      </div>

      {/* Status bar — random games only */}
      {config.isRandom && (
        <div className="w-full">
          <StatusBar state={state} config={config} />
        </div>
      )}

      {/* Board — pointer-events blocked during reset cooldown; opacity signals the pause.
           key={boardKey} forces a full DOM remount on every new game so no CSS flip-animation
           state from the previous round leaks into the next. */}
      <div
        className="transition-opacity duration-300"
        style={{ pointerEvents: isResetting ? "none" : undefined, opacity: isResetting ? 0.4 : 1 }}
      >
        <Board key={boardKey} cards={state.cards} pairs={config.pairs} onCardClick={flipCard} currentTheme={theme} colorize={colorize} />
      </div>

      {/* Below-board utility row: cooldown indicator or mid-game restart */}
      {isResetting ? (
        <p className="text-xs text-[var(--color-text-muted)] animate-pulse">Initializing new game…</p>
      ) : state.status === "playing" ? (
        <button
          onClick={resetGame}
          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          ↺ Restart
        </button>
      ) : null}

      {/* Game over overlays */}
      {state.status === "won" && (
        <div className="w-full rounded-lg border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-4 py-5 space-y-3">
          <p className="text-[var(--color-success)] font-semibold text-lg">You won!</p>

          {isNewRecord && (
            <p className="text-xs text-[var(--color-warning)]">New personal best!</p>
          )}

          {submitError && (
            <p className="text-xs text-[var(--color-warning)]">{submitError}</p>
          )}

          {configResponse?.requireLoginToReveal && !user ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Log in to Steam and solve this game again to see the secret.
            </p>
          ) : secret !== null ? (
            <div className="space-y-1">
              <p className="text-xs text-[var(--color-text-muted)]">Your secret:</p>
              <SecretValue value={secret} />
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)] animate-pulse">
              Retrieving secret…
            </p>
          )}

          <div className="flex gap-2 flex-wrap">
            {secret !== null && (
              <Button
                onClick={() => handleCopySecret(secret)}
                variant="outline"
                className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)]"
              >
                {copiedSecret ? "Copied!" : "Copy secret"}
              </Button>
            )}
            <Button
              onClick={handleCopyShare}
              variant="outline"
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)]"
            >
              {copiedShare ? "Copied!" : "Share result"}
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)]"
            >
              Play again
            </Button>
          </div>
        </div>
      )}

      {state.status === "lost" && (
        <div className="w-full rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-5 space-y-3">
          <p className="text-[var(--color-danger)] font-semibold text-lg">Game over.</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            {config.timeLimit && state.timeElapsed / 1000 >= config.timeLimit
              ? "You ran out of time."
              : "You used all your mistakes."}
          </p>
          <Button
            onClick={resetGame}
            className="bg-[var(--color-primary)] text-[var(--color-bg-base)] hover:bg-[var(--color-primary-hover)]"
          >
            Try again
          </Button>
        </div>
      )}

      </>)}

      {/* Previous-win reveal — returning winner, hasn't played this session */}
      {previousSecret && !previousSecretDismissed && state.status !== "won" && (
        <div className="w-full rounded-lg border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-4 py-5 space-y-3">
          <p className="text-[var(--color-success)] font-semibold text-lg">You've already solved this one!</p>
          <div className="space-y-1">
            <p className="text-xs text-[var(--color-text-muted)]">Your secret:</p>
            <SecretValue value={previousSecret} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleCopySecret(previousSecret)}
              variant="outline"
              className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)]"
            >
              {copiedSecret ? "Copied!" : "Copy secret"}
            </Button>
            {!(configResponse?.requireLoginToReveal && configResponse?.lockedAt) && (
              <Button
                onClick={() => { setPreviousSecretDismissed(true); resetGame(); }}
                variant="outline"
                className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)]"
              >
                Play again
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard — random games only */}
      {config.isRandom && (
        <div className="w-full pt-2">
          <Leaderboard gameId={config.id} refreshKey={leaderboardKey} />
        </div>
      )}

    </div>
    </div>
  );
}
