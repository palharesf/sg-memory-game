import { useMemo } from "react";
import type { Card as CardType, GameTheme } from "@/types/game";

interface CardProps {
  card: CardType;
  onClick: (id: number) => void;
  currentTheme: GameTheme;
  colorize: boolean;
}

/**
 * Single memory card with a CSS flip animation.
 * Front = card back design (face-down), Back = image (face-up).
 * Uses rotateY transform — GPU-accelerated via transform-style: preserve-3d.
 */
export default function Card({ card, onClick, currentTheme, colorize }: CardProps) {
  const isRevealed = card.status === "flipped" || card.status === "matched";
  const isMatched = card.status === "matched";

  // Deterministic hue per pair so both cards always share the same color.
  // Golden angle (137°) gives good visual spread across consecutive pairIds.
  const hueRotate = useMemo(() => (card.pairId * 137) % 360, [card.pairId]);


  return (
    <button
      onClick={() => onClick(card.id)}
      disabled={isMatched}
      aria-label={
        isMatched ? `Card ${card.id + 1}, matched` :
        isRevealed ? `Card ${card.id + 1}, face up` :
        `Card ${card.id + 1}, hidden`
      }
      aria-pressed={isRevealed}
      className={[
        "card-root focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-2",
        isRevealed ? "is-revealed" : "",
        isMatched ? "is-matched" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Inner wrapper that flips */}
      <div className="card-inner">
        {/* Back face — shown when hidden */}
        <div className="card-face card-back">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className="w-6 h-6 opacity-30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Front face — shown when flipped/matched */}
        <div className="card-face card-front">
          <img
            src={card.image}
            alt=""
            draggable={false}
            className="w-full h-full object-cover rounded"
            style={
              colorize && currentTheme === "generic" && card.isGeneric
                ? { filter: `brightness(0) saturate(100%) invert(1) sepia(1) saturate(10000%) hue-rotate(${hueRotate}deg)` }
                : undefined
            }
          />
        </div>
      </div>
    </button>
  );
}
