import { useState } from "react";
import type { GameTheme } from "@/types/game";
import { isValidTheme } from "@/data/themes";

const STORAGE_KEY = "card-theme";
const DEFAULT_THEME: GameTheme = "generic";

export function useTheme(): [GameTheme, (theme: GameTheme) => void] {
  const [theme, setThemeState] = useState<GameTheme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && isValidTheme(stored) ? (stored as GameTheme) : DEFAULT_THEME;
  });

  const setTheme = (newTheme: GameTheme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
  };

  return [theme, setTheme];
}
