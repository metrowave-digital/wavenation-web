"use client";

import { Facebook, Instagram, Youtube, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

interface NewsTickerProps {
  articles: {
    id: string | number;
    title: string;
    slug?: string;
  }[];
}

export default function NewsTicker({ articles }: NewsTickerProps) {
  // Hydration-safe mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Build crawl items
  const crawlItems = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    const withBullets = articles.flatMap((a) => [a, { separator: true }]);
    return [...withBullets, ...withBullets, ...withBullets];
  }, [articles]);

  // Hover speed control
  const [hovered, setHovered] = useState(false);

  if (!mounted || !articles || articles.length === 0) return null;

  return (
    <div className="w-full bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center px-4 py-2 gap-3 sm:gap-4 md:gap-6">

        {/* LABEL */}
        <div
          className="
            bg-electric text-black font-bold uppercase text-[10px] 
            tracking-wider px-3 py-1.5 rounded-md shadow-md
            md:text-xs
          "
        >
          Trending
        </div>

        {/* CRAWLING TICKER */}
        <div className="flex-1 overflow-hidden whitespace-nowrap relative h-6">
          <div
            className={`
              flex items-center gap-6
              ${hovered ? "animate-crawlSlow" : "animate-crawl"}
            `}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {crawlItems.map((item: any, i: number) =>
              item.separator ? (
                <span
                  key={`sep-${i}`}
                  className="text-electric text-sm select-none px-2"
                >
                  •
                </span>
              ) : (
                <Link
                  key={`item-${i}`}
                  href={item.slug ? `/news/${item.slug}` : `/news/${item.id}`}
                  className="
                    text-[11px] sm:text-sm text-white font-medium 
                    hover:text-electric transition-colors whitespace-nowrap
                  "
                >
                  {item.title}
                </Link>
              )
            )}
          </div>
        </div>

        {/* RIGHT PILL (Desktop) */}
        <div
          className="
            hidden sm:flex items-center 
            bg-white/10 backdrop-blur-sm
            px-4 py-1 rounded-full gap-4
          "
        >
          {/* Menu links (HIDDEN on mobile/tablet < md) */}
          <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-white/90">
            <Link href="/news" className="hover:text-electric">News</Link>
            <Link href="/culture" className="hover:text-electric">Culture</Link>
            <Link href="/music" className="hover:text-electric">Music</Link>
            <Link href="/features" className="hover:text-electric">Features</Link>
          </nav>

          {/* Divider (only visible if menu is visible) */}
          <div className="hidden md:block w-px h-5 bg-white/25" />

          {/* Socials (always visible inside pill) */}
          <div className="flex items-center gap-3 text-white/90">
            <Link href="#"><Facebook size={16} className="hover:text-electric" /></Link>
            <Link href="#"><Instagram size={16} className="hover:text-electric" /></Link>
            <Link href="#"><X size={16} className="hover:text-electric" /></Link>
            <Link href="#"><Youtube size={16} className="hover:text-electric" /></Link>
          </div>
        </div>

        {/* MOBILE SOCIAL ICONS (outside pill) */}
        <div className="flex sm:hidden items-center gap-2 ml-1">
          <Link href="#">
            <Facebook size={14} className="text-white/90 hover:text-electric transition" />
          </Link>
          <Link href="#">
            <Instagram size={14} className="text-white/90 hover:text-electric transition" />
          </Link>
        </div>

      </div>
    </div>
  );
}
