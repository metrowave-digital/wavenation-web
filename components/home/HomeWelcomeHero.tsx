import { HighlightPanel } from "./HighlightPanel";
import { ArticlesPanel } from "./ArticlesPanel";
import { PollPanel } from "./PollPanel";
import { SpecialtyRow } from "./SpecialtyRow";
import { AdBanner } from "./AdBanner";

interface HomeWelcomeHeroProps {
  articles: any[];
}

export default function HomeWelcomeHero({ articles }: HomeWelcomeHeroProps) {
  const latestFive = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  return (
    <section className="w-full bg-wn-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">

        <div
          className="
            grid gap-6 
            lg:grid-cols-[1.6fr,1fr] 
            items-stretch 
            content-stretch
            auto-rows-fr
          "
        >
          {/* LEFT */}
          <div className="self-stretch">
            <HighlightPanel articles={latestFive} />
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6 self-stretch h-full">
            <ArticlesPanel />   {/* ✅ FIXED — no props */}
            <PollPanel />
          </div>
        </div>

        <AdBanner slot="12345" className="my-10" />
        <SpecialtyRow />
      </div>
    </section>
  );
}
