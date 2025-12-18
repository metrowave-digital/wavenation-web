"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Track } from "../types";
import { Play, Pause, ListMusic, ChevronUp } from "lucide-react";

export interface PlayerMobileBarProps {
  currentTrack: Track | null;
  currentShow: string | null;
  isLive: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number | null;

  onPlayPause: () => void;
  onSeek: (percent: number) => void;
  onReturnToLive: () => void;
  onOpenQueue: () => void;

  expanded: boolean;
  setExpanded: (value: boolean) => void;
}

export function PlayerMobileBar(props: PlayerMobileBarProps) {
  /* -------------------------------------------------
     REFS (ALL HOOKS FIRST)
  -------------------------------------------------- */
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const trackingRef = useRef(false);
  const displayPctRef = useRef(0);

  const [displayPercent, setDisplayPercent] = useState(0);

  const {
    currentTrack,
    currentShow,
    isLive,
    isPlaying,
    currentTime,
    duration,
    onPlayPause,
    onSeek,
    onReturnToLive,
    onOpenQueue,
    expanded,
    setExpanded,
  } = props;

  /* -------------------------------------------------
     DERIVED STATE (SAFE)
  -------------------------------------------------- */
  const rawProgressPercent = useMemo(() => {
    if (isLive || !duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration, isLive]);

  /* -------------------------------------------------
     SMOOTH PROGRESS ANIMATION
  -------------------------------------------------- */
useEffect(() => {
  // Always animate via RAF to satisfy lint + avoid sync state updates
  const start = performance.now();
  const from = displayPctRef.current;
  const to =
    isLive || !duration || duration <= 0
      ? 0
      : rawProgressPercent;

  const DURATION_MS = 220;
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION_MS);
    const eased = easeOutCubic(t);
    const next = from + (to - from) * eased;

    displayPctRef.current = next;
    setDisplayPercent(next); // ✅ setState only inside RAF callback

    if (t < 1) {
      rafRef.current = requestAnimationFrame(step);
    }
  };

  if (rafRef.current) cancelAnimationFrame(rafRef.current);
  rafRef.current = requestAnimationFrame(step);

  return () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };
}, [rawProgressPercent, isLive, duration]);


  /* -------------------------------------------------
     SWIPE GESTURE (POINTER EVENTS)
  -------------------------------------------------- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const SWIPE_UP = 42;
    const SWIPE_DOWN = 38;
    const HORIZONTAL_CANCEL = 26;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;

      trackingRef.current = true;
      startYRef.current = e.clientY;
      startXRef.current = e.clientX;
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!trackingRef.current || startYRef.current === null || startXRef.current === null) return;

      const dy = e.clientY - startYRef.current;
      const dx = e.clientX - startXRef.current;

      if (Math.abs(dx) > HORIZONTAL_CANCEL && Math.abs(dx) > Math.abs(dy)) {
        trackingRef.current = false;
        return;
      }

      if (Math.abs(dy) > 10) e.preventDefault();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!trackingRef.current || startYRef.current === null) return;

      const dy = e.clientY - startYRef.current;

      if (!expanded && dy < -SWIPE_UP) setExpanded(true);
      if (expanded && dy > SWIPE_DOWN) setExpanded(false);

      trackingRef.current = false;
      startYRef.current = null;
      startXRef.current = null;

      el.releasePointerCapture(e.pointerId);
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
  }, [expanded, setExpanded]);

  /* -------------------------------------------------
     HAPTICS
  -------------------------------------------------- */
  const triggerHaptic = (pattern: number | number[]) => {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  };

  const handlePlayPause = () => {
    triggerHaptic(isPlaying ? 12 : [18, 8, 14]);
    onPlayPause();
  };

  /* -------------------------------------------------
     EARLY UI RETURN (SAFE)
  -------------------------------------------------- */
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-[90] h-16 bg-[#0B0D0F]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-center text-white/60 text-sm md:hidden">
        Loading player…
      </div>
    );
  }

  const subtitle = isLive ? currentShow ?? "Live Broadcast" : currentTrack.artist;

  /* -------------------------------------------------
     RENDER
  -------------------------------------------------- */
  return (
    <div
      ref={rootRef}
      className="md:hidden fixed bottom-0 inset-x-0 z-[90] bg-[#0B0D0F]/95 backdrop-blur-xl border-t border-white/10 px-4 pt-3 pb-2 select-none"
    >
      {/* EXPAND HANDLE */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-12 rounded-full bg-[#0B0D0F]/90 border border-white/10 flex items-center justify-center"
      >
        <ChevronUp
          size={16}
          className={`text-white transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* CONTENT */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-white/5 ring-1 ring-white/10">
            <Image src={currentTrack.artwork} alt={currentTrack.title} fill className="object-cover" />
          </div>

          <div className="min-w-0">
            <div className="text-white text-sm font-semibold truncate">
              {currentTrack.title}
            </div>
            <div className="text-white/60 text-xs truncate">{subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            onClick={onOpenQueue}
            className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center"
          >
            <ListMusic size={18} />
          </button>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mt-3">
        {isLive ? (
          <button
            onClick={onReturnToLive}
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-magenta"
          >
            ● LIVE
          </button>
        ) : (
          <input
            type="range"
            min={0}
            max={100}
            value={displayPercent}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-white h-[3px]"
          />
        )}
      </div>
    </div>
  );
}
