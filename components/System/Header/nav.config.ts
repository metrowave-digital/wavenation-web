export interface NavLink {
  label: string;
  href: string;
  flyout?: NavLink[];
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  sections: NavSection[];
}

/* Charts submenu */
export const CHART_ITEMS: NavLink[] = [
  { label: "Top 20", href: "/charts/top20" },
  { label: "Rhythmic", href: "/charts/rhythmic" },
  { label: "Rap", href: "/charts/rap" },
  { label: "R&B & Soul", href: "/charts/rnb-soul" },
  { label: "Gospel", href: "/charts/gospel" },
  { label: "Christian Hip-Hop", href: "/charts/chh" },
  { label: "Southern Soul", href: "/charts/southern-soul" },
  { label: "Smooth Jazz", href: "/charts/smooth-jazz" },
  { label: "Riddim", href: "/charts/riddim" },
];

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Discover",
    sections: [
      {
        title: "Featured",
        links: [
          { label: "Featured", href: "/discover/featured" },
          { label: "Artists", href: "/discover/artists" },
          { label: "Emerging Talent", href: "/discover/emerging" },
          { label: "Film & TV", href: "/discover/film-tv" },
        ],
      },
      {
        title: "Explore",
        links: [
          { label: "Trending", href: "/explore/trending" },
          { label: "New Releases", href: "/explore/new" },
          { label: "Charts", href: "/explore/charts", flyout: CHART_ITEMS },
        ],
      },
      {
        title: "Playlists",
        links: [
          { label: "Moods", href: "/playlists/moods" },
          { label: "Staff Picks", href: "/playlists/staff-picks" },
        ],
      },
    ],
  },
  {
    label: "On-Air",
    sections: [
      {
        title: "Shows",
        links: [
          { label: "The Wake Up Wave", href: "/shows/wake-up-wave" },
          { label: "Morning Glory", href: "/shows/morning-glory" },
          { label: "Looking to Jesus", href: "/shows/looking-to-jesus" },
          { label: "Full Schedule", href: "/shows/schedule" },
        ],
      },
      {
        title: "Podcasts",
        links: [
          { label: "Lookout Weekend", href: "/podcasts/lookout-weekend" },
          { label: "Indie Uncensored", href: "/podcasts/indie-uncensored" },
        ],
      },
      {
        title: "Talent",
        links: [
          { label: "Karesse O'Mor", href: "/talent/karesse-omor" },
          { label: "The Prince", href: "/talent/the-prince" },
          { label: "Full Schedule", href: "/talent/schedule" },
        ],
      },
    ],
  },
  {
    label: "News",
    sections: [
      {
        title: "Top Stories",
        links: [
          { label: "Entertainment", href: "/news/entertainment" },
          { label: "Culture", href: "/news/culture" },
          { label: "Politics", href: "/news/politics" },
          { label: "Sports", href: "/news/sports" },
          { label: "All Stories", href: "/news" },
        ],
      },
      {
        title: "Featured",
        links: [
          { label: "HBCU", href: "/news/hbcu" },
          { label: "Capitol Watch", href: "/news/capitol-watch" },
          { label: "Regional Updates", href: "/news/regional" },
          { label: "Community Impact", href: "/news/community-impact" },
        ],
      },
    ],
  },
  {
    label: "Watch",
    sections: [
      {
        title: "Watch",
        links: [
          { label: "Music Videos", href: "/watch/music-videos" },
          { label: "Interviews", href: "/watch/interviews" },
          { label: "Podcasts", href: "/watch/podcasts" },
          { label: "Watch Live", href: "/watch/live" },
          { label: "Full Schedule", href: "/watch/schedule" },
        ],
      },
    ],
  },
  {
    label: "Shop",
    sections: [
      {
        title: "Shop",
        links: [
          { label: "Station Merch", href: "/shop/merch" },
          { label: "Event Tickets", href: "/shop/tickets" },
          { label: "Music", href: "/shop/music" },
          { label: "Exclusive Drops", href: "/shop/exclusive" },
        ],
      },
      {
        title: "My Account",
        links: [
          { label: "Cart", href: "/account/cart" },
          { label: "Wishlist", href: "/account/wishlist" },
          { label: "Settings", href: "/account/settings" },
        ],
      },
    ],
  },
  {
    label: "Connect",
    sections: [
      {
        title: "Connect",
        links: [
          { label: "Events", href: "/connect/events" },
          { label: "Contests", href: "/connect/contests" },
          { label: "Community Hub", href: "/connect/community" },
        ],
      },
      {
        title: "For Creators",
        links: [
          { label: "Submit Content", href: "/connect/submit" },
          { label: "Resources", href: "/connect/resources" },
          { label: "Intercultural Media Alliance", href: "/ima" },
        ],
      },
    ],
  },
];
