// app/api/hero-articles/route.ts
import { NextResponse } from "next/server";

const CMS =
  process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/+$/, "") ||
  "https://wavenation.media";

/* ---------------------------------------
   TYPES (Matched to real CMS)
---------------------------------------- */

interface Category {
  name?: string;
}

interface StandardFields {
  subtitle?: string;
  category?: Category;
}

interface HeroImage {
  url?: string;
}

interface Article {
  id: number | string;
  title: string;
  slug: string;
  heroImage?: HeroImage;
  seo?: { ogImage?: HeroImage };
  standardFields?: StandardFields;
}

interface CMSResponse {
  docs?: Article[];
}

/* ---------------------------------------
   API ROUTE — SAFE, NO ANY
---------------------------------------- */

export async function GET() {
  try {
    const url = `${CMS}/api/articles?limit=5&sort=-publishedDate&depth=2`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("CMS ERROR:", res.status);
      return NextResponse.json([], { status: 200 });
    }

    const data: CMSResponse = await res.json();
    const docs = data.docs ?? [];

    const slides = docs.map((article) => {
      const rawImg =
        article.heroImage?.url ||
        article.seo?.ogImage?.url ||
        "/images/editorial/default-hero.jpg";

      const fullImage = rawImg.startsWith("http")
        ? rawImg
        : `${CMS}${rawImg}`;

      return {
        id: article.id,
        title: article.title,
        excerpt: article.standardFields?.subtitle || "",
        category: article.standardFields?.category?.name || "WaveNation News",
        image: fullImage,
        href: `/news/${article.slug}`,
      };
    });

    return NextResponse.json(slides, { status: 200 });
  } catch (err) {
    console.error("🔥 API /hero-articles ERROR:", err);
    return NextResponse.json([], { status: 200 });
  }
}
