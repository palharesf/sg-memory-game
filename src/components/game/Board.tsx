import { memo, useEffect, useRef } from "react";
import Card from "./Card";
import { getGridDimensions } from "@/game/constants";
import type { Card as CardType, GameTheme } from "@/types/game";

interface BoardProps {
  cards: CardType[];
  pairs: number;
  onCardClick: (id: number) => void;
  currentTheme: GameTheme;
}

/**
 * Renders the card grid.
 * Card size is calculated dynamically so the grid always fits the viewport.
 * Uses CSS custom property --card-size to drive both card dimensions and gap.
 */
// memo: prevents re-renders on every timer tick — cards only change on flip/match
const Board = memo(function Board({ cards, pairs, onCardClick, currentTheme }: BoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rows, cols } = getGridDimensions(pairs);

  useEffect(() => {
    function recalcSize() {
      const el = containerRef.current;
      if (!el) return;

      const maxW = el.clientWidth;
      // In compact landscape (e.g. phone rotated), viewport height is short so
      // use a smaller fraction to keep the board + header + status bar on screen.
      const compactLandscape = window.innerWidth > window.innerHeight && window.innerHeight < 500;
      const maxH = window.innerHeight * (compactLandscape ? 0.52 : 0.65);

      const gap = 8;
      const sizeByWidth = Math.floor((maxW - gap * (cols - 1)) / cols);
      const sizeByHeight = Math.floor((maxH - gap * (rows - 1)) / rows);

      const size = Math.min(sizeByWidth, sizeByHeight, 96); // desktop max 96px
      el.style.setProperty("--card-size", `${Math.max(size, 44)}px`); // mobile min 44px
    }

    // Debounce resize to avoid layout thrashing on every pixel during window drag.
    let debounceTimer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(recalcSize, 100);
    }

    recalcSize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(debounceTimer);
    };
  }, [rows, cols]);

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="board-grid mx-auto"
        style={
          {
            "--cols": cols,
            "--rows": rows,
          } as React.CSSProperties
        }
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={onCardClick} currentTheme={currentTheme} />
        ))}
      </div>
    </div>
  );
});

export default Board;
