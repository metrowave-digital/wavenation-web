"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export interface PlayerVolumeDesktopProps {
  volume: number;
  onChange: (v: number) => void;
}

export default function PlayerVolumeDesktop({
  volume,
  onChange,
}: PlayerVolumeDesktopProps) {
  const [open, setOpen] = useState(false);
  const muted = volume === 0;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* ICON */}
      <button
        className="text-white/70 hover:text-white transition"
        aria-label="Volume"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* SLIDER */}
      <div
        className={[
          "absolute bottom-full mb-3 left-1/2 -translate-x-1/2",
          "px-3 py-2 rounded-xl",
          "bg-[#0B0D0F]/95 backdrop-blur-xl border border-white/10",
          "transition-all duration-200",
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-28 accent-electric cursor-pointer"
        />
      </div>
    </div>
  );
}
