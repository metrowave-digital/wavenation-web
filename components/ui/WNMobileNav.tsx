"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Headphones,
  Tv,
  Newspaper,
  User,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/listen", label: "Listen", icon: Headphones },
  { href: "/watch", label: "Watch", icon: Tv },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/menu", label: "Menu", icon: Menu },
];

export default function WNMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[80] md:hidden">
      <div className="mx-2 mb-2 rounded-2xl bg-[#0B0D0F]/85 backdrop-blur-xl border border-white/10 shadow-xl">
        <div className="grid grid-cols-6 py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-1 py-2"
              >
                <div className="relative">
                  <Icon
                    size={20}
                    className={
                      active ? "text-white" : "text-white/50"
                    }
                  />
                  {active && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-white" />
                  )}
                </div>

                <span
                  className={`text-[10px] leading-none ${
                    active ? "text-white" : "text-white/50"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
