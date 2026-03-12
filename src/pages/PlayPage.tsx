import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameState } from "@/hooks/useGameState";
import { api } from "@/services/api";
import Board from "@/components/game/Board";
import StatusBar from "@/components/game/StatusBar";
import Leaderboard from "@/components/game/Leaderboard";
import AttributionsDialog from "@/components/game/AttributionsDialog";
import AdSlot from "@/components/AdSlot";
import { Button } from "@/components/ui/button";
import type { GameConfig, GameConfigResponse } from "@/types/game";

function responseToConfig(r: GameConfigResponse): GameConfig {
  return {
    id: r.id,
    pairs: r.pairs,
    mistakes: r.mistakes,
    timeLimit: r.timeLimit,
    creatorSteamId: r.creatorSteamId,
    createdAt: r.createdAt,
  };
}

export default function PlayPage() {
  const { id } = useParams<{ id: string }>();
  const [configResponse, setConfigResponse] = useState<GameConfigResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Win-state — secret + record
  const [secret, setSecret] = useState<string | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const config = configResponse ? responseToConfig(configResponse) : null;
  const { state, flipCard, resetGame } = useGameState(config);

  // Fetch game config on mount
  useEffect(() => {
    if (!id) return;
    api
      .getGame(id)
      .then(setConfigResponse)
      .catch(() => setLoadError("Game not found or unavailable."));
  }, [id]);

  // Submit win when status transitions to "won"
  useEffect(() => {
    if (state.status !== "won" || !id) return;

    api
      .completeGame(id, { timeMs: state.timeElapsed })
      .then(({ secret: s, isNewRecord: nr }) => {
        setSecret(s);
        setIsNewRecord(nr);
        setLeaderboardKey((k) => k + 1);
      })
      .catch(() => setSubmitError("Could not save your time. The secret is shown below anyway."));
  }, [state.status, id, state.timeElapsed]);

  // -------------------------------------------------------------------------

  if (loadError) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-[var(--color-danger)] mb-4">{loadError}</p>
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
    <div className="flex flex-col items-center px-3 py-4 gap-4 max-w-2xl mx-auto w-full">
      {/* Creator attribution */}
      {configResponse?.creatorUsername && (
        <p className="text-xs text-[var(--color-text-muted)] self-start">
          Created by{" "}
          <span className="text-[var(--color-text)]">{configResponse.creatorUsername}</span>
        </p>
      )}

      {/* Ad slot — above the board */}
      <AdSlot slot="play-top" className="w-full h-[60px]" />

      {/* Status bar */}
      <div className="w-full">
        <StatusBar state={state} config={config} />
      </div>

      {/* Board */}
      <Board cards={state.cards} pairs={config.pairs} onCardClick={flipCard} />

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

          {secret !== null ? (
            <div className="space-y-1">
              <p className="text-xs text-[var(--color-text-muted)]">Your secret:</p>
              <p className="font-mono text-[var(--color-text-bright)] break-all bg-[var(--color-bg-elevated)] rounded px-3 py-2 select-all">
                {secret}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)] animate-pulse">
              Retrieving secret…
            </p>
          )}

          <Button
            onClick={resetGame}
            variant="outline"
            className="border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)]"
          >
            Play again
          </Button>
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

      {/* Ad slot — below the board */}
      <AdSlot slot="play-bottom" className="w-full h-[90px]" />

      {/* Leaderboard */}
      <div className="w-full pt-2">
        <Leaderboard gameId={config.id} refreshKey={leaderboardKey} />
      </div>

      {/* Footer */}
      <footer className="w-full pt-4 pb-2 border-t border-[var(--color-border)] flex items-center justify-center">
        <AttributionsDialog />
      </footer>
    </div>
  );
}
