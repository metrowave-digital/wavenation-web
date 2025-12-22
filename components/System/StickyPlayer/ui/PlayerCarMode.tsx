"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Radio,
} from "lucide-react";
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

  const subtitle = isLive
    ? currentShow ?? "Live Broadcast"
    : currentTrack.artist;

  return (
    <div className="fixed inset-0 z-[160] bg-black text-white">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 blur-3xl opacity-40"
        style={{
          backgroundImage: `url(${currentTrack.artwork})`,
          backgroundSize: "cover",
        }}
      />

      <div className="relative h-full max-w-[960px] mx-auto px-10 py-8 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/70 uppercase text-sm">
            {isLive && <Radio size={16} className="text-magenta" />}
            <span>{isLive ? "Live" : "Car Mode"}</span>
          </div>

          <button
            onClick={onClose}
            className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X size={26} />
          </button>
        </div>

        {/* ART + META */}
        <div className="mt-10 flex items-center gap-10">
          <div className="relative w-56 h-56 rounded-3xl overflow-hidden bg-white/5 border border-white/10">
            <Image
              src={currentTrack.artwork}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-4xl font-semibold truncate">
              {currentTrack.title}
            </h1>
            <p className="text-xl text-white/65 truncate">
              {subtitle}
            </p>

            {isLive && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
                <span className="wn-live-dot" />
                <span className="uppercase text-sm tracking-wide">
                  Live Broadcast
                </span>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mt-10">
          <PlayerProgress
            isLive={isLive}
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
        </div>

        {/* CONTROLS */}
        <div className="mt-auto pb-12 flex items-center justify-center gap-16">
          <button
            onClick={onPrev}
            className="h-24 w-24 rounded-full bg-white/10"
          >
            <SkipBack size={40} />
          </button>

          <button
            onClick={onPlayPause}
            className="h-36 w-36 rounded-full bg-white text-black shadow-2xl"
          >
            {isPlaying ? <Pause size={56} /> : <Play size={56} />}
          </button>

          <button
            onClick={onNext}
            className="h-24 w-24 rounded-full bg-white/10"
          >
            <SkipForward size={40} />
          </button>
        </div>

        <div className="text-center text-white/45 text-sm">
          Large controls • Minimal distraction • WaveNation FM
        </div>
      </div>
    </div>
  );
}
