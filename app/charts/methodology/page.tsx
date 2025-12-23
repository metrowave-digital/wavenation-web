import styles from "./MethodologyPage.module.css"

export default function ChartMethodologyPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Chart Methodology
        </h1>
        <p className={styles.subhead}>
          How WaveNation charts are compiled, weighted,
          and reviewed.
        </p>
      </header>

      <section className={styles.section}>
        <h2>1. Chart Scope</h2>
        <p>
          WaveNation charts track independent and emerging
          music across radio play, digital traction, and
          editorial review. Each chart reflects a single
          weekly period.
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Ranking Factors</h2>
        <ul>
          <li>Radio rotation & airplay frequency</li>
          <li>Audience engagement & requests</li>
          <li>Editorial curation & cultural impact</li>
          <li>Consistency over time</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. Movement Symbols</h2>
        <ul>
          <li><strong>▲</strong> — Chart position improved</li>
          <li><strong>▼</strong> — Chart position declined</li>
          <li><strong>NEW</strong> — First week on chart</li>
          <li><strong>—</strong> — No change</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4. Editorial Oversight</h2>
        <p>
          All charts are reviewed weekly by WaveNation’s
          editorial team to ensure fairness, accuracy, and
          cultural relevance.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Transparency</h2>
        <p>
          Chart data is archived weekly. Historical charts
          remain accessible for reference and research.
        </p>
      </section>
    </main>
  )
}
