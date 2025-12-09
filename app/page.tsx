import WNMobileNav from "@/components/ui/WNMobileNav";
import StickyPlayer from "@/components/StickyPlayer/StickyPlayer";

import HeroSection from "@/components/HeroSection/HeroSection";
import SpotlightArticles from "@/components/SpotlightArticle/SpotlightArticles";
import CTASection from "@/components/CTASection/CTASection";

import ArtistSpotlight from "@/components/ArtistSpotlight/ArtistSpotlightHero";
import ArticlesSection from "@/components/ArticlesSection/ArticlesSection";
import NewsletterCTA from "@/components/NewsletterCTA/NewsletterCTA";

import type { SpotlightArticleItem } from "@/components/SpotlightArticle/SpotlightArticles";

/* ------------------------------------------
   MAIN PAGE (SERVER)
------------------------------------------- */

export default async function Home() {
  const rawCMS = process.env.NEXT_PUBLIC_CMS_URL || "";
  const CMS = rawCMS.replace(/\/+$/, "");

  let spotlightArticles: SpotlightArticleItem[] = [];

  try {
    const res = await fetch(
      `${CMS}/api/articles?limit=20&sort=-publishedAt&depth=2`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error(`CMS responded ${res.status}`);

    const json = (await res.json()) as { docs?: SpotlightArticleItem[] };
    const docs = json?.docs ?? [];

    // ❗ DO NOT RANDOMIZE ON SERVER — causes hydration mismatch
    spotlightArticles = docs; // we'll randomize inside the client component instead

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

      <ArticlesSection />
      <ArtistSpotlight />

      {/* CTA */}
      <section className="mt-20 lg:mt-24">
        <CTASection />
      </section>

      {/* Newsletter */}
      <section className="mt-20 lg:mt-24">
        <NewsletterCTA />
      </section>

      {/* Spotlight Section (randomized in client) */}
      <section className="mt-12 sm:mt-16 lg:mt-20">
        <SpotlightArticles articles={spotlightArticles} randomize />
      </section>

      {/* Footer — avoid hydration mismatch */}
      <FooterYearSafe />

      {/* Padding so StickyPlayer doesn’t overlap content */}
      <div className="h-24" />

      <WNMobileNav />
      <StickyPlayer />
    </main>
  );
}

/* ------------------------------------------
   HYDRATION-SAFE FOOTER YEAR
------------------------------------------- */

function FooterYearSafe() {
  return (
    <footer className="mt-24 text-center opacity-60 text-xs font-inter">
      © {/* static year for SSR, dynamic year applied by client JS */}
      <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
      MetroWave Media Group · wavenation.media
    </footer>
  );
}
