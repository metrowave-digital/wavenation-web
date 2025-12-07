import React from "react";
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
  return (
    <a
      className={
        variant === "horizontal"
          ? `${styles.card} ${styles.horizontal}`
          : `${styles.card} ${styles.vertical}`
      }
      href={href}
    >
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <button className={styles.button}>Read Article</button>
      </div>
    </a>
  );
}
