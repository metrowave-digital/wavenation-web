"use client";

import { useState } from "react";
import MegaMenu from "./MegaMenu";
import { NAV_ITEMS, NavItem } from "./nav.config";

export default function PrimaryNav() {
  const [active, setActive] = useState<NavItem | null>(null);

  return (
    <nav className="hidden md:flex gap-8 text-sm font-medium">
      {NAV_ITEMS.map(item => (
        <div
          key={item.label}
          onMouseEnter={() => setActive(item)}
          onMouseLeave={() => setActive(null)}
          className="relative"
        >
          <button className="py-2 text-white/90 hover:text-electric">
            {item.label}
          </button>
          {active?.label === item.label && <MegaMenu item={active} />}
        </div>
      ))}
    </nav>
  );
}
