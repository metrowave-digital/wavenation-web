/* ===========================================
   MEDIA + HOST + SHOW STRUCTURES
=========================================== */

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

/* ===========================================
   SCHEDULE + UP NEXT + NOW PLAYING
=========================================== */

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

/**
 * Shape returned by /api/now-playing
 * (maps cleanly into Track updates)
 */
export interface NowPlayingTrack {
  title: string;
  artist: string;
  cover: string | null;
  showName?: string | null;
}

/* ===========================================
   PLAYER TRACK STRUCTURES (UNIFIED)
=========================================== */

export type TrackType =
  | "live"
  | "music"
  | "spotify-preview"
  | "podcast"
  | "vod"
  | "video";

export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  src: string;

  type: TrackType;

  /* Optional Metadata */
  isLive?: boolean;
  duration?: number;
  showName?: string | null;

  /* Optional association with schedule/show */
  relatedShow?: RelatedShow | null;
  scheduleBlockId?: string | null;
}
