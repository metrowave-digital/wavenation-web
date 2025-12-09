// app/api/news-ticker/route.ts
import { NextResponse } from "next/server";
import { payloadGraphQL } from "@/lib/payloadClient";
import { ArticlesQueryResponse } from "@/lib/types";

const QUERY = `
  query RandomTickerArticles {
    Articles(limit: 20, where: { status: { equals: "published" } }) {
      docs {
        title
        slug
        publishedDate
      }
    }
  }
`;

export async function GET() {
  const data = await payloadGraphQL<ArticlesQueryResponse>(QUERY);

  const shuffled = [...data.Articles.docs].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10);

  return NextResponse.json(selected, { status: 200 });
}
