export interface MediaFile {
  url: string;
  alt?: string;
}

export interface HostProfile {
  name: string;
  avatar?: MediaFile | null;
}

export interface RelatedShow {
  title: string;
  coverArt?: MediaFile | null;
  bannerImage?: MediaFile | null;
  primaryHost?: HostProfile | null;
  genre?: {
    slug?: string;
    name?: string;
  } | null;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  relatedShow?: RelatedShow | null;
  _dayIndex: number;
}

export interface UpNextShow {
  showTitle: string;
  hostName: string;
  avatar: string | null;
  artwork: string | null;
  date: string;
  start: string;
  end: string;
  startDate: Date;
  endDate: Date;
  isLive: boolean;
  key: string;
}

export interface NowPlayingTrack {
  track: string;
  artist: string;
  cover: string | null;
}
