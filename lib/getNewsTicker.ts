export async function getNewsTicker() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMS_URL}/api/articles?limit=4&sort=-publishedAt`,
      {
        // Revalidate every 60 seconds (or adjust)
        next: { revalidate: 60 },
      }
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
