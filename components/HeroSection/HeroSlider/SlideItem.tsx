// components/HeroSlider/SlideItem.tsx
import Image from "next/image";
import Link from "next/link";
import type { SlideData } from "./HeroSlider.types";

interface SlideItemProps {
  slide: SlideData;
  isActive: boolean;
}

export default function SlideItem({ slide, isActive }: SlideItemProps) {
  return (
    <div className={`slide-item ${isActive ? "active" : ""}`}>
      <Link href={slide.href}>
        {slide.imageUrl ? (
          <Image
            src={slide.imageUrl}
            alt={slide.imageAlt ?? slide.title}
            fill
            className="slide-image"
          />
        ) : (
          <div className="slide-placeholder">
            No image available
          </div>
        )}

        <div className="slide-content">
          <h3>{slide.title}</h3>
          {slide.subtitle && <p>{slide.subtitle}</p>}
        </div>
      </Link>
    </div>
  );
}
