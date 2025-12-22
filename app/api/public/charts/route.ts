import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const res = await fetch(
      "https://wavenation.media/api/charts" +
        "?limit=10" +
        "&depth=0" +
        "&sort=-period" +
        "&where[status][equals]=published",
      {
        cache: "no-store",
        headers: {
          "Accept": "application/json",
          "User-Agent": "WaveNation-Web/1.0",
        },
      }
    )

    if (!res.ok) {
      console.error("Payload returned", res.status)
      return NextResponse.json({ docs: [] })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error("Proxy failed:", err)
    return NextResponse.json({ docs: [] })
  }
}
