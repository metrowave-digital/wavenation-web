// components/HeroSlider/HeroSlider.tsx
import HeroSliderClient from "./HeroSliderClient";
import type { SlideData } from "./HeroSlider.types";

const CMS = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/+$/, "") ?? "";

/* -------------------------------------------------------
   Types for Payload article shape (safe, no any)
-------------------------------------------------------- */
interface CMSImage {
  url?: string;
  alt?: string;
}

interface CMSCategory {
  name?: string;
  title?: string;
}

interface CMSAuthor {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

interface CMSStandardFields {
  subtitle?: string | null;
  heroImage?: CMSImage | null;
  category?: CMSCategory | null;
}

interface CMSArticle {
  id?: string | number;
  title?: string;
  slug?: string;
  publishedDate?: string | Date | null;
  readingTime?: number | null;

  author?: CMSAuthor | null;

  heroImage?: CMSImage | null;
  standardFields?: CMSStandardFields | null;

  seo?: {
    ogImage?: CMSImage | null;
  } | null;
}

/* -------------------------------------------------------
   Fetch + transform CMS articles into SlideData
-------------------------------------------------------- */
async function getSlides(): Promise<SlideData[]> {
  const res = await fetch(
    `${CMS}/api/articles?limit=5&sort=-publishedDate&depth=2`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.error("HeroSlider fetch failed", res.status);
    return [];
  }

  const json = await res.json();
  const docs: CMSArticle[] = json.docs ?? [];

  return docs.map((a): SlideData => {
    /* ---------------------------------------------
       IMAGE RESOLUTION
    --------------------------------------------- */
    const rawImg =
      a.heroImage?.url ||
      a.standardFields?.heroImage?.url ||
      a.seo?.ogImage?.url ||
      null;

    const imageUrl = rawImg
      ? rawImg.startsWith("http")
        ? rawImg
        : `${CMS}${rawImg}`
      : null;

    /* ---------------------------------------------
       BASIC FIELDS
    --------------------------------------------- */
    const title = a.title ?? "Untitled story";
    const subtitle =
      typeof a.standardFields?.subtitle === "string"
        ? a.standardFields.subtitle
        : null;

    const href = `/news/${a.slug ?? ""}`;

    /* ---------------------------------------------
       AUTHOR NAME RESOLUTION
    --------------------------------------------- */
    const authorName =
      a.author?.displayName ||
      (a.author?.firstName
        ? `${a.author.firstName} ${a.author.lastName ?? ""}`.trim()
        : null) ||
      null;

    /* ---------------------------------------------
       CATEGORY & META
    --------------------------------------------- */
    const categoryLabel =
      a.standardFields?.category?.name ??
      a.standardFields?.category?.title ??
      null;

    const publishedDateLabel = a.publishedDate
      ? new Date(a.publishedDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : null;

    const readingTimeLabel = a.readingTime
      ? `${a.readingTime} min read`
      : null;

    /* ---------------------------------------------
       FINAL SlideData RETURN
    --------------------------------------------- */
    return {
      id: a.id ?? href,

      title,
      subtitle,
      href,
      authorName,

      mediaType: "image",
      imageUrl,
      imageAlt: a.heroImage?.alt ?? title,
      videoUrl: null,
      videoPoster: imageUrl,

      categoryLabel,
      publishedDateLabel,
      readingTimeLabel,
    };
  });
}

/* -------------------------------------------------------
   SERVER COMPONENT WRAPPER
-------------------------------------------------------- */
export default async function HeroSlider() {
  const slides = await getSlides();

  if (!slides.length) return null;

  return <HeroSliderClient slides={slides} />;
}
