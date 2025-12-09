"use client";

import { useEffect, useRef } from "react";
import styles from "./SlideItem.module.css";

export interface SlideItemProps {
  _id: string | number;  // unused, but prefix fixes ESLint
  title: string;
  excerpt?: string;
  category?: string;
  href: string;
  image: string;
  isActive: boolean;
  motionClassName?: string;
}

export default function SlideItem({
  _id, // eslint-safe unused var
  title,
  excerpt,
  category,
  href,
  image,
  isActive,
  motionClassName,
}: SlideItemProps) {

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  const animationClass =
    mounted.current && isActive && motionClassName ? motionClassName : "";

  return (
    <a className={styles.slide} href={href}>
      <div
        className={`${styles.background} ${animationClass}`}
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className={styles.overlay}>
        {category && <span className={styles.category}>{category}</span>}
        <h3 className={styles.title}>{title}</h3>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
      </div>
    </a>
  );
}
