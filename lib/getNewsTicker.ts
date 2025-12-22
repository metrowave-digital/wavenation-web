// lib/getNewsTicker.ts

import type { NextFetchOptions } from "./nextFetch";

export async function getNewsTicker() {
  try {
    const base = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/+$/, "");

    if (!base) {
      console.error("NEXT_PUBLIC_CMS_URL is not defined");
      return [];
    }

    const res = await fetch(
      `${base}/api/articles?limit=4&sort=-publishedAt`,
      {
        next: { revalidate: 60 },
      } as NextFetchOptions
    );

    if (!res.ok) {
      console.error("Failed to fetch ticker articles");
      return [];
    }

    const data = await res.json();
    return data?.docs ?? [];
  } catch (err) {
    console.error("CMS connection error:", err);
    return [];
  }
}
