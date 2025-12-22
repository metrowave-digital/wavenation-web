// app/api/dj-status/route.ts

import { NextResponse } from "next/server";

/* ---------------------------------
   TYPES (AZURACAST SAFE)
---------------------------------- */

interface AzuraCastLiveInfo {
  is_live: boolean;
  streamer_name?: string | null;
}

interface AzuraCastNowPlaying {
  live?: AzuraCastLiveInfo;
  station?: {
    name?: string;
  };
  listeners?: {
    current?: number;
  };
  now_playing?: {
    song?: {
      artist?: string;
      title?: string;
    };
  };
}

/* ---------------------------------
   CONFIG
---------------------------------- */

const AZURACAST_NOWPLAYING_URL =
  "https://a12.asurahosting.com/api/nowplaying/wavenation_media";

/* ---------------------------------
   ROUTE
---------------------------------- */

export async function GET() {
  try {
    const res = await fetch(AZURACAST_NOWPLAYING_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch AzuraCast now playing data");
    }

    const data: AzuraCastNowPlaying = await res.json();

    const isLive = Boolean(data.live?.is_live);

    return NextResponse.json({
      isLive,
      mode: isLive ? "live" : "autodj",
      djName: data.live?.streamer_name ?? null,
      showName: isLive
        ? data.station?.name ?? "Live Broadcast"
        : "AutoDJ",
      source: isLive ? "live-dj" : "autodj",
      listeners: data.listeners?.current ?? 0,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("DJ Status Error:", error);

    // SAFE FALLBACK — NEVER BREAK UI
    return NextResponse.json({
      isLive: false,
      mode: "autodj",
      djName: null,
      showName: "AutoDJ",
      source: "autodj",
      listeners: 0,
      updatedAt: new Date().toISOString(),
    });
  }
}
