// app/api/random-3/route.ts
import { NextResponse } from "next/server";
import { payloadGraphQL } from "@/lib/payloadClient";
import { ArticlesQueryResponse } from "@/lib/types";

const QUERY = `
  query RandomThreeArticles {
    Articles(limit: 15, where: { status: { equals: "published" } }) {
      docs {
        title
        slug
        subtitle
        heroImage {
          url
        }
      }
    }
  }
`;

export async function GET() {
  const data = await payloadGraphQL<ArticlesQueryResponse>(QUERY);

  const shuffled = [...data.Articles.docs].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return NextResponse.json(selected, { status: 200 });
}
