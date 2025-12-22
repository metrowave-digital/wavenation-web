"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn"; // optional utility if you have one
import { Radio, Tv, Star } from "lucide-react";

/* --------------------------------------------------------
   SURFACE DETECTION
--------------------------------------------------------- */

type Surface = "fm" | "one" | "plus" | "news" | "default";

function getSurface(pathname: string): Surface {
  if (pathname.startsWith("/watch")) return "one";
  if (pathname.startsWith("/plus")) return "plus";
  if (pathname.startsWith("/news")) return "news";
  if (pathname.startsWith("/listen") || pathname.startsWith("/shows"))
    return "fm";
  return "default";
}

/* --------------------------------------------------------
   COMPONENT
--------------------------------------------------------- */

export default function BrandBar() {
  const pathname = usePathname();
  const surface = getSurface(pathname);

  return (
    <div
      className={cn(
        "w-full px-4 py-3 flex items-center justify-between",
        "border-b border-white/10",
        "bg-wn-black/70 backdrop-blur-xl"
      )}
    >
      {/* LEFT — BRAND LOCKUP */}
      <Link
        href="/"
        className="flex items-center gap-3 select-none"
        aria-label="WaveNation Home"
      >
        <Image
          src="/WNLogo.svg"
          alt="WaveNation"
          width={42}
          height={42}
          priority
        />

        <div className="leading-tight">
          <span className="block text-white font-bold tracking-wide text-lg">
            WAVENATION
          </span>

          {/* Surface label */}
          <span className="block text-[10px] tracking-widest uppercase text-white/50">
            {surfaceLabel(surface)}
          </span>
        </div>
      </Link>

      {/* RIGHT — SURFACE BADGE */}
      <SurfaceBadge surface={surface} />
    </div>
  );
}

/* --------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

function surfaceLabel(surface: Surface) {
  switch (surface) {
    case "fm":
      return "Radio Network";
    case "one":
      return "Streaming TV";
    case "plus":
      return "Premium";
    case "news":
      return "Newsroom";
    default:
      return "Amplify Your Vibe";
  }
}

/* --------------------------------------------------------
   SURFACE BADGE
--------------------------------------------------------- */

function SurfaceBadge({ surface }: { surface: Surface }) {
  if (surface === "default") return null;

  const config = {
    fm: {
      label: "LIVE RADIO",
      icon: Radio,
      className:
        "bg-[#00B3FF]/15 text-[#00B3FF] border-[#00B3FF]/30",
    },
    one: {
      label: "WAVENATION ONE",
      icon: Tv,
      className:
        "bg-[#E92C63]/15 text-[#E92C63] border-[#E92C63]/30",
    },
    plus: {
      label: "PLUS",
      icon: Star,
      className:
        "bg-[#39FF14]/15 text-[#39FF14] border-[#39FF14]/30",
    },
    news: {
      label: "NEWS",
      icon: null,
      className:
        "bg-white/10 text-white border-white/20",
    },
  }[surface];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        "border text-[11px] font-semibold tracking-widest uppercase",
        config.className
      )}
    >
      {Icon && <Icon size={12} />}
      {config.label}
    </div>
  );
}
