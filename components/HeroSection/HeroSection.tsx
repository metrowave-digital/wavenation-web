import React from "react";
import styles from "./HeroSection.module.css";

import HeroSlider from "../HeroSlider/HeroSlider";

const HeroSection: React.FC = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>

        {/* LEFT COLUMN — HERO */}
        <div className={styles.left}>
          <HeroSlider />
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.right}>

          {/* LIVE TV */}
          <div className={styles.liveTvBox}>
            <span className={styles.liveTvText}>Live TV</span>
          </div>

          {/* ENHANCED UP NEXT v3 */}
<div className={styles.upNextBox}>

  {/* Header Row */}
  <div className={styles.upNextHeaderRow}>
    <div className={styles.upNextHeader}>Up Next on Radio</div>
    <div className={styles.upNextCountdown}>Starts in: 00:42:18</div>
  </div>

  {/* Station Tag */}
  <div className={styles.stationBadge}>WN Radio • R&B Mix</div>

  {/* Main Content */}
  <div className={styles.upNextMain}>

    {/* Artwork Section */}
    <div className={styles.upNextArtworkWrapper}>
      <div className={styles.artGlow}></div>
      <div className={styles.upNextArtwork}>
        <div className={styles.artPlaceholder}>Artwork</div>
      </div>
    </div>

    {/* Right side details */}
    <div className={styles.upNextInfo}>

      {/* Title + Avatar */}
      <div className={styles.titleRow}>
        <h3 className={styles.upNextTitle}>The Weekend Flow</h3>
        <div className={styles.hostAvatar}>
          <span>DS</span>
        </div>
      </div>

      <div className={styles.upNextLine}></div>

      <div className={styles.metaGrid}>
        <div>
          <p className={styles.metaLabel}>Host</p>
          <p className={styles.metaValue}>DJ Smooth</p>
        </div>
        <div>
          <p className={styles.metaLabel}>Date</p>
          <p className={styles.metaValue}>Sat, Dec 14</p>
        </div>
        <div>
          <p className={styles.metaLabel}>Start</p>
          <p className={styles.metaValue}>10:00 AM</p>
        </div>
        <div>
          <p className={styles.metaLabel}>Ends</p>
          <p className={styles.metaValue}>12:00 PM</p>
        </div>
      </div>

    </div>
  </div>

</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
