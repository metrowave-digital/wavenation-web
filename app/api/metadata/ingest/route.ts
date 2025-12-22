import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/* ======================================================
   REDIS CLIENT
====================================================== */

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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
   POST — INGEST FROM STATIONPLAYLIST
====================================================== */

export async function POST(req: Request) {
  /* 🔐 AUTH CHECK — MUST BE INSIDE HANDLER */
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.WN_AUTPOST_TOKEN}`) {
    return new Response("Unauthorized", { status: 401 });
  }

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

  if (artist && title) {
    const track: CurrentTrack = {
      artist,
      title,
      album: payload.album?.trim() || null,
      duration: payload.duration
        ? Number(payload.duration)
        : null,
      updatedAt: Date.now(),
    };

    await redis.set("wavenation:nowplaying", track);
  }

  return NextResponse.json({ ok: true });
}

/* ======================================================
   GET — READ CURRENT METADATA
====================================================== */

export async function GET() {
  const track = await redis.get<CurrentTrack>(
    "wavenation:nowplaying"
  );

  return NextResponse.json(
    track ?? {
      artist: "WaveNation FM",
      title: "Live Broadcast",
      album: null,
      duration: null,
      updatedAt: Date.now(),
    }
  );
}
