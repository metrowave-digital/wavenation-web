// app/page.tsx

import WNMobileNav from "@/components/ui/WNMobileNav";
import StickyPlayer from "@/components/StickyPlayer";

import HeroSection from "@/components/HeroSection/HeroSection";
import SpotlightArticles from "@/components/SpotlightArticle/SpotlightArticles";
import CTASection from "@/components/CTASection/CTASection";

import ArtistSpotlight from "@/components/ArtistSpotlight/ArtistSpotlight";
import ArticlesSection from "@/components/ArticlesSection/ArticlesSection";
import NewsletterCTA from "@/components/NewsletterCTA/NewsletterCTA";

import type { SpotlightArticleItem } from "@/components/SpotlightArticle/SpotlightArticles";

/* ------------------------------------------
   MAIN PAGE
------------------------------------------- */
export default async function Home() {
  const CMS = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/+$/, "");

  /* ---------------------------------------------------------
     FETCH SPOTLIGHT ARTICLES (page-level fetch is REQUIRED)
  --------------------------------------------------------- */
  let spotlightArticles: SpotlightArticleItem[] = [];

  try {
    const res = await fetch(
      `${CMS}/api/articles?limit=20&sort=-publishedAt&depth=2`,
      { cache: "no-store" }
    );

    const json = await res.json();
    const docs: SpotlightArticleItem[] = json?.docs ?? [];

    // Shuffle + take 7 spotlight items
    spotlightArticles = [...docs].sort(() => Math.random() - 0.5).slice(0, 7);
  } catch (err) {
    console.error("SpotlightArticles CMS Fetch Error:", err);
  }

  return (
    <main
      className="
        min-h-screen bg-wn-black text-white 
        px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 
        pt-4 sm:pt-6 lg:pt-10 pb-32
        relative overflow-hidden font-fira
      "
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-wn-red/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -right-10 w-[28rem] h-[28rem] bg-wn-gold/20 rounded-full blur-3xl opacity-80" />
      </div>

      {/* HERO */}
      <section className="mt-4 sm:mt-6 lg:mt-10">
        <HeroSection />
      </section>

      {/* Featured 3 + horizontal scroll */}
      <ArticlesSection />

      {/* ARTIST SPOTLIGHT */}
      <ArtistSpotlight
        bannerImage="/artist-spotlight/banner.png"
        artistImage="/artist-spotlight/artist.jpg"
        artistName="Artist Name"
        tagline="R&B • Soul • Contemporary"
        featuredArticle={{
          title: "Exclusive Interview",
          slug: "example-article",
          image: "/artist-spotlight/article.jpg",
        }}
        featuredRelease={{
          title: "New Release",
          slug: "example-release",
          coverArt: "/artist-spotlight/release.jpg",
        }}
        featuredEvent={{
          title: "Live Event",
          slug: "example-event",
          image: "/artist-spotlight/event.jpg",
        }}
      />

            <section className="mt-20 lg:mt-24">
        <CTASection />
      </section>

            <NewsletterCTA />


      {/* Spotlight Section — NOW FIXED */}
      <section className="mt-12 sm:mt-16 lg:mt-20">
        <SpotlightArticles articles={spotlightArticles} />
      </section>

      {/* FOOTER */}
      <footer className="mt-24 text-center opacity-60 text-xs font-inter">
        © {new Date().getFullYear()} MetroWave Media Group · wavenation.media
      </footer>

      <WNMobileNav />
      <StickyPlayer />
    </main>
  );
}
