let nowPlaying: {
  artist: string;
  title: string;
  startedAt?: string;
} = {
  artist: "",
  title: "",
  startedAt: undefined,
};

let history: { artist: string; title: string; playedAt: string }[] = [];

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 200);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let artist = "";
    let title = "";
    let secret = "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const bodyText = await req.text();
      const params = new URLSearchParams(bodyText);
      artist = sanitize(params.get("artist"));
      title = sanitize(params.get("title"));
      secret = sanitize(params.get("secret"));
    } else if (contentType.includes("application/json")) {
      const json = await req.json();
      artist = sanitize((json as any).artist);
      title = sanitize((json as any).title);
      secret = sanitize((json as any).secret);
    } else {
      const bodyText = await req.text();
      const params = new URLSearchParams(bodyText);
      artist = sanitize(params.get("artist"));
      title = sanitize(params.get("title"));
      secret = sanitize(params.get("secret"));
    }

    if (secret !== process.env.METADATA_SECRET) {
      return new Response("Forbidden", { status: 403 });
    }

    // Only update if track actually changed
    const trackChanged =
      artist &&
      title &&
      (artist !== nowPlaying.artist || title !== nowPlaying.title);

    if (trackChanged) {
      const now = new Date().toISOString();

      // Push previous into history
      if (nowPlaying.artist || nowPlaying.title) {
        history.unshift({
          artist: nowPlaying.artist,
          title: nowPlaying.title,
          playedAt: nowPlaying.startedAt || now,
        });
        history = history.slice(0, 5); // keep last 5
      }

      nowPlaying = {
        artist,
        title,
        startedAt: now,
      };

      console.log("Now playing updated:", nowPlaying);
    }

    return new Response("OK");
  } catch (error) {
    console.error("Metadata POST error", error);
    return new Response("Error", { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    nowPlaying,
    history,
  });
}
