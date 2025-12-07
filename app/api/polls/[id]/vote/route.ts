import { NextResponse } from "next/server";

const CMS = process.env.NEXT_PUBLIC_CMS_URL!;

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const res = await fetch(`${CMS}/api/polls/${params.id}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
