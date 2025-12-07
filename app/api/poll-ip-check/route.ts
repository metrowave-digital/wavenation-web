import { NextResponse } from "next/server";

const CMS_URL = "https://wavenation-cms-1dfs.onrender.com/api/polls/check-ip";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(CMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
