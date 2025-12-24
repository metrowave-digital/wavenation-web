"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export default function BrandBar() {
  return (
    <div className={styles.brandBar}>
      <Link href="/" className={styles.brandLockup} aria-label="WaveNation Home">
        <Image
          src="/WNLogo.svg"
          alt="WaveNation"
          width={40}
          height={40}
          priority
          className={styles.logo}
        />

        <div className={styles.brandText}>
          <div className={styles.brandName}>WAVENATION</div>
          <div className={styles.brandSub}>AMPLIFY YOUR VIBE</div>
        </div>
      </Link>
    </div>
  );
}
