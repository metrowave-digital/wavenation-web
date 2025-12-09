// components/HeroSlider/HeroSlider.tsx (SERVER)

import HeroSliderClient from "./HeroSliderClient";
import styles from "./HeroSlider.module.css";

const rawCMS =
  process.env.NEXT_PUBLIC_CMS_URL ||
  "https://wavenation-cms-1dfs.onrender.com";

const API_BASE_URL = rawCMS.replace(/\/+$/, "");

/* ===============================
   TYPES
=============================== */

interface HeroImage {
  url?: string;
}

interface Category {
  name?: string;
  title?: string;
}

interface SEOOgImage {
  url?: string;
}

interface SEO {
  description?: string | null;
  ogImage?: SEOOgImage | null;
}

interface Article {
  id: number | string;
  title: string;
  slug: string;
  status: string;
  publishedAt?: string;
  heroImage?: HeroImage | null;
  seo?: SEO | null;
  category?: Category | null;
}

interface ArticlesResponse {
  docs?: Article[];
}

/* New slide type */
interface SlideItemData {
  id: number | string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  href: string;
}

/* ===============================
   FETCH (SSR)
=============================== */

async function getSlides(): Promise<SlideItemData[]> {
  try {
    const url = `${API_BASE_URL}/api/articles?limit=5&sort=-publishedAt&where[status][equals]=published&depth=2`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      next: { revalidate: 0 },
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

      const categoryName =
        article.category?.name ||
        article.category?.title ||
        "WaveNation News";

      const source = article.seo?.description || article.title;
      const excerpt =
        source.length > 160 ? `${source.slice(0, 157)}...` : source;

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
    console.error("CMS Fetch Error (HeroSlider):", e);
    return [];
  }
}

/* ===============================
   MAIN COMPONENT
=============================== */

export default async function HeroSlider() {
  const slides = await getSlides();

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.title}>Latest WaveNation News</h2>
        <p className={styles.subtitle}>
          Breaking stories, culture, music, and entertainment — updated daily.
        </p>
      </header>

      <div className={styles.sliderOuter}>
        <HeroSliderClient slides={slides} />
      </div>
    </section>
  );
}
