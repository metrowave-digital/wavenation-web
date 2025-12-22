"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./HeroSlider.module.css";

import type { HeroSliderClientProps } from "./HeroSlider.types";


/* ---------------------------------
   COMPONENT
---------------------------------- */

export default function HeroSliderClient({
  slides,
  autoPlayInterval = 8000,
}: HeroSliderClientProps) {
  const [index, setIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const total = slides.length;

  /* ---------------------------------
     AUTOPLAY ENGINE
  ---------------------------------- */
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
        setProgress(0);
      } else {
        setProgress(pct);
      }
    }, stepMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, autoPlayInterval, total]);

  /* ---------------------------------
     RESET PROGRESS
  ---------------------------------- */
  useEffect(() => {
    if (paused || total <= 1) {
      requestAnimationFrame(() => setProgress(0));
    }
  }, [paused, total]);

  if (!total) return null;

  const current = slides[index];
  if (!current || !current.href.startsWith("/")) return null;

  /* ---------------------------------
     NAV HELPERS
  ---------------------------------- */
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

  /* ---------------------------------
     RENDER
  ---------------------------------- */

  return (
    <section
  className={styles.root}
  data-theme="dark" // or "light"
  aria-roledescription="carousel"
  aria-label="Featured stories"
  onFocusCapture={() => setPaused(false)}
  onBlurCapture={() => setPaused(false)}
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

          <div className={styles.mediaBadgeRow}>
            <div className={styles.badgeGroup}>
              {current.categoryLabel && (
                <span className={styles.liveBadge}>
                  {current.categoryLabel}
                </span>
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
        </Link>

        {/* RIGHT CONTENT */}
        <div className={styles.content}>
          <div>
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

          <div>
            <div className={styles.buttonRow}>
              <Link href={current.href} className={styles.button}>
                Read story
              </Link>
            </div>

            <div className={styles.autoplayRow}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressBar}
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>

              <div
                className={styles.dots}
                role="tablist"
                aria-label="Select featured story"
                onKeyDown={handleKeyDownDots}
              >
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={i === index ? styles.dotActive : styles.dot}
                    onClick={() => goTo(i)}
                    aria-selected={i === index}
                    role="tab"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
