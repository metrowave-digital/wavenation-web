import type { Metadata } from "next";
import "./globals.css";

import { WNThemeProvider } from "@/components/ui/theme/WNThemeProvider";
import FullHeader from "@/components/ui/header/FullHeader";
import NewsTicker from "@/components/ui/NewsTicker";
import { getNewsTicker } from "@/lib/getNewsTicker";

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3124981228718299"
     crossorigin="anonymous"></script>

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
        <WNThemeProvider>
          {/* GLOBAL NEWS TICKER */}
          <NewsTicker articles={articles} />

          {/* GLOBAL HEADER */}
          <FullHeader />

          {/* MAIN CONTENT */}
          <main>{children}</main>
        </WNThemeProvider>
      </body>
    </html>
  );
}
