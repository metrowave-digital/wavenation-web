"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export function useArrowAnimation() {
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    // ---------------------------------------------
    // Respect reduced motion
    // ---------------------------------------------
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) return
    if (hasAnimatedRef.current) return

    hasAnimatedRef.current = true

    // ---------------------------------------------
    // Editorial-safe GSAP scope
    // Only animate arrows marked as moving
    // ---------------------------------------------
    const ctx = gsap.context(() => {
      gsap.to(
        "[data-wn-movement='up'], [data-wn-movement='down']",
        {
          y: -3,
          duration: 0.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      )
    })

    // ---------------------------------------------
    // Pause animation when tab is hidden
    // ---------------------------------------------
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
  }, [])
}
