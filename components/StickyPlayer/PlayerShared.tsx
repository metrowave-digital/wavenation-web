"use client";

import type { Track } from "./types";
import { usePlayerController } from "./hooks/usePlayerController";

/**
 * PlayerShared
 * Thin adapter ONLY.
 * No assumptions.
 */
export function usePlayerShared() {
  const controller = usePlayerController();

  return {
    /* audio */
    registerAudioEl: controller.registerAudioEl,

    /* track / show */
    currentTrack: controller.currentTrack as Track | null,
    currentShow: controller.currentShow,

    /* state */
    isLive: controller.isLive,
    isPlaying: controller.isPlaying,
    currentTime: controller.currentTime,
    duration: controller.duration,

    /* ui */
    expandedMobile: controller.expandedMobile,
    volume: controller.volume,

    /* actions */
    togglePlayPause: controller.togglePlayPause,
    playNext: controller.playNext,
    playPrev: controller.playPrev,
    seek: controller.seek,
    jumpToLive: controller.jumpToLive,
    toggleQueue: controller.toggleQueue,
    setExpandedMobile: controller.setExpandedMobile,
    setVolume: controller.setVolume,

    /* queue (read-only if exposed) */
    queue: controller.queue,
    currentIndex: controller.currentIndex,
  };
}
