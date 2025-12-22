"use client";

import { Facebook, Instagram, Youtube, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useRef, useEffect } from "react";
import { SOCIAL_LINKS } from "@/config/socialLinks";

/* -------------------------------------------------------
   TYPES
-------------------------------------------------------- */

interface Article {
  id: string;
  title: string;
  slug: string;
  badges?: string[];
}

interface ArticleItem {
  type: "article";
  data: Article;
}

interface SeparatorItem {
  type: "separator";
}

type CrawlItem = ArticleItem | SeparatorItem;

/* -------------------------------------------------------
   CONSTANTS
-------------------------------------------------------- */

const BREAKING_DURATION_MS = 10_000;
const FADE_DURATION_MS = 400;

/* -------------------------------------------------------
   COMPONENT
-------------------------------------------------------- */

export default function NewsTicker({ articles }: { articles: Article[] }) {
  const [activeBreaking, setActiveBreaking] = useState<Article | null>(null);
  const [showBreaking, setShowBreaking] = useState(false);
  const [dismissedBreakingId, setDismissedBreakingId] =
    useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* -------------------------------------------------------
     PURE BREAKING DETECTION (NO SIDE EFFECTS)
  -------------------------------------------------------- */

  const cmsBreakingArticle = useMemo(
    () => articles.find(a => a.badges?.includes("breaking")) ?? null,
    [articles]
  );

  /* -------------------------------------------------------
     BREAKING STATE MACHINE (ESLINT-SAFE)
  -------------------------------------------------------- */

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // No breaking OR already dismissed → do nothing
    if (
      !cmsBreakingArticle ||
      cmsBreakingArticle.id === dismissedBreakingId
    ) {
      return;
    }

    // New breaking article arrived → clear dismissal (ASYNC)
    if (
      dismissedBreakingId &&
      cmsBreakingArticle.id !== dismissedBreakingId
    ) {
      setTimeout(() => {
        setDismissedBreakingId(null);
      }, 0);
    }

    // Show breaking (ASYNC)
    timerRef.current = setTimeout(() => {
      setActiveBreaking(cmsBreakingArticle);
      setShowBreaking(true);
    }, 0);

    // Auto-expire
    timerRef.current = setTimeout(() => {
      setShowBreaking(false);

      setTimeout(() => {
        setActiveBreaking(null);
        setDismissedBreakingId(cmsBreakingArticle.id);
      }, FADE_DURATION_MS);
    }, BREAKING_DURATION_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [cmsBreakingArticle, dismissedBreakingId]);

  /* -------------------------------------------------------
     NON-BREAKING TICKER ITEMS
  -------------------------------------------------------- */

  const crawlItems: CrawlItem[] = useMemo(() => {
    const nonBreaking = articles.filter(
      a => !a.badges?.includes("breaking")
    );

    if (!nonBreaking.length) return [];

    const mapped: CrawlItem[] = nonBreaking.flatMap(a => [
      { type: "article", data: a },
      { type: "separator" },
    ]);

    return [...mapped, ...mapped];
  }, [articles]);

  /* -------------------------------------------------------
     DRAG HANDLING
  -------------------------------------------------------- */

  const onStart = () => {
    if (activeBreaking) return;
    setIsDragging(true);
    if (dragRef.current) {
      dragRef.current.style.animationPlayState = "paused";
    }
  };

  const onEnd = () => {
    if (!isDragging || activeBreaking) return;
    setIsDragging(false);
    if (dragRef.current) {
      dragRef.current.style.animationPlayState = "running";
      dragRef.current.style.transform = "";
    }
  };

  if (!articles.length) return null;

  /* -------------------------------------------------------
     RENDER
  -------------------------------------------------------- */

  return (
    <div className="w-full border-b border-white/10 overflow-hidden">

      {/* BREAKING BANNER */}
      {activeBreaking && (
        <Link
          href={`/news/${activeBreaking.slug}`}
          className={`
            block bg-[#E92C63] text-white
            transition-opacity
            ${showBreaking ? "opacity-100" : "opacity-0"}
            breaking-pulse
          `}
          style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
            <span className="text-[10px] font-extrabold tracking-widest uppercase bg-black/30 px-3 py-1 rounded-full">
              Breaking
            </span>
            <span className="text-sm sm:text-base font-semibold truncate">
              {activeBreaking.title}
            </span>
          </div>
        </Link>
      )}

      {/* STANDARD TICKER */}
      {!activeBreaking && (
        <div className="bg-[#0B0D0F]/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex items-center px-4 py-2 gap-4">

            <div className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#00B3FF]/10 text-[#00B3FF]">
              Trending
            </div>

            <div
              className="flex-1 overflow-hidden relative h-6"
              onPointerDown={onStart}
              onPointerUp={onEnd}
              onPointerLeave={onEnd}
              onTouchStart={onStart}
              onTouchEnd={onEnd}
            >
              <div className="absolute inset-0 flex items-center whitespace-nowrap">
                <div
                  ref={dragRef}
                  className="flex"
                  style={{ animation: "tickerLoop 130s linear infinite" }}
                >
                  {[0, 1].map(track => (
                    <div key={track} className="flex items-center gap-6">
                      {crawlItems.map((item, i) =>
                        item.type === "separator" ? (
                          <span key={i} className="text-[#00B3FF]/70">•</span>
                        ) : (
                          <Link
                            key={i}
                            href={`/news/${item.data.slug}`}
onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                            className="text-[11px] sm:text-sm text-white/90 hover:text-[#00B3FF]"
                          >
                            {item.data.title}
                          </Link>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SOCIAL ICONS */}
            <div className="hidden sm:flex items-center gap-3 text-white/80">
              {SOCIAL_LINKS.map(link => {
                const href =
                  isMobile && link.appUrl ? link.appUrl : link.webUrl;

                const Icon =
                  link.platform === "facebook" ? Facebook :
                  link.platform === "instagram" ? Instagram :
                  link.platform === "x" ? X :
                  Youtube;

                return (
                  <a
                    key={link.platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WaveNation on ${link.name}`}
                  >
                    <Icon size={14} className="hover:text-[#00B3FF]" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tickerLoop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes breakingPulse {
          0% { box-shadow: 0 0 0 rgba(233,44,99,.4); }
          50% { box-shadow: 0 0 14px rgba(233,44,99,.6); }
          100% { box-shadow: 0 0 0 rgba(233,44,99,.4); }
        }

        .breaking-pulse {
          animation: breakingPulse 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
