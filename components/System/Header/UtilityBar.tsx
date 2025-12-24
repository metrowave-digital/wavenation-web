"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import styles from "./Header.module.css";

export default function UtilityBar({
  isAuthenticated,
  unreadNotifications,
  onOpenSearch,
  mobileMenuOpen,
  onToggleMobileMenu,
}: {
  isAuthenticated: boolean;
  unreadNotifications: number;
  onOpenSearch: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}) {
  const hasUnread = isAuthenticated && unreadNotifications > 0;

  return (
    <div className={styles.utilityWrap}>

      {/* MOBILE BRAND + ACTIONS */}
      <div className={styles.utilityMobile}>
  {/* LEFT — BRAND */}
  <Link href="/" className={styles.mobileBrand}>
    <Image
      src="/WNLogo.svg"
      alt="WaveNation"
      width={28}
      height={28}
      priority
    />

    <div className={styles.mobileBrandText}>
      <span className={styles.mobileBrandName}>WAVENATION</span>
      <span className={styles.mobileBrandSub}>AMPLIFY YOUR VIBE</span>
    </div>
  </Link>

  {/* RIGHT — ACTIONS */}
  <div className={styles.mobileActions}>
    <button
      type="button"
      className={styles.iconButton}
      onClick={onOpenSearch}
      aria-label="Search"
    >
      <Search size={18} />
    </button>

    <button
      type="button"
      className={styles.iconButton}
      onClick={onToggleMobileMenu}
      aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      aria-expanded={mobileMenuOpen}
    >
      <Menu size={20} />
    </button>
  </div>
</div>


      {/* DESKTOP UTILITIES */}
      <div className={styles.utilityDesktop}>
        <Link href="/account" className={styles.iconButton} aria-label="Account">
          <span className={styles.iconWithDot}>
            <User size={18} />
            {hasUnread && <span className={styles.dot} />}
          </span>
        </Link>

        <button
          type="button"
          className={styles.iconButton}
          onClick={onOpenSearch}
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <Link
          href="/account/cart"
          className={styles.iconButton}
          aria-label="Cart"
        >
          <ShoppingBag size={18} />
        </Link>
      </div>
    </div>
  );
}
