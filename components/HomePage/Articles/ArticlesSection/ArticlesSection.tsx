"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ArticlesSection.module.css";

/* ================================
   CMS TYPES (MATCH PAYLOAD)
================================ */
interface CMSImage {
  url?: string | null;
  focalX?: number | null;
  focalY?: number | null;
}

interface CMSCategory {
  name?: string | null;
  title?: string | null;
}

interface CMSSeo {
  ogImage?: CMSImage | null;
  description?: string | null;
}

interface CMSStandardFields {
  category?: CMSCategory | null;
}

interface CMSArticle {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string | null;
  heroImage?: CMSImage | null;
  featuredImage?: CMSImage | null;
  seo?: CMSSeo | null;
  standardFields?: CMSStandardFields | null;
}

/* ================================
   UI TYPE
================================ */
interface ArticleCard {
  id: string | number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  href: string;
  focalX: number;
  focalY: number;
}

export default function ArticlesSection() {
  const CMS_URL =
    process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/+$/, "") ?? "";

  const [articles, setArticles] = useState<ArticleCard[]>([]);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  /* ================================
     FETCH + MAP
  ================================ */
  useEffect(() => {
    let mounted = true;

    async function loadArticles() {
      try {
        const res = await fetch(
          `${CMS_URL}/api/articles?limit=12&depth=2`,
          { cache: "no-store" }
        );

        const data: { docs?: CMSArticle[] } = await res.json();
        const docs = data.docs ?? [];

        const mapped = docs.map<ArticleCard>((article) => {
          const img =
            article.heroImage ||
            article.seo?.ogImage ||
            article.featuredImage ||
            null;

          const rawImage =
            img?.url || "/images/editorial/default-hero.jpg";

          const image =
            rawImage.startsWith("http")
              ? rawImage
              : `${CMS_URL}${rawImage}`;

          const category =
            article.standardFields?.category?.name ||
            article.standardFields?.category?.title ||
            "WaveNation News";

          const text =
            article.seo?.description ||
            article.excerpt ||
            article.title;

          const excerpt =
            text.length > 160 ? `${text.slice(0, 157)}…` : text;

          return {
            id: article.id,
            title: article.title,
            excerpt,
            category,
            image,
            href: `/articles/${article.slug}`,
            focalX: img?.focalX ?? 50,
            focalY: img?.focalY ?? 50,
          };
        });

        const randomThree = mapped
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        if (mounted) setArticles(randomThree);
      } catch (err) {
        console.error("ArticlesSection error:", err);
      }
    }

    loadArticles();
    return () => {
      mounted = false;
    };
  }, [CMS_URL]);

  /* ================================
     AUTO-ADVANCE (ARTICLES ONLY)
================================ */
  useEffect(() => {
    const slider = sliderRef.current;

    // 🔒 HARD SCOPE — THIS COMPONENT ONLY
    if (
      !slider ||
      slider.dataset.autoplay !== "articles" ||
      articles.length < 2
    ) {
      return;
    }

    if (!window.matchMedia("(max-width: 768px)").matches) return;

    let index = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const getCardWidth = () =>
      (slider.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;

    const start = () => {
      stop();
      intervalId = setInterval(() => {
        index = (index + 1) % articles.length;
        slider.scrollTo({
          left: index * getCardWidth(),
          behavior: "smooth",
        });
      }, 6000);
    };

    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    start();

    slider.addEventListener("touchstart", stop);
    slider.addEventListener("mouseenter", stop);

    return () => {
      stop();
      slider.removeEventListener("touchstart", stop);
      slider.removeEventListener("mouseenter", stop);
    };
  }, [articles]);

  if (!articles.length) return null;

  /* ================================
     RENDER
================================ */
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div
          className={styles.grid}
          ref={sliderRef}
          data-autoplay="articles"
        >
          {articles.map((art) => (
            <Link
              href={art.href}
              key={art.id}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 90vw, 33vw"
                  className={styles.image}
                  style={{
                    objectPosition: `${art.focalX}% ${art.focalY}%`,
                  }}
                />
                <span className={styles.category}>
                  {art.category}
                </span>
              </div>

              <div className={styles.content}>
                <h3 className={styles.title}>{art.title}</h3>
                <p className={styles.excerpt}>{art.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
