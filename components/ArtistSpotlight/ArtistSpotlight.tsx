// components/ArtistSpotlight/ArtistSpotlight.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./ArtistSpotlight.module.css";

interface ArtistSpotlightProps {
  bannerImage: string;
  artistImage: string;
  artistName: string;
  tagline: string;
  featuredArticle: {
    title: string;
    slug: string;
    image: string;
  };
  featuredRelease: {
    title: string;
    slug: string;
    coverArt: string;
  };
  featuredEvent: {
    title: string;
    slug: string;
    image: string;
  };
}

export default function ArtistSpotlight({
  bannerImage,
  artistImage,
  artistName,
  tagline,
  featuredArticle,
  featuredRelease,
  featuredEvent,
}: ArtistSpotlightProps) {
  // Safe fallbacks
  const banner = bannerImage || "/artist-spotlight/banner.jpg";
  const portrait = artistImage || "/artist-spotlight/artist.jpg";

  const articleImg = featuredArticle?.image || "/artist-spotlight/article.jpg";
  const articleTitle = featuredArticle?.title || "Featured Article";
  const articleSlug = featuredArticle?.slug || "article";

  const releaseImg = featuredRelease?.coverArt || "/artist-spotlight/release.jpg";
  const releaseTitle = featuredRelease?.title || "Featured Release";
  const releaseSlug = featuredRelease?.slug || "release";

  const eventImg = featuredEvent?.image || "/artist-spotlight/event.jpg";
  const eventTitle = featuredEvent?.title || "Upcoming Event";
  const eventSlug = featuredEvent?.slug || "event";

  return (
    <section className={styles.section}>
      {/* Background Banner */}
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${banner})` }}
      />

      <div className={styles.inner}>
        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>
          <div className={styles.portraitWrapper}>
            <Image
              src={portrait}
              alt={artistName}
              fill
              className={styles.portrait}
            />
          </div>

          <h2 className={styles.artistName}>{artistName}</h2>
          <p className={styles.tagline}>{tagline}</p>

          <Link href="#" className={styles.primaryButton}>
            View Artist Profile
          </Link>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.features}>
          {/* Feature 1: Article */}
          <Link href={`/news/${articleSlug}`} className={styles.card}>
            <Image
              src={articleImg}
              alt={articleTitle}
              fill
              className={styles.cardImage}
            />

            <div className={styles.cardOverlay}>
              <h3>Featured Article</h3>
              <p>{articleTitle}</p>
            </div>
          </Link>

          {/* Feature 2: Release */}
          <Link href={`/music/${releaseSlug}`} className={styles.card}>
            <Image
              src={releaseImg}
              alt={releaseTitle}
              fill
              className={styles.cardImage}
            />

            <div className={styles.cardOverlay}>
              <h3>Featured Release</h3>
              <p>{releaseTitle}</p>
            </div>
          </Link>

          {/* Feature 3: Event */}
          <Link href={`/events/${eventSlug}`} className={styles.card}>
            <Image
              src={eventImg}
              alt={eventTitle}
              fill
              className={styles.cardImage}
            />

            <div className={styles.cardOverlay}>
              <h3>Upcoming Event</h3>
              <p>{eventTitle}</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
