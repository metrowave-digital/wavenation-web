import React from "react";
import HeroSlider from "../HeroSlider/HeroSlider";
import styles from "./HeroSection.module.css";

const LeftHero = () => {
  return <div className={styles.left}><HeroSlider /></div>;
};

export default LeftHero;
