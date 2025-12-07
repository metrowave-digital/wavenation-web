// components/HeroSlider/HeroSlider.tsx (SERVER)

import HeroSliderClient from "./HeroSliderClient";
import { SlideContent } from "./SlideItem";
import styles from "./HeroSlider.module.css";

const API_BASE_URL = "https://wavenation-cms-1dfs.onrender.com";

// ===============================
// TYPES
// ===============================
interface HeroImage {
  url: string;
}

interface Category {
  name: string;
}

interface SEOOgImage {
  url: string;
}

interface SEO {
  description?: string | null;
  ogImage?: SEOOgImage | null;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  status: string;
  publishedDate?: string;
  heroImage?: HeroImage | null;
  seo?: SEO | null;
  category?: Category | null;
}

interface ArticlesResponse {
  docs: Article[];
}

// ===============================
// FETCH (SSR)
// ===============================

async function getSlides(): Promise<SlideContent[]> {
  try {
    const url = `${API_BASE_URL}/api/articles?limit=5&sort=-publishedDate&where[status][equals]=published`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data: ArticlesResponse = await res.json();
    const docs = data.docs ?? [];

    return docs.map((article) => {
      const rawImage =
        article.heroImage?.url ||
        article.seo?.ogImage?.url ||
        "/images/editorial/default-hero.jpg";

      const imageUrl = rawImage.startsWith("http")
        ? rawImage
        : `${API_BASE_URL}${rawImage}`;

      const categoryName = article.category?.name ?? "WaveNation News";

      const excerptSrc = article.seo?.description || article.title;
      const excerpt =
        excerptSrc.length > 160
          ? `${excerptSrc.slice(0, 157)}...`
          : excerptSrc;

      return {
        id: article.id,
        title: article.title,
        excerpt,
        category: categoryName,
        image: imageUrl,
        href: `/news/${article.slug}`,
      };
    });
  } catch (e) {
    console.error("CMS Fetch Error:", e);
    return [];
  }
}

// ===============================
// MAIN COMPONENT
// ===============================

export default async function HeroSlider() {
  const slides = await getSlides();

  return (
    <section className={styles.wrapper}>
      {/* HEADER BLOCK */}
      <header className={styles.header}>
        <h2 className={styles.title}>Latest WaveNation News</h2>
        <p className={styles.subtitle}>
          Breaking stories, culture, music, and entertainment — updated daily.
        </p>
      </header>

      {/* SLIDER */}
      <div className={styles.sliderOuter}>
        <HeroSliderClient slides={slides} />
      </div>
    </section>
  );
}
