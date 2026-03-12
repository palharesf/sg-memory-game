import { useCallback, useEffect, useRef, useState } from "react";
import { generateBoard } from "@/game/boardGenerator";
import { shouldIgnoreClick, isMatch, isWon, isLost } from "@/game/rules";
import { MISMATCH_DELAY_MS } from "@/game/constants";
import type { GameState, GameConfig } from "@/types/game";

const initialState = (): GameState => ({
  cards: [],
  flippedIds: [],
  matchedPairIds: [],
  mistakesMade: 0,
  status: "idle",
  timeElapsed: 0,
  boardLocked: false,
});

export function useGameState(config: GameConfig | null) {
  const [state, setState] = useState<GameState>(initialState);

  // Timer via requestAnimationFrame
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  const tick = useCallback(
    (now: number) => {
      if (startTimeRef.current === null) return;
      const elapsed = now - startTimeRef.current;

      setState((prev) => {
        if (prev.status !== "playing") return prev;

        // Time limit loss condition
        if (config?.timeLimit && elapsed / 1000 >= config.timeLimit) {
          stopTimer();
          return { ...prev, timeElapsed: config.timeLimit * 1000, status: "lost" };
        }

        return { ...prev, timeElapsed: elapsed };
      });

      rafRef.current = requestAnimationFrame(tick);
    },
    [config, stopTimer]
  );

  const startTimer = useCallback(() => {
    if (startTimeRef.current !== null) return; // already running
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Clean up on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  // Re-initialize when config changes
  const initGame = useCallback(() => {
    if (!config) return;
    stopTimer();
    setState({
      ...initialState(),
      cards: generateBoard(config.pairs),
      status: "idle",
    });
    console.debug("game initialized", { config });
  }, [config, stopTimer]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const flipCard = useCallback(
    (cardId: number) => {
      setState((prev) => {
        if (shouldIgnoreClick(prev, cardId)) return prev;

        const newFlipped = [...prev.flippedIds, cardId];

        // Start timer on first flip
        if (prev.status === "idle") {
          startTimer();
        }

        const updatedCards = prev.cards.map((c) =>
          c.id === cardId ? { ...c, status: "flipped" as const } : c
        );

        const next: GameState = {
          ...prev,
          status: "playing",
          cards: updatedCards,
          flippedIds: newFlipped,
        };

        if (newFlipped.length < 2) return next;

        // Two cards flipped — evaluate match
        const [idA, idB] = newFlipped as [number, number];
        const matched = isMatch(updatedCards, idA, idB);

        if (matched) {
          const resolvedCards = updatedCards.map((c) =>
            c.id === idA || c.id === idB ? { ...c, status: "matched" as const } : c
          );
          const matchedPairIds = [
            ...prev.matchedPairIds,
            updatedCards[idA]!.pairId,
          ];
          const won = isWon({ ...next, cards: resolvedCards });
          if (won) stopTimer();

          return {
            ...next,
            cards: resolvedCards,
            flippedIds: [],
            matchedPairIds,
            status: won ? "won" : "playing",
          };
        }

        // Mismatch — lock board; cards flip back after delay (handled below)
        return { ...next, boardLocked: true };
      });

      // Unlock after delay for mismatches (we schedule this outside setState)
    },
    [startTimer, stopTimer]
  );

  // Resolve mismatch after delay
  useEffect(() => {
    if (!state.boardLocked) return;

    const timer = setTimeout(() => {
      setState((prev) => {
        if (!prev.boardLocked) return prev;

        const [idA, idB] = prev.flippedIds as [number, number];
        const newMistakes = prev.mistakesMade + 1;
        const lost = config ? isLost(newMistakes, config.mistakes) : false;

        if (lost) stopTimer();

        const resetCards = prev.cards.map((c) =>
          c.id === idA || c.id === idB ? { ...c, status: "hidden" as const } : c
        );

        return {
          ...prev,
          cards: resetCards,
          flippedIds: [],
          mistakesMade: newMistakes,
          boardLocked: false,
          status: lost ? "lost" : "playing",
        };
      });
    }, MISMATCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [state.boardLocked, config, stopTimer]);

  return { state, flipCard, resetGame: initGame };
}
