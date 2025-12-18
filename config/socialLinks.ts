export interface SocialLink {
  name: string;
  platform: "facebook" | "instagram" | "x" | "youtube";
  webUrl: string;
  appUrl?: string; // mobile deep link
}

/**
 * WaveNation official social links
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Facebook",
    platform: "facebook",
    webUrl: "https://www.facebook.com/people/WaveNation-Media/61585147160405/",
    appUrl: "fb://profile/WaveNation-Media",
  },
  {
    name: "Instagram",
    platform: "instagram",
    webUrl: "https://www.instagram.com/wavenationmedia",
    appUrl: "instagram://user?username=wavenationmedia",
  },
  {
    name: "X",
    platform: "x",
    webUrl: "https://x.com/WaveNationMedia",
    appUrl: "twitter://user?screen_name=WaveNationMedia",
  },
  {
    name: "YouTube",
    platform: "youtube",
    webUrl: "https://www.youtube.com/@WaveNationMedia",
    appUrl: "youtube://www.youtube.com/@WaveNationMedia",
  },
];
