// components/CTASection/CTACard.tsx

import React from "react";
import styles from "./CTACard.module.css";

interface CTACardProps {
  title: string;
  description?: string;
  image: string;
  onClick?: () => void;
}

const CTACard: React.FC<CTACardProps> = ({ title, description, image, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        <button className={styles.button}>Explore</button>
      </div>
    </div>
  );
};

export default CTACard;
