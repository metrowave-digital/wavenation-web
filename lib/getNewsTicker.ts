export async function getNewsTicker() {
  try {
    const base = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/+$/, "");
    const res = await fetch(
      `${base}/api/articles?limit=4&sort=-publishedAt`,
      { next: { revalidate: 60 } }
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
