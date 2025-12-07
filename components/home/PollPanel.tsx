export function PollPanel() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wn-muted">
        People Poll
      </p>

      <h2 className="mt-2 text-lg font-semibold">
        Which WaveNation feature are you rocking with this month?
      </h2>

      <div className="mt-4 space-y-2 text-xs">
        {[
          "Fresh Finds Fridays",
          "Southern Soul Saturdays",
          "Gospel Flow Mornings",
          "WaveNation TV Originals",
        ].map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-black/40 px-3 py-2 hover:bg-black/60"
          >
            <input type="radio" name="poll" className="h-3 w-3 border border-white/60" />
            {option}
          </label>
        ))}
      </div>

      <button className="mt-4 w-full rounded-full bg-wn-accent px-4 py-2 text-xs font-semibold text-black hover:bg-wn-accent/90">
        Vote & View Results
      </button>
    </section>
  );
}
