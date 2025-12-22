"use client"

import { motion } from "framer-motion"
import styles from "./ChartsPage.module.css"

interface ChartSnapshot {
  id: number
  period: string
  entries: {
    rank: number
    manualTrackInfo?: {
      title?: string
    } | null
  }[]
}

export default function ChartHistorySwiper({
  snapshots,
}: {
  snapshots: ChartSnapshot[]
}) {
  if (!snapshots?.length) return null

  return (
    <div className={styles.historyWrapper}>
      <h3 className={styles.historyTitle}>Chart History</h3>

      <div className={styles.historyScroller}>
        {snapshots.map((week) => (
          <motion.div
            key={week.id}
            className={styles.historyCard}
            whileTap={{ scale: 0.96 }}
          >
            <h4>
              {new Date(week.period).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </h4>

            <ul>
              {week.entries.slice(0, 5).map((entry) => (
                <li key={entry.rank}>
                  #{entry.rank}{" "}
                  {entry.manualTrackInfo?.title ?? "—"}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
