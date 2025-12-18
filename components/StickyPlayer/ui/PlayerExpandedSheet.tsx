"use client";

import Image from "next/image";
import { X, Play, Pause, ListMusic, Mic, Radio } from "lucide-react";
import type { Track } from "../types";
import PlayerProgress from "./PlayerProgress";

export interface PlayerExpandedSheetProps {
  currentTrack: Track | null;
  currentShow: string | null;
  isLive: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number | null;

  expanded: boolean;
  onClose: () => void;

  onPlayPause: () => void;
  onSeek: (percent: number) => void;
  onToggleQueue: () => void;
  onOpenVoiceMemo: () => void;
  onReturnToLive: () => void;

  hasLiveTrack: boolean;

  /** used for morph animation (shared artwork id) */
  artworkLayoutId?: string;
}

export default function PlayerExpandedSheet({
  currentTrack,
  currentShow,
  isLive,
  isPlaying,
  currentTime,
  duration,
  expanded,
  onClose,
  onPlayPause,
  onSeek,
  onToggleQueue,
  onOpenVoiceMemo,
  onReturnToLive,
  hasLiveTrack,
}: PlayerExpandedSheetProps) {
  if (!expanded || !currentTrack) return null;

  const subtitle = isLive && currentShow ? currentShow : currentTrack.artist;

  return (
    <div className="fixed inset-0 z-[120] md:hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close player"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 h-[92vh] rounded-t-3xl bg-[#0B0D0F]/98 backdrop-blur-xl border-t border-white/10 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2 text-white/60 text-xs">
            {isLive ? <Radio size={14} /> : null}
            <span className="truncate max-w-[70vw]">
              {isLive ? "LIVE" : "NOW PLAYING"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/5 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Artwork */}
        <div className="px-6 pt-2">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/5 shadow-2xl">
            <Image
              src={currentTrack.artwork}
              alt={currentTrack.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <div className="px-6 pt-5">
          <div className="text-white text-xl font-semibold leading-tight truncate">
            {currentTrack.title}
          </div>
          <div className="text-white/55 text-sm truncate">{subtitle}</div>
        </div>

        {/* Progress */}
        <div className="px-6 pt-5">
          <PlayerProgress
            isLive={isLive}
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
            variant="default"
          />
        </div>

        {/* Controls */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={onToggleQueue}
              className="h-12 w-12 rounded-full bg-white/5 text-white flex items-center justify-center"
              aria-label="Queue"
            >
              <ListMusic size={22} />
            </button>

            <button
              type="button"
              onClick={onPlayPause}
              className="h-16 w-16 rounded-full bg-white text-black flex items-center justify-center shadow-xl"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} />}
            </button>

            <button
              type="button"
              onClick={onOpenVoiceMemo}
              className="h-12 w-12 rounded-full bg-white/5 text-white flex items-center justify-center"
              aria-label="Voice memo"
            >
              <Mic size={22} />
            </button>
          </div>

          {!isLive && hasLiveTrack && (
            <button
              type="button"
              onClick={onReturnToLive}
              className="mt-6 w-full h-12 rounded-xl bg-white/10 text-white font-medium"
            >
              Return to Live
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
