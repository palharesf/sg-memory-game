import { useState } from "react";
import type { GameTheme } from "@/types/game";

const STORAGE_KEY = "card-theme";

export function useTheme(): [GameTheme, (theme: GameTheme) => void] {
  const [theme, setThemeState] = useState<GameTheme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "donated" ? "donated" : "generic";
  });

  const setTheme = (newTheme: GameTheme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
  };

  return [theme, setTheme];
}
