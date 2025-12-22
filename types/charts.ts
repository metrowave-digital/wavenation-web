/* ============================================================
   WaveNation Chart Types (CANONICAL)
   Used across homepage, charts, signals, sparklines
============================================================ */

export interface ChartEntry {
  id?: string | number

  rank: number
  lastWeek?: number | null
  peak?: number | null
  weeksOnChart?: number | null

  movement?: "up" | "down" | "new" | "re-entry" | "same" | null

  manualTrackInfo?: {
    title?: string
    artist?: string
    coverArt?: {
      url?: string
    } | null
    externalUrl?: string
  } | null
}

export interface Chart {
  id: number | string
  title: string
  slug: string
  period?: string
  chartType?: string
  description?: string

  entries?: ChartEntry[]
}
