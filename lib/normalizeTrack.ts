export function normalizeTrack(
  artist: string,
  title: string
) {
  const cleanTitle = title
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/- clean/i, "")
    .replace(/- radio edit/i, "")
    .replace(/feat\.?.*/i, "")
    .replace(/ft\.?.*/i, "")
    .trim();

  const cleanArtist = artist
    .replace(/feat\.?.*/i, "")
    .replace(/ft\.?.*/i, "")
    .trim();

  return {
    artist: cleanArtist,
    title: cleanTitle,
  };
}
