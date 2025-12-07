// components/CTASection/CTASection.tsx

"use client";

import React from "react";
import CTACard from "./CTACard";
import styles from "./CTASection.module.css";

const CTASection: React.FC = () => {
  const cards = [
    {
      title: "Playlists",
      description: "Curated vibes from WaveNation editors.",
      image: "/images/cta/playlists.jpg",
    },
    {
      title: "Discover Artists",
      description: "Find emerging R&B, Hip-Hop & Southern Soul talent.",
      image: "/images/cta/artists.jpg",
    },
    {
      title: "Music Videos",
      description: "Watch interviews, videos & exclusive sessions.",
      image: "/images/cta/music-videos.jpg",
    },
    {
      title: "Creator Hub",
      description: "Upload, monetize, and grow on WaveNation.",
      image: "/images/cta/creator-hub.jpg",
    },
    {
      title: "Podcasts",
      description: "Tap into culture, commentary & storytelling.",
      image: "/images/cta/podcasts.jpg",
    },
    {
      title: "Southern Soul Hub",
      description: "Your home for Southern Soul shows & playlists.",
      image: "/images/cta/southern-soul.jpg",
    },
  ];

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>Explore More</h2>

      <div className={styles.grid}>
        {cards.map((card, index) => (
          <CTACard key={index} {...card} />
        ))}
      </div>
    </section>
  );
};

export default CTASection;
