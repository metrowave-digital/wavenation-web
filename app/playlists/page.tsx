// app/playlists/page.tsx
import Link from "next/link"
import Image from "next/image"
import styles from "./PlaylistsIndex.module.css"

/* ------------------------------------
   MOCK DATA (wire to Payload later)
------------------------------------ */

type PlaylistCard = {
  slug: string
  title: string
  description: string
  cover: string
  cadence?: string
  curator?: string
}

const playlists: PlaylistCard[] = [
  {
    slug: "hitlist-20",
    title: "The Hitlist 20",
    description:
      "The records shaping the culture right now. Updated weekly.",
    cover: "/images/playlists/hitlist-20.jpg",
    cadence: "Updated Weekly",
    curator: "WaveNation Editorial",
  },
  {
    slug: "midnight-silk",
    title: "Midnight Silk",
    description:
      "Smooth R&B, neo-soul, and late-night grooves.",
    cover: "/images/playlists/midnight-silk.jpg",
    cadence: "Updated Weekly",
    curator: "WaveNation FM",
  },
  {
    slug: "southern-soul-saturdays",
    title: "Southern Soul Saturdays",
    description:
      "Southern soul classics and modern grown-folk anthems.",
    cover: "/images/playlists/southern-soul-saturdays.jpg",
    cadence: "Weekend Rotation",
    curator: "WaveNation FM",
  },
  {
    slug: "freshwave-indie",
    title: "FreshWave Indie",
    description:
      "New artists. Independent voices. What’s next.",
    cover: "/images/playlists/freshwave-indie.jpg",
    cadence: "Updated Weekly",
    curator: "WaveNation Discovery",
  },
]

/* ------------------------------------
   PAGE
------------------------------------ */

export default function PlaylistsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        {/* HEADER */}
        <header className={styles.header}>
          <h1 className={styles.title}>Playlists</h1>
          <p className={styles.lede}>
            Curated soundtracks from WaveNation — built by editors, DJs,
            and the culture.
          </p>
        </header>

        {/* GRID */}
        <section className={styles.grid}>
          {playlists.map((pl) => (
            <Link
              key={pl.slug}
              href={`/playlists/${pl.slug}`}
              className={styles.card}
            >
              <div className={styles.coverWrap}>
                <Image
                  src={pl.cover}
                  alt={`${pl.title} cover`}
                  width={520}
                  height={520}
                  className={styles.cover}
                />
                <div className={styles.coverGlow} aria-hidden="true" />
              </div>

              <div className={styles.meta}>
                <div className={styles.cardTop}>
                  {pl.cadence ? (
                    <span className={styles.badge}>{pl.cadence}</span>
                  ) : null}
                </div>

                <h2 className={styles.cardTitle}>{pl.title}</h2>
                <p className={styles.cardDesc}>{pl.description}</p>

                {pl.curator ? (
                  <span className={styles.curator}>
                    Curated by {pl.curator}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
