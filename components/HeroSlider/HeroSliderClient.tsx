"use client";

import { useEffect, useRef, useState } from "react";
import SlideItem from "./SlideItem";

interface Slide {
  id: number | string;
  title: string;
  excerpt?: string;
  category?: string;
  image: string;
  href: string;
  motionClassName?: string;
}

interface HeroSliderClientProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
}

export default function HeroSliderClient({
  slides,
  autoPlay = true,
  interval = 6000,
}: HeroSliderClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Hydration-safe mounted check (no setState in effects)
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  // Autoplay logic
  useEffect(() => {
    if (!autoPlay || slides.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) =>
        prev + 1 >= slides.length ? 0 : prev + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, slides.length, interval]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="HeroSlider relative w-full h-full overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <SlideItem
            key={slide.id}
            _id={slide.id} // <-- IMPORTANT: matches SlideItemProps
            title={slide.title}
            excerpt={slide.excerpt}
            category={slide.category}
            href={slide.href}
            image={slide.image}
            motionClassName={slide.motionClassName}
            isActive={mounted.current && index === activeIndex}
          />
        ))}
      </div>

      {/* NAV DOTS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              mounted.current && i === activeIndex
                ? "bg-electric scale-110"
                : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
