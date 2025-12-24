"use client"

import { useRef } from "react"
import styles from "./ChartRows.module.css"
import Sparkline from "../Sparkline/Sparkline"
import Image from "next/image"
import { ChartEntry } from "../../types"

interface Props {
  entries: ChartEntry[]
  previousEntries?: ChartEntry[] | null
}

/* ------------------------------------------------------------
   RANGE BUILDER
------------------------------------------------------------ */

function buildRanges(entries: ChartEntry[]) {
  const sorted = [...entries].sort((a, b) => a.rank - b.rank)

  const ranges: {
    id: string
    label: string
    items: ChartEntry[]
  }[] = []

  const top10 = sorted.filter((e) => e.rank <= 10)
  if (top10.length) {
    ranges.push({
      id: "top-10",
      label: "Top 10",
      items: top10,
    })
  }

  let start = 11
  while (start <= sorted.length) {
    const end = Math.min(start + 19, sorted.length)
    const items = sorted.filter(
      (e) => e.rank >= start && e.rank <= end
    )

    if (items.length) {
      ranges.push({
        id: `range-${start}-${end}`,
        label: `Ranked ${start}–${end}`,
        items,
      })
    }

    start += 20
  }

  return ranges
}

/* ------------------------------------------------------------
   COMPONENT
------------------------------------------------------------ */

export default function ChartRows({
  entries,
  previousEntries,
}: Props) {
  const ranges = buildRanges(entries)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const scrollToRange = (id: string) => {
    const el = sectionRefs.current[id]
    if (!el) return

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const renderRow = (entry: ChartEntry) => {
    const delta =
      typeof entry.lastWeek === "number"
        ? entry.lastWeek - entry.rank
        : null

    const movementClass =
      entry.movement === "new"
        ? styles.new
        : delta !== null
        ? delta > 0
          ? styles.up
          : styles.down
        : styles.flat

    const trend =
      previousEntries
        ?.filter(
          (e) =>
            e.manualTrackInfo?.title ===
              entry.manualTrackInfo?.title &&
            e.manualTrackInfo?.artist ===
              entry.manualTrackInfo?.artist
        )
        .map((e) => e.rank)
        .concat(entry.rank) ?? [entry.rank]

    const artwork = entry.manualTrackInfo?.artwork ?? null
    const dominantColor =
      entry.manualTrackInfo?.dominantColor ?? "#111418"

    return (
      <div key={entry.id} className={styles.row}>
        <div className={styles.ghostRank} aria-hidden>
          {entry.rank}
        </div>

        <div className={styles.rank}>{entry.rank}</div>

        <div className={styles.track}>
          <div className={styles.trackMain}>
            <div
              className={styles.artworkWrap}
              style={{ backgroundColor: dominantColor }}
            >
              {artwork ? (
                <Image
                  src={artwork}
                  alt={`${entry.manualTrackInfo?.title ?? "Track"} cover`}
                  width={44}
                  height={44}
                  className={styles.artwork}
                />
              ) : (
                <span className={styles.artworkFallback}>♪</span>
              )}
              <div
                className={styles.artworkBlur}
                style={{ backgroundColor: dominantColor }}
                aria-hidden
              />
            </div>

            <div className={styles.trackText}>
              <div className={styles.trackTitle}>
                {entry.manualTrackInfo?.title ?? "—"}
              </div>
              <div className={styles.artist}>
                {entry.manualTrackInfo?.artist ?? "—"}
              </div>
            </div>
          </div>

          <div className={styles.trend}>
            <Sparkline ranks={trend} />
          </div>
        </div>

        <div className={styles.stats}>
          <span>LW {entry.lastWeek ?? "—"}</span>
          <span>PK {entry.peak ?? "—"}</span>
          <span>WOC {entry.weeksOnChart ?? "—"}</span>
        </div>

        <div className={`${styles.movement} ${movementClass}`}>
          {entry.movement === "new"
            ? "NEW"
            : delta !== null
            ? `${delta > 0 ? "▲" : "▼"} ${Math.abs(delta)}`
            : "—"}
        </div>
      </div>
    )
  }

  return (
    <section className={styles.chart} aria-label="Full chart">
      <header className={styles.header}>
        <h2 className={styles.title}>Full Chart</h2>

        <select
          className={styles.jumpSelect}
          onChange={(e) => {
            if (e.target.value) scrollToRange(e.target.value)
          }}
        >
          <option value="">Jump to…</option>
          {ranges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </header>

      {ranges.map((range) => (
        <div
          key={range.id}
          ref={(el) => {
            sectionRefs.current[range.id] = el
          }}
          className={styles.rangeSection}
        >
          <div className={styles.rangeHeader}>
            <span className={styles.rangeLabel}>
              {range.label}
            </span>
          </div>

          <div className={styles.section}>
            {range.items.map(renderRow)}
          </div>

          {range.id !== "top-10" && (
            <div className={styles.rangeAd}>
              <div className={styles.adUnit}>
                Advertisement
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
