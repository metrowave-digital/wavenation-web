"use client"

import styles from "./Sparkline.module.css"

interface Props {
  ranks: number[]
}

export default function Sparkline({ ranks }: Props) {
  if (!ranks || ranks.length === 0) return null

  const max = Math.max(...ranks)
  const min = Math.min(...ranks)
  const isFlat = max === min

  const points =
    ranks.length === 1 || isFlat
      ? // Flat / single-point trend
        "0,50 100,50"
      : ranks
          .map((r, i) => {
            const x = (i / (ranks.length - 1)) * 100
            const y =
              ((r - min) / (max - min)) * 100
            return `${x},${100 - y}`
          })
          .join(" ")

  return (
    <svg
      viewBox="0 0 100 100"
      className={styles.sparkline}
      aria-hidden="true"
      focusable="false"
      shapeRendering="geometricPrecision"
    >
      {/* BASELINE (SUBTLE) */}
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        className={styles.baseline}
      />

      {/* TREND LINE */}
      <polyline
        points={points}
        fill="none"
        className={styles.line}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
