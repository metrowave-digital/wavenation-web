// components/HeroSection/HeroSection.tsx
import HeroSlider from "./HeroSlider/HeroSlider";
import LiveTvBox from "./LiveTVBox/LiveTVBox";
import UpNextBox from "./UpNext/UpNextBox";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.left}>
          <HeroSlider />
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <LiveTvBox />
          <UpNextBox />
        </div>
      </div>
    </section>
  );
}
