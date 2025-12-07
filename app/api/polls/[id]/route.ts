import { NextRequest, NextResponse } from "next/server";

const CMS = process.env.NEXT_PUBLIC_CMS_URL!;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const pollId = segments[segments.length - 1];

  const res = await fetch(`${CMS}/api/polls/${pollId}`, {
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data);
}
