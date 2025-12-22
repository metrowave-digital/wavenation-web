"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import styles from "./ChartsPage.module.css"
import { ChartEntry } from "../types"

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

  if (!slides.length) return null

  const entry = slides[index]

  /* AUTO ADVANCE */
  const startAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 4000)
  }

  const stopAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  if (!timerRef.current) startAuto()

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    stopAuto()

    if (info.offset.x < -80 && index < slides.length - 1)
      setIndex(index + 1)

    if (info.offset.x > 80 && index > 0)
      setIndex(index - 1)

    startAuto()
  }

  const delta =
    typeof entry.lastWeek === "number"
      ? entry.lastWeek - entry.rank
      : null

  return (
    <div className={styles.mobileSwiper} key={period}>
      <AnimatePresence mode="wait">
        <motion.div
          key={entry.id}
          className={styles.swipeCard}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.swipeRank}>#{entry.rank}</div>

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
              entry.movement ? styles[entry.movement] : ""
            }`}
          >
            {entry.movement === "new"
              ? "NEW"
              : delta != null
              ? `${delta > 0 ? "+" : ""}${delta}`
              : "—"}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* MODERN DOTS */}
      <div className={styles.modernDots}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              stopAuto()
              setIndex(i)
              startAuto()
            }}
            className={`${styles.modernDot} ${
              i === index ? styles.modernDotActive : ""
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
