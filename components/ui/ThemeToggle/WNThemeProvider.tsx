"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "wavenation-theme";

export function WNThemeProvider({ children }: { children: React.ReactNode }) {
  /* ---------------------------------
     STATE (lazy initialization)
  ---------------------------------- */
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
  });

  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>("dark");

  /* ---------------------------------
     EFFECT: resolve + apply theme
  ---------------------------------- */
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const resolveTheme = () => {
      const next: ResolvedTheme =
        theme === "system"
          ? media.matches
            ? "dark"
            : "light"
          : theme;

      setResolvedTheme(next);

      // External system sync (DOM) ✅ allowed
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(next);
    };

    resolveTheme();

    if (theme === "system") {
      media.addEventListener("change", resolveTheme);
      return () => media.removeEventListener("change", resolveTheme);
    }
  }, [theme]);

  /* ---------------------------------
     API
  ---------------------------------- */
  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const toggleTheme = () => {
    setTheme(
      theme === "dark"
        ? "light"
        : theme === "light"
        ? "system"
        : "dark"
    );
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/* ---------------------------------
   Hook
---------------------------------- */
export const useWNTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useWNTheme must be used inside WNThemeProvider");
  }
  return ctx;
};
