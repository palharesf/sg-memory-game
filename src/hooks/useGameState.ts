import { useCallback, useEffect, useRef, useState } from "react";
import { generateBoard, generateFixedBoard } from "@/game/boardGenerator";
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
  // Throttle state updates to every 100ms — the timer display doesn't need 60fps
  const lastTickRef = useRef<number>(0);

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

      // Only push state updates every ~100ms to avoid re-rendering 60×/sec.
      // The RAF still runs every frame so time-limit detection stays accurate.
      if (now - lastTickRef.current >= 100) {
        lastTickRef.current = now;
        const elapsed = now - startTimeRef.current;

        setState((prev) => {
          if (prev.status !== "playing") return prev;

          if (config?.timeLimit && elapsed / 1000 >= config.timeLimit) {
            return { ...prev, timeElapsed: config.timeLimit * 1000, status: "lost" };
          }

          return { ...prev, timeElapsed: elapsed };
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [config]
  );

  const startTimer = useCallback(() => {
    if (startTimeRef.current !== null) return;
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Start timer when game begins, stop it when game ends
  useEffect(() => {
    if (state.status === "playing" && startTimeRef.current === null) {
      startTimer();
    }
    if (state.status === "won" || state.status === "lost") {
      stopTimer();
    }
  }, [state.status, startTimer, stopTimer]);

  // Clean up on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  // Re-initialize when config changes
  const initGame = useCallback(() => {
    if (!config) return;
    stopTimer();
    setState({
      ...initialState(),
      cards: config.isRandom
        ? generateBoard(config.pairs)
        : generateFixedBoard(config.pairs, config.id),
      status: "idle",
    });
  }, [config, stopTimer]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Pure state updater — no side effects inside
  const flipCard = useCallback((cardId: number) => {
    setState((prev) => {
      if (shouldIgnoreClick(prev, cardId)) return prev;

      const updatedCards = prev.cards.map((c) =>
        c.id === cardId ? { ...c, status: "flipped" as const } : c
      );
      const newFlipped = [...prev.flippedIds, cardId];
      const next: GameState = {
        ...prev,
        status: "playing",
        cards: updatedCards,
        flippedIds: newFlipped,
      };

      if (newFlipped.length < 2) return next;

      // Two cards flipped — evaluate match
      const [idA, idB] = newFlipped as [number, number];

      if (isMatch(updatedCards, idA, idB)) {
        const resolvedCards = updatedCards.map((c) =>
          c.id === idA || c.id === idB ? { ...c, status: "matched" as const } : c
        );
        const matchedPairIds = [...prev.matchedPairIds, updatedCards[idA]!.pairId];
        const won = isWon({ ...next, cards: resolvedCards });

        return {
          ...next,
          cards: resolvedCards,
          flippedIds: [],
          matchedPairIds,
          status: won ? "won" : "playing",
        };
      }

      // Mismatch — lock board; cards flip back after delay
      return { ...next, boardLocked: true };
    });
  }, []);

  // Resolve mismatch after delay
  useEffect(() => {
    if (!state.boardLocked) return;

    const timer = setTimeout(() => {
      setState((prev) => {
        if (!prev.boardLocked) return prev;

        const [idA, idB] = prev.flippedIds as [number, number];
        const newMistakes = prev.mistakesMade + 1;
        const lost = config ? isLost(newMistakes, config.mistakes ?? null) : false;

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
  }, [state.boardLocked, config]);

  return { state, flipCard, resetGame: initGame };
}
