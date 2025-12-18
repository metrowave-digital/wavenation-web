"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import styles from "./ArtistSpotlightHero.module.css";

/* ================================
   TYPES
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

  const heroRef = useRef<HTMLDivElement>(null);

  /* SAFE FALLBACKS */
  const backdrop = bannerImage?.url || "/artist-spotlight/fallback-banner.png";
  const portrait =
    artistImage?.url || artist?.image?.url || "/artist-spotlight/fallback-artist.jpg";
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

  /* SUBTLE FADE ONLY */
  useEffect(() => {
    if (!heroRef.current) return;

    gsap.from(heroRef.current.children, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out",
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      style={{ backgroundImage: `url(${backdrop})` }}
    >
      <div className={styles.overlay} />

      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.left}>
          <span className={styles.kicker}>FEATURED ARTIST</span>

          <div className={styles.portrait}>
            <Image src={portrait} alt={name} fill />
          </div>

          <h1 className={styles.name}>{name}</h1>

          {tagline && <p className={styles.tagline}>{tagline}</p>}

          <Link
            href={`/profiles/${safeSlug(artist?.slug)}`}
            className={styles.cta}
          >
            View Profile →
          </Link>
        </div>

        {/* RIGHT */}
        <div className={styles.cards}>
          <FeatureCard
            href={`/articles/${safeSlug(featuredArticle?.slug)}`}
            image={articleImg}
            label="Cover Story"
            title={featuredArticle?.title}
          />

          <FeatureCard
            href={`/albums/${safeSlug(featuredRelease?.slug)}`}
            image={releaseImg}
            label="Release"
            title={featuredRelease?.title}
          />

          <FeatureCard
            href={`/events/${safeSlug(featuredEvent?.slug)}`}
            image={eventImg}
            label="Event"
            title={featuredEvent?.title}
          />
        </div>
      </div>
    </section>
  );
}

/* ================================= */
function FeatureCard({
  href,
  image,
  label,
  title,
}: {
  href: string;
  image: string;
  label: string;
  title?: string | null;
}) {
  return (
    <Link href={href} className={styles.card}>
      <Image src={image} alt={title || label} fill />
      <div className={styles.cardMeta}>
        <span>{label}</span>
        <h3>{title || label}</h3>
      </div>
    </Link>
  );
}
