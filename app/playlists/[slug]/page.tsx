// app/playlists/[slug]/page.tsx
import Link from "next/link"
import Image from "next/image"
import styles from "./PlaylistPage.module.css"

// TODO: Replace with your Payload fetch (GraphQL or REST)
async function getPlaylistBySlug(slug: string): Promise<PlaylistDetail | null> {
  // Example shape — wire to Payload:
  // - playlist embeds (spotify/apple/youtube)
  // - tracks for on-site tracklist
  // - related playlists
  // - curator + cadence + tags
  return {
    id: "pl_1",
    slug,
    title: slugToTitle(slug),
    description:
      "A WaveNation editorial playlist — updated regularly with the records shaping the vibe right now.",
    cadenceLabel: "Updated Weekly",
    curatorLabel: "Curated by WaveNation FM",
    cover: "/images/playlists/placeholder-cover.jpg",
    badges: ["EDITORIAL"],
    sponsorLabel: null, // e.g. "Sponsored Playlist"
    primaryCta: { label: "Play on WaveNation", href: "/listen" },

    // Embeds: store embed HTML or URL. Here we store URLs and render iframes.
    embeds: {
      spotify:
        "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator",
      apple: null,
      youtube: null,
    },

    submitHref: "/submit",
    related: [
      {
        slug: "midnight-silk",
        title: "Midnight Silk",
        cover: "/images/playlists/midnight-silk.jpg",
        subtitle: "Smooth R&B • Late-night grooves",
      },
      {
        slug: "freshwave-indie",
        title: "FreshWave Indie",
        cover: "/images/playlists/freshwave-indie.jpg",
        subtitle: "New artists • Weekly picks",
      },
      {
        slug: "southern-soul-saturdays",
        title: "Southern Soul Saturdays",
        cover: "/images/playlists/southern-soul-saturdays.jpg",
        subtitle: "Southern Soul • Grown-folk anthems",
      },
    ],

    tracks: [
      {
        number: 1,
        title: "Neon Nights",
        artist: "WaveNation Selects",
        duration: "3:18",
        isExplicit: false,
        isNew: true,
        isTrending: true,
      },
      {
        number: 2,
        title: "Slow Burn",
        artist: "Midnight Avenue",
        duration: "2:57",
        isExplicit: true,
        isNew: true,
        isTrending: false,
      },
      {
        number: 3,
        title: "Southside Signal",
        artist: "Blue Current",
        duration: "3:44",
        isExplicit: false,
        isNew: false,
        isTrending: true,
      },
    ],
  }
}

function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

type PlaylistTrack = {
  number: number
  title: string
  artist: string
  duration: string
  isExplicit?: boolean
  isNew?: boolean
  isTrending?: boolean
}

type RelatedPlaylistCard = {
  slug: string
  title: string
  cover: string
  subtitle?: string
}

type PlaylistDetail = {
  id: string
  slug: string
  title: string
  description: string
  cadenceLabel?: string
  curatorLabel?: string
  cover: string
  badges?: string[]
  sponsorLabel?: string | null
  primaryCta?: { label: string; href: string }

  embeds?: {
    spotify?: string | null
    apple?: string | null
    youtube?: string | null
  }

  submitHref?: string
  related?: RelatedPlaylistCard[]
  tracks?: PlaylistTrack[]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const playlist = await getPlaylistBySlug(slug)

  if (!playlist) {
    return {
      title: "Playlist Not Found • WaveNation",
      description: "This playlist could not be found.",
    }
  }

  return {
    title: `${playlist.title} • WaveNation Playlists`,
    description: playlist.description,
    openGraph: {
      title: `${playlist.title} • WaveNation`,
      description: playlist.description,
      images: [{ url: playlist.cover }],
    },
  }
}


