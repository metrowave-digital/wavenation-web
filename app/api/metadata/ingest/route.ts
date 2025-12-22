import { NextResponse } from "next/server";

/* ======================================================
   TYPES
====================================================== */

interface StationPlaylistPayload {
  artist?: string;
  title?: string;
  album?: string;
  duration?: string;
}

interface CurrentTrack {
  artist: string;
  title: string;
  album: string | null;
  duration: number | null;
  updatedAt: number;
}

/* ======================================================
   IN-MEMORY STORE
   (Replace with Redis later if desired)
====================================================== */

let currentTrack: CurrentTrack = {
  artist: "WaveNation FM",
  title: "Live Broadcast",
  album: null,
  duration: null,
  updatedAt: Date.now(),
};

/* ======================================================
   HELPERS
====================================================== */

function parseFormEncoded(body: string): StationPlaylistPayload {
  const params = new URLSearchParams(body);

  return {
    artist: params.get("artist") ?? undefined,
    title: params.get("title") ?? undefined,
    album: params.get("album") ?? undefined,
    duration: params.get("duration") ?? undefined,
  };
}

/* ======================================================
   POST — INGEST METADATA FROM STATIONPLAYLIST
====================================================== */

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";

  let payload: StationPlaylistPayload;

  if (contentType.includes("application/json")) {
    payload = (await req.json()) as StationPlaylistPayload;
  } else {
    const text = await req.text();
    payload = parseFormEncoded(text);
  }

  const artist = payload.artist?.trim();
  const title = payload.title?.trim();

  // Only update when real metadata exists
  if (artist && title) {
    currentTrack = {
      artist,
      title,
      album: payload.album?.trim() || null,
      duration: payload.duration
        ? Number(payload.duration)
        : null,
      updatedAt: Date.now(),
    };
  }

  return NextResponse.json({ ok: true });
}

/* ======================================================
   GET — DEBUG / FALLBACK READ
====================================================== */

export async function GET() {
  return NextResponse.json(currentTrack);
}
