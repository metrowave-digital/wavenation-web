"use client";

import type { Track } from "../types";
import Image from "next/image";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-80 bg-[#0a0a0c] h-full border-l border-white/10 p-4 overflow-y-auto">
        
        <button
          onClick={onClose}
          className="text-white/70 hover:text-electric mb-4"
        >
          <X size={22} />
        </button>

        <div className="space-y-3">
          {queue.map((track, i) => (
            <button
              key={track.id}
              onClick={() => onSelectTrack(i)}
              className={`flex items-center gap-3 w-full text-left p-2 rounded ${
                i === currentIndex ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <div className="relative h-12 w-12 rounded overflow-hidden">
                <Image
                  src={track.artwork}
                  alt={track.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">
                  {track.title}
                </span>
                <span className="text-white/60 text-xs">{track.artist}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
