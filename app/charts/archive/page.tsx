import styles from "./ArchivePage.module.css"
import Link from "next/link"

interface ChartArchiveItem {
  id: number
  title: string
  slug: string
  period: string
  chartType: string
}

async function getArchive(): Promise<ChartArchiveItem[]> {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ??
    "https://wavenation.media"

  const res = await fetch(
    `${API_BASE}/api/charts?sort=-period&limit=100`,
    { cache: "no-store" }
  )

  const data = await res.json()
  return data.docs ?? []
}

function formatDate(period: string) {
  return new Date(period).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default async function ChartsArchivePage() {
  const charts = await getArchive()

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Charts Archive</h1>
        <p className={styles.subhead}>
          Explore previous chart weeks across all categories.
        </p>
      </header>

      <section className={styles.grid}>
        {charts.map((chart) => (
          <Link
            key={chart.id}
            href={`/charts/${chart.slug}`}
            className={styles.card}
          >
            <span className={styles.badge}>
              {chart.chartType.toUpperCase()}
            </span>

            <h3 className={styles.cardTitle}>
              {chart.title}
            </h3>

            <p className={styles.cardMeta}>
              Week of {formatDate(chart.period)}
            </p>
          </Link>
        ))}
      </section>
    </main>
  )
}
