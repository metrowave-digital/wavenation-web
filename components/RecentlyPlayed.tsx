"use client";

import { useEffect, useState } from "react";

interface HistoryItem {
  title: string;
  artist: string;
  playedAt: string; // ISO time string
  artwork?: string;
}

interface ApiResponse {
  history: HistoryItem[];
}

export default function RecentlyPlayed() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/now-playing", { cache: "no-store" });
      const json: ApiResponse = await res.json();

      const mapped = (json.history || []).map((h): HistoryItem => ({
        title: h.title ?? "",
        artist: h.artist ?? "",
        playedAt: h.playedAt ?? new Date().toISOString(),
        artwork: h.artwork ?? "",
      }));

      setHistory(mapped);
    };

    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!history.length) return null;

  /** ---- TIME AGO HELPER ---- **/
  const getTimeAgo = (dateString: string): string => {
    const played = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - played.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;

    // Yesterday or older
    return played.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      <div
        className="
          bg-[#202527]/80 
          border border-[#2E3334] 
          rounded-xl 
          p-3 
          backdrop-blur-md
          shadow-[0_8px_20px_rgba(0,0,0,0.35)]
        "
      >
        <ul className="divide-y divide-white/5">
          {history.map((item, index) => {
            const timeLabel = getTimeAgo(item.playedAt);

            return (
              <li
                key={index}
                className="
                  py-3 
                  flex items-start justify-between 
                  hover:bg-white/5 
                  transition 
                  rounded-lg 
                  px-2
                "
              >
                {/* TEXT BLOCK */}
                <div className="flex-1 pr-4 overflow-hidden">
                  <p className="font-inter font-semibold text-sm text-white/95 leading-tight truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-white/60 truncate">{item.artist}</p>
                </div>

                {/* TIME */}
                <div className="text-right text-[10px] text-white/40 whitespace-nowrap">
                  {timeLabel}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
