import Link from "next/link";
import Image from "next/image";
import styles from "./LiveTVBox.module.css";

export default function LiveTVBox() {
  return (
    <Link
      href="/tv"
      className={styles.card}
      aria-label="Watch WaveNation TV"
    >
      <div className={styles.media}>
        <Image
          src="/images/placeholders/wavenation-tv.jpg"
          alt="WaveNation TV Live Stream"
          fill
          className={styles.image}
          priority
        />

        <div className={styles.liveBadge}>
          <span className={styles.liveDot} />
          LIVE
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.network}>WaveNation TV</span>

        <h3 className={styles.title}>WaveNation One</h3>
        <p className={styles.subtitle}>
          24/7 Culture • Music • Originals
        </p>

        <div className={styles.cta}>Watch Live →</div>
      </div>
    </Link>
  );
}
