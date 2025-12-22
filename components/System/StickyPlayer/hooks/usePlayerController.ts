"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "../types";

/* ==================================================
   TYPES
================================================== */

export interface UsePlayerControllerResult {
  queue: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  currentShow: string | null;

  isLive: boolean;
  isPlaying: boolean;
  volume: number;

  currentTime: number;
  duration: number | null;

  expandedMobile: boolean;
  queueOpen: boolean; // ✅ FIXED

  registerAudioEl: (el: HTMLAudioElement | null) => void;

  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  playTrackAt: (index: number) => void;

  seek: (percent: number) => void;
  jumpToLive: () => void;

  toggleQueue: () => void;
  setExpandedMobile: (v: boolean) => void;
  setVolume: (v: number) => void;

  handleTimeUpdate: () => void;
  handleLoadedMetadata: () => void;
  handleEnded: () => void;
}

/* ==================================================
   CONSTANTS
================================================== */

const LIVE_ID = "live";
const LIVE_SRC = "https://streaming.live365.com/a49099";

/* ==================================================
   HELPERS
================================================== */

function isLiveTrack(track: Track | null): boolean {
  return Boolean(
    track &&
      (track.id === LIVE_ID ||
        track.type === "live" ||
        track.isLive === true)
  );
}

function freshLiveSrc() {
  const url = new URL(LIVE_SRC);
  url.searchParams.set("t", Date.now().toString());
  return url.toString();
}

/* ==================================================
   HOOK
================================================== */

