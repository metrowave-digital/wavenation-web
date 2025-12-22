"use client";

import { useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setStoredValue = (val: T) => {
    setValue(val);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(val));
    }
  };

  return [value, setStoredValue] as const;
}
