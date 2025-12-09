"use client";

import React from "react";

export interface PlayerProgressProps {
  isLive: boolean;
  currentTime: number;
  duration: number | null;
  onSeek: (percent: number) => void;
}

export default function PlayerProgress({
  isLive,
  currentTime,
  duration,
  onSeek,
}: PlayerProgressProps) {
  if (isLive) {
    return (
      <div className="h-[3px] w-full bg-white/10 flex items-center">
        <div className="w-2 h-2 bg-electric animate-pulse rounded-full ml-2" />
      </div>
    );
  }

  const percent =
    duration && duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative w-full h-[3px] bg-white/10 rounded cursor-pointer group"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const click = e.clientX - rect.left;
        const pct = (click / rect.width) * 100;
        onSeek(pct);
      }}
    >
      <div
        className="absolute left-0 top-0 h-full bg-electric transition-all"
        style={{ width: `${percent}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition"
        style={{ left: `calc(${percent}% - 6px)` }}
      />
    </div>
  );
}
