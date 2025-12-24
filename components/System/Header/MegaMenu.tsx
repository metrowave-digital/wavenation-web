"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { NavItem, NavLink } from "./nav.config";
import styles from "./Header.module.css";

export default function MegaMenu({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [flyout, setFlyout] = useState<NavLink | null>(null);

  const hasFlyout = useMemo(() => {
    return item.sections.some((s) => s.links.some((l) => l.flyout?.length));
  }, [item]);

  return (
    <div className={styles.megaWrap} role="dialog" aria-label={`${item.label} menu`}>
      <div className={styles.megaPanel}>
        <div className={styles.megaHeader}>
          <div className={styles.megaTitle}>{item.label}</div>
          <button type="button" className={styles.megaClose} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.megaGrid} data-has-flyout={hasFlyout ? "true" : "false"}>
          {item.sections.map((section) => (
            <div key={section.title} className={styles.megaCol}>
              <div className={styles.megaSectionTitle}>{section.title}</div>

              <ul className={styles.megaList}>
                {section.links.map((link) => {
                  const isFlyout = Boolean(link.flyout?.length);

                  return (
                    <li
                      key={link.href}
                      className={styles.megaListItem}
                      onMouseEnter={() => setFlyout(isFlyout ? link : null)}
                      onMouseLeave={() => setFlyout((prev) => (prev?.href === link.href ? null : prev))}
                    >
                      <Link href={link.href} className={styles.megaLink} onClick={onClose}>
                        <span>{link.label}</span>
                        {isFlyout ? <span className={styles.flyoutArrow}>›</span> : null}
                      </Link>

                      {isFlyout && flyout?.href === link.href ? (
                        <div className={styles.flyout}>
                          <div className={styles.flyoutPanel}>
                            <div className={styles.flyoutTitle}>{link.label}</div>
                            <ul className={styles.flyoutList}>
                              {link.flyout!.map((sub) => (
                                <li key={sub.href}>
                                  <Link href={sub.href} className={styles.flyoutLink} onClick={onClose}>
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.megaFooter}>
          <button type="button" className={styles.megaGhost} onClick={onClose}>
            Close menu
          </button>
        </div>
      </div>
    </div>
  );
}
