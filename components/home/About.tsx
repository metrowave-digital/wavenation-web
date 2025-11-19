"use client";

export default function About() {
  return (
    <section className="max-w-5xl mx-auto mt-20">
      <div className="border-l-4 border-wn-gold pl-6 md:pl-8">
        
        <h2 className="text-3xl md:text-4xl font-oswald tracking-tight mb-4">
          About <span className="text-wn-gold">WaveNation</span>
        </h2>

        <div className="space-y-4 text-white/80 font-inter leading-relaxed text-sm md:text-base">

          <p>
            Established in Fall 2024,{" "}
            <span className="text-wn-gold font-semibold">WaveNation</span> is
            the crossroads of culture, creativity, and community—resonating on
            every frequency.
          </p>

          <p>
            As an urban internet radio station and cultural media hub, we amplify
            voices, sounds, and stories from R&amp;B, Gospel, Hip-Hop, Soul, Funk,
            Afrobeats, indie gems, and underground talent.
          </p>

          <p>
            Whether you&apos;re tuning in from the heart of the city or across the globe,
            we bring real conversation and uplifting energy 24/7.
          </p>

          <p className="font-semibold text-white">
            We&apos;re not just a radio station—{" "}
            <span className="text-wn-gold">WaveNation is a movement.</span>
          </p>

        </div>
      </div>
    </section>
  );
}
