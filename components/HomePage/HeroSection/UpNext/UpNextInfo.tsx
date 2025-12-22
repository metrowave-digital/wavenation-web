"use client";

import Image from "next/image";
import styles from "./UpNextBox.module.css";

interface Props {
  title: string;
  host: string;
  date: string;
  start: string;
  end: string;
  avatar: string | null;
}

export default function UpNextInfo({
  title,
  host,
  date,
  start,
  end,
  avatar,
}: Props) {
  return (
    <div className={styles.info}>
      <h3 className={styles.showTitle}>{title}</h3>

      <div className={styles.hostRow}>
        <div className={styles.avatar}>
          {avatar ? (
            <Image src={avatar} alt={host} fill />
          ) : (
            <span>{host[0]}</span>
          )}
        </div>

        <div>
          <p className={styles.hostName}>{host}</p>
          <p className={styles.time}>
            {date} • {start}–{end}
          </p>
        </div>
      </div>
    </div>
  );
}
