"use client";

import { useEffect, useRef, useState } from "react";
import MegaMenu from "./MegaMenu";
import { NAV_ITEMS, NavItem } from "./nav.config";
import styles from "./Header.module.css";

export default function PrimaryNav() {
  const [active, setActive] = useState<NavItem | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Click outside closes
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setActive(null);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className={styles.primaryNavWrap} ref={wrapRef}>
      <nav className={styles.primaryNav} aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isOpen = active?.label === item.label;
          return (
            <div key={item.label} className={styles.navItem}>
              <button
                type="button"
                className={styles.navButton}
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setActive(isOpen ? null : item)}
              >
                {item.label}
                <span className={styles.navChevron} aria-hidden="true">
                  ▾
                </span>
              </button>

              {isOpen ? <MegaMenu item={item} onClose={() => setActive(null)} /> : null}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
