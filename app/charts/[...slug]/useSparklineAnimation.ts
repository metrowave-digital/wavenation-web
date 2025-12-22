"use client"

import { useEffect } from "react"
import gsap from "gsap"

export function useSparklineAnimation(
  containerSelector = ".sparkline"
) {
  useEffect(() => {
    const lines = document.querySelectorAll(
      `${containerSelector} polyline`
    )

    if (!lines.length) return

    gsap.fromTo(
      lines,
      { scaleY: 0.85, opacity: 0.6 },
      {
        scaleY: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.06,
      }
    )

    gsap.to(lines, {
      scaleY: 1.05,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    // Optional cleanup to avoid GSAP lingering refs
    return () => {
      gsap.killTweensOf(lines)
    }
  }, [containerSelector]) // ✅ ESLint satisfied
}
