"use client";

import { useState } from "react";
import Popup from "@/components/ui/PopUp";

export default function SubscribeSection() {
  const [popupVisible, setPopupVisible] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // TODO: send to your API here later

    setPopupVisible(true); // show popup
  };

  return (
    <>
      <section className="max-w-3xl mx-auto mt-24">
        <div className="relative overflow-hidden rounded-3xl border border-red-500/50 bg-gradient-to-br from-black via-[#1a0101] to-black px-6 py-8 md:px-10 md:py-10">
          <div className="absolute -top-24 right-0 w-64 h-64 bg-wn-red/40 rounded-full blur-3xl opacity-70" />

          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-oswald tracking-tight text-center mb-2">
              Lock In With The Wave
            </h3>
            <p className="text-center text-white/70 text-sm md:text-base mb-8 font-inter">
              Get the drops first—new shows, charts, culture stories, creator calls, and more.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 font-inter">
              {/* NAME ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-wn-gold"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-wn-gold"
                />
              </div>

              {/* EMAIL */}
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-white/40 focus:ring-2 focus:ring-wn-gold"
              />

              {/* CHECKBOXES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/85">
                {["News", "Updates", "Charts", "Content", "For Creators"].map((label) => (
                  <label key={label} className="flex items-center gap-3">
                    <input type="checkbox" className="accent-wn-gold" />
                    {label}
                  </label>
                ))}
              </div>

              {/* AGREEMENT */}
              <label className="flex items-start gap-3 text-xs text-white/65">
                <input type="checkbox" required className="mt-1 accent-wn-gold" />
                I agree to receive email updates from WaveNation Media Group and understand I can unsubscribe anytime.
              </label>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-wn-gold text-black font-semibold py-3 rounded-xl hover:bg-wn-gold/90 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* POPUP */}
      <Popup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        title="You're Locked In!"
        message="Thank you for subscribing to WaveNation Media Group. You'll start receiving updates, charts, new content drops, and creator opportunities soon."
      />
    </>
  );
}
