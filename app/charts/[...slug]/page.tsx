import "./charts.print.css"
import styles from "./ChartsPage.module.css"

import MobileChartSwiper from "../components/MobileChartSwiper/MobileChartSwiper"
import WeeklyComparisonSlider from "../components/WeeklyComparison/WeeklyComparisonSlider"
import ChartClimberCard from "../components/ChartGainerCards/ChartClimberCard"
import BiggestDebutCard from "../components/ChartGainerCards/BiggestDebutCard"
import ChartRows from "../components/ChartRows/ChartRows"
import DroppedSongs from "../components/DroppedSongs/DroppedSongs"
import ChartHistorySwiper from "../components/ChartHistorySwiper/ChartHistorySwiper"
import Sidebar from "../components/Sidebar/Sidebar"
import ChartAnimations from "./ChartAnimations"
import ScrollToTopOnSlugChange from "../components/ScrollToTopOnSlugChange"

import type { Chart, ChartEntry } from "../types"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { getSpotifyArtwork } from "@/lib/spotifyArtwork"

/* ============================================================
   PAGE PROPS
============================================================ */

interface PageProps {
  params: Promise<{ slug?: string[] | string }>
}

/* ============================================================
   METADATA
============================================================ */

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const resolvedParams = await params
  const slugParam = resolvedParams.slug
  const slug = Array.isArray(slugParam)
    ? slugParam.join("/")
    : slugParam

  const chartName = slug
    ? slug.replace(/-\d{8}$/, "").replace(/-/g, " ")
    : "Charts"

  return {
    title: `${chartName} Charts | WaveNation`,
    description:
      "Weekly music charts spotlighting independent and emerging artists. Powered by WaveNation Media.",
    alternates: {
      canonical: `https://wavenation.media/charts/${slug}`,
    },
    openGraph: {
      title: `${chartName} Charts | WaveNation`,
      description:
        "Weekly music charts spotlighting independent and emerging artists.",
      url: `https://wavenation.media/charts/${slug}`,
      siteName: "WaveNation",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${chartName} Charts | WaveNation`,
      description:
        "Weekly music charts spotlighting independent and emerging artists.",
    },
  }
}

/* ============================================================
   HELPERS
============================================================ */

function getChartFamily(slug: string) {
  return slug.replace(/-\d{8}$/, "")
}

function getTrackKey(entry: ChartEntry): string | null {
  const info = entry.manualTrackInfo

  if (!info?.title || !info?.artist) return null

  return `${info.artist.trim().toLowerCase()}__${info.title
    .trim()
    .toLowerCase()}`
}


function getDroppedSongs(
  current: ChartEntry[],
  previous?: ChartEntry[]
): ChartEntry[] {
  if (!previous || previous.length === 0) return []

  const currentKeys = new Set(
    current
      .map(getTrackKey)
      .filter((k): k is string => Boolean(k))
  )

  return previous.filter((prev) => {
    const key = getTrackKey(prev)
    return key !== null && !currentKeys.has(key)
  })
}



function toWeekLabel(period: string) {
  return new Date(period).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/* ============================================================
   PAGE
============================================================ */

export default async function ChartPage({
  params,
}: PageProps) {
  const resolvedParams = await params
  const slugParam = resolvedParams.slug
  const slug = Array.isArray(slugParam)
    ? slugParam.join("/")
    : slugParam

  if (!slug) {
    return <main>Chart not found</main>
  }

  const chartFamily = getChartFamily(slug)
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ??
    "https://wavenation.media"

  /* ------------------------------------------------------------
     CURRENT CHART
  ------------------------------------------------------------ */

  const isDatedSlug = /-\d{8}$/.test(slug)

  const chartQuery = isDatedSlug
    ? `${API_BASE}/api/charts?where[slug][equals]=${slug}&limit=1`
    : `${API_BASE}/api/charts?where[slug][like]=${chartFamily}-%&sort=-period&limit=1`

  const res = await fetch(chartQuery, { cache: "no-store" })
  const data: { docs: Chart[] } = await res.json()
  const chart = data.docs[0]

  if (!chart) {
    return <main>Chart not found</main>
  }

  /* ------------------------------------------------------------
     PREVIOUS CHART
  ------------------------------------------------------------ */

  const prevRes = await fetch(
    `${API_BASE}/api/charts?where[slug][like]=${chartFamily}-%&where[period][less_than]=${chart.period}&sort=-period&limit=1`,
    { cache: "no-store" }
  )

  const prevData: { docs: Chart[] } = await prevRes.json()
  const prevChart = prevData.docs[0] ?? null

  /* ------------------------------------------------------------
     CHART HISTORY
  ------------------------------------------------------------ */

  const historyRes = await fetch(
    `${API_BASE}/api/charts?where[slug][like]=${chartFamily}-%&sort=-period&limit=12`,
    { cache: "no-store" }
  )

  const historyData: { docs: Chart[] } =
    await historyRes.json()

  /* ------------------------------------------------------------
     ARTWORK ENRICHMENT (SPOTIFY)
  ------------------------------------------------------------ */

  const enrichedEntries: ChartEntry[] =
    await Promise.all(
      chart.entries.map(async (entry) => {
        const title = entry.manualTrackInfo?.title
        const artist = entry.manualTrackInfo?.artist

        if (!title || !artist) return entry

        const artwork = await getSpotifyArtwork(
          artist,
          title
        )

        return {
          ...entry,
          manualTrackInfo: {
            ...entry.manualTrackInfo,
            artwork: artwork ?? undefined,
          },
        }
      })
    )

  const sortedEntries = enrichedEntries
    .slice()
    .sort((a, b) => a.rank - b.rank)

  const dropped = getDroppedSongs(
    sortedEntries,
    prevChart?.entries
  )

  /* ------------------------------------------------------------
     RENDER
  ------------------------------------------------------------ */

  return (
    <main className={styles.page}>
      <ScrollToTopOnSlugChange />
      <ChartAnimations />

      {/* ================= HEADER ================= */}
      <header className={styles.header}>
        <span className={styles.badge}>
          {chart.chartType.toUpperCase()}
        </span>

        <h1 className={styles.title}>
          {chart.title}
        </h1>

        <p className={styles.meta}>
          Week of {toWeekLabel(chart.period)}
        </p>

        <p className={styles.poweredBy}>
          Powered by{" "}
          <a
            href="https://www.theurbaninfluencer.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Urban Influencer
          </a>
        </p>

        {chart.description && (
          <p className={styles.description}>
            {chart.description}
          </p>
        )}
      </header>

      {/* ================= LAYOUT ================= */}
      <div className={styles.layout}>
        {/* -------- MAIN COLUMN -------- */}
        <section className={styles.main}>
          <MobileChartSwiper
            entries={sortedEntries}
            period={chart.period}
          />

          <div className={styles.highlightGrid}>
            <ChartClimberCard entries={sortedEntries} />
            <BiggestDebutCard entries={sortedEntries} />
          </div>

          <WeeklyComparisonSlider
            current={{
              ...chart,
              entries: sortedEntries,
            }}
            previous={prevChart}
          />
{/* ===== INLINE AD (Between History & Full Chart) ===== */}
          <div className={styles.inlineAd}>
            <div className={styles.adUnit}>
              Advertisement
            </div>
          </div>

          <ChartRows
            entries={sortedEntries}
            previousEntries={prevChart?.entries}
          />

          <DroppedSongs
            entries={dropped}
            chartPeriod={chart.period}
          />

          <ChartHistorySwiper
            chartFamily={chartFamily}
            snapshots={historyData.docs.map((c) => ({
              id: c.id,
              period: c.period,
              entries: c.entries,
            }))}
          />

          {/* ===== INLINE AD (Between History & Full Chart) ===== */}
          <div className={styles.inlineAd}>
            <div className={styles.adUnit}>
              Advertisement
            </div>
          </div>
          
        </section>

        {/* -------- SIDEBAR -------- */}
        <aside className={styles.sidebarCol}>
          <Sidebar />
        </aside>
      </div>
          
    </main>
  )
}
