import { NextResponse } from "next/server";

type NowPlayingMetadata = {
  artist: string;
  title: string;
  artwork: string | null;
  updatedAt: number | null;
};

let currentMetadata: NowPlayingMetadata = {
  artist: "",
  title: "",
  artwork: null,
  updatedAt: null,
};

export async function POST(req: Request) {
  const url = new URL(req.url);

  const artist = url.searchParams.get("artist");
  const title = url.searchParams.get("title");
  const artwork = url.searchParams.get("artwork");

  // Optional security token
  const token = url.searchParams.get("token");
  if (token !== process.env.METADATA_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!artist || !title) {
    return NextResponse.json(
      { error: "Missing artist or title" },
      { status: 400 }
    );
  }

  currentMetadata = {
    artist,
    title,
    artwork,
    updatedAt: Date.now(),
  };

  console.log("🎵 METADATA INGESTED:", currentMetadata);

  return NextResponse.json({ success: true });
}
