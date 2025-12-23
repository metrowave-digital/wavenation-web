"use client"

import styles from "./DroppedSongs.module.css"
import Link from "next/link"
import { ChartEntry } from "../../types"

interface Props {
  entries: ChartEntry[]
  chartPeriod: string
}

export default function DroppedSongs({
  entries,
  chartPeriod,
}: Props) {
  if (!entries || entries.length === 0) return null

  return (
    <section
      className={styles.wrapper}
      aria-labelledby="dropped-heading"
    >
      <header className={styles.header}>
        <h3
          id="dropped-heading"
          className={styles.title}
        >
          Dropped This Week
        </h3>
        <p className={styles.subhead}>
          Songs that exited the chart
        </p>
      </header>

      <ul
        className={styles.list}
        aria-label="Songs that dropped off the chart this week"
      >
        {entries.map((song, idx) => {
          const title = song.manualTrackInfo?.title ?? "—"
          const artist = song.manualTrackInfo?.artist ?? "—"

          return (
            <li
              key={`${title}-${artist}-${idx}`}
              className={styles.row}
            >
              {/* GHOSTED LAST RANK */}
              <div
                className={styles.rank}
                aria-hidden="true"
              >
                #{song.rank}
              </div>

              {/* META */}
              <div className={styles.meta}>
                <Link
                  href={`/charts?week=${chartPeriod}`}
                  className={styles.link}
                >
                  <span className={styles.songTitle}>
                    {title}
                  </span>
                  <span className={styles.artist}>
                    {artist}
                  </span>
                </Link>

                <div className={styles.details}>
                  <span>
                    Last week #{song.rank}
                  </span>
                  {typeof song.peak === "number" && (
                    <span>• Peak #{song.peak}</span>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
