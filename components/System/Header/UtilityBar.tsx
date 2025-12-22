"use client";

import { User, ShoppingBag, Search, Sun, Moon } from "lucide-react";
import { useWNTheme } from "@/components/ui/ThemeToggle/WNThemeProvider";

export default function UtilityBar() {
  const { resolvedTheme, toggleTheme } = useWNTheme();

  return (
    <div className="hidden md:flex items-center gap-4 text-white/80">
      <User size={20} />
      <ShoppingBag size={20} />
      <Search size={20} />

      <button onClick={toggleTheme}>
        {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}
