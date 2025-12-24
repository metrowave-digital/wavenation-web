"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function ChartAnimations() {
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return
    if (hasAnimated.current) return

    hasAnimated.current = true

    const ctx = gsap.context(() => {
      // Rows
      gsap.fromTo(
        "[data-wn-row]",
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.03,
          clearProps: "transform",
        }
      )

      // ▲ UP
      gsap.fromTo(
        '[data-wn-movement][data-direction="up"]',
        { y: 6, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
          delay: 0.15,
        }
      )

      // ▼ DOWN
      gsap.fromTo(
        '[data-wn-movement][data-direction="down"]',
        { y: -6, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
          delay: 0.15,
        }
      )

      // NEW
      gsap.fromTo(
        '[data-wn-movement][data-direction="new"]',
        { opacity: 0, filter: "blur(2px)" },
        {
          opacity: 1,
          filter: "blur(0)",
          duration: 0.3,
          ease: "power2.out",
          delay: 0.2,
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return null
}
