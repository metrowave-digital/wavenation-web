import { NextResponse } from "next/server";

/**
 * Single source of truth
 * (StationPlaylist HTTP push)
 */

export async function GET() {
  const res = await fetch(
    "https://wavenation.media/api/metadata/ingest",
    { cache: "no-store" }
  );

  const data = await res.json();

  const isLive = Date.now() - data.updatedAt < 90_000;

  return NextResponse.json({
    nowPlaying: {
      artist: data.artist,
      title: data.title,
      artwork: "/images/player/default-artwork.jpg",
      isLive,
      mode: "LIVE",
    },
  });
}
