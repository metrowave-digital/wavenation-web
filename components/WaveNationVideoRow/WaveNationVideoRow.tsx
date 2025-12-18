"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./WaveNationVideoRow.module.css";

/* ================================
   TYPES
================================ */
interface VideoItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  badge?: string;
}

const videoItems: VideoItem[] = [
  {
    id: "live",
    title: "WaveNation TV — Live",
    subtitle: "Streaming culture, music & conversations",
    image: "/tv/live-channel.jpg",
    href: "/tv/live",
    badge: "LIVE",
  },
  {
    id: "spotlight",
    title: "Artist Spotlight",
    subtitle: "Exclusive performances & interviews",
    image: "/tv/artist-spotlight.jpg",
    href: "/tv/artist-spotlight",
  },
  {
    id: "docs",
    title: "Culture Docs",
    subtitle: "Stories from the culture",
    image: "/tv/culture-docs.jpg",
    href: "/tv/docs",
  },
  {
    id: "events",
    title: "Live Events",
    subtitle: "Concerts & special broadcasts",
    image: "/tv/events.jpg",
    href: "/tv/events",
  },
];

export default function WaveNationVideoRow() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div>
          <h2>WaveNation TV</h2>
          <p>Watch live and on-demand programming</p>
        </div>

        <Link href="/tv" className={styles.viewAll}>
          View All →
        </Link>
      </header>

      <div className={styles.row}>
        {videoItems.map((item) => (
          <Link key={item.id} href={item.href} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 80vw, 360px"
              />

              {item.badge && (
                <span className={styles.badge}>{item.badge}</span>
              )}
            </div>

            <div className={styles.meta}>
              <h3>{item.title}</h3>
              {item.subtitle && <p>{item.subtitle}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
