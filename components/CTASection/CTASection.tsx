// components/CTASection/CTASection.tsx

"use client";

import React from "react";
import CTACard from "./CTACard";
import styles from "./CTASection.module.css";

const CTASection: React.FC = () => {
  const cards = [
    {
      title: "Music & Playlists",
      description: "Explore curated playlists, charts, and the hottest tracks on WaveNation.",
      image: "/images/cta/music-playlists.jpg",
      link: "/playlists",
    },
    {
      title: "Discover Artists",
      description: "Find rising R&B, Hip-Hop, Gospel, and Southern Soul talent from our culture.",
      image: "/images/cta/discover-artists.jpg",
      link: "/artists",
    },
    {
      title: "Shows & Podcasts",
      description: "Stream interviews, radio shows, podcasts, and exclusive WaveNation video sessions.",
      image: "/images/cta/shows-podcasts.jpg",
      link: "/shows",
    },
    {
      title: "Read the Latest News",
      description: "Stay informed with culture news, music updates, reviews, and trending stories.",
      image: "/images/cta/latest-news.jpg",
      link: "/news",
    },
    {
      title: "Join the Creator Hub",
      description: "Upload content, build your audience, and monetize your work on WaveNation.",
      image: "/images/cta/creator-hub.jpg",
      link: "/creator-hub",
    },
    {
      title: "WaveNation+",
      description: "Unlock ad-free radio, exclusive TV content, early releases, and premium shows.",
      image: "/images/cta/wavenation-plus.jpg",
      link: "/plus",
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
