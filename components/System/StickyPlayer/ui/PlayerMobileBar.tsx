"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { Play, Pause, ChevronUp } from "lucide-react";
import clsx from "clsx";

import type { Track } from "../types";

export interface PlayerMobileBarProps {
  currentTrack: Track | null;
  currentShow: string | null;
  isLive: boolean;
  isPlaying: boolean;

  currentTime?: number;
  duration?: number | null;

  onPlayPause: () => void;
  onExpand: () => void;
  onCollapse?: () => void;
}

export function PlayerMobileBar({
  currentTrack,
  currentShow,
  isLive,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onExpand,
  onCollapse,
}: PlayerMobileBarProps) {
  /* -------------------------------------------------
     HOOKS — MUST ALWAYS RUN
  -------------------------------------------------- */

  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackingRef = useRef(false);
  const startYRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const firedRef = useRef<"none" | "up" | "down">("none");

  const progressPct = useMemo(() => {
    if (!currentTrack) return 0;
    if (isLive) return 0;
    if (!duration || duration <= 0) return 0;
    if (typeof currentTime !== "number") return 0;

    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTrack, currentTime, duration, isLive]);

  /* -------------------------------------------------
     POINTER / GESTURE HANDLING
  -------------------------------------------------- */

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const SWIPE_UP = 34;
    const SWIPE_DOWN = 38;
    const HORIZONTAL_CANCEL = 28;

    const haptic = (pattern: number | number[]) => {
      if ("vibrate" in navigator) navigator.vibrate(pattern);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;

      trackingRef.current = true;
      startYRef.current = e.clientY;
      startXRef.current = e.clientX;
      firedRef.current = "none";

      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (
        !trackingRef.current ||
        startYRef.current === null ||
        startXRef.current === null
      )
        return;

      const dy = e.clientY - startYRef.current;
      const dx = e.clientX - startXRef.current;

      if (Math.abs(dx) > HORIZONTAL_CANCEL && Math.abs(dx) > Math.abs(dy)) {
        trackingRef.current = false;
        return;
      }

      if (firedRef.current === "none") {
        if (dy < -SWIPE_UP) {
          firedRef.current = "up";
          haptic([10, 6, 10]);
          onExpand();
        } else if (dy > SWIPE_DOWN && onCollapse) {
          firedRef.current = "down";
          haptic(10);
          onCollapse();
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      trackingRef.current = false;
      startYRef.current = null;
      startXRef.current = null;

      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [onExpand, onCollapse]);

  /* -------------------------------------------------
     SAFE EARLY EXIT (AFTER HOOKS)
  -------------------------------------------------- */

  if (!currentTrack) return null;

  const subtitle = isLive
    ? currentShow ?? "Live Broadcast"
    : currentTrack.artist;

  const artworkSrc =
    currentTrack.artwork && currentTrack.artwork.length > 0
      ? currentTrack.artwork
      : "/images/placeholder-artwork.jpg";

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("vibrate" in navigator) {
      navigator.vibrate(isPlaying ? 10 : [12, 6, 10]);
    }
    onPlayPause();
  };

  /* -------------------------------------------------
     RENDER
  -------------------------------------------------- */

  return (
    <div
      ref={rootRef}
      className="fixed left-0 right-0 bottom-[72px] z-[70] md:hidden px-3"
    >
      <div
        onClick={onExpand}
        className={clsx(
          "relative flex items-center gap-3",
          "h-[56px] rounded-xl",
          "bg-[#0B0D0F]/90 backdrop-blur-xl",
          "border border-white/10",
          "px-3 shadow-lg"
        )}
      >
        {/* PROGRESS BAR */}
        <div className="absolute left-0 right-0 top-0 h-[2px] overflow-hidden rounded-t-xl">
          <div className="absolute inset-0 bg-white/10" />
          {!isLive && progressPct > 0 && (
            <div
              className="absolute left-0 top-0 h-full bg-white/35"
              style={{ width: `${progressPct}%` }}
            />
          )}
          <div className="absolute inset-0 wn-wave-shimmer" />
        </div>

        {/* ARTWORK */}
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/5">
          <Image
  src={artworkSrc}
  alt={currentTrack.title || "Now Playing"}
  fill
  sizes="40px"
  unoptimized
  className="object-cover"
/>

        </div>

        {/* META */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-sm font-medium truncate">
              {currentTrack.title}
            </div>
            {isLive && <span className="wn-live-dot" />}
          </div>
          <div className="text-xs text-white/60 truncate">
            {subtitle}
          </div>
        </div>

        {/* PLAY / PAUSE */}
        <button
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="h-9 w-9 rounded-full bg-white text-black flex items-center justify-center"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <ChevronUp size={16} className="text-white/40" />
      </div>
    </div>
  );
}
