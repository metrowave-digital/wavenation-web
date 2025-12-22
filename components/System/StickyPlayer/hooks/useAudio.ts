"use client";

import { useEffect, useRef } from "react";

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.preload = "none";
      audioRef.current = audio;
    } else if (audioRef.current.src !== src) {
      audioRef.current.src = src;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [src]);

  return audioRef;
}
