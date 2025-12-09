"use client";

import Image from "next/image";
import React from "react";
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
    <div className={styles.upNextInfo}>
      <div className={styles.titleRow}>
        <h3 className={styles.upNextTitle}>{title}</h3>

        <div className={styles.hostAvatar}>
          {avatar ? (
            <Image src={avatar} alt="Host Avatar" fill className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarFallback}>
              {host.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className={styles.upNextLine}></div>

      <div className={styles.metaGrid}>
        <div>
          <p className={styles.metaLabel}>Host</p>
          <p className={styles.metaValue}>{host}</p>
        </div>
        <div>
          <p className={styles.metaLabel}>Date</p>
          <p className={styles.metaValue}>{date}</p>
        </div>
        <div>
          <p className={styles.metaLabel}>Start</p>
          <p className={styles.metaValue}>{start}</p>
        </div>
        <div>
          <p className={styles.metaLabel}>End</p>
          <p className={styles.metaValue}>{end}</p>
        </div>
      </div>
    </div>
  );
}
