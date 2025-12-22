import Link from "next/link";

export default function FooterNav() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
      <div>
        <h4 className="font-semibold mb-2">WaveNation</h4>
        <Link href="/about">About</Link>
        <Link href="/careers">Careers</Link>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Listen</h4>
        <Link href="/shows">Shows</Link>
        <Link href="/charts">Charts</Link>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Watch</h4>
        <Link href="/watch/live">Live TV</Link>
        <Link href="/watch/originals">Originals</Link>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Connect</h4>
        <Link href="/events">Events</Link>
        <Link href="/creators">Creator Hub</Link>
      </div>
    </div>
  );
}
