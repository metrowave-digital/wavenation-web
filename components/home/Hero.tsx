"use client";

import NowPlaying from "@/components/NowPlaying";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto mt-10">

      <div className="relative overflow-hidden rounded-3xl border border-red-900/60 bg-gradient-to-br from-black via-[#1a0000] to-black">
        <div className="absolute -top-20 left-0 w-full h-72 bg-gradient-to-br from-wn-red/60 via-transparent to-transparent opacity-70" />

        <div className="relative px-6 md:px-10 py-12 md:py-16 flex flex-col lg:flex-row items-center lg:items-start gap-10">
          
          {/* TEXT */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-red-300 mb-3 font-inter">
              24/7 URBAN INTERNET RADIO
            </p>

            <h1 className="text-4xl md:text-6xl xl:text-7xl font-oswald tracking-tight leading-tight">
              The Sound of{" "}
              <span className="text-wn-gold drop-shadow-[0_0_18px_rgba(250,204,21,0.45)]">
                WaveNation
              </span>
            </h1>

            <p className="mt-5 text-sm md:text-base text-white/70 max-w-xl font-inter">
              Southern Soul. R&amp;B. Hip-Hop. Gospel. Afrobeats.
              Built for the culture—your soundtrack, your stories, your station.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-wide font-inter text-white/60">
              <span className="px-3 py-1 rounded-full border border-red-500/60 bg-black/40">
                Southern Soul
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/40">
                R&amp;B Slow Jams
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/40">
                Hip-Hop &amp; Trap
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-black/40">
                Gospel &amp; Inspiration
              </span>
            </div>
          </div>

          {/* NOW PLAYING */}
          <div className="flex-1 w-full max-w-md">
            <div className="rounded-2xl border border-red-500/50 bg-black/70 shadow-[0_0_40px_rgba(248,113,113,0.35)] p-5">

              <div className="flex items-center justify-between mb-4 text-xs text-white/60 font-inter">
                <span className="uppercase tracking-[0.25em] text-red-300">
                  Now Streaming
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-600/70 text-[10px] font-semibold">
                  LIVE
                </span>
              </div>

              <NowPlaying />

              <div className="mt-4 h-[2px] bg-gradient-to-r from-wn-gold via-red-500 to-wn-gold rounded-full" />

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
