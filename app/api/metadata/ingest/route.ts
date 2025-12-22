import { NextResponse } from "next/server";
import { metadataStore } from "@/lib/metadataStore";

export async function POST(req: Request) {
  const url = new URL(req.url);

  const artist = url.searchParams.get("artist");
  const title = url.searchParams.get("title");
  const artwork = url.searchParams.get("artwork");
  const token = url.searchParams.get("token");

  if (token !== process.env.METADATA_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!artist || !title) {
    return NextResponse.json(
      { error: "Missing artist or title" },
      { status: 400 }
    );
  }

  metadataStore.current = {
    artist,
    title,
    artwork,
    updatedAt: Date.now(),
  };

  return NextResponse.json({ success: true });
}
