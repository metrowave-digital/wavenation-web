"use client"

import styles from "./ChartsPage.module.css"
import { ChartEntry } from "../types"
import { findBiggestDebut } from "../utils"

interface Props {
  entries: ChartEntry[]
}

export default function BiggestDebutCard({
  entries,
}: Props) {
  const debut = findBiggestDebut(entries)
  if (!debut) return null

  return (
    <div className={styles.swipeCard}>
      <div className={styles.debutBadge}>
        🆕 Biggest Debut
      </div>

      <div className={styles.swipeTitle}>
        {debut.manualTrackInfo?.title ?? "Unknown Track"}
      </div>

      <div className={styles.swipeArtist}>
        {debut.manualTrackInfo?.artist ?? "Unknown Artist"}
      </div>

      <strong>Debuts at #{debut.rank}</strong>
    </div>
  )
}
