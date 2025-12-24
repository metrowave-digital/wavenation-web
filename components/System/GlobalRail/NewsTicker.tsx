"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./NewsTicker.module.css";
import { SOCIAL_LINKS } from "@/config/socialLinks";

/* -------------------------------------------------------
   TYPES
-------------------------------------------------------- */

interface Article {
  id: string;
  title: string;
  slug: string;
  badges?: string[];
}

interface ArticleItem {
  type: "article";
  data: Article;
}

interface SeparatorItem {
  type: "separator";
}

type CrawlItem = ArticleItem | SeparatorItem;

/* -------------------------------------------------------
   CONSTANTS
-------------------------------------------------------- */

const BREAKING_DURATION_MS = 10_000;
const FADE_DURATION_MS = 400;

/* -------------------------------------------------------
   COMPONENT
-------------------------------------------------------- */

export default function NewsTicker({ articles }: { articles: Article[] }) {
  const [activeBreaking, setActiveBreaking] = useState<Article | null>(null);
  const [showBreaking, setShowBreaking] = useState(false);
  const [dismissedBreakingId, setDismissedBreakingId] =
    useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* -------------------------------------------------------
     BREAKING DETECTION
  -------------------------------------------------------- */

  const cmsBreakingArticle = useMemo(
    () => articles.find(a => a.badges?.includes("breaking")) ?? null,
    [articles]
  );

  /* -------------------------------------------------------
     BREAKING STATE MACHINE
  -------------------------------------------------------- */

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!cmsBreakingArticle || cmsBreakingArticle.id === dismissedBreakingId) {
      return;
    }

    timerRef.current = setTimeout(() => {
      setActiveBreaking(cmsBreakingArticle);
      setShowBreaking(true);
    }, 0);

    timerRef.current = setTimeout(() => {
      setShowBreaking(false);
      setTimeout(() => {
        setActiveBreaking(null);
        setDismissedBreakingId(cmsBreakingArticle.id);
      }, FADE_DURATION_MS);
    }, BREAKING_DURATION_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cmsBreakingArticle, dismissedBreakingId]);

  /* -------------------------------------------------------
     NON-BREAKING ITEMS
  -------------------------------------------------------- */

  const crawlItems: CrawlItem[] = useMemo(() => {
    const nonBreaking = articles.filter(
      a => !a.badges?.includes("breaking")
    );

    if (!nonBreaking.length) return [];

    const mapped: CrawlItem[] = nonBreaking.flatMap(a => [
      { type: "article", data: a },
      { type: "separator" },
    ]);

    return [...mapped, ...mapped];
  }, [articles]);

  /* -------------------------------------------------------
     DRAG CONTROL
  -------------------------------------------------------- */

  const onStart = () => {
    if (activeBreaking) return;
    setIsDragging(true);
    dragRef.current?.style.setProperty("animation-play-state", "paused");
  };

  const onEnd = () => {
    if (!isDragging || activeBreaking) return;
    setIsDragging(false);
    dragRef.current?.style.setProperty("animation-play-state", "running");
    dragRef.current?.style.removeProperty("transform");
  };

  if (!articles.length) return null;

  /* -------------------------------------------------------
     RENDER
  -------------------------------------------------------- */

  return (
    <div className={styles.ticker} role="region" aria-label="WaveNation News Ticker">

      {/* BREAKING */}
      {activeBreaking && (
        <Link
          href={`/news/${activeBreaking.slug}`}
          className={`${styles.breaking} ${
            showBreaking ? styles.breakingVisible : styles.breakingHidden
          }`}
          style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
        >
          <div className={styles.inner}>
            <span className={styles.breakingBadge}>BREAKING</span>
            <span className={styles.breakingTitle}>
              {activeBreaking.title}
            </span>
          </div>
        </Link>
      )}

      {/* STANDARD */}
      {!activeBreaking && (
        <div className={styles.standard}>
          <div className={styles.inner}>
            <span className={styles.trendingBadge}>Trending</span>

            <div
              className={styles.crawlMask}
              onPointerDown={onStart}
              onPointerUp={onEnd}
              onPointerLeave={onEnd}
              onTouchStart={onStart}
              onTouchEnd={onEnd}
            >
              <div className={styles.crawlTrack}>
                <div
                  ref={dragRef}
                  className={styles.crawl}
                  style={{ animationDuration: "130s" }}
                >
                  {crawlItems.map((item, i) =>
                    item.type === "separator" ? (
                      <span key={i} className={styles.separator}>•</span>
                    ) : (
                      <Link
  key={i}
  href={`/news/${item.data.slug}`}
  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
  className={styles.headline}
>

                        {item.data.title}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className={styles.social}>
              {SOCIAL_LINKS.map(link => {
                const href =
                  isMobile && link.appUrl ? link.appUrl : link.webUrl;

                const Icon =
                  link.platform === "facebook" ? Facebook :
                  link.platform === "instagram" ? Instagram :
                  link.platform === "x" ? X :
                  Youtube;

                return (
                  <a
                    key={link.platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WaveNation on ${link.name}`}
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
