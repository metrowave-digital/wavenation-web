"use client";

import RecentlyPlayed from "@/components/RecentlyPlayed";

export default function RecentlyPlayedSection() {
  return (
    <section className="max-w-3xl mx-auto mt-16">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-oswald tracking-tight text-white/90">
          Recently Spun
        </h3>
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
          Latest Rotations
        </span>
      </div>

      {/* CARD */}
      <div className="
        rounded-xl 
        border border-white/10 
        bg-[#202527]/80 
        p-3 md:p-4 
        shadow-[0_8px_24px_rgba(0,0,0,0.35)]
        backdrop-blur-md
      ">
        <RecentlyPlayed />
      </div>
    </section>
  );
}
