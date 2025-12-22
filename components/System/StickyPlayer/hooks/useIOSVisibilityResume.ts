"use client";

import { useEffect, RefObject } from "react";

export function useIOSVisibilityResume(
  audioRef: RefObject<HTMLAudioElement | null>,
  shouldBePlaying: boolean
) {
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onVisibility = async () => {
      if (document.visibilityState !== "visible") return;
      if (!shouldBePlaying) return;

      try {
        await el.play();
      } catch {
        // user will tap play again if blocked
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, [audioRef, shouldBePlaying]);
}
