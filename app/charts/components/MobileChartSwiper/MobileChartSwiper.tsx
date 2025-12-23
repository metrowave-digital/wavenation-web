"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Image from "next/image"
import styles from "./MobileChartSwiper.module.css"
import { ChartEntry } from "../../types"

/* ------------------------------------------------------------
   LOCAL SAFE EXTENSION (NO GLOBAL TYPE CHANGE)
------------------------------------------------------------ */

type TrackInfoWithColor = {
  dominantColor?: string | null
}

/* ------------------------------------------------------------
   COMPONENT
------------------------------------------------------------ */

interface Props {
  entries: ChartEntry[]
  period: string
}

export default function MobileChartSwiper({
  entries,
  period,
}: Props) {
  /* ------------------------------------------------------------
     PREP SLIDES
  ------------------------------------------------------------ */

  const slides = [...entries]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)

  const [index, setIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const prefersReducedMotion = useReducedMotion()

  /* ------------------------------------------------------------
     AUTOPLAY
  ------------------------------------------------------------ */

  const stopAuto = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startAuto = () => {
    if (prefersReducedMotion || timerRef.current) return

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 4200)
  }

  useEffect(() => {
    if (!slides.length) return
    startAuto()
    return stopAuto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, prefersReducedMotion])

  if (!slides.length) return null

  /* ------------------------------------------------------------
     CURRENT ENTRY
  ------------------------------------------------------------ */

  const entry = slides[index]

  const delta =
    typeof entry.lastWeek === "number"
      ? entry.lastWeek - entry.rank
      : null

  const artwork = entry.manualTrackInfo?.artwork ?? null

  /**
   * SAFELY extract dominant color
   * (works even if ManualTrackInfo doesn't define it)
   */
  const dominantColor =
    (entry.manualTrackInfo as TrackInfoWithColor | null)
      ?.dominantColor ?? "#111418"

  /* ------------------------------------------------------------
     RENDER
  ------------------------------------------------------------ */

  return (
    <div
      className={styles.mobileSwiper}
      key={period}
      aria-roledescription="carousel"
      aria-label="Top 10 chart preview"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={entry.id}
          className={styles.swipeCard}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={stopAuto}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80 && index < slides.length - 1) {
              setIndex((i) => i + 1)
            }
            if (info.offset.x > 80 && index > 0) {
              setIndex((i) => i - 1)
            }
            startAuto()
          }}
          initial={
            prefersReducedMotion
              ? undefined
              : { opacity: 0, x: 40 }
          }
          animate={{ opacity: 1, x: 0 }}
          exit={
            prefersReducedMotion
              ? undefined
              : { opacity: 0, x: -40 }
          }
          transition={{
            duration: prefersReducedMotion ? 0 : 0.25,
            ease: "easeOut",
          }}
        >
          {/* GHOST RANK */}
          <div className={styles.ghostRank}>
            {entry.rank}
          </div>

          <div className={styles.swipeInner}>
            {/* ARTWORK */}
            <div
              className={styles.swipeArtworkWrap}
              style={{ backgroundColor: dominantColor }}
            >
              {artwork ? (
                <Image
                  src={artwork}
                  alt={`${entry.manualTrackInfo?.title ?? "Track"} cover`}
                  width={96}
                  height={96}
                  priority={entry.rank <= 3}
                  className={styles.swipeArtwork}
                />
              ) : (
                <div className={styles.swipeArtworkFallback}>
                  #{entry.rank}
                </div>
              )}

              {/* BLUR-UP PLACEHOLDER */}
              <div
                className={styles.artworkBlur}
                style={{ backgroundColor: dominantColor }}
                aria-hidden
              />
            </div>

            {/* INFO */}
            <div className={styles.swipeInfo}>
              <div className={styles.swipeRank}>
                #{entry.rank}
              </div>

              <div className={styles.swipeTitle}>
                {entry.manualTrackInfo?.title ?? "Unknown Track"}
              </div>

              <div className={styles.swipeArtist}>
                {entry.manualTrackInfo?.artist ?? "Unknown Artist"}
              </div>

              <div className={styles.miniStats}>
                <span>LW {entry.lastWeek ?? "—"}</span>
                <span>PK {entry.peak ?? "—"}</span>
                <span>WOC {entry.weeksOnChart ?? "—"}</span>
              </div>

              <div
                className={`${styles.miniMovement} ${
                  entry.movement === "new"
                    ? styles.new
                    : delta != null
                    ? delta > 0
                      ? styles.up
                      : styles.down
                    : ""
                }`}
              >
                {entry.movement === "new"
                  ? "NEW"
                  : delta != null
                  ? `${delta > 0 ? "+" : ""}${delta}`
                  : "—"}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* DOTS */}
      <div className={styles.modernDots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.modernDot} ${
              i === index ? styles.modernDotActive : ""
            }`}
            onClick={() => {
              stopAuto()
              setIndex(i)
              startAuto()
            }}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  )
}
