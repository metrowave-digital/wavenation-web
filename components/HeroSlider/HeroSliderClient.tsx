// components/HeroSlider/HeroSliderClient.tsx
"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./HeroSlider.module.css";
import type { HeroSliderClientProps, SlideData } from "./HeroSlider.types";

export default function HeroSliderClient({
  slides,
  autoPlayInterval = 8000,
}: HeroSliderClientProps) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const total = slides.length;

  /* -------------------------------------------------------
     EFFECT A — AUTOPLAY ENGINE
  -------------------------------------------------------- */
  useEffect(() => {
    if (paused || total <= 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const stepMs = 80;
    const totalSteps = autoPlayInterval / stepMs;
    let currentStep = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      currentStep += 1;
      const pct = currentStep / totalSteps;

      if (pct >= 1) {
        currentStep = 0;
        setIndex((i) => (i + 1) % total);
      } else {
        setProgress(pct);
      }
    }, stepMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, autoPlayInterval, total]);

  /* -------------------------------------------------------
     EFFECT B — SAFE PROGRESS RESET
     Using requestAnimationFrame to avoid synchronous update
  -------------------------------------------------------- */
  useEffect(() => {
    if (paused || total <= 1) {
      requestAnimationFrame(() => setProgress(0));
    }
  }, [paused, total]);

  if (!total) return null;
  const current: SlideData | undefined = slides[index];
  if (!current) return null;

  /* -------------------------------------------------------
     HANDLERS
  -------------------------------------------------------- */
  const goTo = (targetIndex: number) => {
    if (targetIndex < 0) setIndex(total - 1);
    else if (targetIndex >= total) setIndex(0);
    else setIndex(targetIndex);
    setProgress(0);
  };

  const handleKeyDownDots = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    }
  };

  /* -------------------------------------------------------
     RENDER
  -------------------------------------------------------- */

  return (
    <section
      className={styles.root}
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.inner}>
        {/* LEFT: MEDIA */}
        <Link
          href={current.href}
          className={styles.media}
          aria-label={current.title}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className={styles.mediaLayer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {current.mediaType === "video" && current.videoUrl ? (
                <video
                  className={styles.mediaVideo}
                  src={current.videoUrl}
                  poster={current.videoPoster ?? undefined}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : current.imageUrl ? (
                <Image
                  src={current.imageUrl}
                  alt={current.imageAlt || current.title}
                  fill
                  priority={index === 0}
                  className={styles.mediaImage}
                  sizes="(min-width:1024px) 60vw, 100vw"
                />
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className={styles.mediaGradient} />

          {/* LEFT BADGES */}
          <div className={styles.mediaBadgeRow}>
            <div className={styles.badgeGroup}>
              {current.categoryLabel && (
                <span className={styles.liveBadge}>{current.categoryLabel}</span>
              )}

              {current.readingTimeLabel && (
                <span className={styles.counterBadge}>
                  {current.readingTimeLabel}
                </span>
              )}
            </div>

            <span className={styles.counterBadge}>
              {index + 1}/{total}
            </span>
          </div>

          <span className={styles.mediaTitleOverlay} aria-hidden="true" />
        </Link>

        {/* RIGHT SIDE CONTENT */}
        <div className={styles.content}>
          <div>
            {/* META ROW: Date • Author */}
            <div className={styles.meta}>
              {current.publishedDateLabel && (
                <span>{current.publishedDateLabel}</span>
              )}

              {current.publishedDateLabel && current.authorName && (
                <span className={styles.metaDot}>•</span>
              )}

              {current.authorName && <span>{current.authorName}</span>}
            </div>

            <h2 className={styles.title}>{current.title}</h2>

            {current.subtitle && (
              <p className={styles.subtitle}>{current.subtitle}</p>
            )}
          </div>

          {/* CTA + DOTS */}
          <div>
            <div className={styles.buttonRow}>
              <Link href={current.href} className={styles.button}>
                <span>Read story</span>
              </Link>
            </div>

            <div className={styles.autoplayRow}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressBar}
                  style={{ transform: `scaleX(${progress})` }}
                  aria-hidden="true"
                />
              </div>

              <div
                className={styles.dots}
                role="tablist"
                aria-label="Select featured story"
                onKeyDown={handleKeyDownDots}
              >
                {slides.map((slide, i) => {
                  const isActive = i === index;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      className={isActive ? styles.dotActive : styles.dot}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1} of ${total}`}
                      aria-selected={isActive}
                      role="tab"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