export function usePlayerController(): UsePlayerControllerResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ---------------------------------
     INTENT / SAFETY FLAGS
  ---------------------------------- */

  const userInitiatedRef = useRef(false);
  const userPausedRef = useRef(false);
  const blockedRestartRef = useRef(false);
  const autoPlayAttemptedRef = useRef(false);

  /* ---------------------------------
     STATE
  ---------------------------------- */

  const [queue] = useState<Track[]>([
    {
      id: LIVE_ID,
      title: "WaveNation FM — Live",
      artist: "24/7 Streaming",
      artwork: "/images/wavenation-show-art-live.jpg",
      src: LIVE_SRC,
      type: "live",
      isLive: true,
      showName: "WaveNation FM",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.9);
  const [expandedMobile, setExpandedMobile] = useState(false);

  const [queueOpen, setQueueOpen] = useState(false); // ✅ FIXED

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  /* ---------------------------------
     DERIVED
  ---------------------------------- */

  const currentTrack = useMemo(
    () => queue[currentIndex] ?? null,
    [queue, currentIndex]
  );

  const isLive = isLiveTrack(currentTrack);
  const currentShow = currentTrack?.showName ?? null;

  /* ---------------------------------
     AUDIO REGISTRATION
  ---------------------------------- */

  const registerAudioEl = useCallback(
    (el: HTMLAudioElement | null) => {
      audioRef.current = el;
      if (!el) return;

      el.volume = volume;
      el.preload = "none";
    },
    [volume]
  );

  /* ---------------------------------
     VOLUME
  ---------------------------------- */

  const setVolume = useCallback((v: number) => {
    const next = Math.max(0, Math.min(1, v));
    setVolumeState(next);
    if (audioRef.current) audioRef.current.volume = next;
  }, []);

  /* ---------------------------------
     QUEUE
  ---------------------------------- */

  const toggleQueue = useCallback(() => {
    setQueueOpen((v) => !v);
  }, []);

  /* ---------------------------------
     LOAD TRACK
  ---------------------------------- */

  const loadTrack = useCallback((track: Track | null) => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    setCurrentTime(0);
    setDuration(null);

    if (isLiveTrack(track)) {
      audio.src = freshLiveSrc();
      audio.load();
      return;
    }

    if (audio.src !== track.src) {
      audio.src = track.src;
      audio.load();
    }
  }, []);

  /* ---------------------------------
     PLAY / PAUSE CORE
  ---------------------------------- */

  const playInternal = useCallback(
    async (reason: "user" | "autoplay") => {
      const audio = audioRef.current;
      if (!audio || !currentTrack) return;

      if (blockedRestartRef.current && reason !== "user") return;
      if (userPausedRef.current && reason !== "user") return;

      if (isLive) loadTrack(currentTrack);

      try {
        await audio.play();
        setIsPlaying(true);
        blockedRestartRef.current = false;
      } catch {
        setIsPlaying(false);
      }
    },
    [currentTrack, isLive, loadTrack]
  );

  const pauseInternal = useCallback((user: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);

    if (user) {
      userPausedRef.current = true;
      blockedRestartRef.current = true;
    }
  }, []);

  /* ---------------------------------
     AUTOPLAY (LIVE ONLY, ONCE)
  ---------------------------------- */

  useEffect(() => {
    if (!currentTrack || !isLive) return;
    if (autoPlayAttemptedRef.current) return;
    if (!audioRef.current) return;

    autoPlayAttemptedRef.current = true;

    queueMicrotask(() => {
      loadTrack(currentTrack);
      void playInternal("autoplay");
    });
  }, [currentTrack, isLive, loadTrack, playInternal]);

  /* ---------------------------------
     CONTROLS
  ---------------------------------- */

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    userInitiatedRef.current = true;

    if (audio.paused) {
      userPausedRef.current = false;
      blockedRestartRef.current = false;

      if (isLive) loadTrack(currentTrack);
      void playInternal("user");
    } else {
      pauseInternal(true);
    }
  }, [currentTrack, isLive, loadTrack, pauseInternal, playInternal]);

  const playNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1 < queue.length ? i + 1 : 0));
    userPausedRef.current = false;
    blockedRestartRef.current = false;
  }, [queue.length]);

  const playPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : 0));
    userPausedRef.current = false;
    blockedRestartRef.current = false;
  }, []);

  const playTrackAt = useCallback(
    (index: number) => {
      if (index < 0 || index >= queue.length) return;

      setCurrentIndex(index);
      setExpandedMobile(true);

      userInitiatedRef.current = true;
      userPausedRef.current = false;
      blockedRestartRef.current = false;

      queueMicrotask(() => {
        loadTrack(queue[index]);
        void playInternal("user");
      });
    },
    [queue, loadTrack, playInternal]
  );

  const seek = useCallback(
    (percent: number) => {
      const audio = audioRef.current;
      if (!audio || isLive || duration == null) return;

      const p = Math.max(0, Math.min(100, percent));
      const next = (p / 100) * duration;

      audio.currentTime = next;
      setCurrentTime(next);
    },
    [duration, isLive]
  );

  const jumpToLive = useCallback(() => {
    setCurrentIndex(0);
    setExpandedMobile(false);

    loadTrack(queue[0]);

    if (userInitiatedRef.current) {
      blockedRestartRef.current = false;
      userPausedRef.current = false;
      void playInternal("user");
    }
  }, [queue, loadTrack, playInternal]);

  /* ---------------------------------
     AUDIO EVENTS
  ---------------------------------- */

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isLive) return;
    setCurrentTime(audio.currentTime || 0);
  }, [isLive]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isLive) return;
    if (!Number.isNaN(audio.duration)) setDuration(audio.duration);
  }, [isLive]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    blockedRestartRef.current = true;
    userPausedRef.current = true;
  }, []);

  /* ---------------------------------
     AUDIO ERROR SAFETY
  ---------------------------------- */

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onError = () => {
      setIsPlaying(false);
      blockedRestartRef.current = true;
      userPausedRef.current = true;
      try {
        audio.pause();
      } catch {}
    };

    audio.addEventListener("error", onError);
    return () => audio.removeEventListener("error", onError);
  }, []);

  /* ---------------------------------
     RETURN API
  ---------------------------------- */

  return {
    queue,
    currentIndex,
    currentTrack,
    currentShow,
    isLive,
    isPlaying,
    volume,
    currentTime,
    duration,
    expandedMobile,
    queueOpen, // ✅ NOW REAL
    registerAudioEl,

    togglePlayPause,
    playNext,
    playPrev,
    playTrackAt,
    seek,
    jumpToLive,
    toggleQueue,
    setExpandedMobile,
    setVolume,

    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  };
}
