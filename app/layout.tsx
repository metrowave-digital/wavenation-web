import AppShell from "@/components/System/AppShell";
import { getNewsTicker } from "@/lib/getNewsTicker";
import type { NewsArticle } from "@/types/news";
import "./globals.css";

/* --------------------------------------------------------
   METADATA (ENTERPRISE BASELINE)
--------------------------------------------------------- */

export const metadata = {
  title: {
    default: "WaveNation",
    template: "%s | WaveNation",
  },
  description: "24/7 Streaming Radio, TV & Culture — WaveNation Media",
  applicationName: "WaveNation",
  metadataBase: new URL("https://wavenation.media"),
};

/* --------------------------------------------------------
   ROOT LAYOUT
--------------------------------------------------------- */

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side fetch (safe in App Router)
  const articles: NewsArticle[] = await getNewsTicker();

  return (
    <AppShell articles={articles}>
      {children}
    </AppShell>
  );
}
