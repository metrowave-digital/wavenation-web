"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** Basic track model – replace queue seed with data from your CMS later */
type TrackType = "live" | "vod" | "podcast";

interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string; // show art ONLY
  src: string;
  type: TrackType;
  isLive?: boolean;
  duration?: number; // seconds (optional, will be filled from metadata if missing)
}

export default function WaveNationPlayer() {
  // 🔁 Initial queue: first item is LIVE radio, rest are on-demand examples
  const [queue, setQueue] = useState<Track[]>([
    {
      id: "live-radio",
      title: "WaveNation FM – Live Stream",
      artist: "Streaming 24/7",
      artwork: "/images/wavenation-show-art-live.jpg", // fallback
      src: "https://streaming.live365.com/a49099",
      type: "live",
      isLive: true,
    },
    {
      id: "episode-1",
      title: "Lookout Weekend – Pop Culture Rundown",
      artist: "Karesse O’Mor",
      artwork: "/images/show-lookout-weekend.jpg",
      src: "https://example.com/audio/episode1.mp3",
      type: "podcast",
    },
    {
      id: "episode-2",
      title: "Southern Soul Saturdays – Hour 1",
      artist: "WaveNation DJ",
      artwork: "/images/show-southern-soul.jpg",
      src: "https://example.com/audio/episode2.mp3",
      type: "vod",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = useMemo(
    () => queue[currentIndex],
    [queue, currentIndex]
  );

  const isLive = currentTrack?.type === "live" || currentTrack?.isLive;

  /* 🌐 Fetch LIVE metadata & show art – updates FIRST track in queue */
  useEffect(() => {
    const loadLiveMeta = async () => {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        const data = await res.json();

        setQueue((prev) => {
          if (!prev.length) return prev;
          const [first, ...rest] = prev;
          if (first.type !== "live") return prev;

          return [
            {
              ...first,
              title: data?.nowPlaying?.title ?? first.title,
              artist: data?.nowPlaying?.artist ?? first.artist,
              artwork: data?.nowPlaying?.showArt ?? first.artwork, // SHOW ART ONLY
            },
            ...rest,
          ];
        });
      } catch (err) {
        console.error("Now Playing Error:", err);
      }
    };

    loadLiveMeta();
    const interval = setInterval(loadLiveMeta, 15000);
    return () => clearInterval(interval);
  }, []);

  /* ▶️ Attempt autoplay on mount for live */
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.volume = volume;

    if (isLive) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* 🎛 Keep volume in sync */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* 🔁 On track change – load & optionally autoplay */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    setCurrentTime(0);
    setDuration(null);
    audio.currentTime = 0;

    // Autoplay live OR continue autoplay if user already had something playing
    const shouldAutoplay = isLive || isPlaying;

    if (shouldAutoplay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ⏱️ Time + duration tracking */
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || isLive) return; // no progress bar for live
    setCurrentTime(audio.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio || isLive) return;
    const d = audio.duration;
    if (!Number.isNaN(d)) {
      setDuration(d);
      // Persist duration into queue for later
      setQueue((prev) =>
        prev.map((t, idx) =>
          idx === currentIndex && !t.duration ? { ...t, duration: d } : t
        )
      );
    }
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || isLive || duration == null) return;
    const newTime = (value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleEnded = () => {
    // On-demand: go to next if possible
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else if (isLive) {
      // Live: just keep playing
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playTrackAtIndex = (index: number) => {
    if (index < 0 || index >= queue.length) return;
    setCurrentIndex(index);
    setShowQueue(false);
    setExpandedMobile(true);
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const formatTime = (secs: number | null | undefined) => {
    if (secs == null || Number.isNaN(secs)) return "0:00";
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const r = s % 60;
    const rs = r < 10 ? `0${r}` : r.toString();
    return `${m}:${rs}`;
  };

  const progressPercent =
    !isLive && duration ? (currentTime / duration) * 100 : 0;

  /* ========== SHARED UI PARTS ========== */

  const ProgressBar = ({
    compact = false,
  }: {
    compact?: boolean;
  }) => {
    if (isLive) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-wn-red/80">
            Live
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-wn-red"
              animate={{ x: ["-5%", "5%", "-5%"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-[11px] text-white/70">
        {!compact && (
          <span className="w-10 text-right">
            {formatTime(currentTime ?? 0)}
          </span>
        )}
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progressPercent || 0}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="flex-1 accent-wn-gold cursor-pointer"
        />
        {!compact && (
          <span className="w-10">
            {formatTime(duration ?? currentTrack?.duration)}
          </span>
        )}
      </div>
    );
  };

  const VolumeControl = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      {volume === 0 ? (
        <VolumeX size={18} className="text-white/70" />
      ) : (
        <Volume2 size={18} className="text-white/70" />
      )}
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-24 sm:w-32 accent-wn-gold cursor-pointer"
      />
    </div>
  );

  const QueuePanel = () => (
    <AnimatePresence>
      {showQueue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="
            absolute bottom-full mb-3 right-0
            w-72 max-h-80
            rounded-2xl bg-black/90
            border border-white/10
            shadow-[0_15px_45px_rgba(0,0,0,0.75)]
            overflow-hidden
            text-white
          "
        >
          <div className="px-3 py-2 border-b border-white/10 text-xs uppercase tracking-[0.2em] text-white/60">
            Up Next
          </div>
          <div className="max-h-72 overflow-y-auto">
            {queue.map((track, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => playTrackAtIndex(idx)}
                  className={`
                    w-full text-left px-3 py-2 flex items-center gap-2
                    hover:bg-white/5
                    ${active ? "bg-white/10" : ""}
                  `}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    {track.artwork ? (
                      <img
                        src={track.artwork}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {track.title}
                    </p>
                    <p className="text-[11px] text-white/60 truncate">
                      {track.artist}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase text-white/40">
                    {track.type === "live"
                      ? "LIVE"
                      : track.type === "podcast"
                      ? "Podcast"
                      : "On-Demand"}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ========== DESKTOP LAYOUT (>= md) ========== */

  const DesktopBar = () => (
    <div className="hidden md:flex fixed bottom-0 left-0 right-0 z-40">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="
          relative
          mx-auto max-w-6xl w-full
          rounded-t-3xl
          bg-black/45 backdrop-blur-2xl
          border border-white/10
          shadow-[0_-12px_45px_rgba(0,0,0,0.7)]
          px-4 py-3
          flex items-center gap-4
        "
      >
        {/* Glass gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-20 -left-10 w-64 h-64 bg-wn-red/40 blur-3xl opacity-40" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-wn-gold/30 blur-3xl opacity-40" />
        </div>

        {/* Artwork */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0">
          {currentTrack?.artwork ? (
            <img
              src={currentTrack.artwork}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/40 text-[10px]">
              Show Art
            </div>
          )}
        </div>

        {/* Metadata + Progress */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {isLive && (
                <>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-wn-red/80">
                    Live
                  </span>
                  <motion.span
                    className="w-2 h-2 rounded-full bg-wn-red"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                </>
              )}
              {!isLive && (
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                  {currentTrack?.type === "podcast" ? "Podcast" : "On-Demand"}
                </span>
              )}
            </div>

            {/* Queue toggle */}
            <div className="relative">
              <button
                onClick={() => setShowQueue((v) => !v)}
                className="
                  flex items-center gap-1 px-2 py-1
                  rounded-full bg-white/5 hover:bg-white/15
                  border border-white/10 text-[11px] text-white/80
                "
              >
                <ListMusic size={14} />
                Queue
              </button>
              <QueuePanel />
            </div>
          </div>

          <p className="text-sm text-white font-medium truncate">
            {currentTrack?.title}
          </p>
          <p className="text-xs text-white/70 truncate">
            {currentTrack?.artist}
          </p>

          <div className="mt-2">
            <ProgressBar />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-end gap-2 pl-2">
          <div className="flex items-center gap-2">
            <button
              onClick={playPrev}
              disabled={currentIndex === 0}
              className="
                w-9 h-9 flex items-center justify-center
                rounded-xl bg-white/5 hover:bg-white/15
                border border-white/10
                disabled:opacity-30 disabled:hover:bg-white/5
              "
            >
              <SkipBack size={16} className="text-white" />
            </button>

            <button
              onClick={togglePlayPause}
              className="
                w-10 h-10 flex items-center justify-center
                rounded-2xl bg-white/15 hover:bg-white/25
                border border-white/10
              "
            >
              {isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white ml-[2px]" />
              )}
            </button>

            <button
              onClick={playNext}
              disabled={currentIndex >= queue.length - 1}
              className="
                w-9 h-9 flex items-center justify-center
                rounded-xl bg-white/5 hover:bg-white/15
                border border-white/10
                disabled:opacity-30 disabled:hover:bg-white/5
              "
            >
              <SkipForward size={16} className="text-white" />
            </button>
          </div>

          <VolumeControl />
        </div>
      </motion.div>
    </div>
  );

  /* ========== MOBILE LAYOUT (<= md) ========== */

  const MobilePlayer = () => (
    <div className="md:hidden fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded panel */}
      <AnimatePresence>
        {expandedMobile && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 130 }}
            className="
              mb-3 w-[92vw]
              rounded-3xl bg-black/45 backdrop-blur-2xl
              border border-white/10
              shadow-[0_10px_40px_rgba(0,0,0,0.7)]
              px-4 py-4
              text-white relative overflow-hidden
            "
          >
            {/* Glass gradients */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute -top-16 -left-10 w-40 h-40 bg-wn-red/40 blur-2xl opacity-40" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-wn-gold/30 blur-3xl opacity-45" />
            </div>

            {/* Header / Queue toggle */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                {isLive ? "Live Radio" : "On-Demand"}
              </span>
              <button
                onClick={() => setShowQueue((v) => !v)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[11px]"
              >
                <ListMusic size={14} />
                Queue
              </button>
            </div>

            {/* Queue inside panel on mobile */}
            <div className="relative mb-3">
              <QueuePanel />
            </div>

            {/* Artwork + meta */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0">
                {currentTrack?.artwork ? (
                  <img
                    src={currentTrack.artwork}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/40 text-[10px]">
                    Show Art
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {currentTrack?.title}
                </p>
                <p className="text-xs text-white/70 truncate">
                  {currentTrack?.artist}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <ProgressBar compact />
            </div>

            {/* Controls */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={playPrev}
                  disabled={currentIndex === 0}
                  className="
                    w-9 h-9 flex items-center justify-center
                    rounded-xl bg-white/5 hover:bg-white/15
                    border border-white/10
                    disabled:opacity-30 disabled:hover:bg-white/5
                  "
                >
                  <SkipBack size={16} className="text-white" />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="
                    w-12 h-12 flex items-center justify-center
                    rounded-2xl bg-white/15 hover:bg-white/25
                    border border-white/10
                  "
                >
                  {isPlaying ? (
                    <Pause size={22} className="text-white" />
                  ) : (
                    <Play size={22} className="text-white ml-[2px]" />
                  )}
                </button>

                <button
                  onClick={playNext}
                  disabled={currentIndex >= queue.length - 1}
                  className="
                    w-9 h-9 flex items-center justify-center
                    rounded-xl bg-white/5 hover:bg-white/15
                    border border-white/10
                    disabled:opacity-30 disabled:hover:bg-white/5
                  "
                >
                  <SkipForward size={16} className="text-white" />
                </button>
              </div>

              <VolumeControl />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setExpandedMobile((v) => !v)}
        className="
          relative
          w-16 h-16 rounded-full
          bg-black/40 backdrop-blur-xl
          border border-white/10
          shadow-[0_10px_35px_rgba(0,0,0,0.7)]
          flex items-center justify-center
          overflow-hidden
        "
      >
        {currentTrack?.artwork && (
          <img
            src={currentTrack.artwork}
            alt={currentTrack.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-black/45" />

        <motion.div
          className="relative z-10"
          animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={
            isPlaying ? { repeat: Infinity, duration: 1.3 } : { duration: 0.2 }
          }
        >
          {isPlaying ? (
            <Pause className="text-white w-6 h-6" />
          ) : (
            <Play className="text-white w-6 h-6 ml-[2px]" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack?.src}
        autoPlay={isLive}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />
      <DesktopBar />
      <MobilePlayer />
    </>
  );
}
