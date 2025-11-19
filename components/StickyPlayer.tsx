"use client";

export default function StickyPlayer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="mx-auto max-w-4xl px-4 pb-4">
        <div className="rounded-2xl bg-darkcard/80 border border-electric/40 shadow-neon backdrop-blur-2xl px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.25em] text-electric/80">
              Live Stream
            </p>
            <p className="text-sm text-white/80">WaveNation FM – Listen Live</p>
          </div>
          <audio
            controls
            className="w-56 max-w-full"
            src="https://streaming.live365.com/a49099"
          />
        </div>
      </div>
    </div>
  );
}
