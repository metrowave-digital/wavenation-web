// lib/payloadClient.ts

export const PAYLOAD_URL = process.env.PAYLOAD_PUBLIC_API as string;

type NextFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export async function payloadGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(
    `${PAYLOAD_URL}/api/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    } as NextFetchOptions
  );

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Payload GraphQL error");
  }

  return (await res.json()) as T;
}
