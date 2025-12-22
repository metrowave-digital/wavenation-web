import styles from "./SparklineMini.module.css";

interface SparklineMiniProps {
  entry: {
    rank: number;
    lastWeek?: number | null;
  };
}

export default function SparklineMini({ entry }: SparklineMiniProps) {
  const points =
    typeof entry.lastWeek === "number"
      ? [entry.lastWeek, entry.rank]
      : [entry.rank];

  const max = Math.max(...points);
  const min = Math.min(...points);

  return (
    <div className={styles.sparkline} aria-hidden="true">
      {points.map((rank, i) => {
        const height =
          max === min
            ? 60
            : 90 - ((rank - min) / (max - min)) * 60;

        return (
          <span
            key={i}
            className={styles.bar}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}
