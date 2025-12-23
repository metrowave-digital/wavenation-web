"use client"

import styles from "./GainerCard.module.css"
import { ChartEntry } from "../../types"
import { findBiggestDebut } from "../../utils"
import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"

interface Props {
  entries: ChartEntry[]
}

export default function BiggestDebutCard({ entries }: Props) {
  const debut = findBiggestDebut(entries)
  const prefersReducedMotion = useReducedMotion()

  if (!debut) return null

  const artwork = debut.manualTrackInfo?.artwork ?? null
  const dominantColor =
    debut.manualTrackInfo?.dominantColor ?? "#111418"

  return (
    <section
      className={styles.card}
      aria-label="Biggest debut this week"
    >
      {/* BADGE */}
      <motion.div
        className={styles.badgeNew}
        initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
        animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        BIGGEST DEBUT
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
              alt={`${debut.manualTrackInfo?.title ?? "Track"} cover`}
              width={72}
              height={72}
              priority
              className={styles.artwork}
            />
          ) : (
            <div className={styles.artworkFallback}>NEW</div>
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
            {debut.manualTrackInfo?.title ?? "Unknown Track"}
          </div>

          <div className={styles.artist}>
            {debut.manualTrackInfo?.artist ?? "Unknown Artist"}
          </div>

          <div className={styles.metric}>
            Debuts at <span>#{debut.rank}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
