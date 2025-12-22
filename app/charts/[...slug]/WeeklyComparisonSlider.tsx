"use client"

import { motion, AnimatePresence } from "framer-motion"
import styles from "./ChartsPage.module.css"
import { Chart } from "../types"

interface Props {
  current: Chart
  previous: Chart | null
}

export default function WeeklyComparisonSlider({
  current,
  previous,
}: Props) {
  if (!previous) return null

  const currentTop = [...current.entries]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)

  const prevMap = new Map(
    previous.entries.map((e) => [e.id, e])
  )

  return (
    <div className={styles.compareWrapper}>
      <h2 className={styles.mobileHeading}>
        📊 Week-to-Week Comparison
      </h2>

      <div className={styles.compareDragHint}>
        Drag ← → to compare weeks
      </div>

      <div className={styles.compareGrid}>
        <AnimatePresence>
          {currentTop.map((entry) => {
            const prev = prevMap.get(entry.id)

            return (
              <motion.div
                key={entry.id}
                className={styles.compareRow}
                layout
                initial={{
                  opacity: prev ? 1 : 0,
                  y: prev ? 0 : 10,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.compareRank}>
                  {prev ? prev.rank : "NEW"}
                </div>

                <div>
                  <div className={styles.trackTitle}>
                    {entry.manualTrackInfo?.title}
                  </div>
                  <div className={styles.artist}>
                    {entry.manualTrackInfo?.artist}
                  </div>

                  <div className={styles.compareArrow}>
                    {prev
                      ? prev.rank > entry.rank
                        ? "↑"
                        : prev.rank < entry.rank
                        ? "↓"
                        : "—"
                      : "NEW"}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
