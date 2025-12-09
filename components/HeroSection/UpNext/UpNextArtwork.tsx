"use client";

import Image from "next/image";
import React from "react";
import styles from "./UpNextBox.module.css";

interface Props {
  artwork: string | null;
  isLive?: boolean;
}

export default function UpNextArtwork({ artwork, isLive }: Props) {
  return (
    <div
      className={`${styles.upNextArtworkWrapper} ${
        isLive ? styles.liveArtwork : ""
      }`}
    >
      <div className={styles.artGlow}></div>

      <div className={styles.upNextArtwork}>
        {artwork ? (
          <Image
            src={artwork}
            alt="Show Artwork"
            fill
            className={styles.artImage}
            priority
            sizes="200px"
          />
        ) : (
          <div className={styles.artPlaceholder}>Artwork</div>
        )}
      </div>
    </div>
  );
}
