export async function getPoll(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/polls/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}
