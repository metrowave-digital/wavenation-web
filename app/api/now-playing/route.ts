import { NextResponse } from "next/server";
import { metadataStore } from "@/lib/metadataStore";

export async function GET() {
  const data = metadataStore.current;

  const updatedAt = data.updatedAt ?? 0;
  const isLive =
    updatedAt > 0 && Date.now() - updatedAt < 90_000;

  return NextResponse.json({
    nowPlaying: {
      artist: data.artist,
      title: data.title,
      artwork:
        data.artwork || "/images/player/default-artwork.jpg",
      isLive,
      mode: isLive ? "LIVE" : "OFFLINE",
    },
  });
}
