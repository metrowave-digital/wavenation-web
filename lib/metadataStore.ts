export type NowPlayingMetadata = {
  artist: string;
  title: string;
  artwork: string | null;
  updatedAt: number | null;
};

export const metadataStore: {
  current: NowPlayingMetadata;
} = {
  current: {
    artist: "",
    title: "",
    artwork: null,
    updatedAt: null,
  },
};
