"use client";

import { Sun, Moon, Laptop } from "lucide-react";
import { useWNTheme } from "./WNThemeProvider";

export default function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useWNTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Switch theme"
      className="
        p-2 rounded-md
        bg-white/10 hover:bg-white/20
        dark:bg-black/30
        transition
      "
    >
      {theme === "system" ? (
        <Laptop size={18} className="text-wn-blue" />
      ) : resolvedTheme === "dark" ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-wn-black-light" />
      )}
    </button>
  );
}
