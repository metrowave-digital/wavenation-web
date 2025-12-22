"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./UpNextBox.module.css";

import UpNextHeaderRow from "./UpNextHeaderRow";
import UpNextArtwork from "./UpNextArtwork";
import UpNextInfo from "./UpNextInfo";

import type { UpNextShow, NowPlayingTrack } from "@/types/UpNextTypes";
import { getNextShow } from "@/lib/getNextShow";
import { getNowPlaying } from "@/lib/getNowPlaying";

import Image from "next/image";

export default function UpNextBox() {
  const [nextShow, setNextShow] = useState<UpNextShow | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlayingTrack | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // =======================
  // REFRESH LOGIC
  // =======================
  const refresh = useCallback(async () => {
    const show = await getNextShow();
    setNextShow(show);

    if (show?.isLive) {
      const track = await getNowPlaying();
      setNowPlaying(track);
    }
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, [refresh]);

  // Auto refresh every minute
  useEffect(() => {
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  // =======================
  // LIVE PROGRESS BAR
  // =======================
useEffect(() => {
  if (!nextShow) return;

  if (!nextShow.isLive) {
    // Delay state update to next tick — avoids sync setState
    setTimeout(() => setProgress(0), 0);
    return;
  }

  const updateProgress = () => {
    const now = Date.now();
    const start = nextShow.startDate.getTime();
    const end = nextShow.endDate.getTime();

    const pct = ((now - start) / (end - start)) * 100;
    setProgress(Math.min(Math.max(pct, 0), 100));
  };

  updateProgress();
  const interval = setInterval(updateProgress, 5000);

  return () => clearInterval(interval);
}, [nextShow]);


  if (!nextShow)
    return (
      <div className={styles.upNextBox}>
        <p className={styles.loading}>Loading…</p>
      </div>
    );

  return (
    <div
      className={`${styles.upNextBox} ${
        nextShow.isLive ? styles.liveBox : ""
      }`}
    >
      {/* Header row */}
      <UpNextHeaderRow isLive={nextShow.isLive} />

      {/* Station label */}
      <div
        className={`${styles.stationBadge} ${
          nextShow.isLive ? styles.liveBadge : ""
        }`}
      >
        {nextShow.isLive ? "LIVE NOW • WaveNation Radio" : "Up Next • WaveNation Radio"}
      </div>

      {/* Progress bar */}
      {nextShow.isLive && (
        <div className={styles.progressWrapper}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Now Playing */}
      {nextShow.isLive && nowPlaying && (
        <div className={styles.nowPlayingBox}>
          {nowPlaying?.cover && (
  <Image
    src={nowPlaying.cover}
    alt="Now Playing Artwork"
    width={64}
    height={64}
    className={styles.nowPlayingCover}
  />
)}
          <div>
            <p className={styles.trackTitle}>{nowPlaying.track}</p>
            <p className={styles.trackArtist}>{nowPlaying.artist}</p>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className={styles.upNextMain}>
        <UpNextArtwork artwork={nextShow.artwork} isLive={nextShow.isLive} />

        <UpNextInfo
          title={nextShow.showTitle}
          host={nextShow.hostName}
          date={nextShow.date}
          start={nextShow.start}
          end={nextShow.end}
          avatar={nextShow.avatar}
        />
      </div>
    </div>
  );
}
