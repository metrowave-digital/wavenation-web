"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ArtistSpotlightEditorial.module.css";

gsap.registerPlugin(ScrollTrigger);

/* ===============================
   TYPES
=============================== */
interface MediaType {
  url?: string;
}

interface RelationType {
  slug?: string;
  title?: string;
  name?: string;
  heroImage?: MediaType;
  image?: MediaType;
}

interface Props {
  bannerImage?: MediaType | null;
  artist?: RelationType | null;
  artistImage?: MediaType | null;
  featuredArticle?: RelationType | null;
  tagline?: string;
}

/* ===============================
   COMPONENT
=============================== */

export default function ArtistSpotlightEditorial(props: Props) {
  const {
    bannerImage,
    artist,
    artistImage,
    featuredArticle,
    tagline,
  } = props;

  /* -------- DATA FALLBACKS -------- */
  const banner =
    bannerImage?.url || "/artist-spotlight/editorial-bg.jpg";

  const portrait =
    artistImage?.url ||
    artist?.image?.url ||
    "/artist-spotlight/fallback-artist.jpg";

  const articleImg =
    featuredArticle?.heroImage?.url ||
    featuredArticle?.image?.url ||
    "/artist-spotlight/article.jpg";

  const name = artist?.name || "Featured Artist";

  /* -------- REFS -------- */
  const heroRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const coverRef = useRef<HTMLDivElement>(null); // ✔ FIX: div ref, NOT anchor ref

  /* -------- GSAP ANIMATIONS -------- */
  useEffect(() => {
    const hero = heroRef.current;
    const portraitEl = portraitRef.current;
    const headline = headlineRef.current;
    const coverEl = coverRef.current;

    if (!hero || !portraitEl || !headline || !coverEl) return;

    // Background parallax
    gsap.to(hero, {
      backgroundPositionY: "45%",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Portrait fade-in
    gsap.fromTo(
      portraitEl,
      { opacity: 0, scale: 0.85, y: 80 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
      }
    );

    // Headline float up
    gsap.from(headline, {
      opacity: 0,
      y: 40,
      duration: 1.4,
      delay: 0.2,
      ease: "power3.out",
    });

    // Cover card slide-in
    gsap.from(coverEl, {
      opacity: 0,
      y: 60,
      duration: 1.5,
      delay: 0.35,
      ease: "power3.out",
    });
  }, []);

  /* ===============================
     RENDER
  =============================== */

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${banner})` }}
      ref={heroRef}
    >
      {/* Cinematic layers */}
      <div className={styles.vignette} />
      <div className={styles.noise} />
      <div className={styles.glowLeft} />
      <div className={styles.glowRight} />

      <div className={styles.layout}>
        {/* ---------------- LEFT SIDE ---------------- */}
        <div className={styles.left}>
          <h1 className={styles.vertical}>SPOTLIGHT</h1>

          <div ref={portraitRef} className={styles.portraitFrame}>
            <Image
              fill
              src={portrait}
              alt={name}
              className={styles.portrait}
            />
          </div>

          <h2 ref={headlineRef} className={styles.artistName}>
            {name}
          </h2>

          {tagline && <p className={styles.tagline}>{tagline}</p>}

          <Link
            href={`/profiles/${artist?.slug || ""}`}
            className={styles.button}
          >
            View Profile →
          </Link>
        </div>

        {/* ---------------- RIGHT SIDE — STORY COVER ---------------- */}
        <Link
          href={`/articles/${featuredArticle?.slug || ""}`}
          className={styles.coverCard}
        >
          {/* ✔ FIX: actual ref goes on INNER DIV */}
          <div ref={coverRef} className={styles.coverInner}>
            <Image
              fill
              src={articleImg}
              alt={featuredArticle?.title || "Featured Article"}
              className={styles.coverImage}
            />

            <div className={styles.coverOverlay}>
              <h3>Spotlight Feature</h3>
              <p>{featuredArticle?.title || "Featured Article"}</p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
