"use client";

import React, { useEffect, useState } from "react";
import styles from "./PollCard.module.css";

interface PollOption {
  label: string;
  value: string | number;
  voteCount?: number;
}

interface PollData {
  id: number;
  question: string;
  totalVotes: number;
  options: PollOption[];
  endAt?: string | null;
  showResults?: "always" | "after-vote" | "after-end" | "admin-only";
}

interface PollCardProps {
  pollId: number;
}

const PollCard: React.FC<PollCardProps> = ({ pollId }) => {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // countdown + expiry
  const [countdown, setCountdown] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // animated percentages
  const [animatedPercents, setAnimatedPercents] = useState<number[]>([]);

  // Load poll data
  useEffect(() => {
    async function loadPoll() {
      try {
        const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/polls/${pollId}?depth=0`;
        console.log("Fetching poll:", url);

        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        console.log("Poll data:", data);

        setPoll({
          id: data.id,
          question: data.question,
          totalVotes: data.totalVotes ?? 0,
          options: data.options ?? [],
          endAt: data.endAt ?? null,
          showResults: data.showResults ?? "always",
        });
      } catch (err) {
        console.error("Poll fetch error:", err);
      }

      setLoading(false);
    }

    loadPoll();
  }, [pollId]);

  // Countdown timer (D)
  useEffect(() => {
    if (!poll?.endAt) return;

    const end = new Date(poll.endAt).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setIsExpired(true);
        setCountdown("Poll ended");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      const remHours = hours % 24;
      const remMinutes = minutes % 60;

      if (days > 0) {
        setCountdown(`${days}d ${remHours}h left`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${remMinutes}m left`);
      } else {
        setCountdown(`${remMinutes}m left`);
      }
    };

    updateCountdown();
    const id = setInterval(updateCountdown, 60_000); // every minute

    return () => clearInterval(id);
  }, [poll?.endAt]);

  // Animated results reveal (B + E)
  useEffect(() => {
    if (!poll) return;

    const totalVotes = poll.totalVotes ?? 0;
    const targetPercents =
      totalVotes > 0
        ? poll.options.map((opt) =>
            ((opt.voteCount ?? 0) / totalVotes) * 100
          )
        : poll.options.map(() => 0);

    let frameId: number;
    const duration = 600; // ms
    const start = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const current = targetPercents.map((p) => p * t);
      setAnimatedPercents(current);
      if (t < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [poll, voted]);

  // Submit vote
  const submitVote = async () => {
    if (!selected || !poll) return;

    setSubmitLoading(true);

    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionValue: Number(selected),
          optionLabel:
            poll.options.find((o) => Number(o.value) === selected)?.label ||
            "",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setVoted(true);

        // refresh poll from CMS so we get updated counts
        const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/polls/${poll.id}?depth=0`;
        const refreshed = await fetch(url, { cache: "no-store" }).then((r) =>
          r.json()
        );
        setPoll({
          id: refreshed.id,
          question: refreshed.question,
          totalVotes: refreshed.totalVotes ?? 0,
          options: refreshed.options ?? [],
          endAt: refreshed.endAt ?? null,
          showResults: refreshed.showResults ?? "always",
        });
      }
    } catch (err) {
      console.error("Vote error:", err);
    }

    setSubmitLoading(false);
  };

  if (loading || !poll) {
    return <div className={styles.card}>Loading poll...</div>;
  }

  const totalVotes = poll.totalVotes ?? 0;
  const maxVotes =
    totalVotes > 0
      ? Math.max(...poll.options.map((o) => o.voteCount ?? 0))
      : 0;

  const showResults = poll.showResults ?? "always";
  const shouldShowResults =
    showResults === "always" ||
    showResults === "admin-only" ||
    showResults === "after-end" ||
    showResults === "after-vote" ||
    voted ||
    isExpired; // safety

  const disableVoting = isExpired || voted;

  return (
    <div className={styles.card}>
      <div className={styles.headingRow}>
        <div className={styles.heading}>People’s Choice</div>
        {countdown && !isExpired && (
          <div className={styles.countdown}>{countdown}</div>
        )}
        {isExpired && <div className={styles.countdown}>Poll ended</div>}
      </div>

      <div className={styles.question}>{poll.question}</div>
      <div className={styles.totalVotes}>{totalVotes} votes</div>

      <div className={styles.optionsWrapper}>
        {poll.options.map((opt, index) => {
          const valueNum = Number(opt.value);
          const isSelected = selected === valueNum;
          const votes = opt.voteCount ?? 0;
          const percent =
            totalVotes > 0 ? ((votes / totalVotes) * 100) : 0;
          const animatedPercent =
            animatedPercents[index] !== undefined
              ? animatedPercents[index]
              : percent;

          const isWinner = totalVotes > 0 && votes === maxVotes && votes > 0;

          return (
            <div
              key={opt.value}
              className={[
                styles.option,
                isSelected ? styles.selected : "",
                isWinner ? styles.winner : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (!disableVoting) setSelected(valueNum);
              }}
            >
              <div className={styles.optionHeader}>
                <span className={styles.label}>{opt.label}</span>
                {shouldShowResults && (
                  <span className={styles.percentage}>
                    {animatedPercent.toFixed(1)}%
                  </span>
                )}
              </div>

              {shouldShowResults && (
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{ width: `${animatedPercent}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {disableVoting ? (
        <div className={styles.thanks}>
          {isExpired ? "Poll has ended." : "Thanks for voting!"}
        </div>
      ) : (
        <button
          className={styles.submit}
          disabled={!selected || submitLoading}
          onClick={submitVote}
        >
          {submitLoading ? "Submitting..." : "Vote"}
        </button>
      )}
    </div>
  );
};

export default PollCard;
