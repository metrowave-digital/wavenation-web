"use client";

import { FaHeart, FaMicrophoneAlt, FaUsers, FaHandsHelping, FaLightbulb, FaBroadcastTower } from "react-icons/fa";
import ValueCard from "./ValueCard";

export default function Values() {
  return (
    <section className="max-w-6xl mx-auto mt-24">
      
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-oswald tracking-tight">
          Our Frequency
        </h2>
        <p className="mt-3 text-sm md:text-base text-white/70 font-inter">
          A Movement Powered by High Vibrations
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ValueCard icon={<FaHeart />} title="Authenticity" text="Real sound, real stories, real culture." />
        <ValueCard icon={<FaMicrophoneAlt />} title="Creator-First" text="We amplify the voices that move the culture." />
        <ValueCard icon={<FaUsers />} title="Community" text="A movement where people thrive together." />
        <ValueCard icon={<FaHandsHelping />} title="Connection" text="Bridging culture, faith, and sound." />
        <ValueCard icon={<FaLightbulb />} title="Innovation" text="We experiment, evolve, and push the culture forward." />
        <ValueCard icon={<FaBroadcastTower />} title="Opportunity" text="Creating space for overlooked voices." />
      </div>

    </section>
  );
}
