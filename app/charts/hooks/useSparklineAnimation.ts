"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export function useSparklineAnimation(
  containerSelector = ".sparkline"
) {
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    // --------------------------------------------------
    // Respect reduced motion
    // --------------------------------------------------
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) return
    if (hasAnimatedRef.current) return

    hasAnimatedRef.current = true

    // --------------------------------------------------
    // GSAP context — editorial safe
    // --------------------------------------------------
    const ctx = gsap.context(() => {
      const lines = document.querySelectorAll<SVGPolylineElement>(
        `${containerSelector} polyline`
      )

      if (!lines.length) return

      lines.forEach((line) => {
        const length = line.getTotalLength()

        // Prepare stroke-draw animation
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0.6,
        })

        // Draw-in entrance
        gsap.to(line, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        })

        // One subtle settle pulse (NOT infinite)
        gsap.to(line, {
          opacity: 0.85,
          duration: 1,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
          delay: 0.6,
        })
      })
    })

    // --------------------------------------------------
    // Pause animations when tab is hidden
    // --------------------------------------------------
    const handleVisibility = () => {
      if (document.hidden) {
        gsap.globalTimeline.pause()
      } else {
        gsap.globalTimeline.resume()
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    )

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      )
      ctx.revert()
    }
  }, [containerSelector])
}
