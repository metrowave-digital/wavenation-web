"use client";

import { Play, Pause, SkipBack, SkipForward, Mic, ListMusic } from "lucide-react";
import PlayerProgress from "./PlayerProgress";
import Image from "next/image";
import type { Track } from "../types";

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
    <div className="hidden md:flex w-full fixed bottom-0 left-0 z-[90] bg-[#050509]/95 backdrop-blur border-t border-white/10 px-4 py-3 items-center gap-4">
      
      {/* ARTWORK */}
      <div className="relative h-14 w-14 rounded overflow-hidden flex-shrink-0">
        <Image
          src={currentTrack.artwork}
          alt={currentTrack.title}
          fill
          className="object-cover"
        />
      </div>

      {/* TITLES */}
      <div className="flex flex-col leading-tight flex-1">
        <span className="text-white font-semibold">{currentTrack.title}</span>
        <span className="text-white/60 text-sm">
          {isLive && currentShow ? currentShow : currentTrack.artist}
        </span>
      </div>

      {/* LIVE RETURN BUTTON */}
      {!isLive && hasLiveTrack && (
        <button
          onClick={onReturnToLive}
          className="px-3 py-1.5 text-xs bg-electric text-black rounded shadow"
        >
          Return to Live
        </button>
      )}

      {/* CONTROLS */}
      <div className="flex items-center gap-4">
        <button onClick={onPrev} className="text-white/80 hover:text-white">
          <SkipBack size={20} />
        </button>

        <button
          onClick={onPlayPause}
          className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center"
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>

        <button onClick={onNext} className="text-white/80 hover:text-white">
          <SkipForward size={20} />
        </button>
      </div>

      {/* PROGRESS */}
      <div className="w-[25%] px-4">
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
        className="w-24 accent-electric"
      />

      {/* VOICE MEMO */}
      <button
        onClick={onOpenVoiceMemo}
        className="text-white/80 hover:text-electric"
      >
        <Mic size={20} />
      </button>

      {/* QUEUE */}
      <button
        onClick={onToggleQueue}
        className="text-white/80 hover:text-electric"
      >
        <ListMusic size={22} />
      </button>
    </div>
  );
}
