import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ---------------------------------
   TYPES (API-SAFE)
---------------------------------- */

interface LexicalTextNode {
  type: "text";
  text: string;
  format?: number;
}

interface LexicalParagraphNode {
  type: "paragraph" | "quote";
  children: LexicalTextNode[];
}

interface LexicalRoot {
  children: LexicalParagraphNode[];
}

interface RichTextBlock {
  id: string;
  blockType: "richText";
  content: {
    root: LexicalRoot;
  };
}

interface Media {
  url?: string | null;
  focalX?: number | null;
  focalY?: number | null;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  readingTime?: number;
  publishedDate?: string | null;
  lastUpdated?: string | null;
  heroImage?: Media | null;
  heroImageAlt?: string | null;

  author?: {
    displayName?: string | null;
    slug?: string | null;
  };

  seo?: {
    title?: string | null;
    description?: string | null;
    ogImage?: Media | null;
    noIndex?: boolean | null;
  };

  standardFields?: {
    subtitle?: string | null;
    category?: {
      name: string;
      slug: string;
    } | null;
    subCategory?: {
      name: string;
      slug: string;
    } | null;
    tags?: { id: number; name: string; slug: string }[];
    content?: RichTextBlock[];
  };

  creditsSources?: string | null;
}

/* ---------------------------------
   DATA FETCH
---------------------------------- */

async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(
    `https://wavenation.media/api/articles?where[slug][equals]=${slug}&depth=2`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.docs?.[0] ?? null;
}

async function getRelatedArticles(slug: string): Promise<Article[]> {
  const res = await fetch(
    `https://wavenation.media/api/articles?limit=4&where[slug][not_equals]=${slug}&depth=1`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.docs ?? [];
}

/* ---------------------------------
   SEO METADATA
---------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) return {};

  const title =
    article.seo?.title ?? `${article.title} | WaveNation News`;

  const description =
    article.seo?.description ??
    article.standardFields?.subtitle ??
    "Culture-driven reporting from WaveNation News.";

  const image =
    article.seo?.ogImage?.url ??
    article.heroImage?.url ??
    "/og-default.jpg";

  return {
    title,
    description,
    robots: article.seo?.noIndex ? "noindex" : "index, follow",
    openGraph: {
      title,
      description,
      url: `https://wavenation.media/news/${article.slug}`,
      siteName: "WaveNation News",
      images: [{ url: image, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}


/* ---------------------------------
   PAGE
---------------------------------- */

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getArticle(slug);
  if (!article) return notFound();

  const related = await getRelatedArticles(slug);

  return (
    <main className="min-h-screen bg-[#0B0D0F] text-white">
      {/* ================= HERO ================= */}
      <section className="relative h-[55vh]">
        {article.heroImage?.url && (
          <Image
            src={article.heroImage.url}
            alt={article.heroImageAlt || article.title}
            fill
            priority
            className="object-cover"
            style={{
              objectPosition: `${article.heroImage.focalX ?? 50}% ${
                article.heroImage.focalY ?? 50
              }%`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 max-w-6xl w-full px-4 pb-10">
          <div className="text-xs uppercase tracking-widest text-gray-400">
            {article.standardFields?.category?.name}
            {article.standardFields?.subCategory && (
              <> • {article.standardFields.subCategory.name}</>
            )}
          </div>

          <h1 className="mt-2 text-4xl md:text-6xl font-bold leading-tight">
            {article.title}
          </h1>

          {article.standardFields?.subtitle && (
            <p className="mt-4 max-w-3xl text-lg text-gray-300">
              {article.standardFields.subtitle}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
            <span>By {article.author?.displayName ?? "WaveNation Editorial"}</span>
            {article.publishedDate && (
              <time dateTime={article.publishedDate}>
                {new Date(article.publishedDate).toLocaleDateString()}
              </time>
            )}
            {article.readingTime && (
              <span>{article.readingTime} min read</span>
            )}
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* ARTICLE BODY */}
        <article className="prose prose-invert max-w-none prose-p:leading-relaxed prose-blockquote:border-l-[#00B3FF]">
          {article.standardFields?.content?.map((block) =>
            block.blockType === "richText" ? (
              <div key={block.id}>
                {block.content.root.children.map((node, i) =>
                  node.type === "quote" ? (
                    <blockquote key={i}>
                      {node.children.map((t, x) => (
                        <span key={x}>{t.text}</span>
                      ))}
                    </blockquote>
                  ) : (
                    <p key={i}>
                      {node.children.map((t, x) => (
                        <span key={x}>{t.text}</span>
                      ))}
                    </p>
                  )
                )}
              </div>
            ) : null
          )}

          {article.creditsSources && (
            <div className="mt-10 text-sm text-gray-400 whitespace-pre-line">
              <strong>Sources:</strong>
              <br />
              {article.creditsSources}
            </div>
          )}
        </article>

        {/* SIDEBAR */}
        <aside className="space-y-10">
          {/* TAGS */}
          {article.standardFields?.tags?.length ? (
            <div>
              <h4 className="text-sm uppercase tracking-widest text-gray-400 mb-3">
                Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.standardFields.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="px-3 py-1 text-xs border border-[#1F1F21] rounded-full hover:border-[#00B3FF]"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {/* RELATED */}
          {related.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Related Coverage
              </h3>
              <ul className="space-y-4">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="block text-gray-300 hover:text-white"
                    >
                      <span className="font-medium leading-snug">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* BRAND */}
          <div className="border border-[#1F1F21] p-5">
            <h4 className="text-lg font-semibold mb-2">
              About WaveNation News
            </h4>
            <p className="text-sm text-gray-400">
              Culture-first reporting rooted in Southern Black storytelling,
              media analysis, and community voices.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
