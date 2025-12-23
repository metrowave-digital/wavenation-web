import styles from "./ChartsPage.module.css"

export default function Loading() {
  return (
    <main className={styles.page}>
      {/* HEADER SKELETON */}
      <header className={styles.header}>
        <div className="h-4 w-24 bg-white/10 rounded mb-3 animate-pulse" />
        <div className="h-10 w-3/4 bg-white/10 rounded mb-2 animate-pulse" />
        <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
      </header>

      {/* BODY */}
      <div className={styles.layout}>
        <section className={styles.main}>
          {/* MOBILE SWIPER PLACEHOLDER */}
          <div className="h-32 bg-white/6 rounded-xl animate-pulse" />

          {/* HIGHLIGHTS */}
          <div className={styles.highlightGrid}>
            <div className="h-24 bg-white/6 rounded-xl animate-pulse" />
            <div className="h-24 bg-white/6 rounded-xl animate-pulse" />
          </div>

          {/* CHART ROWS */}
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-white/6 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </section>

        {/* SIDEBAR */}
        <aside className={styles.sidebarCol}>
          <div className="h-40 bg-white/6 rounded-xl animate-pulse" />
        </aside>
      </div>
    </main>
  )
}
