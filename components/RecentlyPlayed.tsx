"use client";

import { useEffect, useState } from "react";

export default function RecentlyPlayed() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/now-playing", { cache: "no-store" });
      const json = await res.json();
      setHistory(json.history || []);
    };

    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!history.length) return null;

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
          {history.map((item, index) => (
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
              <div className="flex-1 pr-4">
                <p className="font-inter font-semibold text-sm text-white/95 leading-tight">
                  {item.title}
                </p>
                <p className="text-xs text-white/60 mt-0.5">
                  {item.artist}
                </p>
              </div>

              {/* TIME */}
              <div className="text-right text-[10px] text-white/40 whitespace-nowrap">
                {new Date(item.playedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
