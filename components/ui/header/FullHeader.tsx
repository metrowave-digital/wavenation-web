"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import MegaMenu from "./MegaMenu";
import { NAV_ITEMS, type NavItem } from "./navData";

// Icons
import {
  User,
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  Cloud,
  Search,
} from "lucide-react";

export default function FullHeader() {
  const [active, setActive] = useState<NavItem | null>(null);
  const [isDark, setIsDark] = useState(true); // fake theme toggle for logo

  /* ---------------------------------------------------
     Backdrop fade overlay (no setState here)
  ----------------------------------------------------*/
  useEffect(() => {
    let overlay = document.getElementById("page-fade-overlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "page-fade-overlay";
      overlay.className =
        "pointer-events-none fixed inset-0 z-30 bg-black/0 backdrop-blur-0 transition-all duration-300";
      document.body.appendChild(overlay);
    }

    if (active) {
      overlay.style.background = "rgba(0,0,0,0.45)";
      overlay.style.backdropFilter = "blur(2px)";
    } else {
      overlay.style.background = "rgba(0,0,0,0)";
      overlay.style.backdropFilter = "blur(0px)";
    }
  }, [active]);

  return (
    <header className="w-full bg-wn-black/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center px-4 md:px-6 py-3">

        {/* LEFT: LOGO + TEXT */}
        <div className="flex-1 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 select-none">
            <Image
              src="/WNLogo.svg"
              alt="WaveNation Logo"
              width={42}
              height={42}
              priority
            />

            <span className="text-white font-bold tracking-wide text-lg md:text-xl">
              WAVENATION
            </span>
          </Link>
        </div>

        {/* CENTER NAV — DESKTOP */}
        <nav className="hidden md:flex flex-1 justify-center gap-8 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActive(item)}
              onMouseLeave={() => setActive(null)}
            >
              <button className="relative py-2 whitespace-nowrap text-white/90 hover:text-electric transition">
                <span className="relative">{item.label}</span>

                {active?.label === item.label && (
                  <span
                    className="
                      absolute -bottom-1 left-0 right-0 mx-auto h-[2px]
                      bg-electric rounded-full shadow-[0_0_6px_#00B3FF]
                      animate-neonPulse
                    "
                  />
                )}
              </button>

              {active?.label === item.label && <MegaMenu item={active} />}
            </div>
          ))}
        </nav>

        {/* RIGHT ICONS — DESKTOP */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-4 text-white/90">
          <button className="hover:text-electric transition" aria-label="Profile">
            <User size={20} />
          </button>

          <button className="hover:text-electric transition" aria-label="Cart">
            <ShoppingBag size={20} />
          </button>

          <button className="hover:text-electric transition" aria-label="Weather">
            <Cloud size={20} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="hover:text-electric transition"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="hover:text-electric transition" aria-label="Search">
            <Search size={20} />
          </button>
        </div>

        {/* MOBILE ICONS */}
        <div className="flex md:hidden items-center gap-4 text-white/90">
          <button className="hover:text-electric transition">
            <User size={20} />
          </button>

          <button className="hover:text-electric transition">
            <ShoppingBag size={20} />
          </button>

          <button className="hover:text-electric transition">
            <Cloud size={20} />
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            className="hover:text-electric transition"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="hover:text-electric transition">
            <Search size={20} />
          </button>

          <button className="hover:text-electric transition">
            <Menu size={26} />
          </button>
        </div>
      </div>
    </header>
  );
}
