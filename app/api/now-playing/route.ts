let lastSong = "";
let history: { artist: string; title: string; playedAt: string }[] = [];

export async function GET() {
  try {
    const url = "http://s1.free-shoutcast.com:18116/stats?sid=1&json=1";
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    const raw = data.songtitle || "";
    let artist = "";
    let title = raw;

    if (raw.includes(" - ")) {
      const parts = raw.split(" - ");
      artist = parts[0];
      title = parts.slice(1).join(" - ");
    }

    // If song changed → update history
    if (raw && raw !== lastSong) {
      const playedAt = new Date().toISOString();

      if (lastSong) {
        history.unshift({
          artist,
          title,
          playedAt,
        });

        history = history.slice(0, 5); // keep max 5
      }

      lastSong = raw;
    }

    return Response.json({
      nowPlaying: {
        artist,
        title,
        listeners: data.currentlisteners || 0,
      },
      history,
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return Response.json({
      nowPlaying: { artist: "", title: "", listeners: 0 },
      history,
    });
  }
}
