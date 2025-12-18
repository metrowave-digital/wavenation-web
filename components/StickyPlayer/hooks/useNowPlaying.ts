import { useEffect, useState } from "react";

type NowPlaying = {
  title: string;
  artist: string;
  artwork?: string;
};

export function useNowPlaying(endpoint: string) {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  useEffect(() => {
    let active = true;

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        if (active) setNowPlaying(data);
      } catch {
        // silent fail
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [endpoint]);

  return nowPlaying;
}
