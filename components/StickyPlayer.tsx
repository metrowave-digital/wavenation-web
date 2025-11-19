"use client";

import { useEffect, useState, useRef } from "react";

export default function StickyPlayer() {
  const [nowPlaying, setNowPlaying] = useState({
    title: "",
    artist: "",
    artwork: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        const data = await res.json();
        setNowPlaying({
          title: data?.nowPlaying?.title ?? "",
          artist: data?.nowPlaying?.artist ?? "",
          artwork: data?.nowPlaying?.artwork ?? "",
        });
      } catch (err) {
        console.error("Now Playing Error:", err);
      }
    };

    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 AUTOPLAY WHEN COMPONENT MOUNTS
  useEffect(() => {
    if (audioRef.current) {
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
        } catch (err) {
          console.warn("Autoplay blocked by browser:", err);
        }
      };
      playAudio();
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-4xl px-4 pb-4">

        <div
          className="
            rounded-2xl 
            backdrop-blur-2xl 
            bg-white/5 
            border border-white/10 
            shadow-[0_12px_45px_rgba(0,0,0,0.55)] 
            px-4 py-4 
            flex items-center gap-4
            relative
            overflow-hidden
          "
        >
          {/* 🎛 GRADIENT OVERLAYS FOR GLASS EFFECT */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-10 w-64 h-64 bg-wn-red/30 blur-3xl opacity-60" />
            <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-wn-gold/25 blur-2xl opacity-70" />
          </div>

          {/* 🎵 ARTWORK */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black/40 z-10 flex-shrink-0">
            {nowPlaying.artwork ? (
              <img
                src={nowPlaying.artwork}
                alt="Track artwork"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white/30 text-[10px]">
                No Art
              </div>
            )}
          </div>

          {/* 🎙 METADATA */}
          <div className="flex-1 overflow-hidden z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-wn-red/80">
                Live
              </span>

              {/* 🔴 PULSE ANIMATION */}
              <span className="w-2 h-2 rounded-full bg-wn-red animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-wn-red"></span>
            </div>

            <p className="text-sm text-white/95 font-inter truncate mt-0.5">
              {nowPlaying.title || "WaveNation FM – Live Stream"}
            </p>

            <p className="text-xs text-white/60 truncate font-inter">
              {nowPlaying.artist || "Streaming 24/7"}
            </p>
          </div>

          {/* 🔊 AUDIO PLAYER */}
          <audio
            ref={audioRef}
            controls
            autoPlay
            className="
              w-44 sm:w-56 
              accent-wn-gold 
              bg-transparent
              z-10
              [&::-webkit-media-controls-panel]:bg-transparent
              [&::-webkit-media-controls-play-button]:invert
              [&::-webkit-media-controls-current-time-display]:text-white
              [&::-webkit-media-controls-time-remaining-display]:text-white
            "
            src="https://streaming.live365.com/a49099"
          />
        </div>
      </div>
    </div>
  );
}
