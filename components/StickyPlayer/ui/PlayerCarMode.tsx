"use client";

import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, X, Radio } from "lucide-react";
import type { Track } from "../types";
import PlayerProgress from "./PlayerProgress";

export interface PlayerCarModeProps {
  enabled: boolean;
  onClose: () => void;

  currentTrack: Track | null;
  currentShow: string | null;
  isLive: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number | null;

  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (percent: number) => void;
}

export default function PlayerCarMode({
  enabled,
  onClose,
  currentTrack,
  currentShow,
  isLive,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrev,
  onSeek,
}: PlayerCarModeProps) {
  if (!enabled || !currentTrack) return null;

  const subtitle = isLive && currentShow ? currentShow : currentTrack.artist;

  return (
    <div className="fixed inset-0 z-[140] bg-black text-white">
      <div className="h-full max-w-[820px] mx-auto px-6 py-6 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/70">
            {isLive ? <Radio size={18} /> : null}
            <span className="text-sm">{isLive ? "LIVE" : "CAR MODE"}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="Exit car mode"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-[160px,1fr] gap-6 items-center">
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden bg-white/5">
            <Image src={currentTrack.artwork} alt={currentTrack.title} fill className="object-cover" />
          </div>

          <div className="min-w-0">
            <div className="text-3xl font-semibold truncate">{currentTrack.title}</div>
            <div className="text-white/65 text-lg truncate">{subtitle}</div>
          </div>
        </div>

        <div className="mt-8">
          <PlayerProgress
            isLive={isLive}
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
            variant="default"
          />
        </div>

        <div className="mt-10 flex items-center justify-center gap-10">
          <button
            type="button"
            onClick={onPrev}
            className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="Previous"
          >
            <SkipBack size={34} />
          </button>

          <button
            type="button"
            onClick={onPlayPause}
            className="h-28 w-28 rounded-full bg-white text-black flex items-center justify-center"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={44} /> : <Play size={44} />}
          </button>

          <button
            type="button"
            onClick={onNext}
            className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center"
            aria-label="Next"
          >
            <SkipForward size={34} />
          </button>
        </div>

        <div className="mt-auto pt-8 text-center text-white/45 text-sm">
          Big buttons • minimal distraction • optimized for driving
        </div>
      </div>
    </div>
  );
}
