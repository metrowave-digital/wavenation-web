"use client";

import { Radio, ListMusic, Mail } from "lucide-react";

export default function WNMobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-wn-black/90 dark:bg-white/90 text-white dark:text-black backdrop-blur-xl border-t border-white/10 dark:border-black/10 flex justify-around py-3 z-50">
      <a href="#listen" className="flex flex-col items-center text-xs">
        <Radio className="mb-1" size={20} />
        Live
      </a>

      <a href="#recent" className="flex flex-col items-center text-xs">
        <ListMusic className="mb-1" size={20} />
        Played
      </a>

      <a href="#newsletter" className="flex flex-col items-center text-xs">
        <Mail className="mb-1" size={20} />
        Updates
      </a>
    </nav>
  );
}
