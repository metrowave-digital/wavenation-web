"use client";

import Link from "next/link";
import { Radio, Tv, Newspaper, ShoppingBag, User, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import styles from "./MobileMenu.module.css";
import {
  MOBILE_SECONDARY_LINKS,
  MOBILE_MORE_LINKS,
} from "./mobileSecondary.config";

interface MobileMenuProps {
  onNavigate?: () => void;
}

/* ------------------------------------------------------------
   HELPERS
------------------------------------------------------------ */

function getSection(path: string) {
  if (path.startsWith("/listen")) return "listen";
  if (path.startsWith("/watch")) return "watch";
  if (path.startsWith("/news")) return "news";
  if (path.startsWith("/charts")) return "charts";
  return "default";
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/* ------------------------------------------------------------
   COMPONENT
------------------------------------------------------------ */

export default function MobileMenu({ onNavigate }: MobileMenuProps) {
  const pathname = usePathname();

  const sectionKey = getSection(pathname);
  const section =
    MOBILE_SECONDARY_LINKS[sectionKey] ??
    MOBILE_SECONDARY_LINKS.default;

  return (
    <nav className={styles.menu} aria-label="Mobile Navigation">
      {/* PRIMARY ACTIONS */}
      <div className={styles.primaryGrid}>
        <MenuCard
          icon={<Radio size={22} />}
          label="Listen"
          href="/listen"
          active={isActive(pathname, "/listen")}
          onNavigate={onNavigate}
        />
        <MenuCard
          icon={<Tv size={22} />}
          label="Watch"
          href="/watch"
          active={isActive(pathname, "/watch")}
          onNavigate={onNavigate}
        />
        <MenuCard
          icon={<Newspaper size={22} />}
          label="News"
          href="/news"
          active={isActive(pathname, "/news")}
          onNavigate={onNavigate}
        />
        <MenuCard
          icon={<ShoppingBag size={22} />}
          label="Shop"
          href="/shop"
          active={isActive(pathname, "/shop")}
          onNavigate={onNavigate}
        />
        <MenuCard
          icon={<Plus size={22} />}
          label="Plus"
          href="/plus"
          active={isActive(pathname, "/plus")}
          onNavigate={onNavigate}
        />
        <MenuCard
          icon={<User size={22} />}
          label="Profile"
          href="/account"
          active={isActive(pathname, "/account")}
          onNavigate={onNavigate}
        />
      </div>

      {/* CONTEXTUAL SECONDARY LINKS */}
      <div>
        <div className={styles.sectionTitle}>{section.title}</div>
        <div className={styles.secondary}>
          {section.links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={
                isActive(pathname, link.href) ? "page" : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* MORE LINKS */}
      <div>
        <div className={styles.sectionTitle}>More Links</div>
        <div className={styles.moreLinks}>
          {MOBILE_MORE_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={
                isActive(pathname, link.href) ? "page" : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------
   CARD
------------------------------------------------------------ */

function MenuCard({
  icon,
  label,
  href,
  onNavigate,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  onNavigate?: () => void;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={styles.card}
      aria-current={active ? "page" : undefined}
      aria-label={label}
    >
      <div className={styles.cardIcon}>{icon}</div>
      <span className={styles.cardLabel}>{label}</span>
    </Link>
  );
}
