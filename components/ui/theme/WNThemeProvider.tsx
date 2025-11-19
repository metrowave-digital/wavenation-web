"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function WNThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("wavenation-theme") as Theme) || "system";
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] =
    useState<"light" | "dark">("dark");

  useEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const final =
        theme === "system"
          ? system.matches
            ? "dark"
            : "light"
          : theme;

      setResolvedTheme(final);

      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(final);
    };

    applyTheme();

    if (theme === "system") {
      system.addEventListener("change", applyTheme);
      return () => system.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("wavenation-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useWNTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useWNTheme must be used inside WNThemeProvider");
  return ctx;
};
