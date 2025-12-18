import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import { WNThemeProvider } from "@/components/ui/ThemeToggle/WNThemeProvider";
import FullHeader from "@/components/ui/header/FullHeader";
import NewsTicker from "@/components/ui/NewsTicker";
import StickyPlayer from "@/components/StickyPlayer/StickyPlayer";
import { getNewsTicker } from "@/lib/getNewsTicker";

export const metadata: Metadata = {
  title: "WaveNation FM",
  description: "24/7 Streaming Radio — WaveNation Media Group",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const articles = await getNewsTicker();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* GOOGLE ADSENSE */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3124981228718299"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <WNThemeProvider>
          {/* GLOBAL NEWS TICKER */}
          <NewsTicker articles={articles} />

          {/* GLOBAL HEADER */}
          <FullHeader />

          {/* MAIN CONTENT */}
          <main>{children}</main>

          {/* GLOBAL STICKY PLAYER */}
          <StickyPlayer />
        </WNThemeProvider>
      </body>
    </html>
  );
}
