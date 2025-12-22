"use client"

import styles from "./ChartsPage.module.css"

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */

interface ManualTrackInfo {
  title?: string
  artist?: string
}

export interface ChartEntry {
  rank: number
  lastWeek?: number | null
  manualTrackInfo?: ManualTrackInfo | null
}

interface ChartClimberCardProps {
  entries: ChartEntry[]
}

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */

function findBiggestClimber(
  entries: ChartEntry[]
): ChartEntry | undefined {
  return entries
    .filter(
      (entry) =>
        typeof entry.lastWeek === "number" &&
        entry.lastWeek > entry.rank
    )
    .sort((a, b) => {
      const deltaA = (a.lastWeek ?? 0) - a.rank
      const deltaB = (b.lastWeek ?? 0) - b.rank
      return deltaB - deltaA
    })[0]
}

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */

export default function ChartClimberCard({
  entries,
}: ChartClimberCardProps) {
  const climber = findBiggestClimber(entries)

  if (!climber || climber.lastWeek == null) return null

  const jump = climber.lastWeek - climber.rank

  return (
    <div className={styles.swipeCard}>
      <div className={styles.biggestGainer}>
        📊 Biggest Gainer
      </div>

      <div className={styles.swipeTitle}>
        {climber.manualTrackInfo?.title ?? "Unknown Track"}
      </div>

      <div className={styles.swipeArtist}>
        {climber.manualTrackInfo?.artist ?? "Unknown Artist"}
      </div>

      <strong>↑ {jump} spots this week</strong>
    </div>
  )
}
