"use client"

import styles from "./Sidebar.module.css"
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6"

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* BRAND / PARTNER */}
      <section className={`${styles.card} ${styles.brand}`}>
        <div className={styles.eyebrow}>Powered by</div>
        <h4 className={styles.heading}>Urban Influencer</h4>

        <p className={styles.body}>
          Discovering and elevating independent music, culture,
          and creators.
        </p>

        <nav className={styles.socials} aria-label="Urban Influencer social links">
          <a
            href="https://www.facebook.com/theurbaninfluencer1/"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/theurbaninfluencer/"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/InfluencerUrban"
            aria-label="X"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.youtube.com/channel/UCwd-m0xdqSUyePYcSl-1mIQ"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>
        </nav>
      </section>

      {/* NEWSLETTER */}
      <section className={`${styles.card} ${styles.newsletter}`}>
        <h4 className={styles.heading}>Newsletter</h4>

        <p className={styles.body}>
          Weekly charts, editor insight, and cultural signals —
          delivered.
        </p>

        <form
          className={styles.form}
          action="/api/newsletter/subscribe"
          method="POST"
        >
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            aria-label="Email address"
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* PLAYLIST */}
      <section className={styles.card}>
        <h4 className={styles.heading}>Official Playlist</h4>

        <p className={styles.body}>
          Stream the full chart on your favorite platform.
        </p>

        <a
          href="/playlists/wavenation-hitlist"
          className={styles.primaryCta}
        >
          Open Playlist →
        </a>
      </section>

      {/* METHODOLOGY */}
      <section className={styles.card}>
        <h4 className={styles.heading}>Chart Methodology</h4>

        <p className={styles.body}>
          How rankings, symbols, and editorial weighting work.
        </p>

        <a
          href="/charts/methodology"
          className={styles.textLink}
        >
          View methodology →
        </a>
      </section>

      {/* AD */}
      <section className={`${styles.card} ${styles.ad}`}>
        <div className={styles.eyebrow}>Advertisement</div>
        <div className={styles.adSlot}>
          Ad Slot (1:1)
        </div>
      </section>
    </aside>
  )
}
