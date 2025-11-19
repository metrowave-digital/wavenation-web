"use client";

import { useWNTheme } from "./WNThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useWNTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Switch Theme"
      className="p-2 rounded-md bg-white/10 hover:bg-white/20 dark:bg-black/20 transition"
    >
      {resolvedTheme === "light" ? (
        <Moon size={18} className="text-wn-black-light" />
      ) : (
        <Sun size={18} className="text-yellow-400" />
      )}
    </button>
  );
}
