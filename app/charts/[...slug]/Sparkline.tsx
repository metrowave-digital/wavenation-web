"use client"

import styles from "./ChartsPage.module.css"

interface Props {
  ranks: number[]
}

export default function Sparkline({ ranks }: Props) {
  const max = Math.max(...ranks)
  const min = Math.min(...ranks)

  const points = ranks
    .map((r, i) => {
      const x = (i / (ranks.length - 1)) * 100
      const y = ((r - min) / (max - min || 1)) * 100
      return `${x},${100 - y}`
    })
    .join(" ")

  return (
    <svg viewBox="0 0 100 100" className={styles.sparkline}>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        points={points}
      />
    </svg>
  )
}
