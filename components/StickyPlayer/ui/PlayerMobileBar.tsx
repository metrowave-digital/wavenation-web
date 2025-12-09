"use client";

import { Play, Pause, ListMusic, Mic, ChevronUp } from "lucide-react";
import PlayerProgress from "./PlayerProgress";
import type { Track } from "../types";
import Image from "next/image";

export interface PlayerMobileBarProps {
  currentTrack: Track | null;
  currentShow: string | null;
  isLive: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number | null;

  onPlayPause: () => void;
  onSeek: (percent: number) => void;
  onToggleQueue: () => void;
  onReturnToLive: () => void;
  onOpenVoiceMemo: () => void;

  hasLiveTrack: boolean;

  expanded: boolean;
  setExpanded: (v: boolean) => void;
}

export default function PlayerMobileBar({
  currentTrack,
  currentShow,
  isLive,
  isPlaying,
  currentTime,
  duration,

  onPlayPause,
  onSeek,
  onToggleQueue,
  onReturnToLive,
  onOpenVoiceMemo,

  hasLiveTrack,

  expanded,
  setExpanded,
}: PlayerMobileBarProps) {
  if (!currentTrack) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-[95] bg-[#050509]/95 backdrop-blur border-t border-white/10">

      {/* EXPANDED HEADER */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center py-1 text-white/60"
      >
        <ChevronUp size={20} />
      </button>

      {/* MAIN ROW */}
      <div className="flex items-center gap-3 px-4 py-2">
        {/* ARTWORK */}
        <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
          <Image
            src={currentTrack.artwork}
            alt={currentTrack.title}
            fill
            className="object-cover"
          />
        </div>

        {/* TITLES */}
        <div className="flex flex-col flex-1 leading-tight">
          <span className="font-semibold text-white text-sm">
            {currentTrack.title}
          </span>
          <span className="text-white/60 text-xs">
            {isLive && currentShow ? currentShow : currentTrack.artist}
          </span>
        </div>

        {/* PLAY/PAUSE */}
        <button
          type="button"
          onClick={onPlayPause}
          className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center"
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>

        {/* QUEUE */}
        <button
          type="button"
          onClick={onToggleQueue}
          className="text-white/80 hover:text-electric"
        >
          <ListMusic size={22} />
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="px-4 pb-2">
        <PlayerProgress
          isLive={isLive}
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
        />
      </div>

      {/* RETURN TO LIVE */}
      {!isLive && hasLiveTrack && (
        <button
          type="button"
          onClick={onReturnToLive}
          className="text-xs px-3 py-1 text-black bg-electric rounded mx-4 mb-2"
        >
          Return to Live
        </button>
      )}
    </div>
  );
}
