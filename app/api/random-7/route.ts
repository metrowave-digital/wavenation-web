// app/api/random-7/route.ts
import { NextResponse } from "next/server";
import { payloadGraphQL } from "@/lib/payloadClient";
import { ArticlesQueryResponse } from "@/lib/types";

const QUERY = `
  query RandomSevenArticles {
    Articles(limit: 30, where: { status: { equals: "published" } }) {
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
  const selected = shuffled.slice(0, 7);

  return NextResponse.json(selected, { status: 200 });
}
