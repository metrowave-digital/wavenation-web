"use client";

import { useEffect, useState } from "react";

export type NowPlayingMode = "dj" | "autodj" | "offline";

export interface NowPlaying {
  title: string;
  artist: string;
  artwork: string | null;
  mode: NowPlayingMode;
  djName: string | null;
  playedAt: string | null;
}

export function useNowPlaying(pollMs: number = 15000) {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  useEffect(() => {
    let active = true;

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        if (!res.ok) return;

        const json = (await res.json()) as { nowPlaying?: NowPlaying };
        if (active) setNowPlaying(json.nowPlaying ?? null);
      } catch {
        // silent fail
      }
    };

    fetchNowPlaying();
    const id = window.setInterval(fetchNowPlaying, pollMs);

    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [pollMs]);

  return nowPlaying;
}
