"use client";

import { Volume2, VolumeX } from "lucide-react";

export interface PlayerVolumeProps {
  volume: number;
  onChange: (v: number) => void;
  className?: string;
}

export default function PlayerVolume({
  volume,
  onChange,
  className = "",
}: PlayerVolumeProps) {
  const muted = volume === 0;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {muted ? (
        <VolumeX size={16} className="text-white/70" />
      ) : (
        <Volume2 size={16} className="text-white/70" />
      )}
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 sm:w-24 accent-wn-gold cursor-pointer h-[3px]"
      />
    </div>
  );
}
