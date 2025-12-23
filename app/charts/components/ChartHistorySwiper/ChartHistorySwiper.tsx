"use client"

import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import styles from "./ChartHistory.module.css"

/* ------------------------------------------------------------
   Types (aligned with charts)
------------------------------------------------------------ */

interface ChartHistoryEntry {
  rank: number
  manualTrackInfo?: {
    title?: string
    artwork?: string | null
    dominantColor?: string | null
  } | null
}

interface ChartSnapshot {
  id: number
  period: string
  entries: ChartHistoryEntry[]
}

interface Props {
  snapshots: ChartSnapshot[]
}

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */

export default function ChartHistorySwiper({
  snapshots,
}: Props) {
  const prefersReducedMotion = useReducedMotion()
  const [expanded, setExpanded] = useState(true)

  const grouped = useMemo(() => {
    const map = new Map<string, ChartSnapshot[]>()

    snapshots.forEach((snap) => {
      const date = new Date(snap.period)
      const key = `${date.getFullYear()} • ${date.toLocaleString(
        "en-US",
        { month: "long" }
      )}`

      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(snap)
    })

    return Array.from(map.entries())
  }, [snapshots])

  if (!snapshots?.length) return null

  return (
    <section
      className={styles.wrapper}
      aria-labelledby="chart-history-heading"
    >
      {/* HEADER */}
      <header className={styles.header}>
        <h3
          id="chart-history-heading"
          className={styles.title}
        >
          Chart History
        </h3>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={styles.toggle}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </header>

      {/* BODY */}
      {expanded &&
        grouped.map(([groupLabel, weeks]) => (
          <section
            key={groupLabel}
            className={styles.group}
          >
            <h4 className={styles.groupLabel}>
              {groupLabel}
            </h4>

            <motion.div
              className={styles.scroller}
              role="list"
              drag={prefersReducedMotion ? false : "x"}
              dragConstraints={{ left: -320, right: 0 }}
              dragElastic={0.08}
              aria-label={`Charts from ${groupLabel}`}
            >
              {weeks.map((week) => {
                const topEntry = week.entries.find(
                  (e) => e.rank === 1
                )

                const artwork =
                  topEntry?.manualTrackInfo?.artwork ??
                  null

                const dominantColor =
                  topEntry?.manualTrackInfo
                    ?.dominantColor ?? "#111418"

                return (
                  <motion.article
                    key={week.id}
                    className={styles.card}
                    role="listitem"
                    whileTap={
                      prefersReducedMotion
                        ? undefined
                        : { scale: 0.96 }
                    }
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 10 }
                    }
                    animate={
                      prefersReducedMotion
                        ? false
                        : { opacity: 1, y: 0 }
                    }
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    {/* WEEK */}
                    <div className={styles.week}>
                      {new Date(
                        week.period
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>

                    {/* #1 SPOTLIGHT */}
                    <div className={styles.topRow}>
                      <div
                        className={styles.artworkWrap}
                        style={{
                          backgroundColor: dominantColor,
                        }}
                        aria-hidden="true"
                      >
                        {artwork ? (
                          <Image
                            src={artwork}
                            alt={`${topEntry?.manualTrackInfo?.title ?? "Track"} cover`}
                            width={48}
                            height={48}
                            className={styles.artwork}
                          />
                        ) : (
                          <span
                            className={
                              styles.artworkFallback
                            }
                          >
                            #1
                          </span>
                        )}

                        {/* BLUR-UP */}
                        <div
                          className={styles.artworkBlur}
                          style={{
                            backgroundColor:
                              dominantColor,
                          }}
                          aria-hidden
                        />
                      </div>

                      <div className={styles.topText}>
                        <div className={styles.topLabel}>
                          #1 This Week
                        </div>
                        <strong
                          className={styles.topTitle}
                        >
                          {topEntry?.manualTrackInfo
                            ?.title ?? "—"}
                        </strong>
                      </div>
                    </div>

                    {/* TOP 5 LIST */}
                    <ul className={styles.list}>
                      {week.entries
                        .slice(0, 5)
                        .map((entry) => (
                          <li
                            key={`${week.id}-${entry.rank}`}
                          >
                            <span
                              className={
                                styles.listRank
                              }
                            >
                              #{entry.rank}
                            </span>
                            <span
                              className={
                                styles.listTitle
                              }
                            >
                              {entry.manualTrackInfo
                                ?.title ?? "—"}
                            </span>
                          </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <button
                      type="button"
                      className={styles.cta}
                      onClick={() => {
                        const params =
                          new URLSearchParams(
                            window.location.search
                          )
                        params.set(
                          "week",
                          week.period
                        )
                        window.location.search =
                          params.toString()
                      }}
                    >
                      View full chart →
                    </button>
                  </motion.article>
                )
              })}
            </motion.div>
          </section>
        ))}
    </section>
  )
}
