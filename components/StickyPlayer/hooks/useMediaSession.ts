import { useEffect } from "react";

export function useMediaSession(
  title: string,
  artist: string,
  artwork?: string,
  onPlay?: () => void,
  onPause?: () => void
) {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      artwork: artwork
        ? [{ src: artwork, sizes: "512x512", type: "image/png" }]
        : [],
    });

    if (onPlay) navigator.mediaSession.setActionHandler("play", onPlay);
    if (onPause) navigator.mediaSession.setActionHandler("pause", onPause);
  }, [title, artist, artwork, onPlay, onPause]);
}
