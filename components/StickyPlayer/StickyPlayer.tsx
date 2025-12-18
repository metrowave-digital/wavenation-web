"use client";

import { usePlayerShared } from "./PlayerShared";

import { PlayerMobileBar } from "./ui/PlayerMobileBar";
import PlayerExpandedSheet from "./ui/PlayerExpandedSheet";
import PlayerDesktopBar from "./ui/PlayerDesktopBar";
import PlayerQueue from "./ui/PlayerQueue";
import PlayerCarMode  from "./ui/PlayerCarMode";

export default function StickyPlayer() {
  const {
    registerAudioEl,

    currentTrack,
    currentShow,
    isLive,
    isPlaying,
    currentTime,
    duration,

    queue,
    currentIndex,
    expandedMobile,
    volume,

    togglePlayPause,
    playNext,
    playPrev,
    seek,
    jumpToLive,
    toggleQueue,
    setExpandedMobile,
    setVolume,
  } = usePlayerShared();

  return (
    <>
      {/* GLOBAL AUDIO ELEMENT */}
      <audio
        ref={(el) => registerAudioEl(el)}
        src={currentTrack?.src}
        preload="none"
        playsInline
        hidden
      />

      {/* MOBILE BAR */}
      <PlayerMobileBar
        currentTrack={currentTrack}
        currentShow={currentShow}
        isLive={isLive}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={togglePlayPause}
        onSeek={seek}
        onReturnToLive={jumpToLive}
        onOpenQueue={toggleQueue}
        expanded={expandedMobile}
        setExpanded={setExpandedMobile}
      />

      {/* MOBILE EXPANDED */}
      <PlayerExpandedSheet
        currentTrack={currentTrack}
        currentShow={currentShow}
        isLive={isLive}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        expanded={expandedMobile}
        onClose={() => setExpandedMobile(false)}
        onPlayPause={togglePlayPause}
        onSeek={seek}
        onToggleQueue={toggleQueue}
        onOpenVoiceMemo={() => {}}
        onReturnToLive={jumpToLive}
        hasLiveTrack={queue?.some((t) => t.isLive)}
      />

      {/* DESKTOP BAR */}
      <PlayerDesktopBar
        currentTrack={currentTrack}
        currentShow={currentShow}
        isLive={isLive}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onVolumeChange={setVolume}
        onPlayPause={togglePlayPause}
        onNext={playNext}
        onPrev={playPrev}
        onSeek={seek}
        onToggleQueue={toggleQueue}
        onReturnToLive={jumpToLive}
        onOpenVoiceMemo={() => {}}
        hasLiveTrack={queue?.some((t) => t.isLive)}
      />

      {/* QUEUE (rendered but visibility controlled internally) */}
      <PlayerQueue
        open={false}
        queue={queue ?? []}
        currentIndex={currentIndex ?? 0}
        onSelectTrack={() => {}}
        onClose={toggleQueue}
      />

      {/* CAR MODE */}
      <PlayerCarMode
        enabled={false}
        onClose={() => {}}
        currentTrack={currentTrack}
        currentShow={currentShow}
        isLive={isLive}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={togglePlayPause}
        onNext={playNext}
        onPrev={playPrev}
        onSeek={seek}
      />
    </>
  );
}
