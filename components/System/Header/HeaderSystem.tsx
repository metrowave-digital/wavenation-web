"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import BrandBar from "./BrandBar";
import PrimaryNav from "./PrimaryNav";
import UtilityBar from "./UtilityBar";
import SearchModal from "../Search/SearchModal";
import MobileMenuModal from "../MobileMenu/MobileMenuModal";

import styles from "./Header.module.css";

/* ------------------------------------------------------------
   SURFACE DETECTION (FUTURE-SAFE, NOT VISUAL)
------------------------------------------------------------ */

type Surface = "fm" | "one" | "plus" | "news" | "default";

function getSurface(pathname: string): Surface {
  if (pathname.startsWith("/watch")) return "one";
  if (pathname.startsWith("/plus")) return "plus";
  if (pathname.startsWith("/news")) return "news";
  if (pathname.startsWith("/listen") || pathname.startsWith("/shows"))
    return "fm";
  return "default";
}

/* ------------------------------------------------------------
   PROPS
------------------------------------------------------------ */

export interface HeaderSystemProps {
  pageMenu?: React.ReactNode;
  unreadNotifications?: number;
  isAuthenticated?: boolean;
}

/* ------------------------------------------------------------
   COMPONENT
------------------------------------------------------------ */

export default function HeaderSystem({
  pageMenu,
  unreadNotifications = 0,
  isAuthenticated = false,
}: HeaderSystemProps) {
  const pathname = usePathname();
  const surface = useMemo(() => getSurface(pathname), [pathname]);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /* ------------------------------------------------------------
     SCROLL COLLAPSE
  ------------------------------------------------------------ */

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setCollapsed(window.scrollY > 24);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ------------------------------------------------------------
     ESC KEY HANDLING
  ------------------------------------------------------------ */

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileMenuOpen(false);
      setSearchOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* ------------------------------------------------------------
     RENDER
  ------------------------------------------------------------ */

  return (
    <>
      <header
        className={[
          styles.header,
          collapsed ? styles.isCollapsed : "",
        ].join(" ")}
        data-surface={surface}
      >
        <div className={styles.inner}>
          {/* BRAND BAR — DESKTOP ONLY */}
          <div className={styles.brandRow}>
            <BrandBar />
          </div>

          {/* MAIN ROW */}
          <div className={styles.mainRow}>
            <PrimaryNav />

            <UtilityBar
              isAuthenticated={isAuthenticated}
              unreadNotifications={unreadNotifications}
              onOpenSearch={() => setSearchOpen(true)}
              mobileMenuOpen={mobileMenuOpen}
              onToggleMobileMenu={() => setMobileMenuOpen(v => !v)}
            />
          </div>

          {/* OPTIONAL PAGE-SPECIFIC MENU */}
          {pageMenu ? (
            <div className={styles.pageMenuRow}>{pageMenu}</div>
          ) : null}
        </div>
      </header>

            {/* SEARCH MODAL */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* MOBILE MENU MODAL */}
      <MobileMenuModal
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
