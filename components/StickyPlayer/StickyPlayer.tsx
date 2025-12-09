"use client";

import { usePlayerController } from "./hooks/usePlayerController";
import PlayerDesktopBar from "./ui/PlayerDesktopBar";
import PlayerMobileBar from "./ui/PlayerMobileBar";
import PlayerQueue from "./ui/PlayerQueue";

export default function StickyPlayer() {
  const controller = usePlayerController();

  return (
    <>
      {/* AUDIO ELEMENT */}
      <audio
        ref={controller.registerAudioEl}
        src={controller.currentTrack?.src}
        onTimeUpdate={controller.handleTimeUpdate}
        onLoadedMetadata={controller.handleLoadedMetadata}
        onEnded={controller.handleEnded}
        className="hidden"
      />

      {/* DESKTOP PLAYER */}
      <PlayerDesktopBar
        currentTrack={controller.currentTrack}
        currentShow={controller.currentShow}
        isLive={controller.isLive}
        isPlaying={controller.isPlaying}
        currentTime={controller.currentTime}
        duration={controller.duration}
        volume={controller.volume}
        onVolumeChange={controller.setVolume}
        onPlayPause={controller.togglePlayPause}
        onNext={controller.playNext}
        onPrev={controller.playPrev}
        onSeek={controller.seek}
        onToggleQueue={controller.toggleQueue}
        onReturnToLive={controller.jumpToLive}
        onOpenVoiceMemo={controller.openVoiceMemo}
        hasLiveTrack={controller.hasLiveTrack}
      />

      {/* MOBILE PLAYER */}
      <PlayerMobileBar
        currentTrack={controller.currentTrack}
        currentShow={controller.currentShow}
        isLive={controller.isLive}
        isPlaying={controller.isPlaying}
        currentTime={controller.currentTime}
        duration={controller.duration}
        onPlayPause={controller.togglePlayPause}
        onSeek={controller.seek}
        onToggleQueue={controller.toggleQueue}
        onReturnToLive={controller.jumpToLive}
        onOpenVoiceMemo={controller.openVoiceMemo}
        hasLiveTrack={controller.hasLiveTrack}
        expanded={controller.expandedMobile}
        setExpanded={controller.setExpandedMobile}
      />

      {/* QUEUE */}
      <PlayerQueue
        open={controller.isQueueOpen}
        queue={controller.queue}
        currentIndex={controller.currentIndex}
        onSelectTrack={controller.playTrackAtIndex}
        onClose={controller.toggleQueue}
      />
    </>
  );
}
