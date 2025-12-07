"use client";

import Image from "next/image";
import styles from "./HighlightPanel.module.css";

export interface HighlightArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  imageUrl: string;
  slug: string;
}

interface HighlightPanelProps {
  articles: HighlightArticle[];
}

export function HighlightPanel({ articles }: HighlightPanelProps) {
  const article = articles?.[0];
  if (!article) return null;

  return (
    <div className={styles.panel}>
      {/* IMAGE HERO */}
      <div className={styles.imageWrapper}>
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          priority
          className={styles.image}
        />

        <div className={styles.vignetteMain} />
        <div className={styles.vignetteLeft} />
        <div className={styles.vignetteBottom} />
        <div className={styles.grain} />
      </div>

      {/* FLOATING PREMIUM GLASS CARD */}
      <div className={styles.glass}>
        <h2 className={styles.title}>{article.title}</h2>

        <div className={styles.divider} />

        <p className={styles.excerpt}>{article.excerpt}</p>

        <div className={styles.footer}>
          <span className={styles.author}>By {article.author}</span>

          <a href={`/articles/${article.slug}`} className={styles.button}>
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}
