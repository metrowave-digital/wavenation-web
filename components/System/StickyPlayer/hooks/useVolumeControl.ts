"use client";

import { useCallback } from "react";

export function useVolumeControl(
  audio: HTMLAudioElement | null,
  volume: number,
  setVolume: (v: number) => void,
  isMuted: boolean,
  setIsMuted: (v: boolean) => void
) {
  const changeVolume = useCallback(
    (value: number) => {
      if (!audio) return;
      const next = Math.max(0, Math.min(1, value));
      audio.volume = next;
      audio.muted = next === 0;
      setVolume(next);
      setIsMuted(next === 0);
    },
    [audio, setVolume, setIsMuted]
  );

  const toggleMute = useCallback(() => {
    if (!audio) return;
    const next = !isMuted;
    audio.muted = next;
    setIsMuted(next);
  }, [audio, isMuted, setIsMuted]);

  return { changeVolume, toggleMute };
}
