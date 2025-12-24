"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useReducedMotion } from "framer-motion"
import styles from "./ChartHistory.module.css"

/* ------------------------------------------------------------
   Types
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
  chartFamily: string
}

/* ------------------------------------------------------------
   Utilities
------------------------------------------------------------ */

function periodToDateSlug(period: string) {
  // Accepts "YYYY-MM-DD" or ISO strings
  const [year, month, day] = period.split("T")[0].split("-")
  return `${year}${month}${day}`
}


/* Haptic (safe + optional) */
function triggerHaptic() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(10)
  }
}

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */

export default function ChartHistorySwiper({
  snapshots,
  chartFamily,
}: Props) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  const [expanded, setExpanded] = useState(true)

  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const lastScrollLeft = useRef(0)

  /* ----------------------------------------------------------
     Group snapshots by Month + Year
  ---------------------------------------------------------- */

  const grouped = useMemo(() => {
    const map = new Map<string, ChartSnapshot[]>()

    snapshots.forEach((snap) => {
      const d = new Date(snap.period)
      const label = `${d.getFullYear()} • ${d.toLocaleString(
        "en-US",
        { month: "long" }
      )}`

      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(snap)
    })

    return Array.from(map.entries())
  }, [snapshots])

  if (!snapshots.length) return null

  /* ----------------------------------------------------------
     Render
  ---------------------------------------------------------- */

  return (
    <section className={styles.wrapper}>
      {/* HEADER */}
      <header className={styles.header}>
        <h3 className={styles.title}>Chart History</h3>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={styles.toggle}
          aria-expanded={expanded}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </header>

      {expanded &&
        grouped.map(([groupLabel, weeks]) => (
          <section key={groupLabel} className={styles.group}>
            <h4 className={styles.groupLabel}>{groupLabel}</h4>

            <div className={styles.scrollerMask}>
              <div
                ref={scrollerRef}
                className={styles.scroller}
                onScroll={(e) => {
                  const el = e.currentTarget
                  if (
                    Math.abs(
                      el.scrollLeft - lastScrollLeft.current
                    ) > 56 &&
                    !prefersReducedMotion
                  ) {
                    triggerHaptic()
                    lastScrollLeft.current = el.scrollLeft
                  }
                }}
                onTouchEnd={(e) => {
                  const el = e.currentTarget
                  const cardWidth = 260 + 12
                  const index = Math.round(
                    el.scrollLeft / cardWidth
                  )

                  el.scrollTo({
                    left: index * cardWidth,
                    behavior: "smooth",
                  })
                }}
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
                    <article
                      key={week.id}
                      className={styles.card}
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
                            backgroundColor:
                              dominantColor,
                          }}
                        >
                          {artwork ? (
                            <Image
                              src={artwork}
                              alt=""
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

                      {/* TOP 5 */}
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
    const slugDate = periodToDateSlug(week.period)

    router.push(
      `/charts/${chartFamily}-${slugDate}`,
      { scroll: true }
    )
  }}
>
  View full chart →
</button>

                    </article>
                  )
                })}
              </div>

              {/* Swipe Hint */}
              <div className={styles.swipeHint}>
                SWIPE →
              </div>
            </div>
          </section>
        ))}
    </section>
  )
}
