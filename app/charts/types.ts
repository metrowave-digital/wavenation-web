export interface ManualTrackInfo {
  title?: string
  artist?: string
  artwork?: string
}

export type Movement =
  | "up"
  | "down"
  | "new"
  | "re-entry"
  | "same"

export interface ChartEntry {
  id: string
  rank: number
  lastWeek?: number | null
  peak?: number | null
  weeksOnChart?: number | null
  movement?: Movement | null
  manualTrackInfo?: ManualTrackInfo | null
}

export interface Chart {
  id: number
  title: string
  slug: string
  chartType: string
  period: string
  description?: string | null
  entries: ChartEntry[]
}
