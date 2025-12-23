"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion"
import Image from "next/image"
import styles from "./MobileChartSwiper.module.css"
import { ChartEntry } from "../../types"

interface Props {
  entries: ChartEntry[]
  period: string
}

export default function MobileChartSwiper({
  entries,
  period,
}: Props) {
  const slides = [...entries]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10)

  const [index, setIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const prefersReducedMotion = useReducedMotion()

  /* ------------------------------------------------------------
     AUTOPLAY CONTROL
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
    }, 4000)
  }

  useEffect(() => {
    if (!slides.length) return
    startAuto()
    return stopAuto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, prefersReducedMotion])

  if (!slides.length) return null

  const entry = slides[index]

  const delta =
    typeof entry.lastWeek === "number"
      ? entry.lastWeek - entry.rank
      : null

  const artwork =
    entry.manualTrackInfo?.artwork ?? null

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
          {/* GHOSTED RANK — EDITORIAL BACKDROP */}
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "6px",
              fontSize: "3.5rem",
              fontWeight: 800,
              color: "rgba(255,255,255,0.06)",
              pointerEvents: "none",
              lineHeight: 1,
              zIndex: 0,
            }}
          >
            {entry.rank}
          </div>

          {/* CONTENT LAYER */}
          <div className={styles.swipeInner} style={{ position: "relative", zIndex: 1 }}>
            {/* ARTWORK */}
            <div className={styles.swipeArtworkWrap}>
              {artwork ? (
                <Image
                  src={artwork}
                  alt=""
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

      {/* PROGRESS DOTS */}
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
