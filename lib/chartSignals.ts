import type { Chart, ChartEntry } from "@/types/charts"

/* ============================================================
   Rank Helpers
============================================================ */

export function getRankDelta(entry: ChartEntry): number | null {
  if (typeof entry.lastWeek !== "number") return null
  return entry.lastWeek - entry.rank
}

/* ============================================================
   Biggest Gainer (↑)
============================================================ */

export function getBiggestGainer(
  charts: Chart[]
): { entry: ChartEntry; chartSlug: string; delta: number } | null {
  let best: { entry: ChartEntry; chartSlug: string; delta: number } | null = null

  charts.forEach((chart: Chart) => {
    chart.entries?.forEach((entry: ChartEntry) => {
      const delta = getRankDelta(entry)
      if (delta !== null && delta > 0) {
        if (!best || delta > best.delta) {
          best = {
            entry,
            chartSlug: chart.slug,
            delta,
          }
        }
      }
    })
  })

  return best
}

/* ============================================================
   Biggest Drop (↓)
============================================================ */

export function getBiggestDrop(
  charts: Chart[]
): { entry: ChartEntry; chartSlug: string; delta: number } | null {
  let worst: { entry: ChartEntry; chartSlug: string; delta: number } | null = null

  charts.forEach((chart: Chart) => {
    chart.entries?.forEach((entry: ChartEntry) => {
      const delta = getRankDelta(entry)
      if (delta !== null && delta < 0) {
        if (!worst || delta < worst.delta) {
          worst = {
            entry,
            chartSlug: chart.slug,
            delta,
          }
        }
      }
    })
  })

  return worst
}

/* ============================================================
   #1 Track Finder
============================================================ */

export function getNumberOne(
  charts: Chart[]
): { entry: ChartEntry; chartSlug: string } | null {
  for (const chart of charts) {
    const top = chart.entries?.find(
      (e: ChartEntry) => e.rank === 1
    )
    if (top) {
      return { entry: top, chartSlug: chart.slug }
    }
  }
  return null
}
