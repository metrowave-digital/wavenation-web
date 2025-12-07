const specialty = [
  {
    id: 1,
    title: "Fresh Finds Fridays",
    subtitle: "Spotlighting rising voices.",
  },
  {
    id: 2,
    title: "Southern Soul Saturdays",
    subtitle: "Soul. Blues. Vibes.",
  },
  {
    id: 3,
    title: "Gospel Flow",
    subtitle: "Uplifted mornings.",
  },
  {
    id: 4,
    title: "WaveNation TV",
    subtitle: "Live shows & originals.",
  },
];

export function SpecialtyRow() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-wn-muted">
          Specialty Programming
        </h2>
        <p className="text-[11px] text-wn-muted">Curated lanes for every mood.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {specialty.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl border border-white/10 bg-white/5 p-4 hover:border-wn-accent/70 hover:bg-white/10"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-wn-accent">
              Feature
            </p>
            <h3 className="mt-1 text-sm font-semibold">{item.title}</h3>
            <p className="mt-2 text-xs text-wn-muted">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
