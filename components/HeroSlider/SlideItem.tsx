// components/HeroSlider/SlideItem.tsx

import React from "react";
import styles from "./SlideItem.module.css";

export interface SlideContent {
  id: number | string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  href: string;
}

interface SlideItemProps extends SlideContent {
  motionClassName?: string;
  isActive?: boolean;
}

const SlideItem: React.FC<SlideItemProps> = ({
  title,
  excerpt,
  category,
  image,
  href,
  motionClassName,
  isActive = false,
}) => {
  return (
    <a className={styles.slide} href={href}>
      {/* Background image */}
      <div
        className={`${styles.background} ${
          isActive && motionClassName ? motionClassName : ""
        }`}
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Darkened overlay */}
      <div className={styles.overlay} />

      {/* CATEGORY TAG */}
      <span className={styles.category}>{category}</span>

      {/* TEXT CONTENT SECTION */}
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

        <p className={styles.excerpt}>
          {excerpt}
          <button
            className={styles.readMore}
            type="button"
            aria-label="Read more"
          >
            Read More
          </button>
        </p>
      </div>
    </a>
  );
};

export default SlideItem;
