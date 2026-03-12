import { useEffect, useRef } from "react";
import Card from "./Card";
import { getGridDimensions } from "@/game/constants";
import type { Card as CardType } from "@/types/game";

interface BoardProps {
  cards: CardType[];
  pairs: number;
  onCardClick: (id: number) => void;
}

/**
 * Renders the card grid.
 * Card size is calculated dynamically so the grid always fits the viewport.
 * Uses CSS custom property --card-size to drive both card dimensions and gap.
 */
export default function Board({ cards, pairs, onCardClick }: BoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { rows, cols } = getGridDimensions(pairs);

  useEffect(() => {
    function recalcSize() {
      const el = containerRef.current;
      if (!el) return;

      const maxW = el.clientWidth;
      const maxH = window.innerHeight * 0.65; // leave room for status bar

      const gap = 8;
      const sizeByWidth = Math.floor((maxW - gap * (cols - 1)) / cols);
      const sizeByHeight = Math.floor((maxH - gap * (rows - 1)) / rows);

      const size = Math.min(sizeByWidth, sizeByHeight, 96); // desktop max 96px
      el.style.setProperty("--card-size", `${Math.max(size, 44)}px`); // mobile min 44px
    }

    recalcSize();
    window.addEventListener("resize", recalcSize);
    return () => window.removeEventListener("resize", recalcSize);
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
          <Card key={card.id} card={card} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
