export interface SlideData {
  id: string | number;

  title: string;
  subtitle?: string | null;

  href: string;

  mediaType?: "image" | "video";
  imageUrl?: string | null;
  imageAlt?: string | null;

  videoUrl?: string | null;
  videoPoster?: string | null;

  categoryLabel?: string | null;
  readingTimeLabel?: string | null;
  publishedDateLabel?: string | null;
  authorName?: string | null;
}

export interface HeroSliderClientProps {
  slides: SlideData[];
  autoPlayInterval?: number;
}
