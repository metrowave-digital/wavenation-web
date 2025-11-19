"use client";

import WNHeader from "@/components/ui/WNHeader";
import WNMobileNav from "@/components/ui/WNMobileNav";
import StickyPlayer from "@/components/StickyPlayer";

import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Values from "@/components/home/Values";
import RecentlyPlayedSection from "@/components/home/RecentlyPlayedSection";
import SubscribeSection from "@/components/home/SubscribeSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-wn-black text-white px-4 pb-32 pt-6 relative overflow-hidden font-fira">

      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-wn-red/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -right-10 w-[28rem] h-[28rem] bg-wn-gold/20 rounded-full blur-3xl opacity-80" />
      </div>

      <Hero />
      <About />
      <Values />
      <SubscribeSection />

      <footer className="mt-20 text-center opacity-60 text-xs font-inter">
        © {new Date().getFullYear()} MetroWave Media Group · wavenation.media
      </footer>

      <WNMobileNav />
      <StickyPlayer />
    </main>
  );
}
