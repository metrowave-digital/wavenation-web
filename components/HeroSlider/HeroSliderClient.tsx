"use client";

import React, { useEffect, useState } from "react";
import SlideItem, { SlideContent } from "./SlideItem";
import styles from "./HeroSlider.module.css";
import slideStyles from "./SlideItem.module.css";

interface Props {
  slides: SlideContent[];
}

const AUTO_SLIDE_INTERVAL = 8000;

// ⭐ Allowed by React purity rules.
// useState initializer can safely run Math.random() ONCE.
function generateRandomClasses(slidesLength: number): string[] {
  const candidates = [
    slideStyles.kenBurnsZoomInLeft,
    slideStyles.kenBurnsZoomInRight,
    slideStyles.kenBurnsZoomOutLeft,
    slideStyles.kenBurnsZoomOutRight,
  ];

  return Array.from({ length: slidesLength }, () => {
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  });
}

export default function HeroSliderClient({ slides }: Props) {
  const [current, setCurrent] = useState(0);

  // ⭐ This is the ONLY legal place to use Math.random() in React 18 strict mode.
  const [motionClasses] = useState<string[]>(() =>
    generateRandomClasses(slides.length)
  );

  // Auto rotation
  useEffect(() => {
    if (slides.length < 2) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Fallback for empty slides
  if (!slides || slides.length === 0) {
    return (
      <div className={styles.sliderWrapper}>
        <div className={styles.error}>No articles available.</div>
      </div>
    );
  }

  return (
    <div className={styles.sliderWrapper}>
      {slides.map((slide, index) => {
        const isActive = index === current;

        return (
          <div
            key={slide.id}
            className={`${styles.slide} ${isActive ? styles.active : ""}`}
          >
            <SlideItem
              {...slide}
              isActive={isActive}
              motionClassName={motionClasses[index]}
            />
          </div>
        );
      })}
    </div>
  );
}
