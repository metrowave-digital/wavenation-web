"use client";

import { useEffect } from "react";
import { usePlayerShared } from "./PlayerShared";

import { PlayerMobileBar } from "./ui/PlayerMobileBar";
import PlayerExpandedSheet from "./ui/PlayerExpandedSheet";
import PlayerDesktopBar from "./ui/PlayerDesktopBar";
import PlayerQueue from "./ui/PlayerQueue";

import type { Track } from "./types";

const noop = () => {};

export default function StickyPlayer() {
  const {
    /* audio */
    registerAudioEl,

    /* track / show */
    currentTrack,
    currentShow,

    /* state */
    isPlaying,
    isLiveStream,
    currentTime,
    duration,
    volume,

    /* metadata */
    isDjLive,
    isAutoDj,
    djName,

    /* ui */
    expandedMobile,
    setExpandedMobile,
    isPlayerExpanded,
    canSkip,

    /* actions */
    togglePlayPause,
    playNext,
    playPrev,
    playTrackAt,
    seek,
    jumpToLive,
    toggleQueue,
    setVolume,

    /* queue */
    queue,
    currentIndex,
  } = usePlayerShared();

  useEffect(() => {
    document.body.classList.toggle("player-expanded", isPlayerExpanded);
  }, [isPlayerExpanded]);

  const hasLiveTrack = (queue?.some((t: Track) => t.isLive) ?? false);

  return (
    <>
      {/* AUDIO ELEMENT */}
      <audio
        ref={(el) => registerAudioEl(el)}
        preload="none"
        playsInline
        hidden
      />

      {/* MOBILE MINI PLAYER */}
      <PlayerMobileBar
        currentTrack={currentTrack}
        currentShow={
          isDjLive ? (djName ?? currentShow) : isAutoDj ? "AutoDJ" : currentShow
        }
        isLive={isLiveStream}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={togglePlayPause}
        onExpand={() => setExpandedMobile(true)}
        onCollapse={() => setExpandedMobile(false)}
      />

      {/* EXPANDED SHEET */}
      <PlayerExpandedSheet
        expanded={expandedMobile}
        currentTrack={currentTrack}
        currentShow={
          isDjLive ? (djName ?? currentShow) : isAutoDj ? "AutoDJ" : currentShow
        }
        isLive={isLiveStream}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onClose={() => setExpandedMobile(false)}
        onPlayPause={togglePlayPause}
        onSeek={seek}
        onNext={canSkip ? playNext : noop}
        onPrev={canSkip ? playPrev : noop}
        onToggleQueue={toggleQueue}
        onOpenVoiceMemo={noop}
        onReturnToLive={jumpToLive}
        hasLiveTrack={hasLiveTrack}
        bottomOffset={72}
      />

      {/* DESKTOP BAR */}
      <PlayerDesktopBar
        currentTrack={currentTrack}
        currentShow={
          isDjLive ? (djName ?? currentShow) : isAutoDj ? "AutoDJ" : currentShow
        }
        isLive={isLiveStream}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onVolumeChange={setVolume}
        onPlayPause={togglePlayPause}
        onNext={canSkip ? playNext : noop}
        onPrev={canSkip ? playPrev : noop}
        onSeek={seek}
        onToggleQueue={toggleQueue}
        onReturnToLive={jumpToLive}
        onOpenVoiceMemo={noop}
        hasLiveTrack={hasLiveTrack}
      />

      {/* QUEUE (disabled for now, but wired) */}
      <PlayerQueue
        open={false}
        queue={queue ?? []}
        currentIndex={currentIndex ?? 0}
        onSelectTrack={(index: number) => playTrackAt(index)}
        onClose={toggleQueue}
      />
    </>
  );
}
