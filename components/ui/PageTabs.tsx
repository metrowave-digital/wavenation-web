"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface PageTab {
  label: string;
  href: string;
}

interface PageTabsProps {
  tabs: PageTab[];
}

export default function PageTabs({ tabs }: PageTabsProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-[64px] z-30 bg-[#0B0D0F]/85 backdrop-blur-xl border-b border-white/10">
      <div className="flex gap-6 px-4 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative py-3 text-sm font-medium whitespace-nowrap"
            >
              <span
                className={
                  active
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }
              >
                {tab.label}
              </span>

              {active && (
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
