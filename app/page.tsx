import NowPlaying from "@/components/NowPlaying";
import NewsletterSignup from "@/components/NewsletterSignup";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import StickyPlayer from "@/components/StickyPlayer";

export default function Home() {
  return (
    <main className="min-h-screen bg-darkbg text-white flex flex-col items-center px-4 md:px-6 pb-24 pt-6 relative overflow-hidden">
      {/* Animated Waveform Background */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-80">
        <div className="absolute inset-x-[-20%] top-10 h-64 bg-gradient-to-r from-electric via-magenta to-neon opacity-40 blur-3xl animate-wave" />
      </div>

      {/* NAVBAR */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-electric to-magenta shadow-neon flex items-center justify-center text-xs font-bold">
            WN
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">
              WaveNation FM
            </p>
            <p className="text-xs text-white/60 leading-tight">
              Music • Culture • Community
            </p>
          </div>
        </div>

        <nav className="hidden md:flex gap-6 text-sm text-white/70">
          <a href="#listen" className="hover:text-electric">
            Listen Live
          </a>
          <a href="#recent" className="hover:text-electric">
            Recently Played
          </a>
          <a href="#newsletter" className="hover:text-electric">
            Newsletter
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section
        id="listen"
        className="w-full max-w-3xl text-center flex flex-col items-center mt-4"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-electric via-magenta to-neon bg-clip-text text-transparent drop-shadow-neon animate-float">
          The Sound of WaveNation
        </h1>

        <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-white/80">
          24/7 Southern Soul, R&amp;B, Hip-Hop, Gospel, and more — broadcasting
          from the culture, for the culture.
        </p>

        {/* Now Playing Card */}
        <NowPlaying />
      </section>

      {/* Recently Played */}
      <section id="recent" className="w-full max-w-3xl">
        <RecentlyPlayed />
      </section>

      {/* Newsletter */}
      <section
        id="newsletter"
        className="w-full max-w-3xl flex flex-col items-center"
      >
        <NewsletterSignup />
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center opacity-60 text-xs">
        © {new Date().getFullYear()} WaveNation Media Group · wavenation.media
      </footer>

      {/* Sticky Global Player */}
      <StickyPlayer />
    </main>
  );
}
