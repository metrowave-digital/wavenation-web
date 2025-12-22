import HeroSection from "@/components/HomePage/HeroSection/HeroSection";
import FeaturedPlaylists from "@/components/HomePage/Playlists/FeaturedPlaylists/FeaturedPlaylists";
import ArticlesSection from "@/components/HomePage/Articles/ArticlesSection/ArticlesSection";
import NewsletterCTA from "@/components/HomePage/NewsletterCTA/NewsletterCTA";
import ChartsFeature from "@/components/HomePage/ChartsFeature/ChartsFeature";

export default async function Home() {
  return (
    <>
      {/* FULL-BLEED SURFACE SECTIONS */}
      <HeroSection />
      <FeaturedPlaylists />
      <ChartsFeature />
      <ArticlesSection />
      <NewsletterCTA />
    </>
  );
}
