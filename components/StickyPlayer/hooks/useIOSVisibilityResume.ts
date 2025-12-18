"use client";

import { useEffect, RefObject } from "react";

export function useIOSVisibilityResume(
  audioRef: RefObject<HTMLAudioElement | null>,
  shouldBePlaying: boolean
) {
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onVis = async () => {
      if (document.visibilityState !== "visible") return;
      if (!shouldBePlaying) return;

      try {
        await el.play();
      } catch {
        // iOS may require a gesture; user will hit play again
      }
    };

    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [audioRef, shouldBePlaying]);
}
