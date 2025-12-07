import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      query LatestArticles {
        Articles(limit: 5, sort: "-publishedAt") {
          docs {
            id
            title
            excerpt
            slug
            author {
              name
            }
            category {
              title
            }
            featuredImage {
              url
            }
          }
        }
      }
    `;

    const response = await fetch(process.env.PAYLOAD_GRAPHQL_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ query }),
    });

    const json = await response.json();

    return NextResponse.json(json?.data?.Articles?.docs ?? []);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json([], { status: 500 });
  }
}