export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const playlist = await getPlaylistBySlug(slug)

  if (!playlist) {
    return (
      <main className={styles.page}>
        <div className={styles.shell}>
          <div className={styles.notFound}>
            <h1 className={styles.title}>Playlist not found</h1>
            <p className={styles.lede}>
              Try browsing all playlists or head back home.
            </p>
            <div className={styles.actions}>
              <Link className={styles.btnPrimary} href="/playlists">
                Browse Playlists
              </Link>
              <Link className={styles.btnGhost} href="/">
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroCard}>
            <div className={styles.coverWrap}>
              <Image
                src={playlist.cover}
                alt={`${playlist.title} cover`}
                width={640}
                height={640}
                className={styles.cover}
                priority
              />
              <div className={styles.coverGlow} aria-hidden="true" />
            </div>

            <div className={styles.heroMeta}>
              <div className={styles.badgeRow}>
                {playlist.sponsorLabel ? (
                  <span className={`${styles.badge} ${styles.badgeSponsor}`}>
                    {playlist.sponsorLabel}
                  </span>
                ) : null}

                {playlist.badges?.map((b) => (
                  <span key={b} className={styles.badge}>
                    {b}
                  </span>
                ))}

                {playlist.cadenceLabel ? (
                  <span className={`${styles.badge} ${styles.badgeCadence}`}>
                    {playlist.cadenceLabel}
                  </span>
                ) : null}
              </div>

              <h1 className={styles.title}>{playlist.title}</h1>
              <p className={styles.lede}>{playlist.description}</p>

              <div className={styles.heroSub}>
                {playlist.curatorLabel ? (
                  <span className={styles.curator}>{playlist.curatorLabel}</span>
                ) : null}
              </div>

              {/* ACTION BAR */}
              <div className={styles.actions}>
                {playlist.primaryCta ? (
                  <Link className={styles.btnPrimary} href={playlist.primaryCta.href}>
                    {playlist.primaryCta.label}
                  </Link>
                ) : (
                  <Link className={styles.btnPrimary} href="/listen">
                    Play on WaveNation
                  </Link>
                )}

                <button className={styles.btnSecondary} type="button">
                  Follow
                </button>

                <button className={styles.btnGhost} type="button">
                  Share
                </button>
              </div>

              {/* QUICK LINKS (platform) */}
              <div className={styles.platformRow}>
                {playlist.embeds?.spotify ? (
                  <a className={styles.platformLink} href={playlist.embeds.spotify} target="_blank" rel="noreferrer">
                    Spotify
                  </a>
                ) : null}
                {playlist.embeds?.apple ? (
                  <a className={styles.platformLink} href={playlist.embeds.apple} target="_blank" rel="noreferrer">
                    Apple Music
                  </a>
                ) : null}
                {playlist.embeds?.youtube ? (
                  <a className={styles.platformLink} href={playlist.embeds.youtube} target="_blank" rel="noreferrer">
                    YouTube
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT GRID */}
        <div className={styles.grid}>
          {/* TRACKLIST */}
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.h2}>Tracklist</h2>
              <div className={styles.legend}>
                <span className={styles.legendItem}>
                  <span className={styles.dotNew} /> New
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.dotHot} /> Trending
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.dotExplicit} /> Explicit
                </span>
              </div>
            </div>

            <div className={styles.trackTable} role="table" aria-label="Tracklist">
              <div className={`${styles.trRow} ${styles.trHead}`} role="row">
                <div className={styles.trCellSm} role="columnheader">
                  #
                </div>
                <div className={styles.trCell} role="columnheader">
                  Title
                </div>
                <div className={styles.trCell} role="columnheader">
                  Artist
                </div>
                <div className={styles.trCellSm} role="columnheader">
                  Time
                </div>
              </div>

              {playlist.tracks?.map((t) => (
                <div key={`${t.number}-${t.title}`} className={styles.trRow} role="row">
                  <div className={styles.trCellSm} role="cell">
                    {t.number}
                  </div>
                  <div className={styles.trCell} role="cell">
                    <div className={styles.trackTitle}>
                      {t.title}
                      <span className={styles.trackFlags}>
                        {t.isNew ? <span className={styles.pillNew}>NEW</span> : null}
                        {t.isTrending ? <span className={styles.pillHot}>HOT</span> : null}
                        {t.isExplicit ? <span className={styles.pillExplicit}>E</span> : null}
                      </span>
                    </div>
                  </div>
                  <div className={styles.trCell} role="cell">
                    <span className={styles.artist}>{t.artist}</span>
                  </div>
                  <div className={styles.trCellSm} role="cell">
                    {t.duration}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT RAIL */}
          <aside className={styles.rail}>
            {/* EMBEDS */}
            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <h2 className={styles.h2}>Listen Everywhere</h2>
              </div>

              {playlist.embeds?.spotify ? (
                <div className={styles.embed}>
                  <iframe
                    className={styles.iframe}
                    src={playlist.embeds.spotify}
                    width="100%"
                    height="380"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify playlist"
                  />
                </div>
              ) : (
                <p className={styles.muted}>Add platform embeds to enable one-click listening.</p>
              )}
            </section>

            {/* SUBMIT CTA */}
            <section className={`${styles.panel} ${styles.ctaPanel}`}>
              <h2 className={styles.h2}>Submit Your Music</h2>
              <p className={styles.muted}>
                Think your track fits this vibe? Send it to the WaveNation music team for review.
              </p>
              <Link className={styles.btnPrimary} href={playlist.submitHref ?? "/submit"}>
                Submit a Track
              </Link>
              <p className={styles.micro}>
                Submissions are reviewed weekly. Rights + metadata required.
              </p>
            </section>
          </aside>
        </div>

        {/* RELATED */}
        {playlist.related?.length ? (
          <section className={styles.related}>
            <div className={styles.panelHead}>
              <h2 className={styles.h2}>Related Playlists</h2>
              <Link className={styles.moreLink} href="/playlists">
                View all →
              </Link>
            </div>

            <div className={styles.relatedGrid}>
              {playlist.related.map((p) => (
                <Link key={p.slug} href={`/playlists/${p.slug}`} className={styles.relatedCard}>
                  <div className={styles.relatedCoverWrap}>
                    <Image
                      src={p.cover}
                      alt={`${p.title} cover`}
                      width={520}
                      height={520}
                      className={styles.relatedCover}
                    />
                    <div className={styles.relatedGlow} aria-hidden="true" />
                  </div>
                  <div className={styles.relatedMeta}>
                    <div className={styles.relatedTitle}>{p.title}</div>
                    {p.subtitle ? <div className={styles.relatedSub}>{p.subtitle}</div> : null}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
