"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ArticlesSection.module.css";

interface CMSImage {
  url?: string;
}

interface CMSCategory {
  name?: string;
  title?: string;
}

interface CMSSeo {
  ogImage?: CMSImage;
  description?: string;
}

interface CMSArticle {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string;
  heroImage?: CMSImage;
  featuredImage?: CMSImage;
  seo?: CMSSeo;
  category?: CMSCategory;
}

export interface ArticleCardItem {
  id: number | string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  href: string;
}

export default function ArticlesSection() {
  const CMS = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/+$/, "") ?? "";
  const API_BASE_URL = CMS;

  const [primaryArticles, setPrimaryArticles] = useState<ArticleCardItem[]>([]);
  const [moreArticles, setMoreArticles] = useState<ArticleCardItem[]>([]);

  /* ------------------------------------------
     Mapper (CMS → UI)
  ------------------------------------------ */
  const mapArticle = useCallback(
    (article: CMSArticle): ArticleCardItem => {
      const rawImage =
        article.heroImage?.url ||
        article.seo?.ogImage?.url ||
        article.featuredImage?.url ||
        "/images/editorial/default-hero.jpg";

      const imageUrl =
        rawImage.startsWith("http") ? rawImage : `${API_BASE_URL}${rawImage}`;

      const categoryName =
        article.category?.name ||
        article.category?.title ||
        "WaveNation News";

      const src =
        article.seo?.description ||
        article.excerpt ||
        article.title;

      const excerpt =
        src.length > 160 ? `${src.slice(0, 157)}...` : src;

      return {
        id: article.id,
        title: article.title,
        excerpt,
        category: categoryName,
        image: imageUrl,
        href: `/articles/${article.slug}`,
      };
    },
    [API_BASE_URL]
  );

  /* ------------------------------------------
     Fetch inside the Effect (ESLint approved)
  ------------------------------------------ */
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/articles?limit=30&sort=-publishedAt&depth=2`,
          { cache: "no-store" }
        );

        const json: { docs?: CMSArticle[] } = await res.json();
        const docs = json.docs ?? [];

        const mapped = docs.map(mapArticle);

        // Shuffle ONCE
        const shuffled = [...mapped].sort(() => Math.random() - 0.5);

        if (!isMounted) return;

        // First 3 main articles
        setPrimaryArticles(shuffled.slice(0, 3));

        // Next 10 for horizontal scroll
        setMoreArticles(shuffled.slice(3, 13));
      } catch (err) {
        console.error("ArticlesSection Fetch Error:", err);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [API_BASE_URL, mapArticle]);

  if (primaryArticles.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* TOP FEATURED 3 ARTICLES */}
        <div className={styles.grid}>
          {primaryArticles.map((art) => (
            <Link href={art.href} key={art.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className={styles.image}
                />
                <span className={styles.category}>{art.category}</span>
              </div>

              <div className={styles.content}>
                <h3 className={styles.title}>{art.title}</h3>
                <p className={styles.excerpt}>{art.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* HORIZONTAL SCROLL ROW */}
        {moreArticles.length > 0 && (
          <div className={styles.scrollWrapper}>
            {moreArticles.map((art) => (
              <Link href={art.href} key={art.id} className={styles.scrollCard}>
                <div className={styles.scrollImageWrapper}>
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className={styles.scrollImage}
                  />
                </div>

                <div className={styles.scrollTitle}>{art.title}</div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
