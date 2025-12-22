import styles from "./ChartsPage.module.css"
import WeeklyComparisonSlider from "./WeeklyComparisonSlider"
import MobileChartSwiper from "./MobileChartSwiper"
import ChartClimberCard from "./ChartClimberCard"
import BiggestDebutCard from "./BiggestDebutCard"
import Sparkline from "./Sparkline"
import ChartAnimations from "./ChartAnimations"
import type { Chart, ChartEntry } from "../types"

interface PageProps {
  params: Promise<{ slug?: string[] | string }>
}

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

function getChartFamily(slug: string) {
  return slug.replace(/-\d{8}$/, "")
}

function getDroppedSongs(current: ChartEntry[], previous?: ChartEntry[]) {
  if (!previous) return []
  const currentIds = new Set(current.map((e) => e.id))
  return previous.filter((e) => !currentIds.has(e.id))
}

function toWeekLabel(period: string) {
  return new Date(period).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default async function ChartPage({ params }: PageProps) {
  const resolvedParams = await params
  const slugParam = resolvedParams.slug
  const slug = Array.isArray(slugParam) ? slugParam.join("/") : slugParam

  if (!slug) {
    return (
      <main className={`${styles.root} ${styles.page}`}>
        Chart not found
      </main>
    )
  }

  const chartFamily = getChartFamily(slug)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://wavenation.media"

  /* CURRENT (LATEST) CHART */
  const res = await fetch(
    `${API_BASE}/api/charts?where[slug][like]=${chartFamily}-%&sort=-period&limit=1`,
    { cache: "no-store" }
  )

  const data: { docs: Chart[] } = await res.json()
  const chart = data.docs[0]

  if (!chart) {
    return (
      <main className={`${styles.root} ${styles.page}`}>
        Chart not found
      </main>
    )
  }

  /* PREVIOUS CHART */
  const prevRes = await fetch(
    `${API_BASE}/api/charts?where[slug][like]=${chartFamily}-%&where[period][less_than]=${chart.period}&sort=-period&limit=1`,
    { cache: "no-store" }
  )

  const prevData: { docs: Chart[] } = await prevRes.json()
  const prevChart = prevData.docs[0] ?? null

  const dropped = getDroppedSongs(chart.entries, prevChart?.entries)

  const sortedEntries = chart.entries.slice().sort((a, b) => a.rank - b.rank)

  return (
    <main className={`${styles.root} ${styles.page}`}>
      {/* GSAP animation driver */}
      <ChartAnimations />

      {/* ================= HEADER ================= */}
      <header className={styles.header}>
        <span className={styles.badge}>{chart.chartType.toUpperCase()}</span>

        <h1 className={styles.title}>{chart.title}</h1>

        <p className={styles.meta}>Week of {toWeekLabel(chart.period)}</p>

        <p className={styles.official}>WaveNation Official Chart</p>

        <p className={styles.poweredBy}>
          Powered by{" "}
          <a
            href="https://urbaninfluencer.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Urban Influencer
          </a>
        </p>

        {chart.description && <p className={styles.description}>{chart.description}</p>}
      </header>

      {/* ================= MAIN ================= */}
      <section className={styles.main}>
        {/* MOBILE HIGHLIGHTS */}
        <MobileChartSwiper entries={chart.entries} period={chart.period} />

        <div className={styles.mobileGrid}>
          <ChartClimberCard entries={chart.entries} />
          <BiggestDebutCard entries={chart.entries} />
        </div>

        {/* WEEKLY COMPARISON */}
        <WeeklyComparisonSlider current={chart} previous={prevChart} />

        {/* FULL CHART (DESKTOP + MOBILE) */}
        <section className={styles.chart} aria-label="Full chart">
          {sortedEntries.map((entry, _idx) => {
            const delta =
              typeof entry.lastWeek === "number" ? entry.lastWeek - entry.rank : null

            const movementClass =
              entry.movement === "new"
                ? styles.new
                : delta !== null
                ? delta > 0
                  ? styles.up
                  : delta < 0
                  ? styles.down
                  : ""
                : ""

            const trend =
              prevChart?.entries
                ?.filter(
                  (e) =>
                    e.manualTrackInfo?.title === entry.manualTrackInfo?.title &&
                    e.manualTrackInfo?.artist === entry.manualTrackInfo?.artist
                )
                .map((e) => e.rank)
                .concat(entry.rank) ?? [entry.rank]

            const isNew = entry.movement === "new"
            const isStreak = delta !== null && delta >= 3 // “rank-change streak” threshold
            const isTopRow = entry.rank === 1

            return (
              <div key={entry.id}>
                {/* TOP 10 CUT DIVIDER — insert BEFORE rank 11 */}
                {entry.rank === 11 && (
                  <div className={styles.top10Divider} data-wn-divider>
                    <span>TOP 10</span>
                  </div>
                )}

                <div
                  data-wn-row
                  data-streak={isStreak ? "true" : undefined}
                  className={[
                    styles.row,
                    isTopRow ? styles.topRow : "",
                    isNew ? styles.newEntry : "",
                  ].join(" ")}
                >
                  <div className={styles.rank}>{entry.rank}</div>

                  <div className={styles.trackBlock}>
                    <div className={styles.trackTitle}>
                      {entry.manualTrackInfo?.title ?? "Unknown Track"}
                    </div>
                    <div className={styles.artist}>
                      {entry.manualTrackInfo?.artist ?? "Unknown Artist"}
                    </div>

                    <div data-wn-spark>
                      <Sparkline ranks={trend} />
                    </div>

                    <div className={styles.badgeRow}>
                      {delta !== null && delta >= 5 && (
                        <span className={styles.biggestGainer}>BIGGEST GAINER</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.stats}>
                    <span>LW {entry.lastWeek ?? "—"}</span>
                    <span>PK {entry.peak ?? "—"}</span>
                    <span>WOC {entry.weeksOnChart ?? "—"}</span>
                  </div>

                  <div className={`${styles.movement} ${movementClass}`} data-wn-movement>
                    {entry.movement === "new"
                      ? "NEW"
                      : delta !== null
                      ? `${delta > 0 ? "▲" : delta < 0 ? "▼" : "—"}${
                          delta !== 0 ? ` ${Math.abs(delta)}` : ""
                        }`
                      : "—"}
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* DROPPED SONGS */}
        {dropped.length > 0 && (
          <section className={styles.droppedSection}>
            <h3 className={styles.sectionTitle}>Dropped This Week</h3>
            {dropped.map((song) => (
              <div key={song.id} className={styles.ghostRow}>
                <span>#{song.rank}</span>
                <span>
                  {song.manualTrackInfo?.title} — {song.manualTrackInfo?.artist}
                </span>
              </div>
            ))}
          </section>
        )}
      </section>

      {/* ================= SIDEBAR ================= */}
      <aside className={styles.sidebar}>
       
               <div className={styles.sidebarBox}>
          <div className={styles.sidebarTitle}>Powered by Urban Influencer</div>
          <p className={styles.sidebarText}>Amplifying culture and independent voices.</p>

          {/* Social icons (simple + brand-safe) */}
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/urbaninfluencer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Urban Influencer on Instagram"
              title="Instagram"
            >
              IG
            </a>
            <a
              href="https://x.com/urbaninfluencer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Urban Influencer on X"
              title="X"
            >
              X
            </a>
            <a
              href="https://www.linkedin.com/company/urbaninfluencer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Urban Influencer on LinkedIn"
              title="LinkedIn"
            >
              in
            </a>
          </div>
        </div>
       
       <div className={styles.sidebarBox}>
          <div className={styles.sidebarTitle}>Newsletter</div>
          <p className={styles.sidebarText}>Weekly charts, editor insight, and cultural signals.</p>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        <div className={styles.sidebarBox}>
          <div className={styles.sidebarTitle}>Advertisement</div>
          <div className={styles.adSlot}>Ad Slot (1:1)</div>
        </div>

         <div className={styles.sidebarBox}>
          <div className={styles.sidebarTitle}>Chart Methodology</div>
          <p className={styles.sidebarText}>
            Rankings reflect WaveNation airplay, streaming performance, editorial weighting, and
            cultural impact.
          </p>
        </div>
      </aside>
    </main>
  )
}
