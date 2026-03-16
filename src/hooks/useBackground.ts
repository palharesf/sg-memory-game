const STORAGE_KEY = "sg:bg";

export interface Background {
  id: string;
  color: string;
  label: string;
}

export const BACKGROUNDS: Background[] = [
  { id: "darkest", color: "#0d1117", label: "Near black" },
  { id: "dark", color: "#1a1d23", label: "Default dark" },
  { id: "slate", color: "#2d3a4a", label: "Dark slate" },
  { id: "steel", color: "#4a6274", label: "Steel blue" },
  { id: "mist", color: "#8a9ba8", label: "Mist" },
  { id: "silver", color: "#c4cdd6", label: "Silver" },
  { id: "darkroyalblue", color: "#003A8F", label: "Dark royal blue" },
  { id: "signalyellow", color: "#FFD500", label: "Signal yellow" },
];

export const DEFAULT_BACKGROUND = BACKGROUNDS[1]!; // "dark" = current app bg

import { useState } from "react";

export function useBackground(): [Background, (bg: Background) => void] {
  const [bg, setBgState] = useState<Background>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return BACKGROUNDS.find((b) => b.id === stored) ?? DEFAULT_BACKGROUND;
    } catch {
      return DEFAULT_BACKGROUND;
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
