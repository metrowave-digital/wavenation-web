"use client"

import styles from "./GainerCard.module.css"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */

interface ManualTrackInfo {
  title?: string
  artist?: string
  artwork?: string
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
  const prefersReducedMotion = useReducedMotion()

  if (!climber || climber.lastWeek == null) return null

  const jump = climber.lastWeek - climber.rank
  const artwork = climber.manualTrackInfo?.artwork ?? null

  return (
    <section
      className={styles.card}
      aria-label="Biggest gainer this week"
    >
      {/* BADGE */}
      <motion.div
        className={styles.badgeUp}
        initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
        animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        BIGGEST GAINER
      </motion.div>

      <div className={styles.content}>
        {/* ARTWORK */}
        <div className={styles.artworkWrap}>
          {artwork ? (
            <Image
              src={artwork}
              alt=""
              width={72}
              height={72}
              className={styles.artwork}
            />
          ) : (
            <div className={styles.artworkFallback}>▲</div>
          )}
        </div>

        {/* TEXT */}
        <div className={styles.text}>
          <div className={styles.title}>
            {climber.manualTrackInfo?.title ?? "Unknown Track"}
          </div>

          <div className={styles.artist}>
            {climber.manualTrackInfo?.artist ?? "Unknown Artist"}
          </div>

          <div className={styles.metric}>
            Up <span>+{jump}</span> spots
          </div>
        </div>
      </div>
    </section>
  )
}
