"use client";

import { Facebook, Instagram, Youtube, X } from "lucide-react";
import Link from "next/link";
import {
  useMemo,
  useState,
  useRef,
  useEffect,
  PointerEvent,
  TouchEvent,
} from "react";

/* -------------------------------------------------------
   TYPES
-------------------------------------------------------- */

interface Article {
  id: string | number;
  title: string;
  slug?: string;
}

interface ArticleItem {
  type: "article";
  data: Article;
}

interface SeparatorItem {
  type: "separator";
}

type CrawlItem = ArticleItem | SeparatorItem;

type DragEventType =
  | PointerEvent<HTMLDivElement>
  | TouchEvent<HTMLDivElement>;

/* -------------------------------------------------------
   COMPONENT
-------------------------------------------------------- */

export default function NewsTicker({ articles }: { articles: Article[] }) {
  const [speed, setSpeed] = useState(32);
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(false); // ⭐ Feature K — mobile tap toggle

  const dragRef = useRef<HTMLDivElement | null>(null);

  // Drag momentum memory
  const startX = useRef(0);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const lastTime = useRef(0);
  const momentumFrame = useRef(0);
  const isMomentum = useRef(false);

  // Hover pause timer
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  // For hover bubble
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  /* -------------------------------------------------------
     BUILD LOOP x3
  -------------------------------------------------------- */

  const crawlItems: CrawlItem[] = useMemo(() => {
    if (!articles.length) return [];

    const mapped: CrawlItem[] = articles.flatMap((a) => [
      { type: "article", data: a },
      { type: "separator" },
    ]);

    return [...mapped, ...mapped, ...mapped];
  }, [articles]);

/* -------------------------------------------------------
   AI ADAPTIVE SPEED — ULTRA SLOW (Airport News Mode)
-------------------------------------------------------- */

useEffect(() => {
  if (!dragRef.current) return;

  const width = dragRef.current.scrollWidth;
  const viewport = window.innerWidth;

  const titles = articles.map((a) => a.title);
  const totalChars = titles.reduce((acc, t) => acc + t.length, 0);
  const avgLen = totalChars / (titles.length || 1);

  // A — Headline Length Modifier (more influence)
  const headlineFactor =
    avgLen >= 100 ? 1.9 :
    avgLen >= 70 ? 1.6 :
    avgLen >= 50 ? 1.4 :
    avgLen >= 30 ? 1.2 : 1.0;

  // B — Content Width Modifier
  let widthFactor = width / viewport;
  widthFactor = Math.max(1.3, Math.min(widthFactor, 3.5));

  // C — Drag Velocity Influence (reduced drastically)
  let velocityBoost = Math.abs(velocity.current);
  velocityBoost = Math.min(velocityBoost * 1.5, 0.2);
  const userFactor = 1 + velocityBoost;

  // D — Device Adaptation (mobile slower)
  const isMobile = viewport < 768;
  const deviceFactor = isMobile ? 1.4 : 1.0;

  // BASE ULTRA SLOW SPEED
  let ideal =
    135 * headlineFactor * deviceFactor / (widthFactor * userFactor);

  // Clamp to VERY slow range
  ideal = Math.max(110, Math.min(ideal, 160));

  setSpeed(ideal);
}, [articles]);


  /* -------------------------------------------------------
     PAUSE / RESUME ENGINE
-------------------------------------------------------- */

  const pauseAnimation = () => {
    if (dragRef.current) dragRef.current.style.animationPlayState = "paused";
  };

  const resumeAnimation = () => {
    if (!paused && dragRef.current)
      dragRef.current.style.animationPlayState = "running";
  };

  /* -------------------------------------------------------
     FEATURE K — TAP TO PAUSE / TAP TO RESUME
-------------------------------------------------------- */

  const togglePause = () => {
    if (!dragRef.current) return;

    if (paused) {
      setPaused(false);
      dragRef.current.style.animationPlayState = "running";
    } else {
      setPaused(true);
      dragRef.current.style.animationPlayState = "paused";
    }
  };

  /* -------------------------------------------------------
     HOVER AUTO PAUSE
-------------------------------------------------------- */

  const scheduleHoverPause = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => pauseAnimation(), 2000);
  };

  const cancelHoverPause = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    resumeAnimation();
  };

  /* -------------------------------------------------------
     DRAG SYSTEM
-------------------------------------------------------- */

  const extractX = (e: DragEventType) =>
    "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;

  const onStart = (e: DragEventType) => {
    cancelAnimationFrame(momentumFrame.current);
    isMomentum.current = false;

    pauseAnimation();
    setIsDragging(true);

    startX.current = extractX(e);
    lastX.current = extractX(e);
    lastTime.current = performance.now();

    if (dragRef.current) {
      const c = getComputedStyle(dragRef.current);
      const matrix = c.transform;
      const currentX =
        matrix !== "none" ? parseFloat(matrix.split(",")[4]) : 0;

      dragRef.current.dataset.offset = currentX.toString();
      dragRef.current.style.animationPlayState = "paused";
    }
  };

  const onMove = (e: DragEventType) => {
    if (!isDragging || !dragRef.current) return;

    const x = extractX(e);
    const dx = x - startX.current;

    const offset = parseFloat(dragRef.current.dataset.offset ?? "0");
    dragRef.current.style.transform = `translateX(${offset + dx}px)`;

    // Track velocity
    const now = performance.now();
    const dt = now - lastTime.current;
    velocity.current = (x - lastX.current) / dt;

    lastX.current = x;
    lastTime.current = now;
  };

  /* -------------------------------------------------------
     MOMENTUM
-------------------------------------------------------- */

  const momentumScroll = () => {
    if (!dragRef.current) return;
    isMomentum.current = true;

    velocity.current *= 0.95;

    const match = dragRef.current.style.transform.match(
      /translateX\((-?\d+\.?\d*)px\)/
    );

    const currentX = match ? parseFloat(match[1]) : 0;
    const nextX = currentX + velocity.current * 14;

    dragRef.current.style.transform = `translateX(${nextX}px)`;

    if (Math.abs(velocity.current) > 0.04) {
      momentumFrame.current = requestAnimationFrame(momentumScroll);
    } else {
      isMomentum.current = false;
      dragRef.current.style.transform = "";
      resumeAnimation();
    }
  };

  const onEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(velocity.current) > 0.02) momentumScroll();
    else resumeAnimation();
  };

  if (!articles.length) return null;

  /* -------------------------------------------------------
     RENDER
-------------------------------------------------------- */

  return (
    <div
      className="w-full bg-[#0F0F0F]/80 backdrop-blur-xl border-b border-white/10 relative overflow-hidden touch-pan-x select-none"
      onClick={togglePause} // ⭐ Feature K
    >
      {/* Masks */}
      <div className="wn-ticker-mask wn-ticker-mask-left"></div>
      <div className="wn-ticker-mask wn-ticker-mask-right"></div>

      <div className="max-w-7xl mx-auto flex items-center px-4 py-2 gap-4">
        <div className="bg-electric text-black font-bold uppercase text-[10px] px-3 py-1.5 rounded-md">
          Trending
        </div>

        {/* TRACK */}
        <div
          className="flex-1 overflow-hidden relative h-6"
          onPointerDown={onStart}
          onPointerMove={onMove}
          onPointerUp={onEnd}
          onPointerLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        >
          <div className="absolute inset-0 flex items-center whitespace-nowrap overflow-hidden">
            <div
              ref={dragRef}
              className="flex will-change-transform"
              style={{
                animation: `tickerLoop ${speed}s linear infinite`,
              }}
            >
              {/* TRACK A */}
              <div className="flex items-center gap-6">
                {crawlItems.map((item, i) =>
                  item.type === "separator" ? (
                    <span key={`A-sep-${i}`} className="text-electric text-sm px-2">•</span>
                  ) : (
                    <span
                      key={`A-${i}`}
                      className="wn-ticker-wrapper"
                      onMouseEnter={() => {
                        setHoveredIndex(i);
                        scheduleHoverPause();
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        cancelHoverPause();
                      }}
                    >
                      <span
                        className={`wn-ticker-illusion transition-all duration-300 ${
                          hoveredIndex === i ? "scale-125 z-10 relative" : ""
                        }`}
                      >
                        <Link
                          href={
                            item.data.slug
                              ? `/news/${item.data.slug}`
                              : `/news/${item.data.id}`
                          }
                          className="wn-ticker-link text-[11px] sm:text-sm text-white hover:text-electric whitespace-nowrap leading-none transition-colors"
                        >
                          {item.data.title}
                        </Link>
                      </span>
                    </span>
                  )
                )}
              </div>

              {/* TRACK B */}
              <div className="flex items-center gap-6">
                {crawlItems.map((item, i) =>
                  item.type === "separator" ? (
                    <span key={`B-sep-${i}`} className="text-electric text-sm px-2">•</span>
                  ) : (
                    <span
                      key={`B-${i}`}
                      className="wn-ticker-wrapper"
                      onMouseEnter={() => {
                        setHoveredIndex(10000 + i);
                        scheduleHoverPause();
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        cancelHoverPause();
                      }}
                    >
                      <span
                        className={`wn-ticker-illusion transition-all duration-300 ${
                          hoveredIndex === 10000 + i
                            ? "scale-125 z-10 relative"
                            : ""
                        }`}
                      >
                        <Link
                          href={
                            item.data.slug
                              ? `/news/${item.data.slug}`
                              : `/news/${item.data.id}`
                          }
                          className="wn-ticker-link text-[11px] sm:text-sm text-white hover:text-electric whitespace-nowrap leading-none transition-colors"
                        >
                          {item.data.title}
                        </Link>
                      </span>
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full gap-4">
          <nav className="hidden md:flex items-center gap-4 text-xs text-white/90">
            <Link href="/submissions" className="hover:text-electric">Submissions</Link>
            <Link href="/partner" className="hover:text-electric">Advertise</Link>
            <Link href="/portal" className="hover:text-electric">Portal</Link>
          </nav>

          <div className="hidden md:block w-px h-5 bg-white/25" />

          <div className="flex items-center gap-3 text-white/90">
            <Link href="#"><Facebook size={16} className="hover:text-electric" /></Link>
            <Link href="#"><Instagram size={16} className="hover:text-electric" /></Link>
            <Link href="#"><X size={16} className="hover:text-electric" /></Link>
            <Link href="#"><Youtube size={16} className="hover:text-electric" /></Link>
          </div>
        </div>

        {/* Mobile icons */}
        <div className="flex sm:hidden items-center gap-2">
          <Link href="#"><Facebook size={14} className="text-white/90 hover:text-electric" /></Link>
          <Link href="#"><Instagram size={14} className="text-white/90 hover:text-electric" /></Link>
        </div>
      </div>

      <style>{`
        @keyframes tickerLoop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
