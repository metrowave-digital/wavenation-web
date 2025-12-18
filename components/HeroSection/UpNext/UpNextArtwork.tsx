"use client";

import Image from "next/image";
import styles from "./UpNextBox.module.css";

export default function UpNextArtwork({
  artwork,
  isLive,
}: {
  artwork: string | null;
  isLive?: boolean;
}) {
  return (
    <div className={`${styles.artwork} ${isLive ? styles.artLive : ""}`}>
      {artwork ? (
        <Image src={artwork} alt="Show artwork" fill />
      ) : (
        <div className={styles.artFallback}>Artwork</div>
      )}
    </div>
  );
}
