export interface SecondaryLink {
  label: string;
  href: string;
}

export interface MobileSecondarySection {
  title: string;
  links: SecondaryLink[];
}

export const MOBILE_SECONDARY_LINKS: Record<string, MobileSecondarySection> = {
  listen: {
    title: "Listen",
    links: [
      { label: "Shows", href: "/shows" },
      { label: "Schedule", href: "/shows/schedule" },
      { label: "Playlists", href: "/playlists" },
      { label: "Charts", href: "/charts" },
      { label: "Live DJs", href: "/listen/live" },
    ],
  },

  watch: {
    title: "Watch",
    links: [
      { label: "Live TV", href: "/watch/live" },
      { label: "Interviews", href: "/watch/interviews" },
      { label: "Clips", href: "/watch/clips" },
      { label: "Schedule", href: "/watch/schedule" },
      { label: "Originals", href: "/watch/originals" },
    ],
  },

  news: {
    title: "News",
    links: [
      { label: "Top", href: "/news" },
      { label: "Culture", href: "/news/culture" },
      { label: "Politics", href: "/news/politics" },
      { label: "Sports", href: "/news/sports" },
      { label: "Local", href: "/news/regional" },
    ],
  },

  charts: {
    title: "Charts",
    links: [
      { label: "The Hitlist", href: "/charts/the-hitlist" },
      { label: "R&B & Soul", href: "/charts/rnb-soul" },
      { label: "Rap", href: "/charts/rap" },
      { label: "Gospel", href: "/charts/gospel" },
      { label: "Southern Soul", href: "/charts/southern-soul" },
    { label: "All Charts", href: "/charts/archive" },
    ],
  },

  default: {
    title: "Explore",
    links: [
      { label: "Shows", href: "/shows" },
      { label: "Playlists", href: "/playlists" },
      { label: "Charts", href: "/charts" },
      { label: "Events", href: "/events" },
      { label: "Community", href: "/connect/community" },
    ],
  },
};

/* ALWAYS AVAILABLE */
export const MOBILE_MORE_LINKS: SecondaryLink[] = [
  { label: "Events", href: "/events" },
  { label: "Contests", href: "/connect/contests" },
  { label: "Community", href: "/connect/community" },
  { label: "Submit", href: "/connect/submit" },
  { label: "Resources", href: "/connect/resources" },
  { label: "About", href: "/about" },
];
