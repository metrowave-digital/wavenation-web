// components/HeroSection/HeroSection.tsx

import HeroSlider from "@/components/HeroSlider/HeroSlider";
import LiveTvBox from "./LiveTvBox";
import UpNextBox from "./UpNext/UpNextBox";

import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {/* LEFT: HERO SLIDER */}
        <div className={styles.left}>
          <div className={styles.sliderWrapperFix}>
            <HeroSlider />
          </div>
        </div>

        {/* RIGHT: LIVE TV + UP NEXT */}
        <div className={styles.right}>
          <div className={styles.card}>
            <LiveTvBox />
          </div>
          <div className={styles.card}>
            <UpNextBox />
          </div>
        </div>
      </div>
    </section>
  );
}
