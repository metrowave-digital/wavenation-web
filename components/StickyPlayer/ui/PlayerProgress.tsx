"use client";

import React, { useEffect, useRef, useState } from "react";

export interface PlayerProgressProps {
  isLive: boolean;
  currentTime: number;
  duration: number | null;
  onSeek: (percent: number) => void;
  variant?: "default" | "compact";
}

export default function PlayerProgress({
  isLive,
  currentTime,
  duration,
  onSeek,
  variant = "default",
}: PlayerProgressProps) {
  const isCompact = variant === "compact";
  const barRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Lockscreen position sync
  useEffect(() => {
    if (!("mediaSession" in navigator) || isLive || !duration || duration <= 0) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        position: currentTime,
        playbackRate: 1,
      });
    } catch {
      // ignore safari timing issues
    }
  }, [currentTime, duration, isLive]);

  if (isLive) {
    return (
      <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
      </div>
    );
  }

  const percent = duration && duration > 0 ? (currentTime / duration) * 100 : 0;

  const seekFromClientX = (clientX: number) => {
    const el = barRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const pct = (x / rect.width) * 100;
    onSeek(pct);
  };

  return (
    <div
      ref={barRef}
      className={`relative w-full rounded ${isCompact ? "h-[2px]" : "h-[4px]"} bg-white/15`}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setIsDragging(true);
        seekFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!isDragging) return;
        seekFromClientX(e.clientX);
      }}
      onPointerUp={(e) => {
        setIsDragging(false);
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {}
      }}
      onClick={(e) => {
        // click seek
        seekFromClientX(e.clientX);
      }}
    >
      <div
        className="absolute left-0 top-0 h-full bg-white"
        style={{ width: `${percent}%` }}
      />

      {/* Thumb: only show when not compact OR dragging */}
      {!isCompact && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow transition-opacity ${
            isDragging ? "opacity-100" : "opacity-0 hover:opacity-100"
          }`}
          style={{ left: `calc(${percent}% - 6px)` }}
        />
      )}
    </div>
  );
}
