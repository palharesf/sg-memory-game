import { useState } from "react";
import { BACKGROUNDS } from "@/hooks/useBackground";
import type { Background } from "@/hooks/useBackground";

const STORAGE_KEY = "sg:card-bg";

// Default matches the current card-front color (#2a2e33 = --color-bg-surface)
// Closest preset is "dark" (#1a1d23) — use "slate" (#2d3a4a) as nearest match,
// but since the exact color isn't in the list we default to "dark" (index 1).
export const DEFAULT_CARD_BACKGROUND = BACKGROUNDS[1]!;

export function useCardBackground(): [Background, (bg: Background) => void] {
  const [bg, setBgState] = useState<Background>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return BACKGROUNDS.find((b) => b.id === stored) ?? DEFAULT_CARD_BACKGROUND;
    } catch {
      return DEFAULT_CARD_BACKGROUND;
    }
  });

  const setBg = (newBg: Background) => {
    try {
      localStorage.setItem(STORAGE_KEY, newBg.id);
    } catch {}
    setBgState(newBg);
  };

  return [bg, setBg];
}
