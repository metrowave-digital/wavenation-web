"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { submitNewsletterSignup } from "@/lib/actions/newsletter";
import gsap from "gsap";

import styles from "./NewsletterCTA.module.css";

type PreferenceKey = "news" | "music" | "events" | "releases";

export default function NewsletterCTA() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [preferences, setPreferences] = useState<Record<PreferenceKey, boolean>>({
    news: false,
    music: false,
    events: false,
    releases: false,
  });

  const [isPending, startTransition] = useTransition();
  const [showToast, setShowToast] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [formLocked, setFormLocked] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLParagraphElement | null>(null);

  function togglePreference(key: PreferenceKey) {
    if (formLocked) return;
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function updateField(field: string, value: string) {
    if (formLocked) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function animateSuccessMessage(text: string) {
    if (!statusRef.current) return;

    statusRef.current.innerHTML = "";
    const el = statusRef.current;
    const letters = text.split("");

    // slide in
    gsap.fromTo(
      el,
      { opacity: 0, x: 25 },
      { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
    );

    // Typewriter effect
    letters.forEach((letter, i) => {
      gsap.to({}, {
        delay: i * 0.03,
        onComplete: () => {
          el.innerHTML += letter;
        }
      });
    });

    // Glow pulse
    gsap.fromTo(
      el,
      { textShadow: "0 0 0 rgba(255,0,77,0)" },
      {
        textShadow: "0 0 12px rgba(255,0,77,0.8)",
        duration: 1.2,
        ease: "sine.inOut",
        repeat: 1,
        yoyo: true,
      }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formLocked) return;

    startTransition(async () => {
      await submitNewsletterSignup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        preferences,
      });

      // USER-FACING SUCCESS MESSAGE (animated)
      const msg = "You're officially in the Wave 🌊";
      setStatusMessage(msg);

      setTimeout(() => animateSuccessMessage(msg), 10);

      // LOCK THE FORM — user can no longer interact or resubmit
      setFormLocked(true);

      // DISABLE FORM visually
      gsap.to(formRef.current, {
        opacity: 0.25,
        duration: 0.4,
        ease: "power1.out",
      });

      // Show toast
      setShowToast(true);
      gsap.fromTo(
        toastRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );

      setTimeout(() => {
        gsap.to(toastRef.current, {
          opacity: 0,
          y: 25,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => setShowToast(false),
        });
      }, 4000);
    });
  }

  // INITIAL ANIMATIONS
  useEffect(() => {
    gsap.fromTo(
      leftRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      rightRef.current,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, delay: 0.15, ease: "power3.out" }
    );
  }, []);

  return (
    <>
      <section className={styles.fullBleed}>
        <div className={styles.glow} />

        <div className={styles.container}>
          <h2 className={styles.heading}>Stay In The Wave</h2>
          <p className={styles.sub}>
            Get only what you want — news, exclusives, interviews, events & more.
          </p>

          <div ref={formRef}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* LEFT */}
              <div ref={leftRef} className={styles.left}>
                <input
                  type="text"
                  required
                  disabled={formLocked}
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={styles.input}
                />

                <input
                  type="text"
                  disabled={formLocked}
                  placeholder="Last Name (optional)"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className={styles.input}
                />

                <input
                  type="email"
                  required
                  disabled={formLocked}
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={styles.input}
                />
              </div>

              {/* RIGHT */}
              <div ref={rightRef} className={styles.right}>
                <p className={styles.label}>Choose your updates:</p>

                <div className={styles.grid}>
                  {(
                    [
                      ["news", "News"],
                      ["music", "Music"],
                      ["events", "Events"],
                      ["releases", "New Releases"],
                    ] as [PreferenceKey, string][]
                  ).map(([key, label]) => {
                    const active = preferences[key];

                    return (
                      <button
                        type="button"
                        disabled={formLocked}
                        key={key}
                        onClick={() => togglePreference(key)}
                        className={`${styles.prefButton} ${
                          active ? styles.prefActive : ""
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Animated success message */}
                {statusMessage && (
                  <p ref={statusRef} className={styles.statusMessage} />
                )}

                <button
                  disabled={formLocked || isPending}
                  className={styles.button}
                >
                  {isPending ? "Submitting…" : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {showToast && (
        <div className={styles.toastContainer}>
          <div ref={toastRef} className={styles.toast}>
            <strong>You&apos;re in! 🌊</strong>
            <p>Welcome to WaveNation — updates coming soon.</p>
          </div>
        </div>
      )}
    </>
  );
}
