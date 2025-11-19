"use client";

import { useEffect, useState } from "react";

interface HistoryItem {
  artist: string;
  title: string;
  playedAt: string;
}

interface NowPlayingResponse {
  history: HistoryItem[];
}

export default function RecentlyPlayed() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        const json: NowPlayingResponse = await res.json();
        setHistory(json.history || []);
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };

    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!history.length) {
    return null;
  }

  return (
    <section className="mt-16 w-full max-w-xl">
      <h3 className="text-lg font-semibold mb-4 text-electric">
        Recently Played
      </h3>
      <div className="bg-darkcard/70 border border-electric/30 rounded-2xl p-4 backdrop-blur-xl">
        <ul className="space-y-2 text-sm">
          {history.map((item, idx) => (
            <li
              key={`${item.title}-${item.playedAt}-${idx}`}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-white/70 text-xs">{item.artist}</p>
              </div>
              <p className="text-[11px] text-white/50 whitespace-nowrap">
                {new Date(item.playedAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
