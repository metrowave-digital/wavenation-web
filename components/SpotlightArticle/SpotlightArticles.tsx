"use client";

import styles from "./SpotlightArticles.module.css";
import SpotlightArticle from "./SpotlightArticle";

export interface SpotlightArticleItem {
  id: string | number;
  title: string;
  excerpt?: string;
  slug: string;

  category?: {
    name?: string;
    title?: string;
  };

  heroImage?: { url?: string };
  seo?: { ogImage?: { url?: string } };
}

export interface SpotlightArticlesProps {
  articles: SpotlightArticleItem[];
}

export default function SpotlightArticles({ articles }: SpotlightArticlesProps) {
  // If nothing came back from CMS, silently skip section
  if (!articles || articles.length === 0) return null;

  const CMS = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/+$/, "") ?? "";

  const resolveImage = (article: SpotlightArticleItem): string => {
    const raw =
      article.heroImage?.url ||
      article.seo?.ogImage?.url ||
      "/images/editorial/default-card.jpg";

    if (!raw) {
      return "/images/editorial/default-card.jpg";
    }

    if (raw.startsWith("http")) return raw;
    if (CMS) return `${CMS}${raw}`;
    return raw;
  };

  const resolveCategory = (article: SpotlightArticleItem): string =>
    article.category?.name ||
    article.category?.title ||
    "WaveNation News";

  // FIRST ROW (3 FEATURED HORIZONTAL CARDS)
  const topRow = articles.slice(0, 3);

  // REMAINING CARDS
  const rest = articles.slice(3);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Spotlight Articles</h2>

        {/* FEATURED ROW (3 horizontal cards) */}
        <div className={styles.featuredRow}>
          {topRow.map((article) => (
            <SpotlightArticle
              key={article.id}
              title={article.title}
              excerpt={article.excerpt ?? ""}
              category={resolveCategory(article)}
              href={`/news/${article.slug}`}
              image={resolveImage(article)}
              variant="horizontal"
            />
          ))}
        </div>

        {/* REST OF THE ARTICLES IN GRID */}
        {rest.length > 0 && (
          <div className={styles.grid}>
            {rest.map((article) => (
              <SpotlightArticle
                key={article.id}
                title={article.title}
                excerpt={article.excerpt ?? ""}
                category={resolveCategory(article)}
                href={`/news/${article.slug}`}
                image={resolveImage(article)}
                variant="vertical"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
