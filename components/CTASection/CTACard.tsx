"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./CTACard.module.css";

interface CTACardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const CTACard: React.FC<CTACardProps> = ({ title, description, image, link }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Link href={link} className={styles.cardLink}>
      <div
        ref={cardRef}
        className={`${styles.card} ${isVisible ? styles.visible : ""}`}
      >
        <Image src={image} alt={title} className={styles.image} fill />
        <div className={styles.overlay}></div>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default CTACard;
