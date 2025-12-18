import { useEffect, useRef } from "react";

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.preload = "none";
    } else {
      audioRef.current.src = src;
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [src]);

  return audioRef;
}
