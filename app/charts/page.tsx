"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import styles from "./ChartIndex.module.css"

/* ============================================================
   Types
============================================================ */

interface ChartEntry {
  rank: number
  lastWeek?: number | null
  movement?: "new" | "up" | "down" | null
  manualTrackInfo?: {
    title?: string
    artist?: string
  } | null
}

interface Chart {
  id: number
  title: string
  slug: string
  period?: string
  entries?: ChartEntry[]
}

type ClimberResult = {
  entry: ChartEntry
  delta: number
  chartSlug: string
}

type DebutResult = {
  entry: ChartEntry
  chartSlug: string
}

const CHART_FAMILIES: Record<
  string,
  { title: string; description: string }
> = {
  "christian-hh": {
    title: "Christian Hip-Hop",
    description:
      "Faith-driven lyricism and modern Christian hip-hop culture.",
  },
  "rnb-soul": {
    title: "R&B & Soul",
    description:
      "Modern soul, slow jams, and timeless R&B records shaping the mood.",
  },
  "gospel": {
    title: "Gospel",
    description:
      "Songs of praise, worship, and spiritual impact across generations.",
  },
  "rap": {
    title: "Rap",
    description:
      "Street culture, lyricism, and records moving the needle.",
  },
  "southern-soul": {
    title: "Southern Soul",
    description:
      "Down-home grooves, grown-folk classics, and dance-floor favorites.",
  },
  "the-hitlist": {
    title: "The Hitlist",
    description:
      "WaveNation’s definitive ranking of records shaping the sound right now.",
  },
}



/* ============================================================
   Helpers
============================================================ */

function getFamilyLabel(slug: string) {
  return slug.replace(/-\d{8}$/, "").replace(/-/g, " ").toUpperCase()
}

function getBiggestClimber(charts: Chart[]): ClimberResult | null {
  let best: ClimberResult | null = null

  charts.forEach((chart) => {
    chart.entries?.forEach((entry) => {
      if (typeof entry.lastWeek === "number") {
        const delta = entry.lastWeek - entry.rank
        if (delta > 0 && (!best || delta > best.delta)) {
          best = {
            entry,
            delta,
            chartSlug: chart.slug,
          }
        }
      }
    })
  })

  return best
}

function getBiggestDebut(charts: Chart[]): DebutResult | null {
  let debut: DebutResult | null = null

  charts.forEach((chart) => {
    chart.entries?.forEach((entry) => {
      if (entry.movement === "new") {
        if (!debut || entry.rank < debut.entry.rank) {
          debut = {
            entry,
            chartSlug: chart.slug,
          }
        }
      }
    })
  })

  return debut
}

/* ============================================================
   Page
============================================================ */

export default function ChartsIndexPage() {
  const [charts, setCharts] = useState<Chart[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/public/charts")
      .then((res) => res.json())
      .then((data) => {
        setCharts(Array.isArray(data?.docs) ? data.docs : [])
      })
      .finally(() => setLoading(false))
  }, [])

  /* ================= SORT BY LATEST ================= */

  const sorted = [...charts].sort(
    (a, b) =>
      new Date(b.period ?? 0).getTime() -
      new Date(a.period ?? 0).getTime()
  )

  /* ================= RANDOM FEATURED ================= */

  const featured =
    sorted.length > 0
      ? sorted[Math.floor(Math.random() * sorted.length)]
      : null

  /* ================= GLOBAL HIGHLIGHTS ================= */

  const biggestClimber = getBiggestClimber(sorted)
  const biggestDebut = getBiggestDebut(sorted)

  /* ================= GROUP BY FAMILY ================= */

  const grouped = sorted.reduce<Record<string, Chart[]>>((acc, chart) => {
    const family = chart.slug.replace(/-\d{8}$/, "")
    acc[family] ??= []
    acc[family].push(chart)
    return acc
  }, {})

  return (
    <main className={styles.page}>
      {/* ================= HEADER ================= */}
      <header className={styles.header}>
        <h1 className={styles.title}>WaveNation Charts</h1>
        <p className={styles.description}>
          Official WaveNation rankings across music and culture — updated weekly.
        </p>
      </header>

      {/* ================= GLOBAL HIGHLIGHTS ================= */}
      {(biggestClimber || biggestDebut) && (
        <section className={styles.highlights}>
          {biggestClimber && (
            <Link
              href={`/charts/${biggestClimber.chartSlug}`}
              className={styles.highlightCard}
            >
              <div className={styles.highlightLabel}>
                Biggest Climber (All Charts)
              </div>

              <div className={styles.highlightTitle}>
                {biggestClimber.entry.manualTrackInfo?.title}
              </div>

              <div className={styles.highlightArtist}>
                {biggestClimber.entry.manualTrackInfo?.artist}
              </div>

              <div className={styles.highlightMeta}>
                <span className={styles.climber}>
                  ↑ {biggestClimber.delta} spots
                </span>
                {" · "}
                {getFamilyLabel(biggestClimber.chartSlug)}
              </div>
            </Link>
          )}

          {biggestDebut && (
            <Link
              href={`/charts/${biggestDebut.chartSlug}`}
              className={styles.highlightCard}
            >
              <div className={styles.highlightLabel}>
                Biggest Debut (All Charts)
              </div>

              <div className={styles.highlightTitle}>
                {biggestDebut.entry.manualTrackInfo?.title}
              </div>

              <div className={styles.highlightArtist}>
                {biggestDebut.entry.manualTrackInfo?.artist}
              </div>

              <div className={styles.highlightMeta}>
                <span className={styles.debut}>
                  Debuts at #{biggestDebut.entry.rank}
                </span>
                {" · "}
                {getFamilyLabel(biggestDebut.chartSlug)}
              </div>
            </Link>
          )}
        </section>
      )}

      {/* ================= FEATURED ================= */}
      {featured && (
        <section className={styles.featured}>
          <div className={styles.featuredLabel}>Featured Chart</div>
          <Link href={`/charts/${featured.slug}`}>
            <div className={styles.featuredTitle}>{featured.title}</div>
          </Link>
          <span className={styles.latestBadge}>Latest Week</span>
        </section>
      )}

      {/* ================= SKELETON ================= */}
      {loading &&
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}

      {/* ================= GROUPED CHARTS ================= */}
      {!loading &&
        Object.entries(grouped).map(([family, charts]) => (
          <section key={family} className={styles.group}>
            <h2 className={styles.groupTitle}>
  {CHART_FAMILIES[family]?.title ??
    family.replace(/-/g, " ").toUpperCase()}
</h2>

{CHART_FAMILIES[family]?.description && (
  <p className={styles.groupDescription}>
    {CHART_FAMILIES[family].description}
  </p>
)}



            <div className={styles.grid}>
              {charts.map((chart) => (
                <Link
                  key={chart.id}
                  href={`/charts/${chart.slug}`}
                  className={styles.card}
                >
                  <div className={styles.cardTitle}>{chart.title}</div>
                  {chart.period && (
                    <div className={styles.cardMeta}>
                      Week of{" "}
                      {new Date(chart.period).toLocaleDateString()}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* ================= AD + ATTRIBUTION ================= */}
<section className={styles.attribution}>
  {/* Advertisement */}
  <div className={styles.adSlot}>
    Advertisement
  </div>

  {/* Powered by */}
  <div>
    Powered by{" "}
    <a
      href="https://urbaninfluencer.com"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "var(--blue)", textDecoration: "none", fontWeight: 900 }}
    >
      Urban Influencer
    </a>
  </div>
</section>

    </main>
  )
}
