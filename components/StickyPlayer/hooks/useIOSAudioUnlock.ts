"use client";

import { useEffect, RefObject } from "react";

export function useIOSAudioUnlock(audioRef: RefObject<HTMLAudioElement | null>) {
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const unlock = async () => {
      try {
        // play-pause quickly to unlock audio pipeline
        await el.play();
        el.pause();
      } catch {
        // ignore; will succeed after a real user gesture if blocked
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
