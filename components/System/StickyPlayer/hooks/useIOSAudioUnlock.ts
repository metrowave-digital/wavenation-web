"use client";

import { useEffect, RefObject } from "react";

export function useIOSAudioUnlock(
  audioRef: RefObject<HTMLAudioElement | null>
) {
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const unlock = async () => {
      try {
        await el.play();
        el.pause();
      } catch {
        // iOS will unlock after real gesture
      }
      window.removeEventListener("touchend", unlock);
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("touchend", unlock, { passive: true });
    window.addEventListener("click", unlock);

    return () => {
      window.removeEventListener("touchend", unlock);
      window.removeEventListener("click", unlock);
    };
  }, [audioRef]);
}
