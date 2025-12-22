type ArtworkCacheEntry = {
  artwork: string | null;
  updatedAt: number;
};

const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours
const cache = new Map<string, ArtworkCacheEntry>();

export function getCachedArtwork(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.updatedAt > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return entry.artwork;
}

export function setCachedArtwork(
  key: string,
  artwork: string | null
) {
  cache.set(key, {
    artwork,
    updatedAt: Date.now(),
  });
}
