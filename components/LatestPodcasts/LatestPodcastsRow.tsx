"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./LatestPodcastsRow.module.css";

/* ================================
   TYPES
================================ */
interface ShowItem {
  id: string;
  title: string;
  showName?: string;
  image: string;
  href: string;
  badge?: string;
}

const latestShows: ShowItem[] = [
  {
    id: "morning-wave",
    title: "Holiday Destress & Culture Check",
    showName: "The Morning Wave",
    image: "/podcasts/morning-wave.jpg",
    href: "/shows/the-morning-wave",
  },
  {
    id: "indie-uncensored",
    title: "Indie Artists to Watch in 2026",
    showName: "Indie Uncensored",
    image: "/podcasts/indie-uncensored.jpg",
    href: "/shows/indie-uncensored",
  },
  {
    id: "hitlist",
    title: "Top 20 Countdown — Week 48",
    showName: "Hit List Top 20",
    image: "/podcasts/hitlist.jpg",
    href: "/shows/hitlist-top-20",
    badge: "NEW",
  },
  {
    id: "morning-glory",
    title: "Faith, Focus & Finish Strong",
    showName: "Morning Glory",
    image: "/podcasts/morning-glory.jpg",
    href: "/shows/morning-glory",
  },
];

export default function LatestPodcastsRow() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div>
          <h2>Latest Podcasts & Shows</h2>
          <p>Fresh conversations, music talk, and culture</p>
        </div>

        <Link href="/shows" className={styles.viewAll}>
          View All →
        </Link>
      </header>

      <div className={styles.row}>
        {latestShows.map((item) => (
          <Link key={item.id} href={item.href} className={styles.card}>
            <div className={styles.cover}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 70vw, 260px"
              />

              {item.badge && (
                <span className={styles.badge}>{item.badge}</span>
              )}
            </div>

            <div className={styles.meta}>
              {item.showName && (
                <span className={styles.showName}>{item.showName}</span>
              )}
              <h3>{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
