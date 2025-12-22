import Script from "next/script";
import { WNThemeProvider } from "@/components/ui/ThemeToggle/WNThemeProvider";
import HeaderSystem from "@/components/System/Header/HeaderSystem";
import FooterSystem from "@/components/System/Footer/FooterSystem";
import StickyPlayer from "@/components/System/StickyPlayer/StickyPlayer";
import WNMobileNav from "@/components/ui/WNMobileNav";
import NewsTicker from "@/components/System/GlobalRail/NewsTicker";
import type { NewsArticle } from "@/types/news";

interface AppShellProps {
  children: React.ReactNode;
  articles: NewsArticle[];
}

export default function AppShell({ children, articles }: AppShellProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="
          bg-wn-black text-white
          antialiased
          min-h-screen
          font-fira
        "
      >
        {/* GOOGLE ADSENSE */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3124981228718299"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <WNThemeProvider>
          {/* GLOBAL NEWS */}
          <NewsTicker articles={articles} />

          {/* GLOBAL HEADER */}
          <HeaderSystem />

          {/* 🔑 PAGE ROOT — NO PADDING */}
          <main id="content" className="relative min-h-screen">
            {children}
          </main>

          {/* GLOBAL FOOTER */}
          <FooterSystem />

          {/* PERSISTENT UI */}
          <StickyPlayer />
          <WNMobileNav />
        </WNThemeProvider>
      </body>
    </html>
  );
}
