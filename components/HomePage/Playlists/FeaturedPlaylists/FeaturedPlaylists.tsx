"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedPlaylists.module.css";

type Playlist = {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
};

const featuredPlaylists: Playlist[] = [
  {
    id: "1",
    title: "The Hitlist 20",
    description: "The sound of the moment. The records shaping culture this week.",
    image: "/images/playlists/hitlist-20.jpg",
    slug: "the-hitlist-20",
  },
  {
    id: "2",
    title: "Southern Soul Saturdays",
    description: "Where Southern roots and soul traditions meet the weekend.",
    image: "/images/playlists/southern-soul-saturdays.jpg",
    slug: "southern-soul-saturdays",
  },
  {
    id: "3",
    title: "FreshWave Indie",
    description: "New voices. New sound. The next wave starts here.",
    image: "/images/playlists/freshwave-indie.jpg",
    slug: "freshwave-indie",
  },
  {
    id: "4",
    title: "Midnight Silk",
    description: "When the night slows down, Midnight Silk takes over.",
    image: "/images/playlists/midnight-silk.jpg",
    slug: "midnight-silk",
  },
  {
    id: "5",
    title: "Morning Praise Essentials",
    description: "A soundtrack for faith, reflection, and renewed strength.",
    image: "/images/playlists/morning-praise-essentials.jpg",
    slug: "morning-praise-essentials",
  },
];

export default function FeaturedPlaylists() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const hideHint = () => setShowSwipeHint(false);

    track.addEventListener("scroll", hideHint, { once: true });
    track.addEventListener("touchstart", hideHint, { once: true });

    return () => {
      track.removeEventListener("scroll", hideHint);
      track.removeEventListener("touchstart", hideHint);
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2>Featured Playlists</h2>
          <Link href="/playlists" className={styles.viewAll}>
            View All →
          </Link>
        </header>

        {showSwipeHint && (
          <div className={styles.swipeHint} aria-hidden="true">
            Swipe for more →
          </div>
        )}

        <div ref={trackRef} className={styles.track}>
          {featuredPlaylists.map((playlist) => (
            <article key={playlist.id} className={styles.card}>
              <Link
                href={`/playlists/${playlist.slug}`}
                className={styles.imageWrap}
                aria-label={`Open playlist ${playlist.title}`}
              >
                <Image
                  src={playlist.image}
                  alt={playlist.title}
                  fill
                  sizes="260px"
                  className={styles.image}
                  priority
                />
              </Link>

              <div className={styles.meta}>
                <h3>{playlist.title}</h3>
                <p>{playlist.description}</p>
                <Link href={`/playlists/${playlist.slug}`} className={styles.button}>
                  Listen
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
