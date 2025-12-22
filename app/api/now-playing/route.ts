import { NextResponse } from "next/server";

/**
 * Read-only Now Playing endpoint
 * Single source of truth = metadata ingest
 */

export async function GET() {
  let data;

  try {
    const res = await fetch(
      "https://wavenation.media/api/metadata/ingest",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Metadata source unavailable");
    }

    data = await res.json();
  } catch {
    return NextResponse.json({
      nowPlaying: {
        artist: "",
        title: "",
        artwork: "/images/player/default-artwork.jpg",
        isLive: false,
        mode: "OFFLINE",
      },
    });
  }

  const updatedAt = data.updatedAt ?? 0;

  const isLive =
    updatedAt > 0 && Date.now() - updatedAt < 90_000;

  return NextResponse.json({
    nowPlaying: {
      artist: data.artist ?? "",
      title: data.title ?? "",
      artwork:
        data.artwork && data.artwork.length > 0
          ? data.artwork
          : "/images/player/default-artwork.jpg",
      isLive,
      mode: isLive ? "LIVE" : "AUTO",
    },
  });
}
