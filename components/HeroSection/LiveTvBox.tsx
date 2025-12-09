import React from "react";
import styles from "./HeroSection.module.css";

const LiveTvBox = () => {
  return (
    <div className={styles.liveTvBox}>
      <div className={styles.liveTvHeader}>WaveNation TV</div>

      {/* STREAM PLACEHOLDER */}
      <div className={styles.streamPlaceholder}>
        <div className={styles.streamShimmer}></div>
        <span>Live Stream Coming Soon</span>
      </div>
    </div>
  );
};

export default LiveTvBox;
