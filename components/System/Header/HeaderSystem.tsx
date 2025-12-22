"use client";

import BrandBar from "./BrandBar";
import PrimaryNav from "./PrimaryNav";
import UtilityBar from "./UtilityBar";

export default function HeaderSystem() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-wn-black/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <BrandBar />
        <div className="flex items-center justify-between px-4 py-2">
          <PrimaryNav />
          <UtilityBar />
        </div>
      </div>
    </header>
  );
}
