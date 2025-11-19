"use client";

import { useEffect, useState } from "react";

interface NowPlayingResponse {
  nowPlaying: {
    artist: string;
    title: string;
    startedAt?: string;
  };
}

export default function NowPlaying() {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        const json: NowPlayingResponse = await res.json();
        setArtist(json.nowPlaying?.artist || "");
        setTitle(json.nowPlaying?.title || "");
      } catch (error) {
        console.error("Failed to load now playing", error);
      }
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 p-6 bg-darkcard/70 border border-magenta/40 rounded-2xl shadow-magenta max-w-md w-full text-center backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.25em] text-magenta/70">
        Now Playing
      </p>
      <p className="mt-3 text-2xl font-bold text-electric">
        {title || "Waiting for track…"}
      </p>
      {artist ? (
        <p className="mt-1 text-lg text-white/80">{artist}</p>
      ) : (
        <p className="mt-1 text-sm text-white/50">Metadata will appear here.</p>
      )}
    </div>
  );
}
