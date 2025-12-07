"use client";

import { useEffect, useState } from "react";
import styles from "./ArticlesPanel.module.css";
import Image from "next/image";

/* -------------------------------------------------------
   TYPES (matching your /api/articles GraphQL response)
------------------------------------------------------- */

interface GQLAuthor {
  name?: string;
}

interface GQLFeaturedImage {
  url?: string;
}

interface GQLArticle {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  author?: GQLAuthor;
  featuredImage?: GQLFeaturedImage;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  imageUrl: string;
  author: string;
}

/* -------------------------------------------------------
   COMPONENT
------------------------------------------------------- */

export function ArticlesPanel() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function loadArticles() {
      try {
        // 👉 Fetch from your Next.js /api/articles route (GraphQL)
        const res = await fetch("/api/articles", { cache: "no-store" });
        const docs: GQLArticle[] = await res.json();

        // Format result into UI type
        const formatted: Article[] = docs.map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt,
          slug: a.slug,
          author: a.author?.name || "WaveNation Editorial",
          imageUrl: a.featuredImage?.url || "/placeholder.jpg",
        }));

        // If fewer than 6 → show all
        const final =
          formatted.length <= 6
            ? formatted
            : formatted.sort(() => Math.random() - 0.5).slice(0, 6);

        setArticles(final);
      } catch (err) {
        console.error("Failed to load articles:", err);
      }
    }

    loadArticles();
  }, []);

  if (!articles.length) {
    return (
      <div className={styles.panel}>
        <h3 className={styles.heading}>More Stories</h3>
        <p className={styles.empty}>More articles coming soon.</p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.heading}>More Stories</h3>

      <div className={styles.grid}>
        {articles.map((article) => (
          <a
            href={`/articles/${article.slug}`}
            key={article.id}
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              <h4 className={styles.title}>{article.title}</h4>
              <p className={styles.excerpt}>{article.excerpt}</p>
              <span className={styles.author}>By {article.author}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
