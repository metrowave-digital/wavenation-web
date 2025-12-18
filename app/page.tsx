import WNMobileNav from "@/components/ui/WNMobileNav";

import HeroSection from "@/components/HeroSection/HeroSection";
import FeaturedPlaylists from "@/components/Playlists/FeaturedPlaylists/FeaturedPlaylists";
import ArticlesSection from "@/components/Articles/ArticlesSection/ArticlesSection";
import NewsletterCTA from "@/components/NewsletterCTA/NewsletterCTA";


/* ------------------------------------------
   MAIN PAGE (SERVER)
------------------------------------------- */

export default async function Home() {

  return (
    <main
      className="
        min-h-screen bg-wn-black text-white
        px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20
        pt-4 sm:pt-6 lg:pt-10 pb-32
        relative overflow-hidden font-fira
      "
    >
      {/* BACKGROUND VFX */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-wn-red/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -right-10 w-[28rem] h-[28rem] bg-wn-gold/20 rounded-full blur-3xl opacity-80" />
      </div>

      {/* HERO SECTION */}
      <section className="mt-4 sm:mt-6 lg:mt-10">
        <HeroSection />
      </section>

      {/* FEATURED PLAYLISTS */}
      <FeaturedPlaylists />

      {/* LATEST ARTICLES */}
      <ArticlesSection />

      {/* NEWSLETTER CTA */}
      <section className="mt-20 lg:mt-24">
        <NewsletterCTA />
      </section>

      {/* FOOTER */}
      <FooterYearSafe />

      {/* Prevent StickyPlayer overlap */}
      <div className="h-24" />

      <WNMobileNav />
    </main>
  );
}

/* ------------------------------------------
   HYDRATION SAFE FOOTER YEAR
------------------------------------------- */

function FooterYearSafe() {
  return (
    <footer className="mt-24 text-center opacity-60 text-xs font-inter">
      ©
      <span suppressHydrationWarning>{new Date().getFullYear()}</span>
      {" "}
      MetroWave Media Group · wavenation.media
    </footer>
  );
}
