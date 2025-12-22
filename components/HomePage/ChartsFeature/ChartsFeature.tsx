"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ChartsFeature.module.css";
import SparklineMini from "./SparklineMini";

/* ============================================================
   LOCAL TYPES (MATCH PAYLOAD SCHEMA)
============================================================ */

interface ChartEntry {
  rank: number;
  lastWeek?: number | null;
  manualTrackInfo?: {
    title?: string;
    artist?: string;
  } | null;
}

interface ChartSponsor {
  enabled?: boolean;
  tier?: "flagship" | "moment" | "accent";
  sponsorName?: string;
  sponsorUrl?: string;
  disclosureText?: string;
}

interface Chart {
  slug: string;
  title?: string;
  entries?: ChartEntry[];
  sponsorship?: ChartSponsor;
}

type RankedSignal = {
  entry: ChartEntry;
  chart: Chart;
  delta: number;
};

type NumberOneSignal = {
  entry: ChartEntry;
  chart: Chart;
};

/* ============================================================
   HELPERS
============================================================ */

function getRankDelta(entry: ChartEntry): number | null {
  if (typeof entry.lastWeek !== "number") return null;
  return entry.lastWeek - entry.rank;
}

function getNumberOne(charts: Chart[]): NumberOneSignal | null {
  for (const chart of charts) {
    const top = chart.entries?.find((e) => e.rank === 1);
    if (top) {
      return { entry: top, chart };
    }
  }
  return null;
}

function getBiggestGainer(charts: Chart[]): RankedSignal | null {
  let best: RankedSignal | null = null;

  charts.forEach((chart) => {
    chart.entries?.forEach((entry) => {
      const delta = getRankDelta(entry);
      if (delta !== null && delta > 0) {
        if (!best || delta > best.delta) {
          best = { entry, chart, delta };
        }
      }
    });
  });

  return best;
}

function getBiggestDrop(charts: Chart[]): RankedSignal | null {
  let worst: RankedSignal | null = null;

  charts.forEach((chart) => {
    chart.entries?.forEach((entry) => {
      const delta = getRankDelta(entry);
      if (delta !== null && delta < 0) {
        if (!worst || delta < worst.delta) {
          worst = { entry, chart, delta };
        }
      }
    });
  });

  return worst;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function ChartsFeature() {
  const [charts, setCharts] = useState<Chart[]>([]);

  useEffect(() => {
    fetch("/api/public/charts")
      .then((res) => res.json())
      .then((data) => {
        setCharts(Array.isArray(data?.docs) ? data.docs : []);
      });
  }, []);

  if (!charts.length) return null;

  const numberOne = getNumberOne(charts);
  const biggestGainer = getBiggestGainer(charts);
  const biggestDrop = getBiggestDrop(charts);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* HEADER */}
        <header className={styles.header}>
          <h2 className={styles.title}>WaveNation Charts</h2>
          <Link href="/charts" className={styles.headerCta}>
            View Charts →
          </Link>
        </header>

        {/* GRID */}
        <div className={styles.grid}>
          {/* ================= #1 FLAGSHIP ================= */}
          {numberOne && (
            <Link
              href={`/charts/${numberOne.chart.slug}`}
              className={[
                styles.cardPrimary,
                numberOne.chart.sponsorship?.enabled &&
                numberOne.chart.sponsorship.tier === "flagship"
                  ? styles.sponsoredFlagship
                  : "",
              ].join(" ")}
            >
              {numberOne.chart.sponsorship?.enabled && (
                <span className={styles.sponsorBadge}>
                  {numberOne.chart.sponsorship.disclosureText ?? "Sponsored"}
                </span>
              )}

              <span className={styles.badge}>#1 This Week</span>

              <h3 className={styles.cardTitle}>
                {numberOne.entry.manualTrackInfo?.title ?? "Unknown Track"}
              </h3>

              <p className={styles.artist}>
                {numberOne.entry.manualTrackInfo?.artist ?? "Unknown Artist"}
              </p>

              <SparklineMini entry={numberOne.entry} />

              {numberOne.chart.sponsorship?.enabled && (
                <div className={styles.sponsorFooter}>
                  Powered by {numberOne.chart.sponsorship.sponsorName}
                </div>
              )}
            </Link>
          )}

          {/* ================= BIGGEST GAINER ================= */}
          {biggestGainer && (
            <Link
              href={`/charts/${biggestGainer.chart.slug}`}
              className={styles.card}
            >
              <span className={styles.gainer}>Biggest Gainer</span>

              <h4 className={styles.cardTitle}>
                {biggestGainer.entry.manualTrackInfo?.title ?? "Unknown Track"}
              </h4>

              <p className={styles.artist}>
                {biggestGainer.entry.manualTrackInfo?.artist ?? "Unknown Artist"}
              </p>

              <div className={styles.deltaUp}>
                ↑ {biggestGainer.delta}
              </div>

              <SparklineMini entry={biggestGainer.entry} />

              {biggestGainer.chart.sponsorship?.enabled &&
                biggestGainer.chart.sponsorship.tier === "moment" && (
                  <div className={styles.sponsorInline}>
                    Sponsored Moment
                  </div>
                )}
            </Link>
          )}

          {/* ================= BIGGEST DROP ================= */}
          {biggestDrop && (
            <Link
              href={`/charts/${biggestDrop.chart.slug}`}
              className={styles.card}
            >
              <span className={styles.drop}>Biggest Drop</span>

              <h4 className={styles.cardTitle}>
                {biggestDrop.entry.manualTrackInfo?.title ?? "Unknown Track"}
              </h4>

              <p className={styles.artist}>
                {biggestDrop.entry.manualTrackInfo?.artist ?? "Unknown Artist"}
              </p>

              <div className={styles.deltaDown}>
                ↓ {Math.abs(biggestDrop.delta)}
              </div>

              <SparklineMini entry={biggestDrop.entry} />

              {biggestDrop.chart.sponsorship?.enabled &&
                biggestDrop.chart.sponsorship.tier === "moment" && (
                  <div className={styles.sponsorInline}>
                    Sponsored Moment
                  </div>
                )}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
