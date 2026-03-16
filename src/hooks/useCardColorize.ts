import { useState } from "react";

const STORAGE_KEY = "sg:colorize";

export function useCardColorize(): [boolean, (v: boolean) => void] {
  const [colorize, setColorizeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "false";
    } catch {
      return true;
    }
  });

  const setColorize = (v: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch {}
    setColorizeState(v);
  };

  return [colorize, setColorize];
}
