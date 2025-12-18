"use client";

import Image from "next/image";
import { useWNTheme } from "./ThemeToggle/WNThemeProvider";

export default function WNLogo({ size = 52 }: { size?: number }) {
  const { resolvedTheme } = useWNTheme();
  const src = resolvedTheme === "light" ? "/WNLogo2.svg" : "/WNLogo.svg";

  return (
    <Image
      src={src}
      alt="WaveNation Logo"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}
