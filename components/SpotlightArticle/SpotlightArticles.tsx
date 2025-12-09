"use client";

import { useEffect, useRef } from "react";
import styles from "./SpotlightArticles.module.css";
import SpotlightArticle from "./SpotlightArticle";

export interface SpotlightArticleItem {
  id: string | number;
  title: string;
  excerpt?: string;
  slug: string;
  category?: { name?: string; title?: string };
  heroImage?: { url?: string };
  seo?: { ogImage?: { url?: string } };
}

export interface SpotlightArticlesProps {
  articles: SpotlightArticleItem[];
  randomize?: boolean;
}

export default function SpotlightArticles({
  articles,
  randomize = true,
}: SpotlightArticlesProps) {

  // 🧠 All hooks MUST be BEFORE any conditional return
  const shuffledRef = useRef<SpotlightArticleItem[]>([]);

  const CMS = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/+$/, "") ?? "";

  // 🧠 Hydration-safe randomness MUTATES ref but does NOT affect React render
  useEffect(() => {
    if (!articles || articles.length === 0) {
      shuffledRef.current = [];
      return;
    }

    const list = [...articles];

    if (randomize) {
      // Fisher-Yates shuffle OUTSIDE render (allowed)
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }

    shuffledRef.current = list.slice(0, 7);
    // ❗ No setState() → no ESLint complaint
  }, [articles, randomize]);

  // 🧠 AFTER hooks → safe early return
  if (!articles || articles.length === 0) return null;

  const resolveImage = (article: SpotlightArticleItem): string => {
    const raw =
      article.heroImage?.url ||
      article.seo?.ogImage?.url ||
      "/images/editorial/default-card.jpg";

    if (raw.startsWith("http")) return raw;
    return `${CMS}${raw}`;
  };

  const resolveCategory = (article: SpotlightArticleItem): string =>
    article.category?.name ||
    article.category?.title ||
    "WaveNation News";

  // Data finally ready (no React re-render needed)
  const shuffled = shuffledRef.current;

  const topRow = shuffled.slice(0, 3);
  const rest = shuffled.slice(3);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Spotlight Articles</h2>

        {/* FEATURED */}
        <div className={styles.featuredRow}>
          {topRow.map((article) => (
            <SpotlightArticle
              key={article.id}
              title={article.title}
              excerpt={article.excerpt ?? ""}
              category={resolveCategory(article)}
              href={`/news/${article.slug}`}
              image={resolveImage(article)}
              variant="horizontal"
            />
          ))}
        </div>

        {/* GRID */}
        {rest.length > 0 && (
          <div className={styles.grid}>
            {rest.map((article) => (
              <SpotlightArticle
                key={article.id}
                title={article.title}
                excerpt={article.excerpt ?? ""}
                category={resolveCategory(article)}
                href={`/news/${article.slug}`}
                image={resolveImage(article)}
                variant="vertical"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
