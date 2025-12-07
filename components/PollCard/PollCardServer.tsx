import PollCard from "./PollCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL as string;

async function getLatestPoll(): Promise<number | null> {
  try {
    console.log("CMS URL:", API_BASE_URL);

    if (!API_BASE_URL) {
      console.error("ERROR: NEXT_PUBLIC_CMS_URL is undefined.");
      return null;
    }

    const res = await fetch(
      `${API_BASE_URL}/api/polls?limit=1&sort=-createdAt&where[status][equals]=active`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Poll fetch failed:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    console.log("POLL RESPONSE:", data);

    const poll = data.docs?.[0];
    if (!poll) return null;

    return Number(poll.id); // convert to number
  } catch (err) {
    console.error("Failed to fetch poll:", err);
    return null;
  }
}

export default async function PollCardServer() {
  const pollId = await getLatestPoll();

  if (!pollId) {
    return (
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold">The People’s Poll</h3>
        <p>No active poll available.</p>
      </div>
    );
  }

  return <PollCard pollId={pollId} />;
}
