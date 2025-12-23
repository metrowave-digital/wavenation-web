"use client"

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion"
import styles from "./WeeklyComparison.module.css"
import { Chart } from "../../types"

interface Props {
  current: Chart
  previous: Chart | null
}

/* ------------------------------------------------------------
   Helpers
------------------------------------------------------------ */

function getTrackKey(entry: {
  manualTrackInfo?: {
    title?: string
    artist?: string
  } | null
}) {
  const title =
    entry.manualTrackInfo?.title
      ?.trim()
      .toLowerCase() ?? ""
  const artist =
    entry.manualTrackInfo?.artist
      ?.trim()
      .toLowerCase() ?? ""

  return `${artist}__${title}`
}

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */

export default function WeeklyComparisonSlider({
  current,
  previous,
}: Props) {
  const prefersReducedMotion = useReducedMotion()

  if (!previous) return null

  const currentTop = [...current.entries]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3)

  const prevMap = new Map(
    previous.entries.map((e) => [
      getTrackKey(e),
      e,
    ])
  )

  return (
    <section
      className={styles.wrapper}
      aria-labelledby="weekly-compare-heading"
    >
      <header className={styles.header}>
        <h2
          id="weekly-compare-heading"
          className={styles.title}
        >
          Week-to-Week Movement
        </h2>
        <p className={styles.subhead}>
          Top 3 comparison vs last week
        </p>
      </header>

      <div className={styles.list} role="list">
        <AnimatePresence mode="popLayout">
          {currentTop.map((entry) => {
            const prev = prevMap.get(
              getTrackKey(entry)
            )

            const movement =
              prev == null
                ? "new"
                : prev.rank > entry.rank
                ? "up"
                : prev.rank < entry.rank
                ? "down"
                : "flat"

            return (
              <motion.article
                key={getTrackKey(entry)}
                className={styles.card}
                role="listitem"
                layout
                initial={
                  prefersReducedMotion
                    ? undefined
                    : {
                        opacity: prev ? 1 : 0,
                        y: prev ? 0 : 12,
                      }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: -12 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.35,
                  ease: "easeOut",
                }}
              >
                {/* GHOST CURRENT RANK */}
                <div
                  className={styles.ghostRank}
                  aria-hidden="true"
                >
                  #{entry.rank}
                </div>

                {/* LEFT: LAST WEEK */}
                <div
                  className={styles.lastWeek}
                  aria-label={
                    prev
                      ? `Last week rank ${prev.rank}`
                      : "New entry"
                  }
                >
                  {prev ? prev.rank : "NEW"}
                </div>

                {/* CENTER: TRACK */}
                <div className={styles.track}>
                  <div className={styles.trackTitle}>
                    {entry.manualTrackInfo?.title ?? "—"}
                  </div>
                  <div className={styles.artist}>
                    {entry.manualTrackInfo?.artist ?? "—"}
                  </div>
                </div>

                {/* RIGHT: MOVEMENT */}
                <div
                  className={`${styles.movement} ${
                    movement === "up"
                      ? styles.up
                      : movement === "down"
                      ? styles.down
                      : movement === "new"
                      ? styles.new
                      : styles.flat
                  }`}
                  aria-hidden="true"
                >
                  {movement === "up"
                    ? "↑ UP"
                    : movement === "down"
                    ? "↓ DOWN"
                    : movement === "new"
                    ? "NEW"
                    : "—"}
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </div>
    </section>
  )
}
