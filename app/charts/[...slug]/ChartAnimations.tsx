"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function ChartAnimations() {
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    // --------------------------------------------------
    // Respect reduced-motion preferences
    // --------------------------------------------------
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) return
    if (hasAnimatedRef.current) return

    hasAnimatedRef.current = true

    // --------------------------------------------------
    // Editorial-safe entrance (one-time only)
    // --------------------------------------------------
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-wn-chart] [data-wn-row]",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.035,
          clearProps: "transform",
        }
      )
    })

    return () => {
      ctx.revert()
    }
  }, [])

  return null
}
