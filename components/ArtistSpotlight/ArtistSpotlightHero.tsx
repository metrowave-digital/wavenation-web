"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import styles from "./ArtistSpotlightHero.module.css";

/* ================================
   TYPES (with safe optional fields)
================================ */
interface MediaType { url?: string | null }
interface RelationType {
  slug?: string | null;
  title?: string | null;
  name?: string | null;
  heroImage?: MediaType | null;
  coverArt?: MediaType | null;
  image?: MediaType | null;
}

interface Props {
  bannerImage?: MediaType | null;
  artist?: RelationType | null;
  artistImage?: MediaType | null;
  featuredArticle?: RelationType | null;
  featuredRelease?: RelationType | null;
  featuredEvent?: RelationType | null;
  tagline?: string | null;
}

/* ================================
   SAFE COMPONENT
================================ */
export default function ArtistSpotlightHero(props: Props) {
  const {
    bannerImage,
    artist,
    artistImage,
    featuredArticle,
    featuredRelease,
    featuredEvent,
    tagline,
  } = props;

  /* SAFE IMAGE FALLBACKS */
  const backdrop =
    bannerImage?.url || "/artist-spotlight/fallback-banner.png";

  const portrait =
    artistImage?.url ||
    artist?.image?.url ||
    "/artist-spotlight/fallback-artist.jpg";

  const name = artist?.name || "Featured Artist";

  const articleImg =
    featuredArticle?.heroImage?.url ||
    featuredArticle?.image?.url ||
    "/artist-spotlight/article.jpg";

  const releaseImg =
    featuredRelease?.coverArt?.url ||
    "/artist-spotlight/release.jpg";

  const eventImg =
    featuredEvent?.image?.url ||
    "/artist-spotlight/event.jpg";

  const safeSlug = (slug?: string | null) => slug || "";

  /* ============================================
     BASIC FADE-IN ANIMATIONS (NO PARALLAX)
  ============================================ */
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(`.${styles.portraitFrame}`, { opacity: 0, y: 50, duration: 1 })
      .from(`.${styles.artistName}`, { opacity: 0, y: 30, duration: 1 }, "-=0.5")
      .from(`.${styles.cards} > *`, { opacity: 0, y: 40, stagger: 0.2 }, "-=0.5");

  }, []);

  /* ============================================
     RENDER
  ============================================ */
  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${backdrop})` }}
      ref={heroRef}
    >
      <div className={styles.vignette} />

      <div className={styles.layout}>

        {/* LEFT */}
        <div className={styles.left}>
          <div className={styles.mastheadRow}>
            <span className={styles.masthead}>WAVENATION</span>
            <span className={styles.issueTag}>FEATURED ARTIST</span>
          </div>

          <div className={styles.portraitFrame}>
            <Image
              src={portrait}
              alt={name}
              fill
              className={styles.portrait}
            />
          </div>

          <h1 className={styles.artistName}>{name}</h1>

          {tagline && <p className={styles.tagline}>{tagline}</p>}

          <Link href={`/profiles/${safeSlug(artist?.slug)}`} className={styles.button}>
            View Profile →
          </Link>
        </div>

        {/* RIGHT — CARDS */}
        <div className={styles.cards}>
          
          {/* ARTICLE CARD */}
          <Link href={`/articles/${safeSlug(featuredArticle?.slug)}`} className={styles.card}>
            <Image src={articleImg} alt="Cover Story" fill className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3>COVER STORY</h3>
              <p>{featuredArticle?.title || "Featured Article"}</p>
            </div>
          </Link>

          {/* RELEASE CARD */}
          <Link href={`/albums/${safeSlug(featuredRelease?.slug)}`} className={styles.card}>
            <Image src={releaseImg} alt="Exclusive Drop" fill className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3>EXCLUSIVE DROP</h3>
              <p>{featuredRelease?.title || "Release Spotlight"}</p>
            </div>
          </Link>

          {/* EVENT CARD */}
          <Link href={`/events/${safeSlug(featuredEvent?.slug)}`} className={styles.card}>
            <Image src={eventImg} alt="Live Event" fill className={styles.cardImage} />
            <div className={styles.cardOverlay}>
              <h3>LIVE EVENT</h3>
              <p>{featuredEvent?.title || "Upcoming Event"}</p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
