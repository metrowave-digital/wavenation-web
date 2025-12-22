/* ============================================================
   PlayerExpandedSheet.tsx — FULL REDESIGN (COPY/PASTE)
   WaveNation “Now Playing Surface” — Mobile-first
   - Artwork hero w/ cinematic overlay
   - Big centered controls
   - Mode-aware (LIVE vs On-Demand vs Spotify Preview)
   - Bottom offset support for your 6-icon dock
============================================================ */

"use client";

import Image from "next/image";
import React, { useMemo } from "react";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Radio,
  ListMusic,
  Mic,
  Waves,
  CornerDownLeft,
} from "lucide-react";
import PlayerProgress from "./PlayerProgress";
import type { Track } from "../types";

export interface PlayerExpandedSheetProps {
  expanded: boolean;

  currentTrack: Track | null;
  currentShow: string | null;

  isLive: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number | null;

  /** Distance from bottom (mobile nav height) */
  bottomOffset?: number;

  onClose: () => void;
  onPlayPause: () => void;
  onSeek: (percent: number) => void;
  onNext?: () => void;
  onPrev?: () => void;

  onToggleQueue: () => void;
  onOpenVoiceMemo: () => void;
  onReturnToLive: () => void;

  hasLiveTrack?: boolean;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function PlayerExpandedSheet({
  expanded,
  bottomOffset = 0,

  currentTrack,
  currentShow,

  isLive,
  isPlaying,
  currentTime,
  duration,

  onClose,
  onPlayPause,
  onSeek,
  onNext,
  onPrev,

  onToggleQueue,
  onOpenVoiceMemo,
  onReturnToLive,
  hasLiveTrack,
}: PlayerExpandedSheetProps) {
  const isPreview = currentTrack?.type === "spotify-preview";
  const canReturnToLive = !isLive && Boolean(hasLiveTrack) && !isPreview;

  const subtitle = useMemo(() => {
    if (!currentTrack) return "";
    if (isLive) return currentShow ?? "Live Broadcast";
    if (isPreview) return `${currentTrack.artist} • Spotify Preview`;
    return currentTrack.artist;
  }, [currentTrack, currentShow, isLive, isPreview]);

  const artworkSrc = currentTrack?.artwork ?? "/placeholder-cover.jpg";
  const title = currentTrack?.title ?? "Now Playing";

  // Progress percent for subtle header bar
  const pct = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return clamp((currentTime / duration) * 100, 0, 100);
  }, [currentTime, duration]);

  return (
    <div
      className={[
        "fixed inset-x-0 top-0 z-[80]",
        "transition-transform duration-300 ease-out",
        expanded ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      style={{ bottom: bottomOffset }}
      aria-hidden={!expanded}
    >
      {/* SHEET */}
      <div className="h-full w-full bg-[#0B0D0F] text-white border-t border-white/10">
        {/* TOP PROGRESS STRIP (subtle, mode-aware) */}
        <div className="relative h-[2px] w-full overflow-hidden bg-white/10">
          {!isLive && !isPreview && pct > 0 ? (
            <div className="absolute left-0 top-0 h-full bg-white/50" style={{ width: `${pct}%` }} />
          ) : (
            <div className="absolute left-0 top-0 h-full w-[18%] bg-white/30 animate-pulse" />
          )}
          <div className="absolute inset-0 wn-wave-shimmer" />
        </div>

        {/* HEADER */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/70">
              {isLive ? <Radio size={14} className="text-magenta" /> : <Waves size={14} className="text-electric" />}
              <span>{isLive ? "Live" : isPreview ? "Preview" : "Now Playing"}</span>
            </div>

            <p className="mt-1 text-sm font-semibold truncate">{title}</p>
            <p className="text-xs text-white/60 truncate">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 transition flex items-center justify-center"
            aria-label="Close player"
          >
            <X size={18} />
          </button>
        </div>

        {/* HERO ARTWORK */}
        <div className="px-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {/* Aspect: tall but not full-screen */}
            <div className="relative w-full h-[44vh] max-h-[420px]">
              <Image
  src={artworkSrc}
  alt={title}
  fill
  sizes="(max-width: 768px) 100vw, 600px"
  unoptimized
  className="object-cover"
  priority={expanded}
/>


              {/* Cinematic overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/75" />

              {/* Floating meta (big) */}
              <div className="absolute left-0 right-0 bottom-0 p-4">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-2xl font-semibold leading-tight truncate">{title}</div>
                    <div className="text-white/70 text-sm truncate">{subtitle}</div>

                    {/* Live badge */}
                    {isLive && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 border border-white/10">
                        <span className="wn-live-dot" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-white">
                          Live Broadcast
                        </span>
                      </div>
                    )}

                    {/* Preview badge */}
                    {isPreview && (
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 border border-white/10">
                        <span className="h-2 w-2 rounded-full bg-wn-gold/90" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-white">
                          Spotify Preview (30s)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Return to Live (only when appropriate) */}
                  {canReturnToLive && (
                    <button
                      type="button"
                      onClick={onReturnToLive}
                      className="shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 bg-magenta text-white font-semibold text-xs hover:opacity-95 transition shadow"
                    >
                      <CornerDownLeft size={16} />
                      Return to Live
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS + PROGRESS */}
        <div className="px-4 pt-5 pb-4">
          {/* Progress */}
          <div className="mb-4">
            <PlayerProgress
              isLive={isLive || isPreview /* preview behaves like non-seekable timeline (simple) */}
              currentTime={currentTime}
              duration={duration}
              onSeek={onSeek}
              variant="default"
            />
            {!isLive && !isPreview && (
              <div className="mt-2 flex items-center justify-between text-[11px] text-white/45">
                <span>Drag to seek</span>
                <span className="uppercase tracking-wide">WaveNation Player</span>
              </div>
            )}
            {isPreview && (
              <div className="mt-2 text-[11px] text-white/45">
                Preview mode • Some tracks may not include a preview
              </div>
            )}
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={onPrev}
              disabled={!onPrev || isLive}
              className={[
                "h-14 w-14 rounded-full flex items-center justify-center",
                "bg-white/10 border border-white/10",
                "hover:bg-white/15 transition",
                (!onPrev || isLive) ? "opacity-40 pointer-events-none" : "",
              ].join(" ")}
              aria-label="Previous"
            >
              <SkipBack size={22} />
            </button>

            <button
              type="button"
              onClick={onPlayPause}
              className="h-20 w-20 rounded-full bg-white text-black flex items-center justify-center shadow-xl active:scale-[0.98] transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={30} /> : <Play size={30} />}
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={!onNext || isLive}
              className={[
                "h-14 w-14 rounded-full flex items-center justify-center",
                "bg-white/10 border border-white/10",
                "hover:bg-white/15 transition",
                (!onNext || isLive) ? "opacity-40 pointer-events-none" : "",
              ].join(" ")}
              aria-label="Next"
            >
              <SkipForward size={22} />
            </button>
          </div>

          {/* Actions Row */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onToggleQueue}
              className="h-12 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition flex items-center justify-center gap-2"
            >
              <ListMusic size={18} className="text-electric" />
              <span className="text-sm font-semibold">Queue</span>
            </button>

            <button
              type="button"
              onClick={onOpenVoiceMemo}
              className="h-12 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition flex items-center justify-center gap-2"
            >
              <Mic size={18} className="text-magenta" />
              <span className="text-sm font-semibold">Voice Memo</span>
            </button>
          </div>

          {/* Footer Hint */}
          <div className="mt-4 text-center text-xs text-white/40">
            Swipe down to close • Built for WaveNation FM
          </div>
        </div>
      </div>
    </div>
  );
}
