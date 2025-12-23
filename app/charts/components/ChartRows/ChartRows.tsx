"use client"

import styles from "./ChartRows.module.css"
import Sparkline from "../Sparkline/Sparkline"
import Image from "next/image"
import { ChartEntry } from "../../types"

interface Props {
  entries: ChartEntry[]
  previousEntries?: ChartEntry[] | null
}

export default function ChartRows({
  entries,
  previousEntries,
}: Props) {
  return (
    <section
      className={styles.chart}
      data-wn-chart
      aria-label="Full chart"
    >
      {entries.map((entry) => {
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

        return (
          <div key={entry.id}>
            {/* TOP 10 DIVIDER */}
            {entry.rank === 11 && (
              <div className={styles.top10Divider}>
                <span>TOP 10</span>
              </div>
            )}

            {/* ROW */}
            <div
              className={styles.row}
              role="group"
              aria-label={`Rank ${entry.rank}`}
            >
              {/* GHOST RANK */}
              <div className={styles.ghostRank} aria-hidden="true">
                {entry.rank}
              </div>

              {/* RANK */}
              <div className={styles.rank}>
                {entry.rank}
              </div>

              {/* TRACK */}
              <div className={styles.track}>
                <div className={styles.trackMain}>
                  <div
                    className={styles.artwork}
                    aria-hidden="true"
                  >
                    {entry.manualTrackInfo?.artwork ? (
                      <Image
                        src={entry.manualTrackInfo.artwork}
                        alt=""
                        width={44}
                        height={44}
                      />
                    ) : (
                      <span>♪</span>
                    )}
                  </div>

                  <div className={styles.trackText}>
                    <div className={styles.title}>
                      {entry.manualTrackInfo?.title ?? "—"}
                    </div>
                    <div className={styles.artist}>
                      {entry.manualTrackInfo?.artist ?? "—"}
                    </div>
                  </div>
                </div>

                {/* SPARKLINE */}
                <div className={styles.trend}>
                  <Sparkline ranks={trend} />
                </div>
              </div>

              {/* STATS */}
              <div className={styles.stats}>
                <span>LW {entry.lastWeek ?? "—"}</span>
                <span>PK {entry.peak ?? "—"}</span>
                <span>WOC {entry.weeksOnChart ?? "—"}</span>
              </div>

              {/* MOVEMENT */}
              <div
                className={`${styles.movement} ${movementClass}`}
                aria-label="Chart movement"
              >
                {entry.movement === "new"
                  ? "NEW"
                  : delta !== null
                  ? `${delta > 0 ? "▲" : "▼"} ${Math.abs(delta)}`
                  : "—"}
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
