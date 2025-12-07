// apps/web/src/app/api/random-articles/route.ts

import { NextResponse } from "next/server";

/* -------------------------------------------------------------
   TYPES — Matches your SpotlightArticleItem structure exactly
------------------------------------------------------------- */
interface ArticleImageSize {
  url?: string;
}

interface ArticleImageSizes {
  card?: ArticleImageSize;
  large?: ArticleImageSize;
}

interface ArticleImage {
  url?: string;
  sizes?: ArticleImageSizes;
}

interface ArticleCategory {
  title: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: ArticleCategory;
  featuredImage?: ArticleImage;
}

interface GraphQLArticlesResponse {
  data?: {
    Articles?: {
      docs?: Article[];
    };
  };
}

/* -------------------------------------------------------------
   ROUTE
------------------------------------------------------------- */
export async function GET() {
  try {
    const GRAPHQL_URL = process.env.NEXT_PUBLIC_PAYLOAD_GRAPHQL_URL;

    if (!GRAPHQL_URL) {
      console.error("❌ Missing GraphQL URL");
      return NextResponse.json([], { status: 500 });
    }

    const query = `
      query GetArticles {
        Articles(limit: 100, sort: "-publishedAt") {
          docs {
            id
            title
            slug
            excerpt
            category {
              title
            }
            featuredImage {
              url
              sizes {
                card { url }
                large { url }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error("❌ GraphQL request failed");
      return NextResponse.json([], { status: 500 });
    }

    const json = (await response.json()) as GraphQLArticlesResponse;
    let docs: Article[] = json?.data?.Articles?.docs ?? [];

    /* Ensure at least 4 articles */
    if (docs.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    while (docs.length < 4) {
      docs = [...docs, ...docs];
    }

    /* Stable Shuffle — Fully Typed */
    const shuffled: Article[] = docs
      .map((article): { article: Article; sortKey: number } => ({
        article,
        sortKey: Math.random(),
      }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((entry) => entry.article);

    return NextResponse.json(shuffled.slice(0, 4), { status: 200 });
  } catch (error) {
    console.error("🔥 Random Articles Route Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
