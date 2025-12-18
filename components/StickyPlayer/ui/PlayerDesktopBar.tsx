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
  if (!currentTrack) return null;

  return (
    <div className="hidden md:block fixed bottom-0 inset-x-0 z-[90]">
      {/* Neon accent line */}
      <div className="h-[2px] bg-gradient-to-r from-electric via-magenta to-electric opacity-80" />

      <div className="flex items-center gap-6 px-6 py-4 bg-[#0B0D0F]/95 backdrop-blur-xl border-t border-white/10">
        
        {/* ARTWORK */}
        <div className="relative h-16 w-16 rounded-md overflow-hidden ring-1 ring-white/10 shadow-lg">
          <Image
            src={currentTrack.artwork}
            alt={currentTrack.title}
            fill
            className="object-cover"
          />
        </div>

        {/* NOW PLAYING */}
        <div className="flex flex-col min-w-[220px]">
          <span className="text-white font-semibold leading-tight">
            {currentTrack.title}
          </span>

          <span className="text-white/60 text-sm">
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
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-magenta text-white hover:opacity-90 transition"
          >
            Return to Live
          </button>
        )}

        {/* CONTROLS */}
        <div className="flex items-center gap-4">
          <button onClick={onPrev} className="text-white/70 hover:text-white">
            <SkipBack size={20} />
          </button>

          <button
            onClick={onPlayPause}
            className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button onClick={onNext} className="text-white/70 hover:text-white">
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

        {/* VOLUME */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-28 accent-electric"
        />

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenVoiceMemo}
            className="text-white/70 hover:text-electric"
          >
            <Mic size={20} />
          </button>

          <button
            onClick={onToggleQueue}
            className="text-white/70 hover:text-electric"
          >
            <ListMusic size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
