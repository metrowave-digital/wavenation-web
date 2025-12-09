"use client";

import Link from "next/link";
import styles from "./SpotlightArticle.module.css";

export interface SpotlightArticleProps {
  title: string;
  excerpt: string;
  category: string;
  image: string;
  href: string;
  variant?: "horizontal" | "vertical";
}

export default function SpotlightArticle({
  title,
  excerpt,
  category,
  image,
  href,
  variant = "vertical",
}: SpotlightArticleProps) {
  const cardClassName =
    variant === "horizontal"
      ? `${styles.card} ${styles.horizontal}`
      : `${styles.card} ${styles.vertical}`;

  return (
    <Link href={href} className={cardClassName}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.title}>{title}</h3>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        <button className={styles.button}>Read Article</button>
      </div>
    </Link>
  );
}
