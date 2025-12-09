// app/api/hero-articles/route.ts
import { NextResponse } from "next/server";
import { payloadGraphQL } from "@/lib/payloadClient";
import { ArticlesQueryResponse } from "@/lib/types";

const QUERY = `
  query LatestHeroArticles {
    Articles(
      limit: 5,
      sort: "-publishedDate",
      where: { status: { equals: "published" } }
    ) {
      docs {
        title
        slug
        subtitle
        publishedDate
        heroImage {
          url
        }
      }
    }
  }
`;

export async function GET() {
  const data = await payloadGraphQL<ArticlesQueryResponse>(QUERY);

  return NextResponse.json(data.Articles.docs, { status: 200 });
}
