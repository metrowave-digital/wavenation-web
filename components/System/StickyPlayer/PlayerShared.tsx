"use client";

import { useMemo } from "react";
import type { Track } from "./types";
import { usePlayerController } from "./hooks/usePlayerController";
import { useNowPlaying } from "./hooks/useNowPlaying";

/**
 * PlayerShared
 * --------------------------------------------------
 * Thin adapter ONLY.
 * - No business logic outside derived UI-safe selectors
 * - Overlays AzuraCast metadata onto the LIVE track
 */
export function usePlayerShared() {
  const controller = usePlayerController();
  const nowPlaying = useNowPlaying(15000);

  /* --------------------------------------------------
     DERIVED STATE (UI-SAFE)
  --------------------------------------------------- */

  const isLiveStream = Boolean(controller.currentTrack?.isLive === true);
  const isPlayerExpanded = controller.expandedMobile === true;

  const canSkip =
    !isLiveStream &&
    Array.isArray(controller.queue) &&
    controller.queue.length > 1;

  const isDjLive = nowPlaying?.mode === "dj";
  const isAutoDj = nowPlaying?.mode === "autodj";
  const djName = nowPlaying?.djName ?? null;

  /**
   * Overlay NowPlaying metadata onto the LIVE track only.
   * Keeps Track as the stable domain object for UI components.
   */
const currentTrack: Track | null = useMemo(() => {
  const base = controller.currentTrack;
  if (!base) return null;

  // ONLY override when we actually have metadata
  if (
    base.isLive &&
    nowPlaying &&
    nowPlaying.mode !== "offline" &&
    (nowPlaying.title || nowPlaying.artist)
  ) {
    return {
      ...base,
      title: nowPlaying.title || base.title,
      artist: nowPlaying.artist || base.artist,
      artwork: nowPlaying.artwork || base.artwork,
      showName:
        nowPlaying.mode === "dj"
          ? nowPlaying.djName ?? base.showName ?? "WaveNation Live"
          : nowPlaying.artist || base.artist || base.showName,
    };
  }

  return base;
}, [controller.currentTrack, nowPlaying]);



  const currentShow = currentTrack?.showName ?? controller.currentShow ?? null;

  /* --------------------------------------------------
     PUBLIC API (STABLE CONTRACT)
  --------------------------------------------------- */

  return {
    /* audio */
    registerAudioEl: controller.registerAudioEl,

    /* track / show */
    currentTrack,
    currentShow,

    /* state */
    isLiveStream,
    isPlaying: controller.isPlaying,
    currentTime: controller.currentTime,
    duration: controller.duration,
    volume: controller.volume,

    /* metadata flags */
    isDjLive,
    isAutoDj,
    djName,

    /* ui */
    expandedMobile: controller.expandedMobile,
    setExpandedMobile: controller.setExpandedMobile,
    isPlayerExpanded,
    canSkip,

    /* actions */
    togglePlayPause: controller.togglePlayPause,
    playNext: controller.playNext,
    playPrev: controller.playPrev,
    playTrackAt: controller.playTrackAt,
    seek: controller.seek,
    jumpToLive: controller.jumpToLive,
    toggleQueue: controller.toggleQueue,
    setVolume: controller.setVolume,

    /* queue */
    queue: controller.queue,
    currentIndex: controller.currentIndex,
  };
}
