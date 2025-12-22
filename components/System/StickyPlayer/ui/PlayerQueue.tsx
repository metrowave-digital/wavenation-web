"use client";

import Image from "next/image";
import { X, Play, Radio, Music2 } from "lucide-react";
import type { Track } from "../types";

export interface PlayerQueueProps {
  open: boolean;
  queue: Track[];
  currentIndex: number;
  onSelectTrack: (i: number) => void;
  onClose: () => void;
}

export default function PlayerQueue({
  open,
  queue,
  currentIndex,
  onSelectTrack,
  onClose,
}: PlayerQueueProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm">
      {/* PANEL */}
      <div className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-[#0B0D0F] border-l border-white/10 flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div>
            <p className="text-sm font-semibold">Up Next</p>
            <p className="text-xs text-white/60">
              {queue.length} item{queue.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/15 transition flex items-center justify-center"
            aria-label="Close queue"
          >
            <X size={18} />
          </button>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {queue.map((track, i) => {
            const isActive = i === currentIndex;
            const isLive = track.isLive === true || track.type === "live";
            const isPreview = track.type === "spotify-preview";

            return (
              <button
                key={track.id}
                onClick={() => onSelectTrack(i)}
                className={[
                  "w-full flex items-center gap-3 p-3 rounded-xl transition text-left",
                  isActive
                    ? "bg-white/10 ring-1 ring-white/10"
                    : "hover:bg-white/5",
                ].join(" ")}
              >
                {/* ART */}
                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-white/5 shrink-0">
                  <Image
                    src={track.artwork ?? "/placeholder-cover.jpg"}
                    alt={track.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* META */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {track.title}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {isLive ? track.showName ?? "Live Broadcast" : track.artist}
                  </p>

                  {/* MODE BADGE */}
                  {isLive && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-magenta">
                      <Radio size={10} />
                      Live
                    </span>
                  )}

                  {isPreview && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-wn-gold">
                      <Music2 size={10} />
                      Preview
                    </span>
                  )}
                </div>

                {/* ACTIVE INDICATOR */}
                {isActive && (
                  <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                    <Play size={14} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 border-t border-white/10 text-center text-xs text-white/40">
          Tap a track to play • Swipe to dismiss
        </div>
      </div>
    </div>
  );
}
