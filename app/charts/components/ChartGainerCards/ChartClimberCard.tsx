"use client"

import styles from "./GainerCard.module.css"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { ChartEntry } from "../../types"

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

interface Props {
  entries: ChartEntry[]
}

export default function ChartClimberCard({ entries }: Props) {
  const climber = findBiggestClimber(entries)
  const prefersReducedMotion = useReducedMotion()

  if (!climber || climber.lastWeek == null) return null

  const jump = climber.lastWeek - climber.rank
  const artwork = climber.manualTrackInfo?.artwork ?? null
  const dominantColor =
    climber.manualTrackInfo?.dominantColor ?? "#111418"

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
        <div
          className={styles.artworkWrap}
          style={{ backgroundColor: dominantColor }}
        >
          {artwork ? (
            <Image
              src={artwork}
              alt={`${climber.manualTrackInfo?.title ?? "Track"} cover`}
              width={72}
              height={72}
              className={styles.artwork}
            />
          ) : (
            <div className={styles.artworkFallback}>▲</div>
          )}

          {/* BLUR-UP */}
          <div
            className={styles.artworkBlur}
            style={{ backgroundColor: dominantColor }}
            aria-hidden
          />
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
