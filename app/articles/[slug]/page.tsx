import Image from 'next/image'
import { notFound } from 'next/navigation'

/* ---------------------------------
   TYPES
---------------------------------- */

interface LexicalTextNode {
  text: string
}

interface LexicalNode {
  type: string
  children?: LexicalTextNode[]
}

interface RichTextBlock {
  id: string
  blockType: 'richText'
  content: {
    root: {
      children: LexicalNode[]
    }
  }
}

interface Article {
  title: string
  slug: string
  badges?: string[]
  readingTime?: number
  publishedDate?: string
  lastUpdated?: string

  heroImage?: {
    url?: string | null
  }
  heroImageAlt?: string | null

  author?: {
    displayName?: string | null
    bio?: string | null
  }

  mediaTieIn?: {
    label?: string | null
    url?: string | null
  }

  relatedArticles?: Article[]

  standardFields?: {
    subtitle?: string | null
    category?: { name: string }
    tags?: { name: string }[]
    content?: RichTextBlock[]
  }
}

/* ---------------------------------
   DATA FETCH
---------------------------------- */

async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(
    `https://wavenation.media/api/articles?where[slug][equals]=${slug}&depth=3`,
    { cache: 'no-store' },
  )

  if (!res.ok) return null
  const data = await res.json()
  return data.docs?.[0] ?? null
}

/* ---------------------------------
   PAGE
---------------------------------- */

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return notFound()

  const heroUrl = article.heroImage?.url
  const published = article.publishedDate
    ? new Date(article.publishedDate).toLocaleDateString()
    : null
  const updated = article.lastUpdated
    ? new Date(article.lastUpdated).toLocaleDateString()
    : null

  return (
    <article className="bg-[#0B0D0F] text-white">
      {/* ================= HERO ================= */}
      <header className="relative min-h-[70vh] flex items-end">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={article.heroImageAlt || article.title}
            fill
            priority
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
          {/* BADGES */}
          {article.badges?.length && (
            <div className="flex gap-2 mb-4">
              {article.badges.map((b) => (
                <span
                  key={b}
                  className="bg-red-600 text-xs font-bold px-2 py-1 tracking-wide"
                >
                  {b.toUpperCase()}
                </span>
              ))}
            </div>
          )}

          {article.standardFields?.category && (
            <span className="text-xs tracking-widest text-[#00B3FF] uppercase">
              {article.standardFields.category.name}
            </span>
          )}

          <h1 className="mt-2 text-4xl md:text-6xl font-bold leading-tight">
            {article.title}
          </h1>

          {article.standardFields?.subtitle && (
            <p className="mt-4 max-w-3xl text-lg text-gray-300">
              {article.standardFields.subtitle}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
            <span>
              By{' '}
              <strong className="text-gray-200">
                {article.author?.displayName || 'WaveNation Editorial'}
              </strong>
            </span>
            {published && <span>• {published}</span>}
            {updated && <span className="italic">Updated {updated}</span>}
          </div>
        </div>
      </header>

      {/* ================= META BAR ================= */}
      <div className="border-b border-[#1F1F21] px-6 py-4 flex flex-wrap items-center justify-between gap-4 max-w-6xl mx-auto">
        <div className="flex gap-4 text-sm text-gray-400">
          {article.readingTime && (
            <span>{article.readingTime} min read</span>
          )}
          {article.standardFields?.tags?.map((tag) => (
            <span key={tag.name}>{tag.name}</span>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="border px-3 py-1 text-sm">X</button>
          <button className="border px-3 py-1 text-sm">Facebook</button>
          <button className="border px-3 py-1 text-sm">Copy</button>
          <button className="border px-3 py-1 text-sm bg-white text-black">
            Save
          </button>
        </div>
      </div>

      {/* ================= AD SLOT ================= */}
      <div className="max-w-6xl mx-auto my-10 h-24 bg-[#1A1A1C] flex items-center justify-center text-gray-500">
        ADVERTISEMENT
      </div>

      {/* ================= BODY ================= */}
      <section className="max-w-6xl mx-auto px-6 text-[18px] leading-relaxed space-y-6">
        {article.standardFields?.content?.map((block) => {
          if (block.blockType !== 'richText') return null

          return (
            <div key={block.id} className="space-y-6">
              {block.content.root.children.map((node, idx) => {
                if (!node.children) return null

                if (node.type === 'quote') {
                  return (
                    <blockquote
                      key={idx}
                      className="border-l-4 border-[#00B3FF] pl-4 italic text-gray-300"
                    >
                      {node.children.map((c, i) => (
                        <span key={i}>{c.text}</span>
                      ))}
                    </blockquote>
                  )
                }

                return (
                  <p key={idx}>
                    {node.children.map((c, i) => (
                      <span key={i}>{c.text}</span>
                    ))}
                  </p>
                )
              })}
            </div>
          )
        })}

        {/* MEDIA TIE-IN */}
        {article.mediaTieIn?.label && (
          <div className="border-l-4 border-[#39FF14] pl-4 text-sm">
            🎧 {article.mediaTieIn.label}{' '}
            {article.mediaTieIn.url && (
              <a
                href={article.mediaTieIn.url}
                className="underline ml-1"
              >
                Listen
              </a>
            )}
          </div>
        )}
      </section>

      {/* ================= AD SLOT ================= */}
      <div className="max-w-6xl mx-auto my-10 h-24 bg-[#1A1A1C] flex items-center justify-center text-gray-500">
        ADVERTISEMENT
      </div>

      {/* ================= AUTHOR ================= */}
      <section className="max-w-6xl mx-auto px-6 border-t border-[#1F1F21] pt-8">
        <strong>
          {article.author?.displayName || 'WaveNation Editorial'}
        </strong>
        {article.author?.bio && (
          <p className="mt-2 text-gray-400">{article.author.bio}</p>
        )}
      </section>

      {/* ================= RELATED ================= */}
      {article.relatedArticles?.length ? (
        <section className="max-w-6xl mx-auto px-6 mt-12">
          <h3 className="text-xl font-semibold mb-4">
            Related Stories
          </h3>
          <ul className="space-y-2">
            {article.relatedArticles.map((item) => (
              <li key={item.slug}>
                <a
                  href={`/news/${item.slug}`}
                  className="hover:underline"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ================= CTA ================= */}
      <section className="max-w-6xl mx-auto px-6 my-16 border border-[#1F1F21] p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">
          Subscribe to the WaveNation Weekly
        </h3>
        <p className="text-gray-400 mb-4">
          Culture, music, and stories — delivered.
        </p>
        <button className="bg-[#00B3FF] text-black px-6 py-2 font-semibold">
          Subscribe
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="max-w-6xl mx-auto px-6 pb-16 flex flex-wrap items-center justify-between gap-6 text-sm text-gray-400">
        <div className="flex gap-2">
          {article.standardFields?.tags?.map((tag) => (
            <span key={tag.name}>#{tag.name.replace(/\s+/g, '')}</span>
          ))}
        </div>

        <div className="flex gap-4">
          <a href="#">Report an error</a>
          <a href="#">Share</a>
        </div>
      </footer>
    </article>
  )
}
