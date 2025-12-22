import { ChartEntry } from "./types"

/**
 * Biggest Debut:
 * - Only entries marked as "new"
 * - Lowest rank (best debut) wins
 */
export function findBiggestDebut(
  entries: ChartEntry[]
): ChartEntry | undefined {
  return entries
    .filter((entry) => entry.movement === "new")
    .sort((a, b) => a.rank - b.rank)[0]
}

/**
 * Velocity score:
 * Simple momentum signal based on rank movement
 */
export function getVelocity(entry: ChartEntry): number | null {
  if (typeof entry.lastWeek !== "number") return null
  return entry.lastWeek - entry.rank
}
