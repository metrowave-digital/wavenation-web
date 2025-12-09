"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type RefObject,
} from "react";

export type TrackType = "live" | "vod" | "podcast";

export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  src: string;
  type: TrackType;
  isLive?: boolean;
  duration?: number;
  showName?: string;
}

export interface UsePlayerResult {
  queue: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isLive: boolean;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number | null;

  showQueue: boolean;
  setShowQueue: (v: boolean) => void;

  expandedMobile: boolean;
  setExpandedMobile: (v: boolean) => void;

  setVolume: (v: number) => void;

  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  playTrackAt: (index: number) => void;
  returnToLive: () => void;
  seek: (percent: number) => void;

  handleTimeUpdate: () => void;
  handleLoadedMetadata: () => void;
  handleEnded: () => void;
  handlePlay: () => void;
  handlePause: () => void;

  audioRef: RefObject<HTMLAudioElement | null>;
}

export function usePlayer(
  audioRef: RefObject<HTMLAudioElement | null>
): UsePlayerResult {
  const [queue, setQueue] = useState<Track[]>([
    {
      id: "live",
      title: "WaveNation FM – Live Stream",
      artist: "Streaming 24/7",
      artwork: "/images/wavenation-show-art-live.jpg",
      src: "https://streaming.live365.com/a49099",
      type: "live",
      isLive: true,
      showName: "WaveNation FM",
    },
    {
      id: "lookout",
      title: "Lookout Weekend – Pop Culture Rundown",
      artist: "Karesse O’Mor",
      artwork: "/images/show-lookout-weekend.jpg",
      src: "https://example.com/audio/episode1.mp3",
      type: "podcast",
      showName: "Lookout Weekend",
    },
    {
      id: "southern-soul",
      title: "Southern Soul Saturdays – Hour 1",
      artist: "WaveNation DJ",
      artwork: "/images/show-southern-soul.jpg",
      src: "https://example.com/audio/episode2.mp3",
      type: "vod",
      showName: "Southern Soul Saturdays",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [showQueue, setShowQueue] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  const currentTrack = useMemo(
    () => queue[currentIndex] ?? null,
    [queue, currentIndex]
  );

  const isLive =
    !!currentTrack &&
    (currentTrack.type === "live" || currentTrack.isLive === true);

  // Sync volume to <audio>
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  // Live metadata polling
  useEffect(() => {
    let cancelled = false;

    const loadMeta = async () => {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        if (!res.ok) return;

        const data: {
          nowPlaying?: {
            title?: string;
            artist?: string;
            showName?: string;
            showArt?: string;
          };
        } = await res.json();

        const now = data?.nowPlaying;
        if (cancelled || !now) return;

        setQueue((prev) => {
          if (!prev.length) return prev;
          const [live, ...rest] = prev;

          if (live.type !== "live") return prev;

          return [
            {
              ...live,
              title: now.title ?? live.title,
              artist: now.artist ?? live.artist,
              showName: now.showName ?? live.showName,
              artwork: now.showArt ?? live.artwork,
            },
            ...rest,
          ];
        });
      } catch {
        /* silent fail OK */
      }
    };

    loadMeta();
    const id = setInterval(loadMeta, 15000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, [audioRef]);

  const playNext = useCallback(() => {
    setCurrentIndex((i) =>
      i < queue.length - 1 ? i + 1 : 0
    );
  }, [queue.length]);

  const playPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : 0));
  }, []);

  const playTrackAt = useCallback(
    (index: number) => {
      if (index < 0 || index >= queue.length) return;

      setCurrentIndex(index);
      setShowQueue(false);
      setExpandedMobile(true);

      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) void audio.play();
      }, 0);
    },
    [audioRef, queue.length]
  );

  const returnToLive = useCallback(() => {
    setCurrentIndex(0);
    setShowQueue(false);
    setExpandedMobile(false);

    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) void audio.play();
    }, 0);
  }, [audioRef]);

  const seek = useCallback(
    (percent: number) => {
      if (isLive || duration == null) return;

      const audio = audioRef.current;
      if (!audio) return;

      const next = (percent / 100) * duration;
      audio.currentTime = next;
      setCurrentTime(next);
    },
    [audioRef, isLive, duration]
  );

  const handleTimeUpdate = useCallback(() => {
    if (isLive) return;

    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(audio.currentTime || 0);
  }, [audioRef, isLive]);

  const handleLoadedMetadata = useCallback(() => {
    if (isLive) return;

    const audio = audioRef.current;
    if (!audio) return;

    const d = audio.duration;
    if (!Number.isNaN(d)) {
      setDuration(d);

      setQueue((prev) =>
        prev.map((track, idx) =>
          idx === currentIndex && !track.duration
            ? { ...track, duration: d }
            : track
        )
      );
    }
  }, [audioRef, isLive, currentIndex]);

  const handleEnded = useCallback(() => {
    if (isLive) {
      setCurrentTime(0);
      return;
    }

    setCurrentIndex((i) =>
      i < queue.length - 1 ? i + 1 : 0
    );
  }, [isLive, queue.length]);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);

  return {
    queue,
    currentIndex,
    currentTrack,
    isLive,
    isPlaying,
    volume,
    currentTime,
    duration,
    showQueue,
    setShowQueue,
    expandedMobile,
    setExpandedMobile,
    setVolume,

    togglePlay,
    playNext,
    playPrev,
    playTrackAt,
    returnToLive,
    seek,

    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handlePlay,
    handlePause,

    audioRef,
  };
}
