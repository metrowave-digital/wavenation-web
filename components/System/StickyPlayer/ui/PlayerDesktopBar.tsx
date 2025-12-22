"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Mic,
  ListMusic,
  Radio,
} from "lucide-react";
import Image from "next/image";
import PlayerProgress from "./PlayerProgress";
import type { Track } from "../types";
import { useState } from "react";

/* ---------------------------------
   TYPES
---------------------------------- */

export interface PlayerDesktopBarProps {
  currentTrack: Track | null;
  currentShow: string | null;
  isLive: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number | null;
  volume: number;

  onVolumeChange: (v: number) => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (percent: number) => void;
  onToggleQueue: () => void;
  onReturnToLive: () => void;
  onOpenVoiceMemo: () => void;

  hasLiveTrack: boolean;
}

/* ---------------------------------
   COMPONENT
---------------------------------- */

export default function PlayerDesktopBar({
  currentTrack,
  currentShow,
  isLive,
  isPlaying,
  currentTime,
  duration,
  volume,
  onVolumeChange,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
  onToggleQueue,
  onReturnToLive,
  onOpenVoiceMemo,
  hasLiveTrack,
}: PlayerDesktopBarProps) {
  const [showVolume, setShowVolume] = useState(false);

  if (!currentTrack) return null;

  const artworkSrc =
    currentTrack.artwork && currentTrack.artwork.length > 0
      ? currentTrack.artwork
      : "/images/placeholder-artwork.jpg";

  return (
    <div className="hidden md:flex fixed bottom-0 inset-x-0 z-[120]">
      {/* NEON ACCENT */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-electric via-magenta to-electric opacity-80" />

      <div className="relative flex items-center gap-6 px-6 py-4 w-full bg-[#0B0D0F]/95 backdrop-blur-xl border-t border-white/10">

        {/* ARTWORK */}
        <div className="relative h-16 w-16 rounded-md overflow-hidden ring-1 ring-white/10 shadow-lg shrink-0">
          <Image
  src={artworkSrc}
  alt={currentTrack.title || "Now Playing"}
  fill
  sizes="64px"
  unoptimized
  className="object-cover"
/>

        </div>

        {/* NOW PLAYING */}
        <div className="flex flex-col min-w-[220px] max-w-[260px]">
          <span className="text-white font-semibold leading-tight truncate">
            {currentTrack.title}
          </span>

          <span className="text-white/60 text-sm truncate">
            {isLive && currentShow ? currentShow : currentTrack.artist}
          </span>

          {isLive && (
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-magenta">
              <Radio size={12} />
              Live Broadcast
            </span>
          )}
        </div>

        {/* RETURN TO LIVE */}
        {!isLive && hasLiveTrack && (
          <button
            onClick={onReturnToLive}
            aria-label="Return to live broadcast"
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-magenta text-white hover:opacity-90 transition shrink-0"
          >
            Return to Live
          </button>
        )}

        {/* CONTROLS */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onPrev}
            aria-label="Previous track"
            className="text-white/60 hover:text-white transition"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-[0.97] transition"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={onNext}
            aria-label="Next track"
            className="text-white/60 hover:text-white transition"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="flex-1 max-w-[420px]">
          <PlayerProgress
            isLive={isLive}
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
        </div>

        {/* VOLUME (HOVER REVEAL) */}
        <div
          className="relative flex items-center shrink-0"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <button
            aria-label="Volume"
            className="text-white/60 hover:text-white transition"
          >
            🔊
          </button>

          <div
            className={`
              absolute bottom-full mb-3 left-1/2 -translate-x-1/2
              px-3 py-2 rounded-xl
              bg-[#0B0D0F]/95 backdrop-blur-xl
              border border-white/10 shadow-xl
              transition-all duration-200
              ${
                showVolume
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }
            `}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-28 accent-electric cursor-pointer"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 shrink-0 border-l border-white/10 pl-4">
          <button
            onClick={onOpenVoiceMemo}
            aria-label="Open voice memo"
            className="text-white/60 hover:text-magenta transition"
          >
            <Mic size={20} />
          </button>

          <button
            onClick={onToggleQueue}
            aria-label="Open queue"
            className="text-white/60 hover:text-electric transition"
          >
            <ListMusic size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
