"use client";

import React, { useEffect, useState } from "react";
import styles from "./UpNextBox.module.css";

export default function UpNextHeaderRow({ isLive }: { isLive?: boolean }) {
  const [countdown, setCountdown] = useState("00:00:00");

  useEffect(() => {
    if (isLive) return; // ❌ NO setState here

    const target = new Date();
    target.setHours(target.getHours() + 1);

    const interval = setInterval(() => {
      const diff = target.getTime() - Date.now();

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
    <div className={styles.headerRow}>
      <span className={styles.headerTitle}>
        {isLive ? "LIVE NOW" : "UP NEXT"}
      </span>

      <span className={isLive ? styles.livePill : styles.countdown}>
        {isLive ? "ON AIR" : countdown}
      </span>
    </div>
  );
}
