"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavItem, NavLink } from "./nav.config";

interface MegaMenuProps {
  item: NavItem | null;
}

export default function MegaMenu({ item }: MegaMenuProps) {
  const [flyout, setFlyout] = useState<NavLink | null>(null);

  if (!item) return null;

  return (
    <div className="absolute top-full left-0 z-40 pt-2 animate-fadeIn">
      {/* Invisible map above entire menu (for safe hover zone) */}
      <div className="absolute -top-2 left-0 right-0 h-5"></div>

      <div
        className="
          relative flex gap-6
          bg-white/5 backdrop-blur-xl
          border border-white/15 rounded-2xl
          shadow-xl px-5 py-4
          min-w-max
        "
      >
        {item.sections.map((section) => (
          <div key={section.title} className="min-w-[160px] whitespace-nowrap relative">
            <h3 className="text-xs font-semibold tracking-widest text-electric uppercase mb-2">
              {section.title}
            </h3>

            <ul className="space-y-1.5">
              {section.links.map((link) => (
                <li
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => setFlyout(link.flyout ? link : null)}
                  onMouseLeave={() =>
                    setFlyout((prev) =>
                      prev?.label === link.label ? null : prev
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className="
                        block text-sm text-white/90
                        group-hover:text-electric transition-colors
                      "
                    >
                      {link.label}
                    </Link>

                    {link.flyout && (
                      <span
                        className="
                          text-white/40 group-hover:text-electric
                          ml-2 text-xs transition-transform
                          group-hover:translate-x-[3px]
                        "
                      >
                        ▶
                      </span>
                    )}
                  </div>

                  {/* Flyout submenu – TOUCHING the menu item */}
                  {flyout?.label === link.label && flyout.flyout && (
                    <div
                      className="
                        absolute top-0 left-[98%]
                        z-50 animate-flyoutFade
                      "
                    >
                      {/* Invisible hover bridge */}
                      <div className="absolute left-[-18px] w-10 h-full"></div>

                      <div
                        className="
                          bg-white/5 backdrop-blur-xl
                          border border-white/15 rounded-2xl
                          shadow-xl px-4 py-4
                          min-w-[160px]
                        "
                      >
                        <ul className="space-y-1.5">
                          {flyout.flyout.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                className="
                                  block text-sm text-white/90
                                  hover:text-electric transition-colors
                                "
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
