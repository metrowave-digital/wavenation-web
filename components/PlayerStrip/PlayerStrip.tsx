"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./PlayerStrip.module.css";

interface Props {
  artwork?: string;
  artist?: string;
  title?: string;
}

export default function PlayerStrip({
  artwork = "/fallback-art.jpg",
  artist = "Unknown Artist",
  title = "Untitled Track",
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={styles.strip}>
      {/* Artwork */}
      <div className={styles.artworkWrapper}>
        <Image src={artwork} alt={title} fill className={styles.artwork} />
      </div>

      {/* Meta */}
      <div className={styles.meta}>
        <p className={styles.title}>{title}</p>
        <p className={styles.artist}>{artist}</p>
      </div>

      {/* Controls */}
      <button
        className={styles.playButton}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      {/* Progress */}
      <div className={styles.progressWrapper}>
        <div className={styles.progress} />
      </div>

      <button className={styles.expand}>⋯</button>
    </div>
  );
}
