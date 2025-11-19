"use client";

import { useEffect, useState } from "react";

export default function NowPlaying() {
  const [data, setData] = useState({
    artist: "",
    title: "",
    listeners: 0,
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/now-playing", { cache: "no-store" });
      const json = await res.json();
      setData(json.nowPlaying);
    };

    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 p-6 bg-darkcard/70 border border-magenta/40 rounded-2xl shadow-magenta text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-magenta/70">
        Now Playing
      </p>

      <p className="mt-4 text-2xl font-bold text-electric">
        {data.title || "Loading…"}
      </p>

      <p className="text-lg text-white/80">{data.artist}</p>

      <p className="mt-3 text-sm text-white/50">
        {data.listeners} listening
      </p>
    </div>
  );
}
