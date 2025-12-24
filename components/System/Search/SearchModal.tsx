"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../Header/Header.module.css";

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Search">
      <button className={styles.modalBackdrop} onClick={onClose} aria-label="Close" />

      <div className={styles.modal}>
        <div className={styles.modalTop}>
          <div className={styles.modalTitle}>Search WaveNation</div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="Search news, shows, playlists, artists…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className={styles.searchHintRow}>
            <span className={styles.searchHint}>Press ESC to close</span>
            {/* Optional: route to a full search page later */}
            <Link href="/search" className={styles.searchLink} onClick={onClose}>
              Advanced search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
