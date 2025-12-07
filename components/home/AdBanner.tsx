"use client";

import { useEffect } from "react";

interface AdBannerProps {
  slot: string;
  className?: string;
}

export function AdBanner({ slot, className }: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("AdSense error:", e);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle block text-center"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3124981228718299"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
