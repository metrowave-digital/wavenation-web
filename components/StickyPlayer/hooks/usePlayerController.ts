"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Track, TrackType } from "../types";

export interface UsePlayerControllerResult {
  queue: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  isLive: boolean;
  currentShow: string | null;
  volume: number;
  currentTime: number;
  duration: number | null;
  isQueueOpen: boolean;
  expandedMobile: boolean;
  hasLiveTrack: boolean;

  registerAudioEl: (el: HTMLAudioElement | null) => void;

  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (percent: number) => void;
  setVolume: (v: number) => void;
  jumpToLive: () => void;
  playTrackAtIndex: (index: number) => void;
  toggleQueue: () => void;
  setExpandedMobile: (value: boolean) => void;
  openVoiceMemo: () => void;

  handleTimeUpdate: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
  handleLoadedMetadata: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
  handleEnded: () => void;
}

export function usePlayerController(): UsePlayerControllerResult {
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  const [queue, setQueue] = useState<Track[]>([
    {
      id: "live-radio",
      title: "WaveNation FM – Live Stream",
      artist: "Streaming 24/7",
      artwork: "/images/wavenation-show-art-live.jpg",
      src: "https://streaming.live365.com/a49099",
      type: "live",
      isLive: true,
      showName: "WaveNation Live",
    },
    {
      id: "lookout-1",
      title: "Lookout Weekend – Pop Culture Rundown",
      artist: "Karesse O’Mor",
      artwork: "/images/show-lookout-weekend.jpg",
      src: "https://example.com/audio/episode1.mp3",
      type: "podcast",
    },
    {
      id: "southern-soul-1",
      title: "Southern Soul Saturdays – Hour 1",
      artist: "WaveNation DJ",
      artwork: "/images/show-southern-soul.jpg",
      src: "https://example.com/audio/episode2.mp3",
      type: "vod",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.9);

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState(false);
  const [currentShow, setCurrentShow] = useState<string | null>(null);

  const currentTrack = useMemo(
    () => queue[currentIndex] ?? null,
    [queue, currentIndex]
  );

  const isLive = currentTrack?.type === "live" || currentTrack?.isLive === true;

  const hasLiveTrack = useMemo(
    () => queue.some((t) => t.type === "live" || t.isLive),
    [queue]
  );

  /* NOW PLAYING LIVE POLL */
  useEffect(() => {
    let mounted = true;
    const loadLive = async () => {
      try {
        const r = await fetch("/api/now-playing", { cache: "no-store" });
        const json = await r.json();
        if (!mounted || !json.nowPlaying) return;

        const np = json.nowPlaying;

        setQueue((prev) => {
          const first = prev[0];
          if (!first || first.type !== "live") return prev;

          return [
            {
              ...first,
              title: np.title ?? first.title,
              artist: np.artist ?? first.artist,
              artwork: np.cover ?? first.artwork,
              showName: np.showName ?? first.showName,
            },
            ...prev.slice(1),
          ];
        });

        setCurrentShow(np.showName ?? null);
      } catch {
        /* silent */
      }
    };

    loadLive();
    const id = setInterval(loadLive, 15000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  /* SYNC VOLUME */
  useEffect(() => {
    if (audioEl) audioEl.volume = volume;
  }, [audioEl, volume]);

  /* AUTOPLAY LIVE (ONCE) */
  useEffect(() => {
    if (!audioEl || !currentTrack) return;
    if (!isLive) return;

    audioEl.play().then(() => setIsPlaying(true)).catch(() => {});

  }, [audioEl, currentTrack?.id, isLive]);

  /* TRACK CHANGE */
  useEffect(() => {
    if (!audioEl || !currentTrack) return;

    audioEl.currentTime = 0;
    setCurrentTime(0);
    setDuration(null);

    const shouldPlay = currentTrack.type === "live" || isPlaying;

    if (shouldPlay) {
      audioEl.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audioEl.pause();
      setIsPlaying(false);
    }
  }, [currentTrack?.id]);

  /* HANDLERS */
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (isLive) return;
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (isLive) return;
    const d = e.currentTarget.duration;
    if (!Number.isNaN(d)) {
      setDuration(d);
    }
  };

  const handleEnded = () => {
    if (!isLive && hasLiveTrack) {
      jumpToLive();
    } else {
      setIsPlaying(false);
    }
  };

  /* CONTROLS */
  const togglePlayPause = () => {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play().then(() => setIsPlaying(true));
    } else {
      audioEl.pause();
      setIsPlaying(false);
    }
  };

  const playNext = () =>
    setCurrentIndex((i) => (i < queue.length - 1 ? i + 1 : i));

  const playPrev = () =>
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));

  const seek = (percent: number) => {
    if (!audioEl || isLive || duration == null) return;
    const newTime = (percent / 100) * duration;
    audioEl.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const playTrackAtIndex = (index: number) => {
    if (index < 0 || index >= queue.length) return;
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const jumpToLive = () => {
    const idx = queue.findIndex((t) => t.type === "live" || t.isLive);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setIsPlaying(true);
      setExpandedMobile(true);
    }
  };

  const toggleQueue = () => setIsQueueOpen((x) => !x);
  const openVoiceMemo = () =>
    window.open("mailto:voice@wavenation.media?subject=Voice Memo", "_blank");

  const registerAudioEl = useCallback((el: HTMLAudioElement | null) => {
    setAudioEl(el);
  }, []);

  return {
    queue,
    currentIndex,
    currentTrack,
    isPlaying,
    isLive,
    currentShow,
    volume,
    currentTime,
    duration,
    isQueueOpen,
    expandedMobile,
    hasLiveTrack,

    registerAudioEl,
    togglePlayPause,
    playNext,
    playPrev,
    seek,
    setVolume,
    jumpToLive,
    playTrackAtIndex,
    toggleQueue,
    setExpandedMobile,
    openVoiceMemo,

    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  };
}
