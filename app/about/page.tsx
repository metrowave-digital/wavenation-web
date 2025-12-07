import Hero from "@/components/home/Hero";
import Info from "@/components/home/Info";
import Values from "@/components/home/Values";
import SubscribeSection from "@/components/home/SubscribeSection";

export default async function About() {
  return (
    <>
      {/* Standard Sections */}
      <section className="mt-24 lg:mt-28">
        <Hero />
      </section>

      <section className="mt-20 lg:mt-24">
        <Info />
      </section>

      <section className="mt-20 lg:mt-24">
        <Values />
      </section>

      <section className="mt-20 lg:mt-24">
        <SubscribeSection />
      </section>
    </>
  );
}
