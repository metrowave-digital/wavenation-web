"use client";

import { useState } from "react";
import styles from "./NewsletterCTA.module.css";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Stay In The Wave</h2>
        <p className={styles.text}>
          Join thousands who get fresh music drops, exclusive interviews, and culture news weekly.
        </p>

        <form className={styles.form}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button className={styles.button}>Sign Up</button>
        </form>
      </div>
    </section>
  );
}
