"use client";

export function BroadcastHeader() {
  return (
    <header className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-r from-black via-black to-wn-accent/10 p-5 sm:p-6 lg:p-7">
      <div className="grid gap-6 lg:grid-cols-[2fr,2fr,2fr]">
        
        {/* Left: Logo + tagline */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wn-accent text-xs font-black text-black">
              WN
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-wn-muted">Wavenation FM</p>
              <p className="text-sm font-semibold sm:text-base">Amplify Your Vibe.</p>
            </div>
          </div>

          <p className="max-w-sm text-xs text-wn-muted sm:text-sm">
            24/7 urban radio, TV, and on-demand vibes for the culture.
          </p>
        </div>

        {/* Middle: On Air Now */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wn-muted">
            On Air Now
          </p>

          <div className="rounded-2xl bg-white/5 p-3 sm:p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-wn-accent">Morning Hype</p>
            <p className="text-sm font-semibold">Hosted by Karesse & The Wave Crew</p>
            <p className="text-[11px] text-wn-muted">R&B, hip-hop, and real talk • 7:00–10:00 AM</p>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
              <div className="h-full w-1/2 rounded-full bg-wn-accent"></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-wn-muted">
            <span className="font-semibold uppercase tracking-[0.16em]">Recently Played</span> •
            <span>SZA – Good Days</span> •
            <span>Usher – Superstar</span>
          </div>
        </div>

        {/* Right: Quick links */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wn-muted">Quick Access</p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {["Listen", "Watch", "Poll", "Articles"].map((label) => (
              <button key={label}
                className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold hover:border-wn-accent/70 hover:bg-black/70">
                {label}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-wn-muted">
            Designed for web, mobile, and TV — one hub, all your signals.
          </p>
        </div>

      </div>
    </header>
  );
}
