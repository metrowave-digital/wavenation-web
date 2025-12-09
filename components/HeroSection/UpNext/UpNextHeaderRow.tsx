"use client";

import React, { useEffect, useState } from "react";
import styles from "./UpNextBox.module.css";

interface Props {
  isLive?: boolean;
}

export default function UpNextHeaderRow({ isLive }: Props) {
  const [countdown, setCountdown] = useState("00:00:00");

 useEffect(() => {
  if (isLive) {
    // Avoid synchronous state update
    setTimeout(() => setCountdown("LIVE"), 0);
    return;
  }

  const target = new Date();
  target.setHours(target.getHours() + 1);

  const interval = setInterval(() => {
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      setCountdown("00:00:00");
      return;
    }

    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
    const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    setCountdown(`${h}:${m}:${s}`);
  }, 1000);

  return () => clearInterval(interval);
}, [isLive]);


  return (
    <div className={styles.upNextHeaderRow}>
      <div className={styles.upNextHeader}>
        {isLive ? "LIVE NOW" : "Up Next on Radio"}
      </div>

      <div className={isLive ? styles.liveIndicator : styles.upNextCountdown}>
        {isLive ? "LIVE" : `Starts in: ${countdown}`}
      </div>
    </div>
  );
}
