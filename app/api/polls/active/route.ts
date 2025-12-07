import { NextResponse } from "next/server";

const CMS = process.env.NEXT_PUBLIC_CMS_URL!;

export async function GET() {
  try {
    const res = await fetch(`${CMS}/api/polls/active`, {
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Frontend Active Poll Error:", err);
    return NextResponse.json(
      { error: "Failed to load active poll" },
      { status: 500 }
    );
  }
}
